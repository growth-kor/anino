import React, { useState, useRef, useEffect } from 'react';
import { UnoBoard } from '../../components/hardware/Board';
import { LED } from '../../components/hardware/LED';
import { Minimize2, Maximize2 } from 'lucide-react';
import type { LogicBlock } from '../../components/editor/CodeWorkspace';

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

interface Day4SimulatorProps {
  currentStepIndex: number;
  onMissionComplete?: (complete: boolean) => void;
  cardFolded: boolean;
  setCardFolded: (folded: boolean) => void;
  codeBlocks?: LogicBlock[];
}

export const Day4Simulator: React.FC<Day4SimulatorProps> = ({ 
  currentStepIndex, 
  onMissionComplete,
  cardFolded,
  setCardFolded,
  codeBlocks
}) => {
  const [wires, setWires] = useState<Wire[]>([]);
  const [activeWireStart, setActiveWireStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<PinCoord>({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  
  // Switch press state
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  const scale = 1.65;
  const boardX = 90;
  const boardY = 170;
  
  // LED and Switch positions
  const ledX = 260;
  const ledY = 20;
  const swX = 260;
  const swY = 120;

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
    
    // Switch Pins
    coords['SW-PIN1'] = { x: swX + 15, y: swY + 30 };
    coords['SW-PIN2'] = { x: swX + 65, y: swY + 30 };
    
    return coords;
  })();

  useEffect(() => {
    resetAll();
  }, [currentStepIndex]);

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

  const isGnd = (node: string) => {
    return areConnected(node, 'UNO-GND-1') || areConnected(node, 'UNO-GND-2') || areConnected(node, 'UNO-GND-3');
  };

  // Check wiring
  const isSwitchWired = (areConnected('UNO-D2', 'SW-PIN1') && isGnd('SW-PIN2')) || 
                        (areConnected('UNO-D2', 'SW-PIN2') && isGnd('SW-PIN1'));
  
  const isLedWired = areConnected('UNO-D13', 'LED-ANODE') && isGnd('LED-CATHODE');

  // Check code blocks
  const setup = codeBlocks?.find(b => b.type === 'setup');
  const loop = codeBlocks?.find(b => b.type === 'loop');
  
  const codeHasInputPullup = setup?.children?.some(c => c.type === 'pinMode' && c.args?.pin === '2' && c.args?.mode === 'INPUT_PULLUP');
  const codeHasOutput = setup?.children?.some(c => c.type === 'pinMode' && c.args?.pin === '13' && c.args?.mode === 'OUTPUT');
  const codeHasIfInput = loop?.children?.some(c => c.type === 'ifInput');

  const isCodeCorrect = !!(codeHasInputPullup && codeHasOutput && codeHasIfInput);

  useEffect(() => {
    // Determine LED ON/OFF state
    if (isSwitchWired && isLedWired && isCodeCorrect) {
      if (isButtonPressed) {
        setLedOn(true);
      } else {
        setLedOn(false);
      }
    } else {
      setLedOn(false);
    }
  }, [wires, isButtonPressed, isSwitchWired, isLedWired, isCodeCorrect]);

  useEffect(() => {
    // Verify Mission Completion for Step 6 (Day 4 Practice)
    if (currentStepIndex === 5 && isSwitchWired && isLedWired && isCodeCorrect && isButtonPressed && onMissionComplete) {
      onMissionComplete(true);
    }
  }, [wires, isButtonPressed, isSwitchWired, isLedWired, isCodeCorrect, currentStepIndex]);

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
    if (src.includes('D2') || tgt.includes('D2')) return '#a855f7'; // Purple for signal
    if (src.includes('D13') || tgt.includes('D13')) return '#ef4444'; // Red
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
    setLedOn(false);
    setIsButtonPressed(false);
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
          {/* Arduino UNO */}
          <UnoBoard x={boardX} y={boardY} onPinClick={handlePinClick} activePins={activeWireStart ? [activeWireStart] : []} />
          
          {/* Red LED (Pin mode indicator) */}
          <LED x={ledX} y={ledY} id="LED1" isOn={ledOn} isBurning={false} onPinClick={handlePinClick} />
          
          {/* Tact Switch (Tactile Button) */}
          <g transform={`translate(${swX}, ${swY})`}>
            {/* Button base */}
            <rect x="5" y="5" width="70" height="50" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            
            {/* Clickable Push Button Cap */}
            <rect 
              x="25" y="15" width="30" height="30" rx="15" 
              fill={isButtonPressed ? '#10b981' : '#ef4444'} 
              stroke="#047857" strokeWidth="2" 
              style={{ cursor: 'pointer', transition: 'all 0.1s' }}
              onClick={(e) => { e.stopPropagation(); setIsButtonPressed(!isButtonPressed); }} 
            />
            
            {/* Metal Pins */}
            <line x1="0" y1="30" x2="5" y2="30" stroke="#94a3b8" strokeWidth="3" />
            <line x1="75" y1="30" x2="80" y2="30" stroke="#94a3b8" strokeWidth="3" />

            {/* Clickable Terminal Pins */}
            <circle cx="15" cy="30" r="6" fill={activeWireStart === 'SW-PIN1' ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick('SW-PIN1'); }} />
            <circle cx="65" cy="30" r="6" fill={activeWireStart === 'SW-PIN2' ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick('SW-PIN2'); }} />
            
            <text x="40" y="4" fill="#94a3b8" fontSize="8" textAnchor="middle">BUTTON</text>
          </g>

          {/* Hover highlight */}
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
          
          {/* Active drawing line */}
          {activeWireStart && pinCoords[activeWireStart] && (
            renderWire(pinCoords[activeWireStart].x, pinCoords[activeWireStart].y, mousePos.x, mousePos.y, '#64748b')
          )}
        </g>
      </svg>

      {/* Mission Card */}
      <div className="glass-panel" style={{
        position: 'absolute', top: 90, right: 32, padding: 'var(--spacing-6)',
        width: cardFolded ? '240px' : 'clamp(280px, 30vw, 420px)', border: '1px solid var(--color-glass-border)',
        boxShadow: 'var(--shadow-lg)', background: 'var(--color-bg-surface-elevated)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', gap: cardFolded ? '0px' : '16px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-gradient" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
            {cardFolded ? '📋 미션 진행 가이드' : '미션: 내부 풀업 스위치 입력'}
          </h3>
          <button onClick={() => setCardFolded(!cardFolded)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            {cardFolded ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
        
        {!cardFolded && (
          <>
            <div>
              {!isSwitchWired ? (
                <p style={{ fontSize: '0.95rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>
                  1. <strong>[D2 핀] ➔ [스위치 왼쪽 핀 (SW-PIN1)]</strong> 연결<br/>
                  2. <strong>[스위치 오른쪽 핀 (SW-PIN2)] ➔ [UNO-GND]</strong> 연결<br/>
                  <br/>
                  * 내부 풀업 저항을 쓰므로 외부 저항은 필요 없습니다!
                </p>
              ) : !isLedWired ? (
                <p style={{ fontSize: '0.95rem', color: '#fca5a5', margin: 0, lineHeight: 1.6 }}>
                  스위치가 잘 연결되었습니다! 이제 LED를 구동할 회로도 마저 연결해 주세요.<br/>
                  - <strong>[D13] ➔ [LED(+) 긴 다리]</strong><br/>
                  - <strong>[LED(-) 짧은 다리] ➔ [GND]</strong>
                </p>
              ) : !isCodeCorrect ? (
                <p style={{ fontSize: '0.95rem', color: '#fde68a', margin: 0, lineHeight: 1.6 }}>
                  회로가 완벽히 결선되었습니다! 이제 왼쪽 에디터에서 아래 3가지 블록을 순서대로 조립해 코드를 완성하세요.<br/>
                  - pinMode(2, INPUT_PULLUP)<br/>
                  - pinMode(13, OUTPUT)<br/>
                  - if (digitalRead(2) == LOW) 조건문 블록
                </p>
              ) : (
                <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.5)', color: '#ffffff', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <strong style={{ color: '#86efac' }}>⚙️ 준비 완료!</strong><br/><br/>
                  우측 스위치의 <strong>빨간색 버튼(원형)을 마우스로 직접 클릭</strong>하여 누르고 떼어보세요!<br/>
                  누르는 순간 D2 입력이 LOW가 되면서 LED가 켜집니다!
                </div>
              )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <button onClick={resetAll} style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.06)', color: '#ffffff', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer' }}>
                시뮬레이터 다시 시작
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
