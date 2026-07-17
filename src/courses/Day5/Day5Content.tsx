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

export const Day5_Steps: Step[] = [
  {
    id: 1, type: 'theory', title: '버튼 내부의 지진 - 스위치 바운싱(Bouncing) 현상',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          스위치와 LED 회로를 완벽히 구축하고 나면, 아주 기묘한 현상을 맞닥뜨리게 됩니다. **버튼을 분명히 딱 한 번만 눌렀다 뗐는데, 불이 켜지다가 말거나 두세 번 연속으로 껌뻑거리며 오작동**하는 것입니다.
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          이것은 사용자가 조작을 잘못한 것이 아닙니다. 스위치가 가진 물리적인 금속 접점의 한계 때문에 발생하는 자연 현상인 **바운싱(Bouncing) 현상**, 또는 **채터링(Chattering)**이라고 합니다.
        </p>
        <div style={{ background: 'rgba(239,68,68,0.08)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '24px' }}>
          <strong style={{ color: '#fca5a5', display: 'block', marginBottom: '8px' }}>왜 바운싱이 일어날까요?</strong>
          <span style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
            사람의 눈에는 버튼을 누르는 동작이 부드러운 일회성 행동으로 보이지만, 현미경 수준의 초고속 카메라로 관찰하면 내부의 얇은 구리 판넬이 닿는 순간 <strong>용수철처럼 미세하게 파르르 떨리면서 수십 번을 튀어 오르는(Bounce) 진동</strong>을 겪습니다. 이 진동은 단 1~2ms(밀리초) 안에 끝나지만, 1초에 1,600만 번 연산할 수 있는 초고속 컴퓨터인 아두이노 CPU는 이 미세한 튕김을 전부 독자적인 버튼 클릭 신호로 감지해버립니다.
          </span>
        </div>
      </div>
    )
  },
  {
    id: 2, type: 'theory', title: '소프트웨어 디바운스 - 시간을 통한 필터링',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          이 물리적 떨림 현상을 잡아내어 한 번의 정직한 입력으로 여과하는 기술을 **디바운스(Debounce)**라고 부릅니다.
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          하드웨어적으로 커패시터(Capacitor)를 달아 전기를 지연시키는 방법도 있지만, 가장 저렴하고 대중적인 방법은 **소프트웨어 코딩을 이용해 전기 신호를 여과(Filter)**하는 것입니다.
        </p>
        
        <div style={{ background: 'rgba(34,197,94,0.05)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '24px' }}>
          <h5 style={{ color: '#4ade80', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>⏳ 소프트웨어 디바운스 알고리즘의 원리</h5>
          <ol style={{ color: '#cbd5e1', lineHeight: 1.9, margin: 0, paddingLeft: '20px' }}>
            <li>스위치가 눌렸는지(LOW) 첫 신호를 감지합니다.</li>
            <li>진동이 다 끝나고 접점이 완전히 밀착될 때까지 <strong>약 50ms(0.05초) 동안 임시로 대기(delay)</strong>합니다.</li>
            <li>50ms가 지난 시점에 <strong>다시 한번 전기 상태를 확인</strong>합니다. 여전히 LOW라면, 이는 노이즈가 아닌 사용자가 정말 손가락으로 누른 진실한 신호로 인정합니다!</li>
          </ol>
        </div>
      </div>
    )
  },
  {
    id: 3, type: 'theory', title: '토글(Toggle) 스위치 - 상태 뒤집기 제어',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          디바운스 필터를 갖추고 나면, 우리가 실생활에서 쓰는 전등 스위치처럼 **한 번 누르면 켜지고, 다시 한 번 누르면 꺼지는 토글(Toggle) 기능**을 구현할 수 있습니다.
        </p>
        <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '24px' }}>
          토글을 만들기 위해서는 LED의 현재 켜짐/꺼짐 상태를 임시로 보관하는 상자(변수)인 <strong>bool ledState = false;</strong>가 필요합니다.
        </p>
        
        <div style={{ background: '#0f172a', padding: '24px', borderRadius: '12px', border: '1px solid #334155', fontFamily: 'monospace', marginBottom: '24px' }}>
          <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '1.15rem', display: 'block', marginBottom: '12px' }}>🔄 토글 알고리즘 코드 예시</span>
          <p style={{ color: '#cbd5e1', margin: 0, lineHeight: 1.8 }}>
            if (digitalRead(2) == LOW) &#123;<br/>
            &nbsp;&nbsp;delay(50); // 바운스 필터링 대기<br/>
            &nbsp;&nbsp;if (digitalRead(2) == LOW) &#123;<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;ledState = !ledState; // 상태값 반전 (true ➔ false, false ➔ true)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;digitalWrite(13, ledState);<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;while(digitalRead(2) == LOW); // 스위치에서 손을 뗄 때까지 루프에 잡아두어 무한 반복 방지!<br/>
            &nbsp;&nbsp;&#125;<br/>
            &#125;
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4, type: 'theory', title: '실습 회로 매핑 가이드',
    content: (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textAlign: 'left', margin: '0 auto', maxWidth: '1000px', fontSize: '1.15rem' }}>
        <div style={{ flex: '0 0 440px', height: '310px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="100%" viewBox="-10 -10 380 270">
            <UnoBoard x={0} y={0} activePins={[]} highlight="none" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 850 }}>디바운스 버튼 토글 결선</h4>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            Day 4의 회로 연결과 완전히 동일합니다. 전선 연결뿐만 아니라, 이번 단계는 바운싱을 예방하는 **C++ 디바운싱 토글 블록**을 잘 적재해야 미션을 최종 완수할 수 있습니다.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            - **[UNO-D2]** ➔ <strong>[SW-PIN1]</strong> 연결<br/>
            - **[SW-PIN2]** ➔ <strong>[UNO-GND]</strong> 연결<br/>
            - **[UNO-D13]** ➔ <strong>[LED-ANODE(+)]</strong> 연결<br/>
            - **[LED-CATHODE(-)]** ➔ <strong>[UNO-GND]</strong> 연결
          </p>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
            우측 시뮬레이터에서 회로를 연결한 뒤, 좌측 에디터에서 디바운스 버튼 토글 블록을 Loop() 안에 넣어 버튼 조작을 완수해 보세요!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 5, type: 'practice', title: '실습 4: 스위치 디바운싱 토글 스위치', content: null,
    practiceProps: { 
      missionTitle: '미션. 회로 결선 후 [if (디바운스_버튼_토글)] 블록을 Loop에 넣고 버튼을 누를 때마다 LED 온/오프 상태가 정밀 반전되는지 검증하기', 
      showCode: true 
    }
  }
];
