import React, { useState, useEffect } from 'react';
import { BookOpen, Layers, ArrowLeft, ChevronDown, CheckCircle2, Circle, ChevronRight, RefreshCw, Lock } from 'lucide-react';
import { Day3Simulator } from './Day3Simulator';
import { Day3_Steps } from './Day3Content';
import confetti from 'canvas-confetti';

interface Day3CourseProps {
  onBackToLanding: () => void;
}

export const Day3Course: React.FC<Day3CourseProps> = ({ onBackToLanding }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [highestStepReached, setHighestStepReached] = useState(0);
  const [showMissions, setShowMissions] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});
  const [cardFolded, setCardFolded] = useState(false);

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
      setClearTextContent(`미션 클리어!`);
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

  const step = Day3_Steps[currentStepIndex];

  const isCurrentStepCleared = () => {
    if (step.type === 'theory') return true;
    return !!completedSteps[currentStepIndex];
  };

  const handleNextStep = () => {
    if (currentStepIndex < Day3_Steps.length - 1) {
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
              <BookOpen size={18} />
              진도 요약 ({currentStepIndex + 1}/{Day3_Steps.length})
              <ChevronDown size={16} />
            </button>

            {showMissions && (
              <div className="glass-panel" style={{
                position: 'absolute', top: '100%', right: 0, marginTop: '8px',
                width: '320px', maxHeight: '400px', overflowY: 'auto',
                padding: '16px', zIndex: 100, border: '1px solid var(--color-glass-border)',
                background: 'var(--color-bg-surface-elevated)', boxShadow: 'var(--shadow-lg)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ fontWeight: 850, fontSize: '1.1rem' }}>학습 목차</span>
                  <button 
                    onClick={resetProgress}
                    style={{ fontSize: '0.8rem', color: '#f87171', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                  >
                    <RefreshCw size={12} /> 진도 초기화
                  </button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {Day3_Steps.map((s, idx) => {
                    const isCompleted = idx < highestStepReached || completedSteps[idx];
                    const isLocked = idx > highestStepReached;
                    const isActive = idx === currentStepIndex;

                    return (
                      <div 
                        key={s.id}
                        onClick={() => !isLocked && [setCurrentStepIndex(idx), setShowMissions(false)]}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '10px',
                          padding: '10px 12px', borderRadius: 'var(--radius-md)',
                          background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent',
                          cursor: isLocked ? 'not-allowed' : 'pointer',
                          opacity: isLocked ? 0.4 : 1,
                          border: isActive ? '1px solid rgba(99,102,241,0.3)' : '1px solid transparent',
                          transition: 'all 0.2s'
                        }}
                      >
                        {isCompleted ? (
                          <CheckCircle2 size={16} color="var(--color-success)" style={{ flexShrink: 0 }} />
                        ) : isLocked ? (
                          <Lock size={16} color="var(--color-text-muted)" style={{ flexShrink: 0 }} />
                        ) : (
                          <Circle size={16} color="var(--color-accent-primary)" style={{ flexShrink: 0 }} />
                        )}
                        <span style={{ fontSize: '0.9rem', color: isActive ? '#fff' : 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: isActive ? 700 : 500 }}>
                          {idx + 1}. {s.title}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Workspace */}
      <div className="workspace-layout" style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        
        {step.type === 'theory' ? (
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', background: 'var(--color-bg-base)', padding: '40px 30px', overflowY: 'auto' }}>
            <div className="glass-panel animate-fade-in" style={{ maxWidth: '1000px', width: '100%', padding: '50px 60px', borderRadius: 'var(--radius-2xl)', border: '1px solid var(--color-glass-border)', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', background: 'var(--color-bg-surface-elevated)' }}>
              
              <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(99,102,241,0.1)', borderRadius: '4px', color: '#818cf8', fontSize: '0.85rem', fontWeight: 800, marginBottom: '16px' }}>
                DAY 3: 브레드보드 단자 분석과 직병렬 회로
              </div>
              
              <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '32px', letterSpacing: '-1px' }} className="text-gradient">
                {step.title}
              </h2>
              
              <div style={{ marginBottom: '40px' }}>
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
                {currentStepIndex < Day3_Steps.length - 1 ? (
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
                    🎉 Day 3 완료! 메인으로 돌아가기
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <>
            <div style={{ flex: 1.5, position: 'relative', height: '100%', display: 'flex', flexDirection: 'column' }}>
              
              <div style={{
                position: 'absolute', top: 20, left: 32, right: 32, zIndex: 10,
                display: 'flex', justifyContent: 'space-between', alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: '#c7d2fe', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '2px' }}>
                    Interactive Simulator
                  </div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>
                    {step.title}
                  </h2>
                </div>

                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={handleNextStep}
                    disabled={!isCurrentStepCleared()}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '12px 28px', borderRadius: 'var(--radius-full)',
                      fontWeight: 800,
                      background: isCurrentStepCleared() ? 'var(--color-success)' : 'rgba(255,255,255,0.08)',
                      color: isCurrentStepCleared() ? '#000' : 'var(--color-text-muted)',
                      cursor: isCurrentStepCleared() ? 'pointer' : 'not-allowed',
                      transition: 'all 0.2s',
                      fontSize: '1rem',
                      border: 'none'
                    }}
                  >
                    {isCurrentStepCleared()
                      ? (currentStepIndex === Day3_Steps.length - 1 ? '🎉 Day 3 완료!' : '미션 클리어! 다음 ➔') 
                      : '미션을 완료해야 다음으로 넘어갑니다'}
                  </button>
                </div>
              </div>

              <Day3Simulator 
                currentStepIndex={currentStepIndex}
                onMissionComplete={(complete) => handleMissionComplete(currentStepIndex, complete)}
                cardFolded={cardFolded}
                setCardFolded={setCardFolded}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
