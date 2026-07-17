import React, { useState, useRef, useEffect } from 'react';
import { UnoBoard } from '../../components/hardware/Board';
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

interface Day3SimulatorProps {
  currentStepIndex: number;
  onMissionComplete?: (complete: boolean) => void;
  cardFolded: boolean;
  setCardFolded: (folded: boolean) => void;
}

export const Day3Simulator: React.FC<Day3SimulatorProps> = ({ 
  currentStepIndex, 
  onMissionComplete,
  cardFolded,
  setCardFolded
}) => {
  const [wires, setWires] = useState<Wire[]>([]);
  const [activeWireStart, setActiveWireStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<PinCoord>({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  
  // LED States: 'off' | 'on' | 'burned'
  const [led1State, setLed1State] = useState<'off' | 'on' | 'burned'>('off');
  const [led2State, setLed2State] = useState<'off' | 'on' | 'burned'>('off');
  const [led3State, setLed3State] = useState<'off' | 'on' | 'burned'>('off');
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  const scale = 1.6;
  const boardX = 80;
  const boardY = 180;
  
  // Custom positions for three LEDs and three Resistors
  const compX = 260;
  const led1Y = 20,  res1Y = 70;
  const led2Y = 120, res2Y = 170;
  const led3Y = 220, res3Y = 270;

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
    
    // LED 1 Pins (Red)
    coords['LED1-ANODE'] = { x: compX + 35, y: led1Y + 40 };
    coords['LED1-CATHODE'] = { x: compX + 20, y: led1Y + 40 };
    
    // Resistor 1 Pins
    coords['RES1-PIN1'] = { x: compX + 15, y: res1Y + 20 };
    coords['RES1-PIN2'] = { x: compX + 65, y: res1Y + 20 };
    
    // LED 2 Pins (Yellow)
    coords['LED2-ANODE'] = { x: compX + 35, y: led2Y + 40 };
    coords['LED2-CATHODE'] = { x: compX + 20, y: led2Y + 40 };
    
    // Resistor 2 Pins
    coords['RES2-PIN1'] = { x: compX + 15, y: res2Y + 20 };
    coords['RES2-PIN2'] = { x: compX + 65, y: res2Y + 20 };

    // LED 3 Pins (Green)
    coords['LED3-ANODE'] = { x: compX + 35, y: led3Y + 40 };
    coords['LED3-CATHODE'] = { x: compX + 20, y: led3Y + 40 };
    
    // Resistor 3 Pins
    coords['RES3-PIN1'] = { x: compX + 15, y: res3Y + 20 };
    coords['RES3-PIN2'] = { x: compX + 65, y: res3Y + 20 };
    
    return coords;
  })();

  useEffect(() => {
    resetAll();
  }, [currentStepIndex]);

  // Evaluate Circuit Connections
  useEffect(() => {
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

    // --- LED 1 (Red, D13) Evaluation ---
    let l1: 'off' | 'on' | 'burned' = 'off';
    const hasD13Power = areConnected('UNO-D13', 'LED1-ANODE') || areConnected('UNO-5V', 'LED1-ANODE');
    const hasD13SafePath = 
      (areConnected('UNO-D13', 'RES1-PIN1') && areConnected('RES1-PIN2', 'LED1-ANODE')) ||
      (areConnected('UNO-D13', 'RES1-PIN2') && areConnected('RES1-PIN1', 'LED1-ANODE')) ||
      (areConnected('UNO-5V', 'RES1-PIN1') && areConnected('RES1-PIN2', 'LED1-ANODE')) ||
      (areConnected('UNO-5V', 'RES1-PIN2') && areConnected('RES1-PIN1', 'LED1-ANODE'));

    if (isGnd('LED1-CATHODE')) {
      if (hasD13Power) l1 = 'burned';
      else if (hasD13SafePath) l1 = 'on';
    }

    // --- LED 2 (Yellow, D12) Evaluation ---
    let l2: 'off' | 'on' | 'burned' = 'off';
    const hasD12Power = areConnected('UNO-D12', 'LED2-ANODE') || areConnected('UNO-5V', 'LED2-ANODE');
    const hasD12SafePath = 
      (areConnected('UNO-D12', 'RES2-PIN1') && areConnected('RES2-PIN2', 'LED2-ANODE')) ||
      (areConnected('UNO-D12', 'RES2-PIN2') && areConnected('RES2-PIN1', 'LED2-ANODE')) ||
      (areConnected('UNO-5V', 'RES2-PIN1') && areConnected('RES2-PIN2', 'LED2-ANODE')) ||
      (areConnected('UNO-5V', 'RES2-PIN2') && areConnected('RES2-PIN1', 'LED2-ANODE'));

    if (isGnd('LED2-CATHODE')) {
      if (hasD12Power) l2 = 'burned';
      else if (hasD12SafePath) l2 = 'on';
    }

    // --- LED 3 (Green, D11) Evaluation ---
    let l3: 'off' | 'on' | 'burned' = 'off';
    const hasD11Power = areConnected('UNO-D11', 'LED3-ANODE') || areConnected('UNO-5V', 'LED3-ANODE');
    const hasD11SafePath = 
      (areConnected('UNO-D11', 'RES3-PIN1') && areConnected('RES3-PIN2', 'LED3-ANODE')) ||
      (areConnected('UNO-D11', 'RES3-PIN2') && areConnected('RES3-PIN1', 'LED3-ANODE')) ||
      (areConnected('UNO-5V', 'RES3-PIN1') && areConnected('RES3-PIN2', 'LED3-ANODE')) ||
      (areConnected('UNO-5V', 'RES3-PIN2') && areConnected('RES3-PIN1', 'LED3-ANODE'));

    if (isGnd('LED3-CATHODE')) {
      if (hasD11Power) l3 = 'burned';
      else if (hasD11SafePath) l3 = 'on';
    }

    setLed1State(l1);
    setLed2State(l2);
    setLed3State(l3);

    // If all three LEDs are ON safely, complete Step 5
    if (currentStepIndex === 4 && l1 === 'on' && l2 === 'on' && l3 === 'on' && onMissionComplete) {
      onMissionComplete(true);
    }
  }, [wires, currentStepIndex]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / scale;
    let y = (e.clientY - rect.top) / scale;

    let snappedPin = null;
    let minDist = 25; 
    
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
    if (src.includes('D13') || tgt.includes('D13')) return '#ef4444'; // Red Wire
    if (src.includes('D12') || tgt.includes('D12')) return '#eab308'; // Yellow Wire
    if (src.includes('D11') || tgt.includes('D11')) return '#22c55e'; // Green Wire
    if (src.includes('GND') || tgt.includes('GND')) return 'var(--color-wire-gnd)';
    return 'var(--color-wire-signal-1)';
  };

  const renderWire = (startX: number, startY: number, endX: number, endY: number, color: string) => {
    const controlYOffset = Math.abs(endY - startY) / 2 + 30;
    const d = `M ${startX} ${startY} C ${startX} ${startY + controlYOffset}, ${endX} ${endY - controlYOffset}, ${endX} ${endY}`;
    return <path d={d} stroke={color} strokeWidth="4" fill="none" strokeLinecap="round" opacity="0.85" />;
  };

  const resetAll = () => {
    setWires([]);
    setLed1State('off');
    setLed2State('off');
    setLed3State('off');
    setActiveWireStart(null);
    setHoveredPin(null);
  };

  const drawLED = (x: number, y: number, color: string, state: 'off' | 'on' | 'burned', anodeId: string, cathodeId: string) => {
    let ledColor = 'rgba(255,255,255,0.2)';
    let glow = 'none';
    if (state === 'burned') {
      ledColor = '#475569'; // charcoal black
    } else if (state === 'on') {
      ledColor = color;
      glow = `drop-shadow(0 0 12px ${color})`;
    }

    return (
      <g transform={`translate(${x}, ${y})`}>
        {/* LED Body */}
        <path d="M 15 20 A 12 12 0 0 1 39 20 L 39 40 L 15 40 Z" fill={ledColor} stroke="#94a3b8" strokeWidth="2" style={{ filter: glow }} />
        <rect x="12" y="40" width="30" height="4" fill="#cbd5e1" stroke="#94a3b8" />
        
        {/* Cathode (Shorter lead, Left) */}
        <line x1="20" y1="44" x2="20" y2="60" stroke="#cbd5e1" strokeWidth="2.5" />
        {/* Anode (Longer bent lead, Right) */}
        <path d="M 34 44 L 34 50 L 35 55 L 35 60" stroke="#cbd5e1" strokeWidth="2.5" fill="none" />

        {/* Burn smoke cloud if burned */}
        {state === 'burned' && (
          <text x="27" y="10" fontSize="16" textAnchor="middle">💨</text>
        )}

        {/* Clickable Terminal Pins */}
        <circle cx="20" cy="60" r="5.5" fill={activeWireStart === cathodeId ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick(cathodeId); }} />
        <circle cx="35" cy="60" r="5.5" fill={activeWireStart === anodeId ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick(anodeId); }} />
        
        {/* Text indicators */}
        <text x="20" y="74" fill="#94a3b8" fontSize="7" textAnchor="middle">-</text>
        <text x="35" y="74" fill="#94a3b8" fontSize="7" textAnchor="middle">+</text>
      </g>
    );
  };

  const drawResistor = (x: number, y: number, name: string, pin1Id: string, pin2Id: string) => {
    return (
      <g transform={`translate(${x}, ${y})`}>
        <line x1="0" y1="20" x2="80" y2="20" stroke="#94a3b8" strokeWidth="2.5" />
        <rect x="15" y="10" width="50" height="20" rx="5" fill="#fef08a" stroke="#d97706" strokeWidth="1.5" />
        {/* 220 Ohm stripes */}
        <rect x="25" y="10" width="5" height="20" fill="#ef4444" />
        <rect x="34" y="10" width="5" height="20" fill="#ef4444" />
        <rect x="43" y="10" width="5" height="20" fill="#92400e" />
        <rect x="52" y="10" width="4" height="20" fill="#fbbf24" />

        <circle cx="15" cy="20" r="5.5" fill={activeWireStart === pin1Id ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick(pin1Id); }} />
        <circle cx="65" cy="20" r="5.5" fill={activeWireStart === pin2Id ? '#22c55e' : '#64748b'} stroke="#fff" strokeWidth="1.5" style={{ cursor: 'pointer' }} onClick={(e) => { e.stopPropagation(); handlePinClick(pin2Id); }} />
        
        <text x="40" y="6" fill="#94a3b8" fontSize="8" textAnchor="middle">{name}</text>
      </g>
    );
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
        backgroundImage: 'radial-gradient(var(--color-glass-border) 1px, transparent 1px)',
        backgroundSize: '20px 20px', opacity: 0.5, pointerEvents: 'none'
      }} />

      <svg 
        ref={svgRef} width="100%" height="100%" style={{ background: 'transparent', marginTop: '30px', cursor: hoveredPin ? 'pointer' : 'default' }}
        onMouseMove={handleMouseMove} onClick={handleSvgClick}
      >
        <g transform={`scale(${scale})`}>
          {/* Arduino UNO */}
          <UnoBoard x={boardX} y={boardY} onPinClick={handlePinClick} activePins={activeWireStart ? [activeWireStart] : []} />
          
          {/* Three LEDs (Red, Yellow, Green) */}
          {drawLED(compX, led1Y, '#ef4444', led1State, 'LED1-ANODE', 'LED1-CATHODE')}
          {drawLED(compX, led2Y, '#fbbf24', led2State, 'LED2-ANODE', 'LED2-CATHODE')}
          {drawLED(compX, led3Y, '#22c55e', led3State, 'LED3-ANODE', 'LED3-CATHODE')}
          
          {/* Three Resistors */}
          {drawResistor(compX, res1Y, 'R1 (Red)', 'RES1-PIN1', 'RES1-PIN2')}
          {drawResistor(compX, res2Y, 'R2 (Yellow)', 'RES2-PIN1', 'RES2-PIN2')}
          {drawResistor(compX, res3Y, 'R3 (Green)', 'RES3-PIN1', 'RES3-PIN2')}

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
            {cardFolded ? '📋 미션 진행 가이드' : '미션: 3색 병렬 LED 신호등 결선'}
          </h3>
          <button onClick={() => setCardFolded(!cardFolded)} style={{ background: 'none', border: 'none', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
            {cardFolded ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
        
        {!cardFolded && (
          <>
            <div>
              {led1State === 'burned' || led2State === 'burned' || led3State === 'burned' ? (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.5)', color: '#ffffff', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>💥</span><strong style={{ color: '#fca5a5' }}>LED가 쇼트로 파괴되었습니다!</strong><br/>
                  저항을 건너뛰고 D13/D12/D11을 LED에 직접 연결한 부분이 있습니다. 리셋 후 저항을 통과하게 안전 회로를 결선해 주세요.
                </div>
              ) : (led1State === 'on' && led2State === 'on' && led3State === 'on') ? (
                <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.5)', color: '#ffffff', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>🚥</span><strong style={{ color: '#86efac' }}>신호등 회로 완성!</strong><br/>
                  3색 LED가 병렬 분기선을 통해 개별 전력(D13, D12, D11)으로 독립 구동됩니다! [Day 3 완료]를 눌러 다음 진도로 진입하세요.
                </div>
              ) : (
                <p style={{ fontSize: '0.95rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>
                  빨간색(D13), 노란색(D12), 초록색(D11) 핀을 각각 아래 저항(R1, R2, R3)의 한쪽 핀에 연결하고, 저항 다른 핀을 각 LED(+)에 잇습니다.<br/>
                  그리고 세 LED의 (-)핀을 각각 아두이노 GND에 연결하세요.
                </p>
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
