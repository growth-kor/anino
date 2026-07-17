import { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { LevelSyllabusPage } from './components/landing/LevelSyllabusPage';
import { Day1Course } from './courses/Day1/Day1Course';
import { Day2Course } from './courses/Day2/Day2Course';
import { Day3Course } from './courses/Day3/Day3Course';
import { Day4Course } from './courses/Day4/Day4Course';
import { Day5Course } from './courses/Day5/Day5Course';
import './index.css';

type CourseView = 'day1' | 'day2' | 'day3' | 'day4' | 'day5';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'syllabus' | CourseView>('landing');
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [showAlert, setShowAlert] = useState(false);
  const [alertDay, setAlertDay] = useState(0);

  const handleSelectDay = (dayNum: number) => {
    if (dayNum === 1) {
      setCurrentView('day1');
    } else if (dayNum === 2) {
      setCurrentView('day2');
    } else if (dayNum === 3) {
      setCurrentView('day3');
    } else if (dayNum === 4) {
      setCurrentView('day4');
    } else if (dayNum === 5) {
      setCurrentView('day5');
    } else {
      setAlertDay(dayNum);
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
    }
  };

  const isCourseActive = currentView.startsWith('day');

  return (
    <div style={{ minHeight: '100vh', background: isCourseActive ? 'var(--color-bg-base)' : 'transparent', color: '#ffffff', position: 'relative' }}>
      
      {/* Day alert notice */}
      {showAlert && (
        <div style={{
          position: 'fixed', top: '24px', left: '50%', transform: 'translateX(-50%)',
          zIndex: 99999, background: 'rgba(245, 158, 11, 0.95)', color: '#000000',
          padding: '16px 24px', borderRadius: '12px', fontWeight: 800,
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', gap: '12px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          fontSize: '1.05rem',
          backdropFilter: 'blur(8px)'
        }}>
          ⚠️ Day {alertDay} 코스는 현재 가상 하드웨어 엔진 설계 단계입니다. Day 1~5 코스를 먼저 진행해 주세요!
        </div>
      )}

      {currentView === 'landing' && (
        <LandingPage 
          onSelectLevel={(levelId) => {
            setSelectedLevelId(levelId);
            setCurrentView('syllabus');
          }} 
        />
      )}

      {currentView === 'syllabus' && (
        <LevelSyllabusPage 
          levelId={selectedLevelId}
          onBackToLanding={() => setCurrentView('landing')}
          onSelectDay={handleSelectDay}
        />
      )}

      {currentView === 'day1' && (
        <Day1Course onBackToLanding={() => setCurrentView('syllabus')} />
      )}

      {currentView === 'day2' && (
        <Day2Course onBackToLanding={() => setCurrentView('syllabus')} />
      )}

      {currentView === 'day3' && (
        <Day3Course onBackToLanding={() => setCurrentView('syllabus')} />
      )}

      {currentView === 'day4' && (
        <Day4Course onBackToLanding={() => setCurrentView('syllabus')} />
      )}

      {currentView === 'day5' && (
        <Day5Course onBackToLanding={() => setCurrentView('syllabus')} />
      )}
    </div>
  );
}

export default App;
