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

export const Day1_Steps: Step[] = [
  {
    id: 1, type: 'theory', title: '아두이노의 역사와 목표',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          아두이노(Arduino)는 이탈리아어로 <strong>"친한 친구"</strong>라는 뜻입니다. 전기를 만지고 컴퓨터를 제어하는 기술은 과거에 값비싼 연구 장비와 수준 높은 전자공학 지식이 있어야만 가능했습니다. 
        </p>
        <p style={{ color: '#e2e8f0', lineHeight: 1.9, marginBottom: '24px' }}>
          하지만 2005년 이탈리아의 한 디자인 학교 교수들이 <strong>"예술가, 디자이너, 중학생 등 비전공자 누구나 손쉽게 전자기기를 만들 수 있게 하자!"</strong>는 철학으로 초소형 컴퓨터 보드를 개발했습니다. 이것이 아두이노의 시작입니다.
        </p>
      </div>
    )
  },
  {
    id: 2, type: 'theory', title: '아두이노 우노(UNO) 보드의 유래',
    content: (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textAlign: 'left', margin: '0 auto', maxWidth: '1000px', fontSize: '1.15rem' }}>
        {/* Left Side: Large Board Image */}
        <div style={{ flex: '0 0 440px', height: '310px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="100%" viewBox="-10 -10 380 270">
            <UnoBoard x={0} y={0} activePins={[]} highlight="none" />
          </svg>
        </div>
        {/* Right Side: Detailed Description */}
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#ffffff', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 850 }}>왜 하필 이름이 '우노(UNO)'일까요?</h4>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            <strong>UNO</strong>는 이탈리아어로 <strong>"숫자 1(하나)"</strong>을 뜻합니다. 아두이노의 수많은 개발용 보드 중 가장 기준이 되고 대중적인 1호 표준 보드라는 의미를 담고 있습니다.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            스마트워치처럼 아주 작게 만들 때는 <strong>아두이노 나노(Nano)</strong>를, 3D 프린터처럼 거대하고 많은 장치를 제어할 때는 <strong>아두이노 메가(Mega)</strong>를 쓰기도 하지만, 입문과 표준은 단연 이 <strong>우노(UNO)</strong> 보드입니다.
          </p>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
            실생활에서도 도어락, 에어컨, 세탁기 등 특정 기능만 수행하는 소형 가전제품 내부에는 이 우노 보드와 동일한 원리의 제어 보드가 장착되어 활약하고 있습니다.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 3, type: 'theory', title: '보드의 핵심 뇌, ATMEGA328P',
    content: (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textAlign: 'left', margin: '0 auto', maxWidth: '1000px', fontSize: '1.15rem' }}>
        {/* Left Side: Large Board Image (Highlighting MCU) */}
        <div style={{ flex: '0 0 440px', height: '310px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="100%" viewBox="-10 -10 380 270">
            <UnoBoard x={0} y={0} activePins={[]} highlight="mcu" />
          </svg>
        </div>
        {/* Right Side: Detailed Description */}
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#fbbf24', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 850 }}>가운데 노란색으로 강조된 칩이 보이시나요?</h4>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            이 길쭉하고 검은 칩이 바로 아두이노의 실제 뇌인 <strong>ATMEGA328P 마이크로컨트롤러(MCU)</strong>입니다.
          </p>
          <div style={{ background: '#0f172a', padding: '16px 20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '16px' }}>
            <p style={{ margin: 0, color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6 }}>
              - <strong>Mega</strong>: 고성능 8비트 컴퓨터 아키텍처를 뜻함.<br/>
              - <strong>32</strong>: 코드가 저장되는 플래시 메모리 용량이 <strong>32KB(킬로바이트)</strong>임을 의미함.<br/>
              - <strong>8</strong>: 계산을 한 번에 8비트 단위로 함.<br/>
              - <strong>P</strong>: PicoPower의 약자로, 건전지 하나로도 전력을 극도로 아끼는 설계가 들어갔음을 뜻함.
            </p>
          </div>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            이 뇌는 단 <strong>2KB의 SRAM(임시 기억장치)</strong>만 가지고 있습니다. 컴퓨터 사양의 수만 분의 일에 불과하지만, 신호등을 제어하거나 로봇 팔을 구동하는 제어 용도로는 이 정도 뇌로도 차고 넘칩니다!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 4, type: 'theory', title: '네모난 구멍들의 정체, 핀(Pin)',
    content: (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textAlign: 'left', margin: '0 auto', maxWidth: '1000px', fontSize: '1.15rem' }}>
        {/* Left Side: Large Board Image (Highlighting Digital Pins) */}
        <div style={{ flex: '0 0 440px', height: '310px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="100%" viewBox="-10 -10 380 270">
            <UnoBoard x={0} y={0} activePins={[]} highlight="digital" />
          </svg>
        </div>
        {/* Right Side: Detailed Description */}
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#818cf8', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 850 }}>보드 가장자리의 파란색 강조 영역을 보세요!</h4>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            아두이노 보드 위아래를 감싸고 있는 검은색 구멍들을 <strong>헤더 핀(Header Pin)</strong> 혹은 간단히 <strong>핀(Pin)</strong>이라고 부릅니다. 이 구멍들은 역할에 따라 정밀하게 구분되어 설계되어 있습니다.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            보드 상단의 <strong>디지털 핀(0~13번)</strong>은 켜짐(5V)과 꺼짐(0V) 단 두 가지 상태만 다룹니다. LED를 켜거나 버튼 입력을 받을 때 사용합니다.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, margin: 0 }}>
            보드 하단에는 연속적인 값(밝기, 온도 등)을 읽는 <strong>아날로그 핀(A0~A5)</strong>과, 회로 전체의 전원을 공급하고 남은 전류를 흘려보내 순환시키는 <strong>전원 핀(5V, 3.3V, GND)</strong>들이 자리 잡고 있습니다.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 5, type: 'theory', title: '끊임없이 속닥거리는 TX와 RX',
    content: (
      <div style={{ display: 'flex', gap: '40px', alignItems: 'center', textAlign: 'left', margin: '0 auto', maxWidth: '1000px', fontSize: '1.15rem' }}>
        {/* Left Side: Large Board Image (Highlighting TX/RX) */}
        <div style={{ flex: '0 0 440px', height: '310px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '16px', border: '1px solid var(--color-glass-border)', padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="100%" height="100%" viewBox="-10 -10 380 270">
            <UnoBoard x={0} y={0} activePins={[]} highlight="txrx" />
          </svg>
        </div>
        {/* Right Side: Detailed Description */}
        <div style={{ flex: 1 }}>
          <h4 style={{ color: '#10b981', fontSize: '1.5rem', marginBottom: '16px', fontWeight: 850 }}>초록색으로 반짝이는 통신 표시기</h4>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            보드 왼쪽 상단을 자세히 보시면 미세하게 깜빡이는 두 개의 작은 LED 전구와 함께 <strong>TX</strong>, <strong>RX</strong>라는 글씨가 적혀 있습니다.
          </p>
          <p style={{ color: '#cbd5e1', lineHeight: 1.8, marginBottom: '16px' }}>
            - <strong>TX (Transmit, 송신)</strong>: 아두이노가 컴퓨터나 센서로 데이터를 보낼 때 반짝입니다.<br/>
            - <strong>RX (Receive, 수신)</strong>: 컴퓨터에서 아두이노 뇌(칩)로 새로운 소스코드를 내려받을 때 반짝입니다.
          </p>
          <p style={{ color: '#94a3b8', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
            이것을 <strong>UART(직렬 통신)</strong>라고 부릅니다. 아두이노를 컴퓨터에 연결하고 새로운 코드를 업로드할 때 보드의 불빛들이 혼자서 정신없이 반짝거리는 현상을 보셨다면, 바로 새로운 코드가 뇌 속으로 흘러 들어가고 있었던 통신의 흔적입니다!
          </p>
        </div>
      </div>
    )
  },
  {
    id: 6, type: 'theory', title: '프로그래밍 언어의 본질과 C++의 이유',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '950px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.8, marginBottom: '24px' }}>
          컴퓨터의 뇌는 원래 0과 1(전기가 흐른다/안 흐른다)이라는 이진법 신호밖에 이해하지 못합니다. 
          따라서 인간이 컴퓨터에게 복잡한 하드웨어 동작 명령을 전달하기 위해서는 징검다리 역할을 해 줄 **"프로그래밍 언어"**가 반드시 필요합니다.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(59,130,246,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)' }}>
            <h5 style={{ color: '#60a5fa', margin: '0 0 12px 0', fontSize: '1.15rem', fontWeight: 800 }}>왜 아두이노는 C++을 쓸까요?</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              아두이노의 뇌(ATMEGA328P)는 단 2KB의 초미세 임시 메모리를 갖고 있습니다. C++ 언어는 작성한 코드를 컴퓨터 기계어로 직접 컴파일(번역)하여 실행하기 때문에 <strong>속도가 가장 빠르고 메모리를 낭비하지 않는 독보적인 하드웨어 제어력</strong>을 가집니다.
            </p>
          </div>
          
          <div style={{ background: 'rgba(139,92,246,0.05)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(139,92,246,0.2)' }}>
            <h5 style={{ color: '#a78bfa', margin: '0 0 12px 0', fontSize: '1.15rem', fontWeight: 800 }}>다른 언어는 사용할 수 없나요?</h5>
            <p style={{ color: '#cbd5e1', fontSize: '1rem', lineHeight: 1.6, margin: 0 }}>
              * <strong>어셈블리(Assembly)</strong>: 칩에 다이렉트 명령을 내리는 최강의 속도지만 외계어 수준으로 난해합니다.<br/>
              * <strong>마이크로파이썬(MicroPython)</strong>: 배우기 쉽지만, 파이썬 해석 엔진을 칩 안에 얹어야 하므로 메모리가 훨씬 큰 고성능 칩(ESP32 등)에서만 구동이 가능합니다.
            </p>
          </div>
        </div>

        <div style={{ background: '#0f172a', padding: '20px', borderRadius: '12px', border: '1px solid #334155', marginBottom: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #475569', color: '#ffffff' }}>
                <th style={{ textAlign: 'left', padding: '10px' }}>구분</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>C / C++ (아두이노 표준)</th>
                <th style={{ textAlign: 'left', padding: '10px' }}>MicroPython</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '10px', fontWeight: 700 }}>작동 방식</td>
                <td style={{ padding: '10px', color: '#94a3b8' }}>컴파일 (기계어로 미리 전부 번역)</td>
                <td style={{ padding: '10px', color: '#94a3b8' }}>인터프리터 (한 줄씩 읽어가며 실행)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #334155' }}>
                <td style={{ padding: '10px', fontWeight: 700 }}>속도 / 용량</td>
                <td style={{ padding: '10px', color: '#34d399', fontWeight: 700 }}>압도적으로 빠름 / 수 KB 이내</td>
                <td style={{ padding: '10px', color: '#fca5a5' }}>상대적으로 느림 / 수백 KB 이상 필요</td>
              </tr>
              <tr>
                <td style={{ padding: '10px', fontWeight: 700 }}>적합 보드</td>
                <td style={{ padding: '10px', color: '#94a3b8' }}>우노(UNO)를 포함한 모든 소형 보드</td>
                <td style={{ padding: '10px', color: '#94a3b8' }}>메모리가 넉넉한 고급 스마트 IoT 보드</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <p style={{ color: '#e2e8f0', lineHeight: 1.7, margin: 0 }}>
          Anino에서는 복잡한 C++ 타이핑 문법의 공포를 덜어드리기 위해 <strong>비주얼 코딩 블록</strong>을 제공합니다. 블록 퍼즐을 맞추면 우측 코드로 자동 동기화 번역되므로, 눈으로 C++의 핵심 뼈대인 `void setup()`과 `void loop()`를 자연스럽게 익힐 수 있습니다.
        </p>
      </div>
    )
  },
  {
    id: 7, type: 'theory', title: '전기는 물과 같다 (다이오드와 극성)',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '900px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.8, marginBottom: '24px' }}>
          높은 산에서 낮은 계곡으로 물이 흐르듯, <strong>전기 에너지도 에너지가 높은 곳(5V)에서 낮은 곳(GND)으로 흐릅니다.</strong> 
          이 흐름의 입구와 출구를 연결하는 전선 고리를 **회로(Circuit)**라고 부릅니다.
        </p>

        <div style={{ background: 'rgba(59,130,246,0.08)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)', marginBottom: '24px' }}>
          <h5 style={{ color: '#60a5fa', margin: '0 0 12px 0', fontSize: '1.25rem', fontWeight: 800 }}>💡 왜 긴 다리는 (+)에, 짧은 다리는 (-)에 연결해야 할까요?</h5>
          <p style={{ color: '#cbd5e1', lineHeight: 1.7, margin: 0 }}>
            LED는 발광 <strong>다이오드(Diode)</strong>의 일종으로, 전기를 한쪽 방향으로만 흘려주는 <strong>일방통행 도로</strong>입니다.
            <br/>
            - <strong>긴 다리 (Anode, 양극)</strong>: 전기가 들어오는 입구 ➔ <strong>(+) 전압(5V 또는 디지털 핀)</strong>에 연결해야 합니다.<br/>
            - <strong>짧은 다리 (Cathode, 음극)</strong>: 전기가 흘러나가는 출구 ➔ <strong>(-) 접지(GND)</strong>에 연결해야 합니다.<br/>
            <br/>
            만약 다리를 반대로 연결하면 전기가 도로 장벽에 막혀 아예 흐르지 못하므로 LED에 불이 켜지지 않습니다.
          </p>
        </div>

        <p style={{ color: '#e2e8f0', lineHeight: 1.8, margin: 0 }}>
          만약 중간에 방해물(저항) 없이 5V와 GND를 다이렉트로 연결해 버리면 어떻게 될까요? 물살이 너무 강해 수차가 파괴되듯 <strong>과전류가 흐르면서 칩과 부품이 타버립니다.</strong> 이것을 <strong>쇼트(Short Circuit)</strong>라고 하며, 다음 실습에서 이를 눈으로 직접 확인해 보겠습니다.
        </p>
      </div>
    )
  },
  {
    id: 8, type: 'practice', title: '실습 1: 전원 연결하기', content: null,
    practiceProps: { 
      missionTitle: '미션 1. 전원(5V) 핀에서 LED의 양극(+)으로 전류 주입로 연결하기', 
      showCode: false 
    }
  },
  {
    id: 9, type: 'practice', title: '실습 2: 접지 연결하여 회로 완성', content: null,
    practiceProps: { 
      missionTitle: '미션 2. [5V ➔ LED(+)] 연결 후, [LED(-) ➔ GND]를 추가로 연결하여 회로 완성하기', 
      showCode: false 
    }
  },
  {
    id: 10, type: 'theory', title: '왜 쇼트(Short Circuit)가 발생했을까요?',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '850px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.8, marginBottom: '24px' }}>
          방금 경험하신 <strong>"부품 타버림"</strong> 현상은 가상 엔진이 물리 법칙을 완벽히 계산하여 연출한 결과입니다. 왜 이런 일이 일어났을까요?
        </p>
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '5px solid #ef4444', padding: '24px', borderRadius: '0 12px 12px 0', marginBottom: '24px' }}>
          <p style={{ margin: 0, color: '#fca5a5', lineHeight: 1.7, fontWeight: 700, fontSize: '1.15rem' }}>
            옴의 법칙: 전류(I) = 전압(V) / 저항(R)
          </p>
          <p style={{ margin: '12px 0 0 0', color: '#fca5a5', lineHeight: 1.6, fontSize: '1rem' }}>
            물탱크(5V)의 물살이 아무리 세도, 파이프의 두께가 매우 좁다면(저항이 크다면) 물이 졸졸 흐릅니다. 
            <br/>하지만 LED는 스스로 전류를 방어하는 저항력이 거의 없습니다 (R = 0에 수렴). 즉, 파이프가 댐의 폭만큼 거대하게 뚫려 있는 것입니다. 
            <br/>여기에 저항이라는 댐이나 조절 장치 없이 5V를 직접 밀어 넣으면, <strong>무한대에 가까운 미친 물살(전류)이 LED 속을 통과하면서 순간적인 마찰열로 부품이 타버립니다.</strong>
          </p>
        </div>
        <p style={{ color: '#cbd5e1', lineHeight: 1.7 }}>
          이것이 바로 합선 또는 단락이라 부르는 <strong>쇼트(Short)</strong>입니다. 현실에서 아두이노 보드에 저항 없이 직접 핀을 꽂으면 칩에서 '툭' 소리와 함께 연기가 나며 보드가 영구적으로 망가집니다! 
          <br/>이제 왜 안전장치인 '저항'이 필요한지 완전히 깨달으셨을 것입니다.
        </p>
      </div>
    )
  },
  {
    id: 11, type: 'theory', title: '통제 가능한 전기, 13번 디지털 핀',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '850px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.8, marginBottom: '24px' }}>
          5V 전원 핀은 전압이 고정된 파이프입니다. 그렇다면 우리가 전기를 보냈다 끊었다 하며 불빛을 깜빡이게 통제하려면 어떻게 해야 할까요?
        </p>
        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', marginBottom: '32px', background: 'var(--color-bg-surface)', padding: '32px', borderRadius: '16px', border: '1px solid var(--color-glass-border)' }}>
          <div style={{ flexShrink: 0, textAlign: 'center', background: 'rgba(59,130,246,0.1)', padding: '24px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: '2.8rem', fontWeight: 950, color: '#3b82f6', marginBottom: '4px', fontFamily: 'monospace' }}>D13</div>
            <span style={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 700 }}>DIGITAL PIN 13</span>
          </div>
          <div>
            <p style={{ color: '#cbd5e1', lineHeight: 1.7, fontSize: '1.05rem', margin: 0 }}>
              보드 상단에 일렬로 나열된 <strong>0번부터 13번 디지털 핀</strong>들은 코딩으로 제어할 수 있는 똑똑한 전자 수도꼭지입니다. 
              <br/>우리가 명령을 내려 밸브를 열면(<code style={{ color: '#93c5fd' }}>HIGH</code>) 전기가 흐르고, 밸브를 잠그면(<code style={{ color: '#93c5fd' }}>LOW</code>) 전기가 끊깁니다. 
              <br/><br/>이제 타버릴 걱정 없는 13번 디지털 핀을 활용해 LED에 안전하게 선을 연결해 봅시다! (Day 1 실습의 편의를 위해 13번 핀에 연결할 시에는 물리 엔진이 내부 저항이 결합된 것으로 판정하여 부품이 타지 않습니다.)
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 12, type: 'practice', title: '실습 3: 13번 핀에 안전하게 연결하기', content: null,
    practiceProps: { 
      missionTitle: '미션 3. [D13 핀 ➔ LED(+)] 및 [GND 핀 ➔ LED(-)]를 전선으로 안전하게 연결하기', 
      showCode: false 
    }
  },
  {
    id: 13, type: 'theory', title: '코드로 생명을 불어넣다',
    content: (
      <div style={{ textAlign: 'left', maxWidth: '850px', margin: '0 auto', fontSize: '1.2rem' }}>
        <p style={{ color: '#e2e8f0', lineHeight: 1.8, marginBottom: '24px' }}>
          선을 알맞게 연결했지만 코드로 명령을 코딩하기 전까지는 13번 핀의 전자 밸브가 완전히 잠겨 있습니다. 이제 아두이노의 뇌(ATMEGA328P)에게 내릴 세 가지 C++ 특급 명령어를 학습해 봅시다!
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: 'rgba(59,130,246,0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)' }}>
            <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.1rem', fontFamily: 'monospace' }}>pinMode(13, OUTPUT);</span>
            <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              아두이노의 핀은 전기를 내보낼 수도(출력) 있고, 외부 신호를 읽을 수도(입력) 있는 양방향 길입니다. 
              <br/><strong>pinMode(13, OUTPUT)</strong>은 뇌(CPU)에게 <strong>"13번 핀을 전기를 밖으로 뿜어내는 출력(OUTPUT)용 도로로 사용할게!"</strong>라고 설정(setup) 단계에서 선언하는 것입니다.
            </p>
          </div>
          <div style={{ background: 'rgba(59,130,246,0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(59,130,246,0.3)' }}>
            <span style={{ fontWeight: 800, color: '#38bdf8', fontSize: '1.1rem', fontFamily: 'monospace' }}>digitalWrite(13, HIGH / LOW);</span>
            <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              13번 핀의 전압을 제어합니다. <strong>HIGH</strong>는 5V 전기를 콸콸 흘려보내는 것이고(LED가 켜짐), <strong>LOW</strong>는 0V로 전기를 뚝 끊어버리는 것(LED가 꺼짐)입니다.
            </p>
          </div>
          <div style={{ background: 'rgba(245,158,11,0.15)', padding: '20px', borderRadius: '12px', border: '1px solid rgba(245,158,11,0.3)' }}>
            <span style={{ fontWeight: 800, color: '#fbbf24', fontSize: '1.1rem', fontFamily: 'monospace' }}>delay(1000);</span>
            <p style={{ margin: '8px 0 0 0', color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6 }}>
              컴퓨터의 뇌는 1초에 수천만 번 명령을 실행할 만큼 너무 빠릅니다. <strong>delay(1000)</strong>은 <strong>"1000밀리초(1초) 동안 아무것도 하지 말고 현재 켜짐/꺼짐 상태를 유지하며 기다려라"</strong>라는 뜻입니다. 이게 없으면 LED가 너무 빠르게 켜지고 꺼져서 우리 눈에는 계속 켜져 있는 것처럼 보입니다.
            </p>
          </div>
        </div>
      </div>
    )
  },
  {
    id: 14, type: 'practice', title: '실습 4: 코드 작성하고 깜빡이기', content: null,
    practiceProps: { 
      missionTitle: '최종 미션. [D13 ➔ LED(+)] 및 [GND ➔ LED(-)] 회로를 다시 연결한 뒤, 좌측 에디터에서 1초 주기 깜빡임 블록 코드 작성하기', 
      showCode: true 
    }
  }
];
