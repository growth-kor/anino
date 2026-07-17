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

interface Day5SimulatorProps {
  currentStepIndex: number;
  onMissionComplete?: (complete: boolean) => void;
  cardFolded: boolean;
  setCardFolded: (folded: boolean) => void;
  codeBlocks?: LogicBlock[];
}

export const Day5Simulator: React.FC<Day5SimulatorProps> = ({ 
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
  
  // States
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [ledOn, setLedOn] = useState(false);
  
  const svgRef = useRef<SVGSVGElement>(null);
  
  const scale = 1.65;
  const boardX = 90;
  const boardY = 170;
  
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
  const codeHasDebounce = loop?.children?.some(c => c.type === 'debounceToggle');

  const isCodeCorrect = !!(codeHasInputPullup && codeHasOutput && codeHasDebounce);

  // Button Click Handler simulating physical toggle code execution
  const handleButtonClick = () => {
    if (isSwitchWired && isLedWired && isCodeCorrect) {
      // Toggle LED status
      setLedOn(prev => !prev);
      setIsButtonPressed(true);
      setTimeout(() => setIsButtonPressed(false), 150); // momentary visual feedback
    } else {
      setIsButtonPressed(prev => !prev);
    }
  };

  useEffect(() => {
    // If not correct code or wires, reset LED to off
    if (!isSwitchWired || !isLedWired || !isCodeCorrect) {
      setLedOn(false);
    }
  }, [wires, isSwitchWired, isLedWired, isCodeCorrect]);

  useEffect(() => {
    // Verify Mission Completion for Step 5 (Day 5 Practice)
    // Completed once the LED is toggled ON successfully in correct state.
    if (currentStepIndex === 4 && isSwitchWired && isLedWired && isCodeCorrect && ledOn && onMissionComplete) {
      onMissionComplete(true);
    }
  }, [wires, ledOn, isSwitchWired, isLedWired, isCodeCorrect, currentStepIndex]);

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
    if (src.includes('D2') || tgt.includes('D2')) return '#a855f7'; 
    if (src.includes('D13') || tgt.includes('D13')) return '#ef4444'; 
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
          
          {/* Red LED */}
          <LED x={ledX} y={ledY} id="LED1" isOn={ledOn} isBurning={false} onPinClick={handlePinClick} />
          
          {/* Tact Switch */}
          <g transform={`translate(${swX}, ${swY})`}>
            <rect x="5" y="5" width="70" height="50" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="2" />
            
            {/* Clickable Push Button Cap */}
            <rect 
              x="25" y="15" width="30" height="30" rx="15" 
              fill={isButtonPressed ? '#10b981' : '#ef4444'} 
              stroke="#047857" strokeWidth="2" 
              style={{ cursor: 'pointer', transition: 'all 0.1s' }}
              onClick={(e) => { e.stopPropagation(); handleButtonClick(); }} 
            />
            
            <line x1="0" y1="30" x2="5" y2="30" stroke="#94a3b8" strokeWidth="3" />
            <line x1="75" y1="30" x2="80" y2="30" stroke="#94a3b8" strokeWidth="3" />

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
            {cardFolded ? '📋 미션 진행 가이드' : '미션: 디바운싱 토글 제어'}
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
                  D2 핀과 GND 핀에 스위치를 다시 이중 결선해 주세요.<br/>
                  - [D2] ➔ [SW-PIN1]<br/>
                  - [SW-PIN2] ➔ [GND]
                </p>
              ) : !isLedWired ? (
                <p style={{ fontSize: '0.95rem', color: '#fca5a5', margin: 0, lineHeight: 1.6 }}>
                  스위치가 잘 연결되었습니다! LED를 구동할 회로도 연결해 주세요.<br/>
                  - [D13] ➔ [LED(+) 긴 다리]<br/>
                  - [LED(-) 짧은 다리] ➔ [GND]
                </p>
              ) : !isCodeCorrect ? (
                <p style={{ fontSize: '0.95rem', color: '#fde68a', margin: 0, lineHeight: 1.6 }}>
                  회로가 모두 완성되었습니다! 왼쪽 에디터에서 아래 3가지 블록을 순서대로 조립해 코드를 완성해 주세요.<br/>
                  - pinMode(2, INPUT_PULLUP)<br/>
                  - pinMode(13, OUTPUT)<br/>
                  - if (디바운스_버튼_토글) 조건문 블록
                </p>
              ) : (
                <div style={{ background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.5)', color: '#ffffff', padding: '12px', borderRadius: 'var(--radius-md)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  <strong style={{ color: '#86efac' }}>⚙️ 토글 디바운싱 활성화!</strong><br/><br/>
                  우측 스위치의 <strong>빨간색 버튼(원형)을 마우스로 클릭</strong>해 보세요.<br/>
                  - <strong>1번 클릭:</strong> LED가 켜진 상태로 유지됩니다.<br/>
                  - <strong>2번 클릭:</strong> LED가 다시 꺼집니다.<br/>
                  바운싱 없이 오직 1클릭당 1회 토글이 깔끔하게 이뤄집니다!
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
