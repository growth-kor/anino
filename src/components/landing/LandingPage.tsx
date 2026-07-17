import React, { useState } from 'react';
import { Play, Cpu, Zap, Layers, BookOpen, Terminal, ShieldCheck, ChevronRight } from 'lucide-react';
import { CurrentFlowBackground } from './CurrentFlowBackground';

interface LandingPageProps {
  onSelectLevel: (levelId: number) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onSelectLevel }) => {
  const [activeImg, setActiveImg] = useState(0);
  const [showLens, setShowLens] = useState(false);
  const [lensPos, setLensPos] = useState({ x: 0, y: 0, pctX: 0, pctY: 0 });

  const boardImages = [
    { src: '/board_iso.png', alt: '아두이노 우노 3D 입체 뷰' },
    { src: '/board_top.png', alt: '아두이노 우노 실물 R3 보드' },
    { src: '/board_pinout.png', alt: '아두이노 우노 상세 핀 매핑 가이드' }
  ];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const pctX = x / rect.width;
    const pctY = y / rect.height;
    setLensPos({ x, y, pctX, pctY });
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', paddingBottom: 'var(--spacing-24)', position: 'relative', fontSize: '1.05rem', overflowX: 'hidden' }}>
      
      {/* Dynamic Electron/Current Flow Canvas Background */}
      <CurrentFlowBackground />

      {/* Header */}
      <header style={{ padding: 'var(--spacing-6) var(--spacing-12)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        <div className="flex-center" style={{ gap: '12px' }}>
          <div style={{
            width: '40px', height: '40px', 
            background: 'var(--color-accent-primary)',
            borderRadius: 'var(--radius-lg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Layers size={24} color="white" />
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
            Anino <span style={{ color: 'var(--color-text-muted)', fontWeight: 500 }}>Studio</span>
          </h1>
        </div>

        {/* Customer Feedback/Form Button */}
        <a 
          href="https://docs.google.com/forms/d/e/1FAIpQLScXpkHkGAKNxeY90oBPGdYc-gnWH8ns9jxdb6AcDQXr3uzG2Q/viewform?usp=dialog" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{
            padding: '10px 20px', borderRadius: '8px', 
            border: '1px solid rgba(129, 140, 248, 0.4)', 
            background: 'rgba(129, 140, 248, 0.05)',
            color: '#c7d2fe', fontSize: '0.95rem', fontWeight: 700,
            textDecoration: 'none', cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', gap: '6px'
          }}
          onMouseOver={e => { e.currentTarget.style.background = 'rgba(129, 140, 248, 0.15)'; e.currentTarget.style.borderColor = '#818cf8'; }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(129, 140, 248, 0.05)'; e.currentTarget.style.borderColor = 'rgba(129, 140, 248, 0.4)'; }}
        >
          고객 의견 접수
        </a>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 var(--spacing-6)', position: 'relative', zIndex: 10 }}>
        
        {/* Hero Section */}
        <section className="animate-fade-in" style={{ textAlign: 'center', marginTop: 'var(--spacing-12)', marginBottom: 'var(--spacing-24)' }}>
          <div style={{ display: 'inline-block', padding: '8px 20px', background: 'rgba(139,92,246,0.15)', borderRadius: 'var(--radius-full)', color: '#c4b5fd', fontSize: '0.95rem', fontWeight: 700, marginBottom: 'var(--spacing-6)', border: '1px solid rgba(139,92,246,0.3)' }}>
            하드웨어 없이 시작하는 아두이노 마스터 클래스
          </div>
          <h2 style={{ fontSize: '4.8rem', fontWeight: 900, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: 'var(--spacing-6)' }}>
            부품 하나 없이, <br/>
            <span className="text-gradient">내 머릿속에 완벽한 회로를.</span>
          </h2>
          <p style={{ fontSize: '1.35rem', color: 'var(--color-text-secondary)', maxWidth: '750px', margin: '0 auto var(--spacing-8)', lineHeight: 1.6 }}>
            Anino는 브라우저 안에서 구동되는 완벽한 물리 엔진 시뮬레이터로, 당신을 하드웨어 마스터의 길로 안내합니다.
          </p>
          <button 
            onClick={() => onSelectLevel(1)}
            className="animate-float"
            style={{
              background: 'var(--color-accent-primary)', color: 'white',
              padding: '18px 48px', borderRadius: 'var(--radius-full)',
              fontSize: '1.2rem', fontWeight: 800,
              boxShadow: 'var(--shadow-glow)', transition: 'all 0.2s',
              display: 'inline-flex', alignItems: 'center', gap: '12px', cursor: 'pointer', border: 'none'
            }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'var(--color-accent-hover)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'var(--color-accent-primary)'; }}
          >
            <Play size={22} fill="currentColor" />
            첫 코스 시작하기
          </button>
        </section>

        {/* What is Arduino & Why Anino */}
        <section style={{ marginBottom: 'var(--spacing-24)' }}>
          <div className="bento-grid" style={{ gap: '24px' }}>
            {/* Expanded layout with flex for Side-by-Side: text on left, custom media gallery on right */}
            <div className="glass-panel bento-item" style={{ padding: 'var(--spacing-8)', gridColumn: 'span 2', display: 'flex', gap: '32px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '300px' }}>
                <Cpu size={36} color="#3b82f6" style={{ marginBottom: 'var(--spacing-4)' }} />
                <h3 style={{ fontSize: '1.95rem', marginBottom: 'var(--spacing-4)', fontWeight: 800 }}>아두이노(Arduino)란 무엇인가요?</h3>
                <p style={{ color: 'var(--color-text-secondary)', lineHeight: 1.7, fontSize: '1.15rem', margin: 0 }}>
                  아두이노는 센서로 빛이나 온도를 감지하고, 모터를 돌리거나 LED를 켜는 등 <strong>현실 세계와 상호작용하는 작은 컴퓨터</strong>입니다. 스마트홈 기기, 자율주행 로봇, 인공지능 IoT 등 우리가 아는 모든 하드웨어 기술의 가장 기초적이고 훌륭한 입문 도구입니다.
                </p>
              </div>

              {/* Sophisticated Interactive Image Gallery with Rectangular Magnifier */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '360px', flexShrink: 0 }}>
                <div 
                  onMouseEnter={() => setShowLens(true)}
                  onMouseLeave={() => setShowLens(false)}
                  onMouseMove={handleMouseMove}
                  style={{ 
                    width: '100%', height: '230px', position: 'relative',
                    cursor: showLens ? 'none' : 'default'
                  }}
                >
                  <div style={{
                    width: '100%', height: '100%', borderRadius: '12px', overflow: 'hidden', 
                    border: '1px solid var(--color-glass-border)', background: 'rgba(255,255,255,0.03)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <img 
                      src={boardImages[activeImg].src} 
                      alt={boardImages[activeImg].alt} 
                      style={{ width: '92%', height: '92%', objectFit: 'contain' }} 
                    />
                  </div>
                  
                  {/* Rectangular Magnifier Zoom Lens */}
                  {showLens && (
                    <div style={{
                      position: 'absolute',
                      left: `${lensPos.x - 70}px`,
                      top: `${lensPos.y - 50}px`,
                      width: '140px',
                      height: '100px',
                      border: '2px solid #818cf8',
                      borderRadius: '8px',
                      backgroundImage: `url(${boardImages[activeImg].src})`,
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '350% 350%', // 3.5x Zoom
                      backgroundPosition: `${lensPos.pctX * 100}% ${lensPos.pctY * 100}%`,
                      pointerEvents: 'none',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
                      backgroundColor: '#070a13',
                      zIndex: 100
                    }} />
                  )}

                  <div style={{ 
                    position: 'absolute', bottom: '8px', right: '12px', 
                    background: 'rgba(0,0,0,0.6)', padding: '2px 8px', 
                    borderRadius: '4px', fontSize: '0.75rem', color: '#94a3b8',
                    pointerEvents: 'none'
                  }}>
                    {boardImages[activeImg].alt} {showLens ? '(자세히 보기 구동 중)' : ''}
                  </div>
                </div>
                {/* Thumbnails */}
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                  {boardImages.map((img, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setActiveImg(idx)}
                      style={{
                        width: '76px', height: '54px', borderRadius: '6px', overflow: 'hidden',
                        border: activeImg === idx ? '2px solid #818cf8' : '1px solid var(--color-glass-border)',
                        cursor: 'pointer', opacity: activeImg === idx ? 1 : 0.6,
                        transition: 'all 0.2s', background: '#0f172a',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      <img src={img.src} alt={img.alt} style={{ width: '90%', height: '90%', objectFit: 'contain' }} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="glass-panel bento-item" style={{ padding: 'var(--spacing-8)', minWidth: '300px' }}>
              <ShieldCheck size={36} color="#22c55e" style={{ marginBottom: 'var(--spacing-4)' }} />
              <h3 style={{ fontSize: '1.7rem', marginBottom: 'var(--spacing-4)', fontWeight: 800 }}>왜 Anino를 선택해야 하나요?</h3>
              <ul style={{ color: 'var(--color-text-secondary)', lineHeight: 1.9, paddingLeft: '22px', fontSize: '1.1rem' }}>
                <li><strong style={{ color: '#fff' }}>비용 제로:</strong> 비싼 스타터 키트를 살 필요가 없습니다.</li>
                <li><strong style={{ color: '#fff' }}>안전함:</strong> 선을 잘못 꽂아 칩이 타버리는 두려움 없이 마음껏 실험하세요.</li>
                <li><strong style={{ color: '#fff' }}>시각적 이해:</strong> 전기가 어떻게 흐르는지 눈으로 직접 확인합니다.</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Terminology / Methodology Explanation */}
        <section style={{ marginBottom: 'var(--spacing-24)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 'var(--spacing-4)' }}>초보자도 전문가처럼 배우는 <span className="text-gradient">혁신적 학습법</span></h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>Anino 스튜디오에 적용된 3가지 핵심 에듀테크 기술을 소개합니다.</p>
          </div>

          <div className="bento-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            <div className="glass-panel bento-item" style={{ padding: 'var(--spacing-6)' }}>
              <Zap size={32} color="#f59e0b" style={{ marginBottom: 'var(--spacing-4)' }} />
              <h4 style={{ fontSize: '1.35rem', marginBottom: 'var(--spacing-2)', color: '#fde68a', fontWeight: 800 }}>1. 인터랙티브 가상 회로</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                어려운 회로도 대신, 실제 아두이노 보드에 <strong>직접 마우스로 선을 긋습니다.</strong> 5V와 GND를 잘못 연결하면 연기가 피어오릅니다! 전기의 흐름을 시각적으로 체감할 수 있습니다.
              </p>
            </div>
            
            <div className="glass-panel bento-item" style={{ padding: 'var(--spacing-6)' }}>
              <Terminal size={32} color="#8b5cf6" style={{ marginBottom: 'var(--spacing-4)' }} />
              <h4 style={{ fontSize: '1.35rem', marginBottom: 'var(--spacing-2)', color: '#ddd6fe', fontWeight: 800 }}>2. 실시간 C++ 코드 변환</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                텍스트 코딩이 처음이신가요? 레고 블록을 맞추듯 UI 버튼을 눌러 논리를 조립하세요. <strong>블록을 놓는 즉시 옆 화면에 실제 C 언어 코드가 타이핑되어 나타납니다.</strong> 자연스럽게 진짜 프로그래머의 문법을 습득합니다.
              </p>
            </div>

            <div className="glass-panel bento-item" style={{ padding: 'var(--spacing-6)' }}>
              <BookOpen size={32} color="#3b82f6" style={{ marginBottom: 'var(--spacing-4)' }} />
              <h4 style={{ fontSize: '1.35rem', marginBottom: 'var(--spacing-2)', color: '#bfdbfe', fontWeight: 800 }}>3. PPT 슬라이드 러닝</h4>
              <p style={{ color: 'var(--color-text-secondary)', fontSize: '1rem', lineHeight: 1.6 }}>
                길고 지루한 동영상이나, 갑자기 나타나는 낯선 코드 창에 겁먹을 필요 없습니다. 한 화면에 <strong>딱 하나의 핵심 이론과 하나의 실습</strong>을 교대로 제공하는 선형적 구조로 누구나 포기 없이 완주할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Syllabus / 30-Day Roadmap */}
        <section style={{ marginBottom: 'var(--spacing-24)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--spacing-12)' }}>
            <h2 style={{ fontSize: '2.8rem', fontWeight: 800, marginBottom: 'var(--spacing-4)' }}>목표: 30일 만에 <span className="text-gradient">Lv.5 선생님 급 마스터</span> 달성</h2>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.2rem' }}>해제를 원하는 레벨들을 클릭하여 상세 학습 로드맵과 1일차 실습을 시작해 보세요.</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Level Syllabus List */}
            {[
              { id: 1, day: 'Day 1', lv: 'Lv. 1 입문 (1일)', title: '전기의 흐름과 LED 깜빡이기', desc: '가상 회로에 5V와 GND를 연결해보고 부품이 타는 원리와 아두이노 보드의 뇌/통신 핀 구조를 배웁니다.' },
              { id: 2, day: 'Day 2-5', lv: 'Lv. 2 기초 (4일간)', title: '하드웨어 구성 요소', desc: '다양한 저항과 센서를 사용하며 회로의 깊은 원리를 깨우칩니다.' },
              { id: 3, day: 'Day 6-10', lv: 'Lv. 3 초급 (5일간)', title: '스마트 세상 구현 (조도 센서, 모터 제어)', desc: '빛에 반응하는 센서와 모터를 제어하여 로봇의 뼈대를 구축합니다.' },
              { id: 4, day: 'Day 11-20', lv: 'Lv. 4 중급 (10일간)', title: '다중 센서와 시스템 설계자', desc: 'LCD 화면에 글자를 띄우고 조건문, 반복문을 통해 온습도계를 제작합니다.' },
              { id: 5, day: 'Day 21-30', lv: 'Lv. 5 고급 & 마스터 (10일간)', title: '커넥티드 IoT 및 디버깅', desc: '무선 통신 웹서버를 구축하고 최종적으로 10대 고장 하드웨어를 트러블슈팅합니다.' }
            ].map((course) => (
              <div 
                key={course.id} 
                className="glass-panel" 
                style={{ 
                  padding: '24px 32px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  borderLeft: '5px solid var(--color-accent-primary)', 
                  background: 'rgba(30, 41, 59, 0.2)' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ 
                    width: '80px', height: '80px', borderRadius: '50%', 
                    background: 'rgba(99,102,241,0.1)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', 
                    color: '#818cf8', fontSize: '1rem', fontWeight: 900,
                    whiteSpace: 'nowrap', flexShrink: 0
                  }}>
                    {course.day}
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.8rem', padding: '3px 10px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', color: '#c7d2fe', fontWeight: 700 }}>{course.lv}</span>
                      <h4 style={{ fontSize: '1.35rem', margin: 0, fontWeight: 800, color: '#ffffff' }}>{course.title}</h4>
                    </div>
                    <p style={{ color: 'var(--color-text-secondary)', margin: 0, fontSize: '1.05rem', lineHeight: 1.5 }}>{course.desc}</p>
                  </div>
                </div>
                
                <button 
                  onClick={() => onSelectLevel(course.id)} 
                  style={{ 
                    padding: '14px 28px', 
                    background: 'var(--color-accent-primary)', 
                    color: '#ffffff', 
                    borderRadius: 'var(--radius-full)', 
                    fontWeight: 800, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    cursor: 'pointer', 
                    border: 'none', 
                    fontSize: '1rem', 
                    transition: 'all 0.2s',
                    flexShrink: 0
                  }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  학습 목차 <ChevronRight size={18} />
                </button>
              </div>
            ))}

          </div>
        </section>
      </main>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: 'var(--spacing-12)', borderTop: '1px solid var(--color-glass-border)', color: 'var(--color-text-muted)' }}>
        <p>© 2026 Anino Studio. Developed for the best learning experience.</p>
      </footer>
    </div>
  );
};
