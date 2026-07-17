import React from 'react';
import { ArrowLeft, Play, AlertCircle } from 'lucide-react';

interface DaySyllabus {
  dayNum: number;
  title: string;
  learn: string;
  do: string;
  implemented: boolean;
}

interface LevelData {
  id: number;
  title: string;
  desc: string;
  days: DaySyllabus[];
}

const levelsSyllabusData: Record<number, LevelData> = {
  1: {
    id: 1,
    title: 'Lv. 1 입문 (Day 1)',
    desc: '아두이노의 역사와 보드 구조를 딥다이브하고 가상 시뮬레이터에서 전기의 흐름을 시각적으로 체감합니다.',
    days: [
      {
        dayNum: 1,
        title: '전기의 흐름과 아두이노 보드 구조 딥다이브',
        learn: '우노 보드의 기원 및 타 보드 비교, 마이크로컨트롤러(ATMEGA328P) 구조와 메모리, 디지털/아날로그 핀 구분, UART(TX/RX) 무선 통신의 작동 원리, 전압/GND 전위차 및 쇼트 물리 법칙',
        do: '가상 시뮬레이터에서 5V, GND, 13번 핀 회로를 안전하게 결선하고, C++의 pinMode, digitalWrite, delay 블록 코드를 활용하여 1초 간격으로 LED를 제어할 수 있습니다.',
        implemented: true
      }
    ]
  },
  2: {
    id: 2,
    title: 'Lv. 2 기초 (Day 2~5)',
    desc: '전자기학의 기본 저항 회로를 설계하고 버튼 노이즈를 극복하는 임베디드 디바운스 소프트웨어 기술을 다룹니다.',
    days: [
      {
        dayNum: 2,
        title: '댐과 수도꼭지 - 옴의 법칙과 저항 계산',
        learn: '옴의 법칙(V=IR)과 저항의 역할, 색띠 판독법, LED 적정 전류(20mA)에 근거한 직렬 회로 보호 계산 공식',
        do: '가상 회로의 전원에 따라 알맞은 저항값(220옴, 330옴 등)을 수학적으로 직접 연출하고 배치하여 부품을 보호할 수 있습니다.',
        implemented: true
      },
      {
        dayNum: 3,
        title: '브레드보드(빵판)의 내부 구조와 직병렬 회로 설계',
        learn: '브레드보드 내부의 세로/가로 금속 연결선 버스 구조 및 회로 직렬/병렬 연결의 전압/전류 분배 법칙',
        do: '1개의 아두이노 전원을 브레드보드로 확장하여 3개의 LED를 독립 병렬 제어하는 다중 회로를 구성할 수 있습니다.',
        implemented: true
      },
      {
        dayNum: 4,
        title: '스위치 입력과 풀업/풀다운 저항의 물리적 원리',
        learn: '스위치 전원 개폐 원리, 전기 신호가 공중에 뜨는 플로팅 현상, 전압을 고정(Pull)시키는 풀업/풀다운 저항 회로',
        do: '내부 풀업 저항(INPUT_PULLUP) 모드를 포함하여 노이즈 없이 깔끔한 버튼 누름 상태(0/1)를 입력받을 수 있습니다.',
        implemented: true
      },
      {
        dayNum: 5,
        title: '스위치 바운싱과 소프트웨어 디바운스(Debounce) 알고리즘',
        learn: '금속 스위치 접점의 탄성으로 인한 물리적 미세 진동(Chattering) 현상, 시간 필터를 이용한 노이즈 방어 이론',
        do: '버튼을 1번 누를 때 정확히 켜지고 다시 누르면 꺼지는 채터링 방지 토글 스위치 펌웨어 코드를 작성할 수 있습니다.',
        implemented: true
      }
    ]
  },
  3: {
    id: 3,
    title: 'Lv. 3 초급 (Day 6~10)',
    desc: '자연계의 연속적인 아날로그 물리량을 아날로그-디지털 변환(ADC)하고 정밀 구동 신호를 생성합니다.',
    days: [
      {
        dayNum: 6,
        title: '어둠을 감지하는 조도센서(CDS)와 전압 분배 법칙',
        learn: '빛의 양에 반응하는 CDS 조도 소자 반도체 특성, 가변 저항을 전압 신호로 매핑하는 전압 분배(Voltage Divider) 공식',
        do: '10kΩ 저항과 조도센서를 직렬 연결하여 밝기에 따른 전압 변동 폭을 사전에 수학적으로 정밀 설계할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 7,
        title: '아날로그-디지털 변환기(ADC)와 데이터 시각화',
        learn: '0V~5V 연속 전압을 0~1023 디지털 코드로 분해하는 10비트 ADC 원리 및 아두이노 시리얼 플로터 시각화 기법',
        do: '센서에서 흘러나오는 아날로그 변동 신호를 정밀 데이터로 획득하고, PC 화면에 실시간 그래프로 모니터링할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 8,
        title: '부드러운 전압 제어 - PWM(펄스 폭 변조)의 마법',
        learn: '디지털 핀으로 가상 전압을 출력하는 PWM 원리, 듀티 사이클(Duty Cycle) 비율 연산 및 analogWrite 작동 원리',
        do: 'LED의 전압을 미세하게 제어하여 밝기가 서서히 변하는 웰컴 라이트 페이드(Fade) 효과를 코딩할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 9,
        title: '모터의 힘을 지배하다 - DC 모터와 트랜지스터 회로',
        learn: '모터 구동 전류 역류 차단법, 소량의 신호로 큰 전력을 통제하는 트랜지스터(MOSFET) 및 H-브릿지 회로 구동 원리',
        do: '별도의 외부 전원 회로를 격리 설계하여 아두이노를 안전하게 보존하면서 PWM 신호로 DC 모터 방향과 속도를 제어할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 10,
        title: '소리로 거리를 측정하는 초음파 센서(HC-SR04)',
        learn: '초음파 펄스 파동의 반사 시간 측정 원리, 음속(340m/s)을 바탕으로 한 실제 마이크로초 시간의 거리(cm) 환산 공식',
        do: '초음파 펄스를 출력하고 반사되어 돌아온 시간차를 계측하여 전방 장애물 거리를 센티미터 단위로 추출할 수 있습니다.',
        implemented: false
      }
    ]
  },
  4: {
    id: 4,
    title: 'Lv. 4 중급 (Day 11~20)',
    desc: '다중 장치들을 유한상태머신(FSM)으로 융합 제어하고 동기식 통신 프로토콜로 외부 모듈을 제어합니다.',
    days: [
      {
        dayNum: 11,
        title: '유한상태머신(FSM) 기반의 교통 신호 체계',
        learn: '시스템 상태 정의 및 전환 제어 설계법, switch-case 구조를 통한 유한 상태 분기 알고리즘',
        do: '주차장 차단기와 신호등의 연동 상태를 코드로 매핑해 안전 기계 오토마타를 구현할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 12,
        title: '시간 관리의 예술 - 논블로킹 millis() 멀티태스킹',
        learn: 'CPU 연산을 정지시키는 delay()의 한계 극복, 시스템 가동 시간 계측 함수 millis()를 이용한 주기적 논블로킹 타이밍 설계',
        do: '독립적인 주기를 가지는 LED 3개와 버저를 동시 다발적으로 개별 연산 제어할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 13,
        title: '가변저항(Potentiometer)과 수치 매핑(map) 기술',
        learn: '3단 가변 기계의 물리 저항 가변축 전압 분배, 10비트 입력을 다른 범위값으로 매핑하는 map() 연산 공식',
        do: '가변저항을 돌려 LED의 밝기나 모터의 회전 속도를 0~100% 매끄러운 비율로 스무딩 제어할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 14,
        title: '각도를 제어하는 서보 모터(Servo Motor) 정밀 제어',
        learn: '50Hz PWM 파형의 펄스 폭 길이(1ms~2ms)로 물리적 위치를 지시하는 PPM 서보 제어 원리',
        do: '가변저항이나 센서 입력 값에 맞춰 로봇 팔 관절과 차단기 각도를 0도에서 180도까지 제어할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 15,
        title: '소리 신호의 발생 - 피에조 부저(Piezo Buzzer)와 멜로디',
        learn: '역압전 효과로 공기 진동을 주파수별로 출력하는 피에조 소자, 음계 주파수(Hz) 매핑 및 tone() 함수의 원리',
        do: '서보모터가 열릴 때 환영 웰컴 멜로디음을 고정 옥타브 연산으로 부드럽게 출력할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 16,
        title: '2선식 동기 통신 - I2C 통신 프로토콜 규격 분석',
        learn: '1:N 통신을 지원하는 SDA/SCL 2선 오픈드레인 버스 구조, 마스터-슬레이브 주소 어드레싱 동기 메커니즘',
        do: 'I2C 버스 주소 스캐너 코드를 통해 기기에 부여된 고유 식별 주소를 자가 진단할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 17,
        title: 'LCD 화면에 데이터 출력하기 - Character LCD 제어',
        learn: 'I2C LCD 드라이버 모듈의 내부 레지스터 조작, 화면 커서 이동 및 문자 인코딩 매핑 기법',
        do: '가변저항 각도나 온습도 센서의 실시간 데이터를 LCD 화면에 깔끔하게 출력할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 18,
        title: '4선식 초고속 통신 - SPI 프로토콜과 SD 카드 로깅',
        learn: 'MISO/MOSI/SCK/SS 신호선을 사용한 1:1 고속 동기 통신 규격, FAT 파일 시스템의 파일 읽기/쓰기 블록 제어',
        do: '센서 로그 데이터를 SD 메모리 카드에 텍스트 파일(.txt) 형태로 고속 영구 보존할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 19,
        title: '스마트 출입문 설계 - RFID 카드 리더기 연동',
        learn: '13.56MHz 전자기 유도 결합 무선 통신 규격, 카드 UID 식별 패킷 데이터 수신 원리',
        do: '사전에 등록된 고유 카드 UID가 감지될 때만 LCD에 환영 문구를 띄우고 서보모터를 개방하는 게이트를 구현할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 20,
        title: '정밀 시간 보존 - RTC(Real Time Clock) 시간 수집',
        learn: '아두이노 전원이 꺼져도 독립 작동하는 RTC DS3231 칩 원리, 윤년 연산 및 내부 발진기 동기 방식',
        do: '부품이 작동한 정밀 시각(년-월-일 시:분:초)을 실시간으로 읽어와 기록할 수 있습니다.',
        implemented: false
      }
    ]
  },
  5: {
    id: 5,
    title: 'Lv. 5 고급 & 마스터 (Day 21~30)',
    desc: '하드웨어 인터럽트, 저전력 Sleep 제어를 완수하고 IoT 클라이언트 및 실무 고장 트러블슈팅을 완주합니다.',
    days: [
      {
        dayNum: 21,
        title: '최우선 신호 처리 - 하드웨어 인터럽트(ISR)',
        learn: '코드 진행 루프와 상관없이 물리 핀 상태 변화를 감지하는 인터럽트 트리거 원리, volatile 선언의 이유',
        do: '버튼을 누르는 순간 즉각 시스템 동작을 일시 중단하고 긴급 정지 루틴(ISR)으로 진입하도록 조립할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 22,
        title: '초저전력 슬립 모드(Sleep Mode)와 Wake-Up 제어',
        learn: '클럭 공급을 차단해 대기 소모 전류를 마이크로암페어(uA)로 줄이는 Sleep 전원 관리, 외부 인터럽트 깨우기',
        do: '동작하지 않을 때는 잠들어 있다가, 스위치가 눌리면 즉각 복귀해 구동하는 배터리 세이빙 회로를 설계할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 23,
        title: '각도의 극강 정밀도 - 스텝 모터(Stepper Motor) 제어',
        learn: '4상 바이폴라/유니폴라 모터 펄스 신호 제어법, 정밀 톱니 회전각 및 드라이버 칩 스텝 분배 작동 원리',
        do: '모터를 원하는 방향으로 정확한 각도(예: 36.5도)만큼 회전시켜 3D 프린터나 정밀 가공 장치의 뼈대를 만들 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 24,
        title: '1선 온습도 센서(DHT11) 원시 데이터 디코딩',
        learn: '별도의 라이브러리 없이 1개의 데이터 신호선으로 가동하는 DHT11 특유의 시간 지연 핸드셰이크 프로토콜',
        do: '마이크로초(us) 단위의 펄스 길이를 측정하여 습도 및 온도 바이너리 40비트 데이터를 직접 파싱 및 검증할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 25,
        title: '고전압 제어 - 릴레이(Relay) 스위치 안전 회로',
        learn: '아두이노의 5V 신호와 가정용 고전압 AC(220V) 라인을 포토커플러로 격리시키는 솔레노이드 릴레이 물리 구조',
        do: '센서 데이터 값이 기준치를 넘을 때 220V 모터나 가전을 안전하게 온/오프하는 자동 제어망을 설계할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 26,
        title: '무선 통신의 기초 - 블루투스 직렬 통신 프로토콜',
        learn: '스마트폰과 보드 간 직렬 RX/TX 무선 데이터 버스 규격, 무선 직렬 신호 문자열 파싱 기법',
        do: '안드로이드/iOS 앱을 이용해 무선으로 LED를 켜거나 서보모터 동작을 원격 트리거할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 27,
        title: '무선 네트워크 연동 - ESP8266 Wi-Fi 통신 기초',
        learn: 'Wi-Fi 칩셋 AT 명령어 제어 규격, AP 자동 연결 펌웨어 설계, TCP/IP 네트워크 소켓의 기초',
        do: '주변 와이파이 공유기 AP에 연결하여 로컬 IP 주소를 획득하는 통신 모듈을 가동할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 28,
        title: '사물인터넷(IoT) 웹서버 구축 및 무선 제어',
        learn: '아두이노 메모리 내부에서 구동되는 웹서버 페이지 전송 원리, HTTP GET/POST 통신 헤더 분석 및 제어 스위치 매핑',
        do: '스마트폰 브라우저에 아두이노 IP를 치고 접속하여 그래픽 스위치를 누르면 실제 모터가 작동하는 무선 서버를 구현할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 29,
        title: '인터넷 오픈 API 연동 - 실시간 기상청 전광판 제작',
        learn: '기상청 API 서버에 HTTP 요청을 보내 응답 데이터를 가져오는 네트워크 클라이언트 기법, JSON 데이터 파싱 알고리즘',
        do: '기상청 서버에서 오늘 우리 동네의 실시간 기온과 미세먼지 수치를 수집해 LCD 화면에 흐르는 전광판으로 표현할 수 있습니다.',
        implemented: false
      },
      {
        dayNum: 30,
        title: '10대 실전 디버깅 및 트러블슈팅 최종 마스터',
        learn: '실제 아두이노 프로젝트에서 마주하는 10가지 치명적 결함(플로팅 노이즈, 저항 누락 쇼트, 바운싱 노출, 풀업 미선언, 역전류 보드 리셋, 코드 데드락, I2C 통신 불통, 릴레이 과도 서지, 업로드 충돌, 핀 센서 반대 배선)의 물리적 진단',
        do: '고장난 회로와 오동작 코드로 얽힌 10가지 가상 실습 키트를 직접 복원 수리해 냄으로써, 타인에게 문제를 분석 지도해줄 수 있는 공인 강사 수준의 수료증을 획득합니다.',
        implemented: true
      }
    ]
  }
};

