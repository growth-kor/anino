import React from 'react';

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

export const Day4_Steps: Step[] = [
  {
    id: 1, type: 'theory', title: '디지털 입력의 스위치 - 택트 스위치(Tact Switch)',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          지금까지 우리는 아두이노에서 전기를 **보내는(OUTPUT)** 동작만 배웠습니다. 하지만 진짜 스마트한 기기를 만들기 위해서는 센서의 신호나 사용자의 조작을 **받아들이는(INPUT)** 기능이 필요합니다.
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          가장 대표적인 입력 장치가 바로 **택트 스위치(Tact Switch)**입니다. 스위치는 평소에는 전선이 끊어져 있다가, 버튼을 물리적으로 꾹 누르는 순간 내부의 도체판이 닿으면서 전기가 흐르게 만드는 개폐 장치입니다.
        </p>
        <div style={{ background: 'rgba(245,158,11,0.08)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.2)' }}>
          <strong style={{ color: '#fbbf24', display: 'block', marginBottom: '8px' }}>입출력 모드의 전환</strong>
          <span style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            아두이노 핀을 입력으로 사용하기 위해서는 코드 영역의 setup()에서 <strong>pinMode(핀번호, INPUT)</strong> 명령을 통해 핀의 방향을 전기를 받아들이는 깔때기 상태로 선언해야 합니다.
          </span>
        </div>
      </div>
    )
  },
  {
    id: 2, type: 'theory', title: '미지의 회색 지대 - 플로팅(Floating) 현상',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          컴퓨터는 이진법 세상에 살기 때문에 전압이 5V 근처면 <strong>HIGH(1)</strong>, 0V 근처면 <strong>LOW(0)</strong>로 판단합니다.
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          만약 스위치를 아두이노 핀에 달아두고 버튼을 누르지 않은 대기 상태라면, 그 핀의 전압은 몇 볼트일까요? 0V일까요?
        </p>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center', background: 'rgba(239,68,68,0.08)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '24px' }}>
          <div style={{ fontSize: '3rem' }}>⚠️</div>
          <div>
            <strong style={{ color: '#fca5a5', fontSize: '1.25rem', display: 'block', marginBottom: '8px' }}>정답은 "알 수 없다 (미지수)" 입니다.</strong>
            <span style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
              스위치가 열려 있으면 입력 핀은 전원(5V)과도, 접지(GND)와도 닿아있지 않은 채 <strong>공중에 붕 떠 있는 상태</strong>가 됩니다. 이를 **플로팅(Floating) 현상**이라고 합니다. 공기 중의 정전기나 미세한 전자파 노이즈 때문에 핀의 전압이 0V와 5V 사이를 요동치며, 컴퓨터는 버튼을 누르지도 않았는데 멋대로 눌렸다고 오작동하게 됩니다.
            </span>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 3, type: 'theory', title: '전압을 위로 묶는다 - 풀업(Pull-up) 저항',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          플로팅 현상을 막기 위해 우리는 전압을 한쪽 방향으로 강제 고정하는 저항 회로를 씁니다. 먼저 전압을 5V로 묶어 두는 **풀업(Pull-up) 저항**을 알아봅시다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h5 style={{ color: '#818cf8', margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 800 }}>🔘 버튼 안 누를 때 (평상시)</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              입력 핀이 저항을 거쳐 5V 전원에 묶여 있습니다. 전하가 입력 핀 쪽으로 흘러 들어가 핀의 전압은 확실하게 <strong>HIGH (5V)</strong> 상태로 유지됩니다.
            </p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <h5 style={{ color: '#86efac', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>👇 버튼 누를 때 (작동시)</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              스위치가 닫히면서 전기가 저항을 거쳐 저항이 없는 안전한 하수구(GND)로 몽땅 빠져나갑니다. 이에 따라 입력 핀의 전압은 즉각 <strong>LOW (0V)</strong>로 뚝 떨어집니다.
            </p>
          </div>
        </div>
        
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
          정리하자면, 풀업 저항은 평상시에는 <strong>HIGH</strong>, 버튼을 누를 때 <strong>LOW</strong> 신호가 수신되는 방식입니다.
        </p>
      </div>
    )
  },
  {
    id: 4, type: 'theory', title: '전압을 아래로 묶는다 - 풀다운(Pull-down) 저항',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          풀업과 정반대로 평소에는 0V(LOW)로 묶어두는 **풀다운(Pull-down) 저항** 방식도 있습니다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #334155' }}>
            <h5 style={{ color: '#818cf8', margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: 800 }}>🔘 버튼 안 누를 때 (평상시)</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              입력 핀이 저항을 거쳐 GND(0V)에 묶여 있습니다. 핀에 전하가 전혀 차지 않으므로 확실하게 <strong>LOW (0V)</strong> 상태로 유지됩니다.
            </p>
          </div>
          <div style={{ background: 'rgba(34,197,94,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)' }}>
            <h5 style={{ color: '#86efac', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>👇 버튼 누를 때 (작동시)</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.7, margin: 0 }}>
              스위치가 닫히며 5V의 거대한 전기가 입력 핀으로 밀고 들어옵니다. 이에 따라 입력 핀의 전압은 즉각 <strong>HIGH (5V)</strong>로 튀어 오릅니다.
            </p>
          </div>
        </div>
        
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
          풀다운 저항은 직관적으로 평소에는 <strong>LOW</strong>, 버튼을 누를 때 <strong>HIGH</strong>가 들어와 우리가 이해하기 가장 자연스럽지만, 실제 전기 노이즈 방어율이나 아두이노 보드의 안정성 측면에서는 풀업 저항이 훨씬 우수하여 현업에서는 풀업을 권장합니다.
        </p>
      </div>
    )
  },
  {
    id: 5, type: 'theory', title: '비장의 무기 - 내부 풀업 저항 (INPUT_PULLUP)',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          매번 스위치를 꽂을 때마다 저항을 추가로 달고 복잡한 회로선을 그리는 것은 너무 성가신 일입니다. 
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          그래서 아두이노의 CPU(ATmega328P) 내부에는 **자체적으로 켜고 닫을 수 있는 20k\(\Omega\)의 내부 풀업 저항**이 내장되어 있습니다! 
        </p>
        <div style={{ background: 'rgba(34,197,94,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '24px' }}>
          <h5 style={{ color: '#4ade80', margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800 }}>🛠️ 코드 한 줄로 저항 생략하기</h5>
          <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.8, fontFamily: 'monospace' }}>
            pinMode(2, <strong>INPUT_PULLUP</strong>);
          </p>
        </div>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
          이렇게 코드를 쓰면, 외부 저항을 전혀 달지 않고도 아두이노 핀이 5V 풀업 상태가 됩니다. 우리는 스위치의 한쪽 다리를 <strong>D2</strong> 핀에 꽂고, 반대쪽 다리를 <strong>GND</strong>에 바로 꽂아주기만 하면 만사형통입니다!
        </p>
      </div>
    )
  },
  {
    id: 6, type: 'practice', title: '실습 3: 내부 풀업 저항과 버튼 감지', content: null,
    practiceProps: { 
      missionTitle: '미션. D2 핀을 내부 풀업 저항 모드로 작동시키고, 스위치를 누르면 D13 LED가 켜지는 회로와 코드를 조립하기', 
      showCode: true 
    }
  }
];
