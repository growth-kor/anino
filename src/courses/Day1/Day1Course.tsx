import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, ArrowLeft, ChevronDown, CheckCircle2, Circle, ChevronRight, RefreshCw, Lock } from 'lucide-react';
import { SimulatorView } from '../../components/hardware/SimulatorView';
import { CodeWorkspace, type LogicBlock } from '../../components/editor/CodeWorkspace';
import { Day1_Steps } from './Day1Content';
import confetti from 'canvas-confetti';

interface Day1CourseProps {
  onBackToLanding: () => void;
}

export const Day1Course: React.FC<Day1CourseProps> = ({ onBackToLanding }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highestStepReached, setHighestStepReached] = useState(0);
  const [showMissions, setShowMissions] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [cardFolded, setCardFolded] = useState(false);

  const [codeBlocks, setCodeBlocks] = useState<LogicBlock[]>([
    { id: 'b-setup', type: 'setup', children: [] },
    { id: 'b-loop', type: 'loop', children: [] }
  ]);

  useEffect(() => {
    if (currentStepIndex > highestStepReached) {
      setHighestStepReached(currentStepIndex);
    }
  }, [currentStepIndex, highestStepReached]);

  const [showClearText, setShowClearText] = useState(false);
  const [clearTextContent, setClearTextContent] = useState('');

  const handleMissionComplete = (stepIndex: number, isComplete: boolean) => {
    if (isComplete && !completedSteps[stepIndex]) {
      setCompletedSteps(prev => ({ ...prev, [stepIndex]: true }));
      
      // Calculate mission numbers (since we added theory slides, indexes changed)
      // Indexes:
      // 7: Practice 1 (Mission 1)
      // 8: Practice 2 (Mission 2)
      // 11: Practice 3 (Mission 3)
      // 13: Practice 4 (Mission 4)
      let missionNum = 1;
      if (stepIndex === 8) missionNum = 2;
      else if (stepIndex === 11) missionNum = 3;
      else if (stepIndex === 13) missionNum = 4;

      setClearTextContent(`미션 ${missionNum} 클리어!`);
      setShowClearText(true);
      
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#8b5cf6', '#fbbf24']
      });

      setTimeout(() => setShowClearText(false), 2200);
    }
  };

  const step = Day1_Steps[currentStepIndex];

  const isCurrentStepCleared = () => {
    if (step.type === 'theory') return true;
    return !!completedSteps[currentStepIndex];
  };

  const handleNextStep = () => {
    if (currentStepIndex < Day1_Steps.length - 1) {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  const resetProgress = () => {
    setCurrentStepIndex(0);
    setHighestStepReached(0);
    setCompletedSteps({});
    setCodeBlocks([
      { id: 'b-setup', type: 'setup', children: [] },
      { id: 'b-loop', type: 'loop', children: [] }
    ]);
    setShowMissions(false);
  };

  return (
    <div className="app-container" style={{ fontSize: '1.05rem' }}>
      
      {/* Confetti Overlay */}
      {showClearText && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999,
          pointerEvents: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <h1 className="animate-fade-in text-gradient" style={{ 
            fontSize: '5rem', fontWeight: 900, textShadow: '0 10px 40px rgba(0,0,0,0.6)',
            transform: 'translateY(-20px)'
          }}>
            {clearTextContent}
          </h1>
        </div>
      )}

      {/* Header */}
      <header className="app-header" style={{ position: 'relative', zIndex: 50, padding: '16px 32px' }}>
        <div className="flex-center" style={{ gap: '20px' }}>
          <button 
            onClick={onBackToLanding}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', background: 'transparent', padding: '10px 14px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.05rem', border: 'none' }}
            onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
            onMouseOut={e => e.currentTarget.style.background = 'transparent'}
          >
            <ArrowLeft size={20} /> 메인 코스
          </button>
          
          <div onClick={onBackToLanding} className="flex-center" style={{ gap: '12px', cursor: 'pointer' }}>
            <div style={{ width: '36px', height: '36px', background: 'var(--color-accent-primary)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow)' }}>
              <Layers size={20} color="white" />
            </div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px' }}>
              Anino <span style={{ color: 'var(--color-text-muted)', fontSize: '1rem', fontWeight: 500 }}>Studio</span>
            </h1>
          </div>
        </div>
        
        <div className="flex-center" style={{ gap: '16px' }}>
          <div style={{ position: 'relative' }}>
            <button 
              onClick={() => setShowMissions(!showMissions)}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                background: 'var(--color-bg-surface-elevated)', color: '#ffffff',
                padding: '10px 20px', borderRadius: 'var(--radius-full)',
                fontSize: '1rem', fontWeight: 700, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer'
              }}
            >
              <BookOpen size={18} color="#8b5cf6" />
              <span>Day 1 - Step {currentStepIndex + 1}/{Day1_Steps.length}</span>
              <ChevronDown size={16} />
            </button>

            {/* Dropdown Menu */}
            {showMissions && (
              <div style={{
                position: 'absolute', top: '120%', right: 0, width: '400px',
                background: 'var(--color-bg-surface-elevated)', border: '1px solid var(--color-glass-border)',
                borderRadius: 'var(--radius-lg)', padding: '20px', boxShadow: 'var(--shadow-lg)',
                maxHeight: '75vh', overflowY: 'auto'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h4 style={{ margin: 0, fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: 800 }}>Day 1 학습 목차</h4>
                  <button onClick={resetProgress} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', color: '#fca5a5', fontSize: '0.85rem', cursor: 'pointer', border: '1px solid rgba(239,68,68,0.3)', padding: '4px 8px', borderRadius: '4px' }}>
                    <RefreshCw size={12} /> 진도 초기화
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Day1_Steps.map((s, idx) => {
                    const isUnlocked = idx <= highestStepReached;
                    const isStepCleared = s.type === 'theory' ? (idx < highestStepReached) : !!completedSteps[idx];
                    return (
                      <div 
                        key={s.id} 
                        onClick={() => { if(isUnlocked) { setCurrentStepIndex(idx); setShowMissions(false); } }}
                        style={{ 
                          display: 'flex', alignItems: 'center', gap: '14px', 
                          cursor: isUnlocked ? 'pointer' : 'not-allowed',
                          padding: '14px', borderRadius: '8px',
                          background: idx === currentStepIndex ? 'rgba(139,92,246,0.15)' : 'transparent',
                          border: idx === currentStepIndex ? '1px solid rgba(139,92,246,0.3)' : '1px solid transparent',
                          opacity: isUnlocked ? 1 : 0.5,
                          transition: 'all 0.2s'
                        }}
                      >
                        {isStepCleared ? <CheckCircle2 size={22} color="#22c55e" /> : 
                         idx === currentStepIndex ? <Circle size={22} color="#8b5cf6" /> : 
                         <Lock size={22} color="var(--color-text-muted)" />}
                        <div>
                          <div style={{ color: idx === currentStepIndex ? '#ffffff' : 'var(--color-text-secondary)', fontSize: '1rem', fontWeight: 700, marginBottom: '4px' }}>{s.title}</div>
                          <div style={{ color: idx === currentStepIndex ? '#c4b5fd' : 'var(--color-text-muted)', fontSize: '0.85rem' }}>{s.type === 'theory' ? '이론 설명' : '실습'}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="app-main" style={{ height: 'calc(100vh - 72px)' }}>
        {step.type === 'theory' ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--color-bg-base)', padding: '40px 30px', overflowY: 'auto' }}>
            <div className="glass-panel animate-fade-in" style={{ maxWidth: '1000px', width: '100%', padding: '50px 60px', textAlign: 'center', position: 'relative' }}>
              <div style={{ display: 'inline-flex', padding: '10px 20px', background: 'rgba(139,92,246,0.15)', borderRadius: 'var(--radius-full)', color: '#c4b5fd', fontSize: '1rem', fontWeight: 800, marginBottom: '24px', border: '1px solid rgba(139,92,246,0.3)' }}>
                💡 Day 1 핵심 개념 - {currentStepIndex + 1}
              </div>
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '40px', color: '#ffffff', letterSpacing: '-0.5px' }}>{step.title}</h2>
              
              <div style={{ marginBottom: '50px' }}>
                {step.content}
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                {currentStepIndex > 0 && (
                  <button 
                    onClick={handlePrevStep}
                    style={{ padding: '16px 36px', background: 'transparent', border: '1px solid var(--color-glass-border)', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: '1.15rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                    onMouseOut={e => e.currentTarget.style.background = 'transparent'}
                  >
                    이전으로
                  </button>
                )}
                {currentStepIndex < Day1_Steps.length - 1 ? (
                  <button 
                    onClick={handleNextStep}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 48px', background: 'var(--color-accent-primary)', color: '#fff', borderRadius: 'var(--radius-full)', fontSize: '1.15rem', fontWeight: 800, boxShadow: 'var(--shadow-glow)', cursor: 'pointer', border: 'none', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    다음 단계 <ChevronRight size={22} />
                  </button>
                ) : (
                  <button 
                    onClick={onBackToLanding}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '16px 48px', background: 'var(--color-success)', color: '#000', borderRadius: 'var(--radius-full)', fontSize: '1.15rem', fontWeight: 800, boxShadow: 'var(--shadow-glow)', cursor: 'pointer', border: 'none', transition: 'all 0.2s' }}
                    onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    🎉 Day 1 완료! 메인으로 돌아가기
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            {step.practiceProps?.showCode && (
              <div style={{ flex: 1.1, borderRight: '1px solid var(--color-glass-border)', display: 'flex', flexDirection: 'column', padding: 'var(--spacing-4)', background: 'var(--color-bg-base)' }}>
                <CodeWorkspace blocks={codeBlocks} setBlocks={setCodeBlocks} />
              </div>
            )}
            <div style={{ flex: step.practiceProps?.showCode ? 1.2 : 2.5, display: 'flex', flexDirection: 'column', position: 'relative', background: 'var(--color-bg-surface)' }}>
              
              {/* Top Mission Guide Bar */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '70px',
                background: 'rgba(15, 22, 41, 0.9)', backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--color-glass-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px', zIndex: 10
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ padding: '8px 14px', background: 'rgba(34,197,94,0.2)', color: '#4ade80', borderRadius: '8px', fontWeight: 800, fontSize: '0.95rem' }}>실습 미션</div>
                  <h3 style={{ color: '#ffffff', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{step.practiceProps?.missionTitle}</h3>
                </div>
                
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                  {currentStepIndex > 0 && (
                    <button 
                      onClick={handlePrevStep} 
                      style={{ color: 'var(--color-text-secondary)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: 600 }}
                    >
                      이전 단계
                    </button>
                  )}
                  <button 
                    onClick={handleNextStep}
                    disabled={!isCurrentStepCleared()}
                    style={{
                      padding: '10px 28px', borderRadius: 'var(--radius-full)', fontWeight: 800,
                      background: isCurrentStepCleared() ? 'var(--color-success)' : 'rgba(255,255,255,0.08)',
                      color: isCurrentStepCleared() ? '#000' : 'var(--color-text-muted)',
                      cursor: isCurrentStepCleared() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      fontSize: '1rem',
                      border: 'none'
                    }}
                  >
                    {isCurrentStepCleared()
                      ? (currentStepIndex === Day1_Steps.length - 1 ? '🎉 Day 1 완료!' : '미션 클리어! 다음 ➔') 
                      : '미션을 완료해야 다음으로 넘어갑니다'}
                  </button>
                </div>
              </div>

              {/* Simulator Card folding container */}
              <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                <SimulatorView 
                  codeBlocks={codeBlocks}
                  currentStepIndex={currentStepIndex}
                  onMissionComplete={(complete) => handleMissionComplete(currentStepIndex, complete)}
                  cardFolded={cardFolded}
                  setCardFolded={setCardFolded}
                />
              </div>

            </div>
          </>
        )}
      </main>
    </div>
  );
};
