import React from 'react';
import { UnoBoard } from '../../components/hardware/Board';

export type StepType = 'theory' | 'practice';

export interface Step {
  id: number;
  type: StepType;
  title: string;
  content: React.ReactNode;
  practiceProps?: {
    missionTitle: string;
    showCode: boolean;
  };
}

export const Day3_Steps: Step[] = [
  {
    id: 1, type: 'theory', title: '부품 확장소 - 브레드보드(Breadboard)의 필요성',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          아두이노 보드는 아주 훌륭하지만, 한 가지 치명적인 물리적 한계가 있습니다. **연결할 수 있는 구멍(핀 단자)의 개수가 너무 부족하다**는 점입니다.
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          예를 들어, LED를 3개 켜고 싶은데 아두이노 보드에서 전기를 모아 배출하는 GND(배수구) 구멍은 단 3개뿐입니다. 센서나 부품이 더 늘어나면 선을 꽂을 자리가 아예 없어집니다.
        </p>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '24px' }}>
          이때 납땜을 하지 않고도 수십 개의 부품을 임시로 꽂아 전선망을 확장할 수 있게 도와주는 만능 도구가 바로 **브레드보드(Breadboard)**, 일명 **빵판**입니다.
        </p>
        <div style={{ background: 'rgba(99,102,241,0.08)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' }}>
          <strong style={{ color: '#818cf8', display: 'block', marginBottom: '8px' }}>왜 이름이 빵판(Breadboard)일까요?</strong>
          <span style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '1.1rem' }}>
            1970년대 이전의 전자공학 취미가들은 회로를 테스트할 때 실제 부엌에서 쓰는 나무 빵 도마(Bread board)에 못을 박고 전선을 감아서 실험했습니다. 이 유래가 굳어져 오늘날의 플라스틱 핀 판데기도 브레드보드라고 부르게 되었습니다.
          </span>
        </div>
      </div>
    )
  },
  {
    id: 2, type: 'theory', title: '브레드보드의 해부도 - 내부 연결선 분석',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '950px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          브레드보드는 구멍마다 아무렇게나 연결된 것이 아닙니다. 플라스틱 내부에 **구리 금속 클립**이 숨겨져 있어, 특정 방향으로만 전기가 통합니다. 이 내부 배선 원리를 반드시 이해해야 회로를 쇼트 없이 안전하게 만들 수 있습니다.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '32px', alignItems: 'center' }}>
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>1. 파워 버스 레일 (Power Bus Rails)</h4>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.1rem', marginBottom: '20px' }}>
              보드의 양쪽 가장자리에 빨간색(+)선과 파란색(-)선이 그어진 구간입니다. 이 구간의 구멍들은 **가로 방향(또는 세로 방향 레일 방향)으로 끝까지 쭉 한 몸으로 연결**되어 있습니다. 아두이노의 5V와 GND를 여기에 한 번만 연결해두면, 옆에 있는 수십 개의 구멍 모두에서 5V와 GND를 마음껏 끌어다 쓸 수 있습니다.
            </p>
            <h4 style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, marginBottom: '12px' }}>2. IC 영역/단자 영역 (Terminal Strips)</h4>
            <p style={{ color: '#cbd5e1', lineHeight: 1.8, fontSize: '1.1rem', margin: 0 }}>
              가운데에 A-B-C-D-E / F-G-H-I-J 라고 알파벳이 적히고 숫자가 매겨진 구멍들입니다. 이 영역은 **세로 방향으로 5개의 구멍(예: A1부터 E1까지)만 한 묶음으로 연결**되어 있습니다. 가운데의 깊은 홈을 기준으로는 위아래가 차단되어 있습니다.
            </p>
          </div>

          {/* SVG Diagram illustrating internal breadboard trace lines */}
          <div style={{ background: '#0f172a', padding: '24px', borderRadius: '16px', border: '1px solid #334155' }}>
            <svg width="100%" height="220" viewBox="0 0 200 180">
              {/* Rails representing connection lines */}
              <line x1="20" y1="20" x2="180" y2="20" stroke="#ef4444" strokeWidth="6" strokeDasharray="2,5" opacity="0.7" />
              <text x="100" y="15" fill="#fca5a5" fontSize="10" textAnchor="middle">가로 파워 레일 (+)</text>

              <line x1="20" y1="40" x2="180" y2="40" stroke="#3b82f6" strokeWidth="6" strokeDasharray="2,5" opacity="0.7" />
              <text x="100" y="55" fill="#93c5fd" fontSize="10" textAnchor="middle">가로 파워 레일 (-)</text>
              
              {/* Vertical IC connection representation */}
              <rect x="50" y="80" width="16" height="80" fill="rgba(34,197,94,0.2)" stroke="#22c55e" strokeWidth="2" rx="4" />
              <circle cx="58" cy="90" r="3" fill="#22c55e" />
              <circle cx="58" cy="105" r="3" fill="#22c55e" />
              <circle cx="58" cy="120" r="3" fill="#22c55e" />
              <circle cx="58" cy="135" r="3" fill="#22c55e" />
              <circle cx="58" cy="150" r="3" fill="#22c55e" />

              <text x="80" y="120" fill="#86efac" fontSize="10" alignmentBaseline="middle">세로 5칸 연결 (IC 영역)</text>
            </svg>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3, type: 'theory', title: '직렬(Series) vs 병렬(Parallel) 회로 설계',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          부품을 확장하여 연결할 때는 전기가 흘러가는 길을 어떻게 낼지에 따라 **직렬**과 **병렬**로 나뉩니다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(239,68,68,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)' }}>
            <h5 style={{ color: '#fca5a5', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>⛓️ 직렬 회로 (Series Circuit)</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              - 전기를 하나의 외길로 흐르게 이어 배치합니다.<br/>
              - 중간에 부품 하나가 고장 나거나 연결이 끊어지면 회로 전체의 물길이 막혀 **나머지 모든 LED도 꺼집니다.** (예: 구식 크리스마스 트리 전구)<br/>
              - 전압이 부품 수만큼 분할되어 LED가 매우 침침해집니다.
            </p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <h5 style={{ color: '#86efac', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>🌳 병렬 회로 (Parallel Circuit)</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              - 전하가 갈라져 흐를 수 있도록 독립적인 여러 개의 길(가지)을 냅니다.<br/>
              - 한 부품이 끊어지더라도 다른 물길로 우회하여 전기가 흐르므로, **다른 LED들은 아무 영향 없이 밝게 켜집니다.** (예: 우리 집 조명/콘센트 설계)<br/>
              - 모든 가지에 똑같이 아두이노의 5V 전압이 100% 걸립니다.
            </p>
          </div>
        </div>

        <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
          아두이노 실습을 할 때는 대부분 독립 제어와 밝기 확보를 위해 **병렬 회로**로 구성합니다. 이번 미션에서도 3개의 LED를 병렬로 나란히 배치하여 각각의 물길을 제어해 보겠습니다!
        </p>
      </div>
    )
  },
  {
    id: 4, type: 'theory', title: '실습 회로 설계도와 단자 연동 원리',
    content: (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textAlign: 'left', margin: '0 auto', maxWidth: '1000px', fontSize: '1.15rem' }}>
        <div style={{ flex: '0 0 440px', height: '310px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="100%" viewBox="-10 -10 380 270">
            <UnoBoard x={0} y={0} activePins={[]} highlight="none" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 850 }}>3개 LED 병렬 제어하기</h4>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            우리는 아두이노의 디지털 핀 **D11, D12, D13**을 사용해 3개의 독립된 LED 신호등 회로를 설계합니다.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            - 아두이노의 **D13** ➔ <strong>첫 번째 LED의 저항(R1)</strong> ➔ <strong>LED1(+)</strong><br/>
            - 아두이노의 **D12** ➔ <strong>두 번째 LED의 저항(R2)</strong> ➔ <strong>LED2(+)</strong><br/>
            - 아두이노의 **D11** ➔ <strong>세 번째 LED의 저항(R3)</strong> ➔ <strong>LED3(+)</strong><br/>
            - 세 LED의 짧은 다리(-)는 전부 **GND**로 모아서 연결해 주어야 합니다.
          </p>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
            우측 시뮬레이터에서 3개의 LED를 저항을 거쳐 아두이노의 독립 디지털 제어 핀에 연결해 신호등의 기초 회로를 완성해 보세요!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 5, type: 'practice', title: '실습 2: 브레드보드 병렬 LED 제어 회로', content: null,
    practiceProps: { 
      missionTitle: '미션. 3개의 LED를 저항(R1, R2, R3)을 거쳐 D13, D12, D11 핀과 GND 핀에 올바르게 결선하기', 
      showCode: false 
    }
  }
];
