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

export const Day2_Steps: Step[] = [
  {
    id: 1, type: 'theory', title: '수도관과 댐 - 저항(Resistor)이란 무엇인가?',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          Day 1에서 우리는 저항 없이 5V 전원과 LED를 바로 연결했다가 무시무시한 전류 때문에 LED가 타버리는 **쇼트(합선)** 현상을 목격했습니다.
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          <strong>저항(Resistor)</strong>은 쉽게 말해 전기의 흐름을 방해하는 <strong>수도관의 밸브나 강물의 댐</strong>과 같습니다. 전선의 통로를 좁혀서 너무 많은 전하(물)가 한꺼번에 쏟아져 들어오지 못하도록 막아주는 안전 장치입니다.
        </p>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', background: 'rgba(245,158,11,0.08)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '24px' }}>
          <div style={{ fontSize: '3rem' }}>💡</div>
          <div>
            <strong style={{ color: '#fbbf24', fontSize: '1.25rem', display: 'block', marginBottom: '8px' }}>왜 저항이 필수적일까요?</strong>
            <span style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
              LED나 센서 같은 정밀 부품들은 받아들일 수 있는 최대 전류가 정해져 있습니다. 저항을 회로 중간에 배치하지 않으면 전기가 거침없이 흐르면서 과도한 마찰열을 발생시키고, 이 열이 반도체 소자를 영구적으로 녹여 파괴해버립니다.
            </span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 2, type: 'theory', title: '우주적 공식 - 옴의 법칙 (V = I x R)',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          전자공학에서 가장 중요하고 평생 쓰게 될 공식이 있습니다. 바로 1827년 독일의 물리학자 옴(Ohm)이 발견한 **옴의 법칙(Ohm\'s Law)**입니다.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '32px', marginBottom: '32px', alignItems: 'center' }}>
          <div style={{ background: '#0f172a', padding: '32px', borderRadius: '16px', border: '2px solid #3b82f6', textAlign: 'center', boxShadow: 'var(--shadow-glow)' }}>
            <div style={{ fontSize: '3.5rem', fontWeight: 950, color: '#3b82f6', fontFamily: 'monospace', marginBottom: '8px' }}>V = I × R</div>
            <span style={{ color: '#94a3b8', fontSize: '1.1rem', fontWeight: 700 }}>전압(V) = 전류(I) × 저항(R)</span>
          </div>
          <div>
            <ul style={{ color: '#cbd5e1', lineHeight: 2.0, margin: 0, paddingLeft: '20px' }}>
              <li><strong>전압 (V, Volt)</strong>: 전기를 밀어내는 압력 (물탱크의 높이)</li>
              <li><strong>전류 (I, Ampere)</strong>: 1초당 흐르는 전하의 양 (물줄기의 굵기)</li>
              <li><strong>저항 (R, Ohm)</strong>: 전류를 방해하는 세기 (파이프의 좁은 정도)</li>
            </ul>
          </div>
        </div>

        <div style={{ background: 'rgba(59,130,246,0.06)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '24px' }}>
          <span style={{ fontWeight: 800, color: '#60a5fa', display: 'block', marginBottom: '8px' }}>공식 변형의 응용</span>
          <p style={{ margin: 0, color: '#cbd5e1', lineHeight: 1.7 }}>
            - 전류를 구하고 싶을 때: I = V / R (저항이 클수록 전류가 줄어듦)<br/>
            - **저항을 구하고 싶을 때: R = V / I (회로 설계 시 우리가 저항값을 계산할 때 사용!)**
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3, type: 'theory', title: 'LED 보호용 저항값 직접 계산하기',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          자, 이제 우리가 아두이노 5V 단자에 빨간색 LED를 안전하게 켜기 위해 몇 옴짜리 저항을 달아야 하는지 직접 공식으로 도출해 봅시다.
        </p>

        <div style={{ background: 'rgba(34,197,94,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '24px' }}>
          <h5 style={{ color: '#4ade80', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>실제 부품의 스펙 (Specification)</h5>
          <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.8 }}>
            1. **아두이노 출력 전압**: 5V<br/>
            2. **빨간색 LED 적정 구동 전압 (순방향 강하 전압)**: 약 2V (2V가 넘어가면 켜지기 시작함)<br/>
            3. **빨간색 LED 적정 작동 전류**: 약 20mA (0.02A) (이보다 크면 타버림)
          </p>
        </div>

        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px', fontFamily: 'monospace' }}>
          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.1rem', display: 'block', marginBottom: '12px' }}>🧮 단계별 공식 대입</span>
          <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.8 }}>
            - **저항에 걸려야 하는 전압**: 전체 5V 중 2V는 LED가 소모하므로 저항이 나머지 3V를 감당해야 함. ➔ 5V - 2V = 3V<br/>
            - **저항 공식 대입**: R = V / I ➔ R = 3V / 0.02A<br/>
            - **결과값**: R = 150옴<br/>
            <br/>
            따라서 최소 150옴 이상의 저항을 직렬로 달아야 안전합니다! 실제 회로에서는 부품 오차와 안전 마진을 더해 가장 흔히 구하기 쉬운 220옴 저항을 표준으로 꽂아서 구동합니다.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4, type: 'theory', title: '알록달록 색띠의 비밀 - 저항 판독법',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '950px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.8, marginBottom: '24px' }}>
          저항은 크기가 너무 작아서 숫자를 인쇄하기 어렵습니다. 그래서 대신 저항 표면에 **알록달록한 4~5개의 색깔 띠**를 그려 값을 표시합니다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(99,102,241,0.06)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(99,102,241,0.2)' }}>
            <h5 style={{ color: '#818cf8', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>🎨 저항 색상 코드표</h5>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              검(0), 갈(1), 적(2), 주(3), 황(4), 초(5), 파(6), 보(7), 회(8), 흰(9)<br/>
              - 배수: 금(x 0.1), 은(x 0.01)<br/>
              - 오차율: 금(± 5%), 은(± 10%)
            </p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.06)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <h5 style={{ color: '#4ade80', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>🔍 220옴 저항 읽는 법 (갈-적-적-금)</h5>
            <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.7, margin: 0 }}>
              - 첫째 띠 (십의 자리): 갈(1)<br/>
              - 둘째 띠 (일의 자리): 적(2) ➔ 여기까지 숫자 '12'<br/>
              - 셋째 띠 (곱할 10의 거듭제곱): 갈(1) ➔ x 10^1 (즉, x 10)<br/>
              - 넷째 띠 (오차): 금(± 5%)<br/>
              ➔ 계산: 12 x 10 = 120옴? 아, 220옴은 적-적-갈-금입니다!<br/>
              - 적(2) - 적(2) - 갈(1) ➔ 22 x 10^1 = 220옴!
            </p>
          </div>
        </div>

        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ width: '120px', height: '40px', background: '#e2e8f0', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-around', border: '1px solid #94a3b8', position: 'relative' }}>
            <div style={{ width: '6px', height: '100%', background: '#ef4444' }} /> {/* Red */}
            <div style={{ width: '6px', height: '100%', background: '#ef4444' }} /> {/* Red */}
            <div style={{ width: '6px', height: '100%', background: '#92400e' }} /> {/* Brown */}
            <div style={{ width: '6px', height: '100%', background: '#fbbf24' }} /> {/* Gold */}
          </div>
          <p style={{ margin: 0, color: '#cbd5e1', fontSize: '1.05rem', lineHeight: 1.6 }}>
            이번 실습에서 사용할 저항이 바로 이 <strong>적-적-갈-금(220옴)</strong> 저항입니다. 저항을 통해 전류를 적절히 차단하여 안전하게 LED를 밝혀보겠습니다!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 5, type: 'theory', title: '실습 회로 매핑 가이드',
    content: (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textAlign: 'left', margin: '0 auto', maxWidth: '1000px', fontSize: '1.15rem' }}>
        <div style={{ flex: '0 0 440px', height: '310px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="100%" viewBox="-10 -10 380 270">
            <UnoBoard x={0} y={0} activePins={[]} highlight="none" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 850 }}>저항을 거쳐가는 전기 회로선 긋기</h4>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            물이 흐르듯 전기가 흘러가기 위해서는 <strong>[출발지 ➔ 안전 저항 ➔ LED ➔ 배수구(GND)]</strong>로 순서대로 연결해 주어야 합니다.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            - 출발지인 아두이노의 <strong>5V 핀</strong>을 저항의 한쪽 핀(왼쪽)에 꽂습니다.<br/>
            - 감압 장치를 거쳐 나온 전기를 다시 <strong>저항의 다른쪽 핀(오른쪽)에서 LED의 긴 다리(+)</strong>로 잇습니다.<br/>
            - 마지막으로 <strong>LED의 짧은 다리(-)를 GND</strong>에 꽂아 배수구 순환을 마칩니다.
          </p>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
            자, 준비되셨다면 우측 시뮬레이터에서 직접 저항을 거치는 안전한 회로를 그려봅시다!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 6, type: 'practice', title: '실습 1: 옴의 법칙과 저항의 연결', content: null,
    practiceProps: { 
      missionTitle: '미션. [5V ➔ 저항(왼쪽)] ➔ [저항(오른쪽) ➔ LED(+)] ➔ [LED(-) ➔ GND] 순서로 전선 연결하기', 
      showCode: false 
    }
  }
];
