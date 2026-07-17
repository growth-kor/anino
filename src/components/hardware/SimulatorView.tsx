import React, { useState, useRef, useEffect } from 'react';
import { UnoBoard } from './Board';
import { LED } from './LED';
import { CircuitSimulator } from '../../engine/CircuitSimulator';
import type { HardwareComponent } from '../../engine/CircuitSimulator';
import type { LogicBlock } from '../editor/CodeWorkspace';
import { Minimize2, Maximize2 } from 'lucide-react';

interface PinCoord {
  x: number;
  y: number;
}

interface SimulatorViewProps {
  codeBlocks?: LogicBlock[];
  currentStepIndex: number;
  onMissionComplete?: (complete: boolean) => void;
  cardFolded: boolean;
  setCardFolded: (folded: boolean) => void;
}

export const SimulatorView: React.FC<SimulatorViewProps> = ({ 
  codeBlocks, 
  currentStepIndex, 
  onMissionComplete,
  cardFolded,
  setCardFolded
}) => {
  const [simulator] = useState(() => new CircuitSimulator());
  const [wires, setWires] = useState<{id: string, source: string, target: string, color: string}[]>([]);
  const [activeWireStart, setActiveWireStart] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState<PinCoord>({ x: 0, y: 0 });
  const [hoveredPin, setHoveredPin] = useState<string | null>(null);
  const [ledState, setLedState] = useState({ isOn: false, isBurning: false });
  const svgRef = useRef<SVGSVGElement>(null);
  
  // Scale factor increased for larger and less empty view
  const scale = 1.65;
  const boardX = 90;
  const boardY = 170;
  const ledX = 260;
  const ledY = 30;

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
    coords['LED1-ANODE'] = { x: ledX + 35, y: ledY + 90 };
    coords['LED1-CATHODE'] = { x: ledX + 20, y: ledY + 90 };
    return coords;
  })();

  useEffect(() => {
    resetAll();
  }, [currentStepIndex]);

  const has5V = wires.some(w => (w.source === 'UNO-5V' && w.target === 'LED1-ANODE') || (w.target === 'UNO-5V' && w.source === 'LED1-ANODE'));
  const hasD13 = wires.some(w => (w.source === 'UNO-D13' && w.target === 'LED1-ANODE') || (w.target === 'UNO-D13' && w.source === 'LED1-ANODE'));
  const hasGND = wires.some(w => (w.source.includes('GND') && w.target === 'LED1-CATHODE') || (w.target.includes('GND') && w.source === 'LED1-CATHODE'));

  useEffect(() => {
    let completed = false;

    if (currentStepIndex === 7) {
      completed = has5V;
    } else if (currentStepIndex === 8) {
      completed = has5V && hasGND && ledState.isBurning;
    } else if (currentStepIndex === 11) {
      completed = hasD13 && hasGND;
    } else if (currentStepIndex === 13) {
      if (hasD13 && hasGND && codeBlocks) {
        const setup = codeBlocks.find(b => b.type === 'setup');
        const loop = codeBlocks.find(b => b.type === 'loop');
        const hasPinMode = setup?.children?.some(c => c.type === 'pinMode' && c.args?.pin === '13' && c.args?.mode === 'OUTPUT');
        const hasHigh = loop?.children?.some(c => c.type === 'digitalWrite' && c.args?.pin === '13' && c.args?.state === 'HIGH');
        const hasLow = loop?.children?.some(c => c.type === 'digitalWrite' && c.args?.pin === '13' && c.args?.state === 'LOW');
        const hasDelay = loop?.children?.some(c => c.type === 'delay');
        completed = !!(hasPinMode && hasHigh && hasLow && hasDelay);
      }
    }

    if (completed && onMissionComplete) {
      onMissionComplete(true);
    }
  }, [wires, ledState.isBurning, codeBlocks, currentStepIndex, has5V, hasD13, hasGND]);

  useEffect(() => {
    if (currentStepIndex !== 13 || !hasD13 || !hasGND || !codeBlocks) {
      if (!ledState.isBurning) setLedState(prev => ({ ...prev, isOn: false }));
      return;
    }

    const setup = codeBlocks.find(b => b.type === 'setup');
    const loop = codeBlocks.find(b => b.type === 'loop');
    const hasPinMode = setup?.children?.some(c => c.type === 'pinMode' && c.args?.pin === '13' && c.args?.mode === 'OUTPUT');
    const hasHigh = loop?.children?.some(c => c.type === 'digitalWrite' && c.args?.pin === '13' && c.args?.state === 'HIGH');
    const hasLow = loop?.children?.some(c => c.type === 'digitalWrite' && c.args?.pin === '13' && c.args?.state === 'LOW');
    const hasDelay = loop?.children?.some(c => c.type === 'delay');

    if (hasPinMode && hasHigh && hasLow && hasDelay) {
      let blinkState = true;
      setLedState({ isOn: true, isBurning: false });
      
      const interval = setInterval(() => {
        blinkState = !blinkState;
        setLedState({ isOn: blinkState, isBurning: false });
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (hasHigh) {
      setLedState({ isOn: true, isBurning: false });
    } else {
      setLedState({ isOn: false, isBurning: false });
    }
  }, [codeBlocks, wires, currentStepIndex, hasD13, hasGND]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    let x = (e.clientX - rect.left) / scale;
    let y = (e.clientY - rect.top) / scale;

    let snappedPin = null;
    let minDist = 40; 
    
    for (const [pinId, coord] of Object.entries(pinCoords)) {
      if (pinId === activeWireStart) continue;
      if (currentStepIndex <= 8 && pinId.includes('D13')) continue;
      if (currentStepIndex >= 11 && pinId.includes('5V')) continue;

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
      if (currentStepIndex <= 8 && pinId.includes('D13')) return;
      if (currentStepIndex >= 11 && pinId.includes('5V')) return;

      setActiveWireStart(pinId);
      setMousePos({ x: pinCoords[pinId].x, y: pinCoords[pinId].y });
    } else {
      if (activeWireStart !== pinId) {
        const newWireId = simulator.addWire(activeWireStart, pinId);
        const newWires = [...wires, { 
          id: newWireId, 
          source: activeWireStart, 
          target: pinId, 
          color: getWireColor(activeWireStart, pinId) 
        }];
        setWires(newWires);
        
        const led = simulator.components.find(c => c.id === 'LED1');
        if (led) {
          setLedState({ isOn: led.state.isOn, isBurning: led.state.isBurning });
        }
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
    simulator.reset();
    setWires([]);
    setLedState({ isOn: false, isBurning: false });
    setActiveWireStart(null);
    setHoveredPin(null);
    
    const ledComp: HardwareComponent = {
      id: 'LED1',
      type: 'LED',
      pins: {
        'ANODE': { id: 'LED1-ANODE', type: 'COMPONENT', voltage: 0 },
        'CATHODE': { id: 'LED1-CATHODE', type: 'COMPONENT', voltage: 0 }
      },
      state: { isOn: false, isBurning: false }
    };
    simulator.addComponent(ledComp);
  };

  const getMissionTitle = () => {
    if (currentStepIndex === 7) return '미션 1: 5V(전원) 연결하기';
    if (currentStepIndex === 8) return '미션 2: GND(접지) 연결하기';
    if (currentStepIndex === 11) return '미션 3: 13번 핀 연결하기';
    if (currentStepIndex === 13) return '최종 미션: 블록 코딩으로 깜빡이기';
    return '실습 진행 중';
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
        <style>
          {`
            @keyframes magnetic-pulse {
              0% { r: 6; stroke-width: 2; opacity: 1; }
              100% { r: 18; stroke-width: 0; opacity: 0; }
            }
            .magnetic-ring {
              animation: magnetic-pulse 1s infinite;
            }
          `}
        </style>
        <g transform={`scale(${scale})`}>
          <UnoBoard x={boardX} y={boardY} onPinClick={handlePinClick} activePins={activeWireStart ? [activeWireStart] : []} />
          <LED x={ledX} y={ledY} id="LED1" isOn={ledState.isOn} isBurning={ledState.isBurning} onPinClick={handlePinClick} />
          
          {hoveredPin && pinCoords[hoveredPin] && hoveredPin !== activeWireStart && (
            <g>
              <circle cx={pinCoords[hoveredPin].x} cy={pinCoords[hoveredPin].y} className="magnetic-ring" fill="none" stroke="#22c55e" />
              <circle cx={pinCoords[hoveredPin].x} cy={pinCoords[hoveredPin].y} r="6" fill="none" stroke="#22c55e" strokeWidth="2" opacity="0.8" />
            </g>
          )}

          {wires.map(w => {
            const start = pinCoords[w.source] || { x: 0, y: 0 };
            const end = pinCoords[w.target] || { x: 0, y: 0 };
            return <g key={w.id}>{renderWire(start.x, start.y, end.x, end.y, w.color)}</g>;
          })}
          {activeWireStart && pinCoords[activeWireStart] && (
            renderWire(pinCoords[activeWireStart].x, pinCoords[activeWireStart].y, mousePos.x, mousePos.y, '#64748b')
          )}
        </g>
      </svg>

      {/* Foldable/Collapsible Mission Card */}
      <div className="glass-panel" style={{
        position: 'absolute', top: 90, right: 32, padding: 'var(--spacing-6)',
        width: cardFolded ? '240px' : 'clamp(280px, 30vw, 420px)', border: '1px solid var(--color-glass-border)',
        boxShadow: 'var(--shadow-lg)', background: 'var(--color-bg-surface-elevated)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex', flexDirection: 'column', gap: cardFolded ? '0px' : '16px'
      }}>
        
        {/* Card Header (with fold toggle) */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="text-gradient" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
            {cardFolded ? '📋 미션 진행 가이드' : getMissionTitle()}
          </h3>
          <button 
            onClick={() => setCardFolded(!cardFolded)}
            style={{
              background: 'none', border: 'none', color: 'var(--color-text-secondary)',
              cursor: 'pointer', padding: '4px', borderRadius: '4px',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = 'none'}
          >
            {cardFolded ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        </div>
        
        {/* Card Content (Hidden when folded) */}
        {!cardFolded && (
          <>
            {currentStepIndex === 7 && (
              <p style={{ fontSize: '1rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>
                {has5V ? (
                  <strong style={{ color: '#86efac' }}>5V 연결 성공! 상단의 [미션 클리어] 버튼을 눌러 다음 단계로 진행하세요.</strong>
                ) : (
                  <>아두이노 보드 하단에 있는 <strong style={{ color: '#ef4444' }}>5V 핀</strong>을 클릭한 뒤, 빨간색 LED의 <strong style={{ color: '#ef4444' }}>오른쪽 긴 다리(+)</strong>를 클릭하여 연결하세요.</>
                )}
              </p>
            )}

            {currentStepIndex === 8 && (
              <div>
                {ledState.isBurning ? (
                  <div style={{ 
                    background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.5)',
                    color: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', 
                    fontSize: '0.95rem', lineHeight: 1.6
                  }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>💥</span><strong style={{ color: '#fca5a5' }}>앗! 쇼트가 발생했습니다!</strong><br/><br/>
                    저항 없이 5V를 직접 연결하면 부품이 타버립니다. 상단의 <strong>'미션 클리어! 다음'</strong> 버튼을 눌러 이유를 알아봅시다!
                  </div>
                ) : (
                  <p style={{ fontSize: '1rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>
                    이전 단계의 전선이 초기화되었습니다. 우선 <strong style={{ color: '#ef4444' }}>5V 핀에서 LED의 긴 다리(+)</strong>로 선을 먼저 연결하고, 그 다음 <strong style={{ color: '#38bdf8' }}>GND(접지) 핀에서 LED의 짧은 다리(-)</strong>로 선을 연결해 주세요. 댐(5V)과 배수구(GND)가 모두 연결되어 회로가 닫히는 순간 쇼트가 발생합니다!
                  </p>
                )}
              </div>
            )}

            {currentStepIndex === 11 && (
              <p style={{ fontSize: '1rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>
                {hasD13 && hasGND ? (
                  <strong style={{ color: '#86efac' }}>13번 핀에 안전하게 연결되었습니다! 하지만 아직 불이 들어오지 않네요. 상단의 [미션 클리어] 버튼을 눌러 C++ 코딩 지식을 배워봅시다.</strong>
                ) : (
                  <>보드 위쪽에 있는 <strong>D13번 핀</strong>을 LED의 <strong>긴 다리(+)</strong>에 연결하고, <strong>GND 핀</strong>을 <strong>짧은 다리(-)</strong>에 연결해 주세요.</>
                )}
              </p>
            )}

            {currentStepIndex === 13 && (
              <div>
                {(() => {
                  if (!hasD13 || !hasGND || !codeBlocks) return false;
                  const setup = codeBlocks.find(b => b.type === 'setup');
                  const loop = codeBlocks.find(b => b.type === 'loop');
                  const hasPinMode = setup?.children?.some(c => c.type === 'pinMode' && c.args?.pin === '13' && c.args?.mode === 'OUTPUT');
                  const hasHigh = loop?.children?.some(c => c.type === 'digitalWrite' && c.args?.pin === '13' && c.args?.state === 'HIGH');
                  const hasLow = loop?.children?.some(c => c.type === 'digitalWrite' && c.args?.pin === '13' && c.args?.state === 'LOW');
                  const hasDelay = loop?.children?.some(c => c.type === 'delay');
                  return !!(hasPinMode && hasHigh && hasLow && hasDelay);
                })() ? (
                  <div style={{ 
                    background: 'rgba(34, 197, 94, 0.15)', border: '1px solid rgba(34, 197, 94, 0.5)',
                    color: '#ffffff', padding: '16px', borderRadius: 'var(--radius-md)', 
                    fontSize: '0.95rem', lineHeight: 1.6
                  }}>
                    <span style={{ fontSize: '1.2rem', marginRight: '8px' }}>💡</span><strong style={{ color: '#86efac' }}>LED가 깜빡입니다!</strong><br/><br/>
                    완벽합니다! 작성하신 블록 코드가 실제 C++ 코드로 변환되어, 13번 핀에 전기를 넣었다 끊었다를 1초마다 반복하고 있습니다!
                  </div>
                ) : (
                  <p style={{ fontSize: '1rem', color: '#ffffff', margin: 0, lineHeight: 1.6 }}>
                    이전 단계의 전선이 초기화되었습니다. 우측 시뮬레이터에서 <strong style={{ color: '#38bdf8' }}>D13번 핀을 LED의 긴 다리(+)</strong>에 연결하고, <strong style={{ color: '#38bdf8' }}>GND 핀을 LED의 짧은 다리(-)</strong>에 전선으로 다시 연결해 주세요! 그 후 좌측 에디터에서 블록들을 조립해야 뇌가 밸브를 제어하여 불이 깜빡이게 됩니다.
                  </p>
                )}
              </div>
            )}

            {/* Restructured Reset Button to fit content and not stretch full width */}
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
