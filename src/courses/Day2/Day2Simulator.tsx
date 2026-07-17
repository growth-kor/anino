import React, { useState, useRef, useEffect } from 'react';
import { UnoBoard } from '../../components/hardware/Board';
import { LED } from '../../components/hardware/LED';
import { Minimize2, Maximize2 } from 'lucide-react';

interface PinCoord {
  x: number;
  y: number;
}

interface Wire {
  id: string;
  source: string;
  target: string;
  color: string;
}

interface Day2SimulatorProps {
  currentStepIndex: number;
  onMissionComplete?: (complete: boolean) => void;
  cardFolded: boolean;
  setCardFolded: (folded: boolean) => void;
}

export const Day2Simulator: React.FC<Day2SimulatorProps> = ({ 
  currentStepIndex, 
  onMissionComplete,
  cardFolded,
  setCardFolded
}) => {
  const [wires, setWires] = useState<Wire[]>([]);
  const [activeWireStart, setActiveWireStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<PinCoord>({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  
  // LED State: 'off' | 'on' | 'burned'
  const [ledState, setLedState] = useState<'off' | 'on' | 'burned'>('off');
  const svgRef = useRef<SVGSVGElement>(null);
  
  const scale = 1.65;
  const boardX = 90;
  const boardY = 170;
  
  // LED and Resistor coordinates
  const ledX = 260;
  const ledY = 20;
  const resX = 260;
  const resY = 120;

  const pinCoords: Record<string, PinCoord> = (() => {
    const coords: Record<string, PinCoord> = {};
    for (let i = 0; i <= 13; i++) coords[`UNO-D${13 - i}`] = { x: boardX + 70 + i * 18, y: boardY + 15 };
    coords['UNO-GND-1'] = { x: boardX + 70 + 14 * 18, y: boardY + 15 };
    coords['UNO-AREF'] = { x: boardX + 70 + 15 * 18, y: boardY + 15 };
    coords['UNO-VIN'] = { x: boardX + 90, y: boardY + 235 };
    coords['UNO-GND-2'] = { x: boardX + 108, y: boardY + 235 };
    coords['UNO-GND-3'] = { x: boardX + 126, y: boardY + 235 };
    coords['UNO-5V'] = { x: boardX + 144, y: boardY + 235 };
    coords['UNO-3V3'] = { x: boardX + 162, y: boardY + 235 };
    coords['UNO-RESET'] = { x: boardX + 180, y: boardY + 235 };
    for (let i = 0; i <= 5; i++) coords[`UNO-A${i}`] = { x: boardX + 216 + i * 18, y: boardY + 235 };
    
    // LED Pins
    coords['LED-ANODE'] = { x: ledX + 35, y: ledY + 90 };
    coords['LED-CATHODE'] = { x: ledX + 20, y: ledY + 90 };
    
    // Resistor Pins
    coords['RES-PIN1'] = { x: resX + 15, y: resY + 40 };
    coords['RES-PIN2'] = { x: resX + 65, y: resY + 40 };
    
    return coords;
  })();

  useEffect(() => {
    resetAll();
  }, [currentStepIndex]);

  // Evaluate Circuit Connections
  useEffect(() => {
    // A function to check connectivity in our wire graph
    const areConnected = (nodeA: string, nodeB: string) => {
      const visited = new Set<string>();
      const queue = [nodeA];
      
      while (queue.length > 0) {
        const curr = queue.shift()!;
        if (curr === nodeB) return true;
        if (visited.has(curr)) continue;
        visited.add(curr);
        
        wires.forEach(w => {
          if (w.source === curr && !visited.has(w.target)) queue.push(w.target);
          if (w.target === curr && !visited.has(w.source)) queue.push(w.source);
        });
      }
      return false;
    };

    // 1. Direct short circuit burn check: 5V directly connected to LED-ANODE and LED-CATHODE connected to GND
    const isDirect5VToAnode = areConnected('UNO-5V', 'LED-ANODE');
    const isCathodeToGnd = areConnected('LED-CATHODE', 'UNO-GND-1') || 
                           areConnected('LED-CATHODE', 'UNO-GND-2') || 
                           areConnected('LED-CATHODE', 'UNO-GND-3');


    
    // Verify path goes through resistor
    const goesThroughResistor = 
      (areConnected('UNO-5V', 'RES-PIN1') && areConnected('RES-PIN2', 'LED-ANODE')) ||
      (areConnected('UNO-5V', 'RES-PIN2') && areConnected('RES-PIN1', 'LED-ANODE'));

    let newLedState: 'off' | 'on' | 'burned' = 'off';

    if (isCathodeToGnd) {
      if (isDirect5VToAnode) {
        // Direct link without resistor burns the LED!
        newLedState = 'burned';
      } else if (goesThroughResistor) {
        // Path goes through the 220 Ohm Resistor safely
        newLedState = 'on';
      }
    }

    setLedState(newLedState);

    // Verify Mission Completion for Step 6 (Day 2 Practice step)
    if (currentStepIndex === 5 && newLedState === 'on' && onMissionComplete) {
      onMissionComplete(true);
    }
  }, [wires, currentStepIndex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / scale;
    let y = (e.clientY - rect.top) / scale;

    let snappedPin = null;
    let minDist = 30; 
    
    for (const [pinId, coord] of Object.entries(pinCoords)) {
      if (pinId === activeWireStart) continue;

      const dist = Math.hypot(coord.x - x, coord.y - y);
      if (dist < minDist) {
        minDist = dist;
        snappedPin = pinId;
      }
    }

    if (snappedPin) {
      x = pinCoords[snappedPin].x;
      y = pinCoords[snappedPin].y;
      setHoveredPin(snappedPin);
    } else {
      setHoveredPin(null);
    }

    if (activeWireStart) {
      setMousePos({ x, y });
    }
  };

  const handlePinClick = (pinId: string) => {
    if (!activeWireStart) {
      setActiveWireStart(pinId);
      setMousePos({ x: pinCoords[pinId].x, y: pinCoords[pinId].y });
    } else {
      if (activeWireStart !== pinId) {
        const newWires = [...wires, { 
          id: `wire-${Date.now()}`, 
          source: activeWireStart, 
          target: pinId, 
          color: getWireColor(activeWireStart, pinId) 
        }];
        setWires(newWires);
      }
      setActiveWireStart(null);
    }
  };

  const handleSvgClick = () => {
    if (activeWireStart) {
      if (hoveredPin) {
        handlePinClick(hoveredPin);
      } else {
        setActiveWireStart(null);
      }
    }
  };

  const getWireColor = (src: string, tgt: string) => {
    if (src.includes('5V') || tgt.includes('5V')) return 'var(--color-wire-5v)';
    if (src.includes('GND') || tgt.includes('GND')) return 'var(--color-wire-gnd)';
    return 'var(--color-wire-signal-1)';
  };

  const renderWire = (startX: number, startY: number, endX: number, endY: number, color: string) => {
    const controlYOffset = Math.abs(endY - startY) / 2 + 30;
    const d = `M ${startX} ${startY} C ${startX} ${startY + controlYOffset}, ${endX} ${endY - controlYOffset}, ${endX} ${endY}`;
    return <path d={d} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" />;
  };

  const resetAll = () => {
    setWires([]);
    setLedState('off');
    setActiveWireStart(null);
    setHoveredPin(null);
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(var(--color-glass-border) 1px, transparent 1px)',
        backgroundSize: '20px 20px', opacity: 0.5, pointerEvents: 'none'
      }} />

      <svg 
        ref={svgRef} width="100%" height="100%" style={{ background: 'transparent', marginTop: '50px', cursor: hoveredPin ? 'pointer' : 'default' }}
        onMouseMove={handleMouseMove} onClick={handleSvgClick}
      >
        <g transform={`scale(${scale})`}>
          {/* Arduino Uno Board */}
          <UnoBoard x={boardX} y={boardY} onPinClick={handlePinClick} activePins={activeWireStart ? [activeWireStart] : []} />
          
          {/* Red LED */}
          <LED x={ledX} y={ledY} id="LED1" isOn={ledState === 'on'} isBurning={ledState === 'burned'} onPinClick={handlePinClick} />
          
          {/* Resistor Component (220 Ohm: Red, Red, Brown, Gold) */}
          <g transform={`translate(${resX}, ${resY})`}>
            {/* Leads / Connecting wires */}
            <line x1="0" y1="40" x2="80" y2="40" stroke="#94a3b8" strokeWidth="3" />
            
            {/* Resistor Body */}
            <rect x="15" y="28" width="50" height="24" rx="6" fill="#fef08a" stroke="#d97706" strokeWidth="2" />
            
            {/* Color Bands */}
            <rect x="25" y="28" width="6" height="24" fill="#ef4444" /> {/* Red */}
            <rect x="36" y="28" width="6" height="24" fill="#ef4444" /> {/* Red */}
            <rect x="47" y="28" width="6" height="24" fill="#92400e" /> {/* Brown */}
            <rect x="58" y="28" width="4" height="24" fill="#fbbf24" /> {/* Gold */}

            {/* Clickable Terminal Pins */}
            <circle cx="15" cy="40" r="6" fill={activeWireStart === 'RES-PIN1' ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick('RES-PIN1'); }} />
            <circle cx="65" cy="40" r="6" fill={activeWireStart === 'RES-PIN2' ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick('RES-PIN2'); }} />
            
            {/* Pin Labels */}
            <text x="15" y="20" fill="#94a3b8" fontSize="8" textAnchor="middle">R1</text>
            <text x="65" y="20" fill="#94a3b8" fontSize="8" textAnchor="middle">R2</text>
          </g>

          {/* Magnetic Ring for hovering */}
          {hoveredPin && pinCoords[hoveredPin] && hoveredPin !== activeWireStart && (
            <g>
              <circle cx={pinCoords[hoveredPin].x} cy={pinCoords[hoveredPin].y} r="14" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.6" />
              <circle cx={pinCoords[hoveredPin].x} cy={pinCoords[hoveredPin].y} r="6" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
            </g>
          )}

          {/* Wires */}
          {wires.map(w => {
            const start = pinCoords[w.source] || { x: 0, y: 0 };
            const end = pinCoords[w.target] || { x: 0, y: 0 };
            return <g key={w.id}>{renderWire(start.x, start.y, end.x, end.y, w.color)}</g>;
          })}
          
          {/* Active Drawing Wire */}
          {activeWireStart && pinCoords[activeWireStart] && (
            renderWire(pinCoords[activeWireStart].x, pinCoords[activeWireStart].y, mousePos.x, mousePos.y, '#64748b')
          )}
        </g>
      </svg>

      {/* Foldable Mission Card */}
      <div className="glass-panel" style={{
        position: 'absolute', top: 90, right: 32, padding: 'var(--spacing-6)',
        width: cardFolded ? '240px' : 'clamp(280px, 30vw, 420px)', border: '1px solid var(--color-glass-border)',
        boxShadow: 'var(--shadow-lg)', background: 'var(--color-bg-surface-elevated)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', gap: cardFolded ? '0px' : '16px'
      }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-gradient" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
            {cardFolded ? '📋 미션 진행 가이드' : '미션: 저항을 통과하는 회로 연결'}
          </h3>
          <button 
            onClick={() => setCardFolded(!cardFolded)}
            style={{
              background: 'none', border: 'none', color: 'var(--color-text-secondary)',
              cursor: 'pointer', padding: '4px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            {cardFolded ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
        
        {!cardFolded && (
          <>
            <div>
              {ledState === 'burned' ? (
                <div style={{ 
                  background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', 
                  fontSize: '0.95rem', lineHeight: 1.6
                }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>💥</span><strong style={{ color: '#fca5a5' }}>LED가 타버렸습니다!</strong><br/><br/>
                  저항을 거치지 않고 5V와 LED를 직접 연결하여 과전류로 부품이 파괴되었습니다. 아래 '시뮬레이터 다시 시작' 버튼을 누르고, 전선이 저항을 꼭 통과하도록 다시 연결해 주세요!
                </div>
              ) : ledState === 'on' ? (
                <div style={{ 
                  background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.5)',
                  color: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', 
                  fontSize: '0.95rem', lineHeight: 1.6
                }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🎉</span><strong style={{ color: '#86efac' }}>안전하게 불이 켜졌습니다!</strong><br/><br/>
                  220옴 저항이 전류를 적당히 좁혀주어 LED가 파손되지 않고 안전하게 불을 밝힙니다! 옴의 법칙 증명 성공! [Day 2 완료] 버튼을 눌러 다음 날짜로 넘어갑니다.
                </div>
              ) : (
                <p style={{ fontSize: '1rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>
                  - <strong>[UNO-5V] ➔ [R1 (왼쪽 핀)]</strong> 연결<br/>
                  - <strong>[R2 (오른쪽 핀)] ➔ [LED-ANODE (오른쪽 긴 다리)]</strong> 연결<br/>
                  - <strong>[LED-CATHODE (왼쪽 짧은 다리)] ➔ [UNO-GND]</strong> 연결<br/>
                  <br/>
                  * 5V를 LED에 직접 대면 부품이 파괴되므로 조심하세요!
                </p>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '8px' }}>
              <button 
                onClick={resetAll}
                style={{
                  padding: '8px 16px', background: 'rgba(255,255,255,0.06)',
                  color: '#ffffff', borderRadius: 'var(--radius-md)', fontSize: '0.9rem',
                  fontWeight: 700, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseOut={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                시뮬레이터 다시 시작
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