interface LevelSyllabusPageProps {
  levelId: number;
  onBackToLanding: () => void;
  onSelectDay: (dayNum: number) => void;
}

export const LevelSyllabusPage: React.FC<LevelSyllabusPageProps> = ({ levelId, onBackToLanding, onSelectDay }) => {
  const level = levelsSyllabusData[levelId];
  
  if (!level) return <div>잘못된 레벨 정보입니다.</div>;

  return (
    <div style={{ width: '100%', minHeight: '100vh', padding: '60px var(--spacing-12)', background: 'var(--color-bg-base)', position: 'relative' }}>
      
      {/* Back Button */}
      <div style={{ maxWidth: '1000px', margin: '0 auto 32px auto' }}>
        <button 
          onClick={onBackToLanding}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--color-text-secondary)', background: 'transparent', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '1.05rem', border: '1px solid var(--color-glass-border)' }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={18} /> 메인으로 돌아가기
        </button>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto' }} className="glass-panel animate-fade-in">
        
        {/* Level Header */}
        <div style={{ borderBottom: '1px solid var(--color-glass-border)', padding: '40px', background: 'rgba(15, 22, 41, 0.4)', borderRadius: '12px 12px 0 0' }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(139,92,246,0.15)', borderRadius: 'var(--radius-full)', color: '#c4b5fd', fontSize: '0.9rem', fontWeight: 800, marginBottom: '16px', border: '1px solid rgba(139,92,246,0.3)' }}>
            Course Overview
          </div>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', margin: '0 0 12px 0' }}>{level.title}</h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.15rem', margin: 0, lineHeight: 1.6 }}>{level.desc}</p>
        </div>

        {/* Days List */}
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {level.days.map((day) => (
            <div 
              key={day.dayNum} 
              style={{ 
                padding: '24px', 
                background: 'rgba(30, 41, 59, 0.3)', 
                borderRadius: '12px', 
                border: day.implemented ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--color-glass-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div style={{ 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '50%', 
                    background: day.implemented ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255,255,255,0.05)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    color: day.implemented ? '#22c55e' : 'var(--color-text-muted)', 
                    fontSize: '1.1rem', 
                    fontWeight: 900 
                  }}>
                    Day {day.dayNum}
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>{day.title}</h3>
                    {!day.implemented && (
                      <span style={{ fontSize: '0.75rem', padding: '2px 8px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderRadius: '4px', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px', fontWeight: 700 }}>
                        <AlertCircle size={10} /> 개발 진행 중 (Syllabus 열람 가능)
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => onSelectDay(day.dayNum)}
                  style={{ 
                    padding: '10px 20px', 
                    background: day.implemented ? 'var(--color-success)' : 'rgba(255,255,255,0.05)', 
                    color: day.implemented ? '#000000' : 'var(--color-text-muted)', 
                    borderRadius: 'var(--radius-full)', 
                    fontWeight: 800, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px', 
                    cursor: day.implemented ? 'pointer' : 'not-allowed', 
                    border: 'none',
                    fontSize: '0.95rem',
                    transition: 'all 0.2s'
                  }}
                  onMouseOver={e => { if (day.implemented) e.currentTarget.style.transform = 'scale(1.03)'; }}
                  onMouseOut={e => { if (day.implemented) e.currentTarget.style.transform = 'scale(1)'; }}
                >
                  <Play size={14} fill="currentColor"/> 학습 시작
                </button>
              </div>

              {/* Learning Objectives Deep Dive */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '16px', fontSize: '0.95rem', lineHeight: 1.6 }}>
                <div>
                  <strong style={{ color: '#c4b5fd', display: 'block', marginBottom: '4px' }}>💡 이 단계에서 배우는 지식 (What to Learn):</strong>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{day.learn}</span>
                </div>
                <div>
                  <strong style={{ color: '#60a5fa', display: 'block', marginBottom: '4px' }}>🛠️ 실습으로 직접 해내게 될 것 (What to Achieve):</strong>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{day.do}</span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
