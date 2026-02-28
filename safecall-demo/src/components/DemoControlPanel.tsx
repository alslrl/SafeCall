import { useAppState, type ScenarioType, type AppState } from '../context/AppStateContext'

const SCENARIOS: { type: ScenarioType; emoji: string; label: string; number: string; color: string }[] = [
  { type: 'fire_false_alarm', emoji: '🔥', label: '화재 오인', number: '119', color: '#f59e0b' },
  { type: 'fall_detected', emoji: '🤕', label: '낙상 감지', number: '119', color: '#ef4444' },
  { type: 'burglar_false_alarm', emoji: '🚨', label: '침입 망상', number: '112', color: '#8b5cf6' },
]

const STATE_LABELS: Record<AppState, string> = {
  IDLE: '대기 중',
  DIALING: '다이얼 중',
  CALLING_119: '통화 중',
  ANALYZING: 'AI 분석 중',
  ALERT_SENT: '알림 전송됨',
  EMERGENCY_ALERT: '긴급 알림',
  CONFIRMED: '확인됨',
  INTERCEPT_ACTIVE: '인터셉트 활성',
  INTERCEPT_CALL: '재전화 감지',
  AI_CONVERSATION: 'AI 대화 중',
  RECALL_ALERT: '재전화 알림',
}

export default function DemoControlPanel() {
  const { state, scenario, setScenario, reset } = useAppState()

  return (
    <div className="demo-panel">
      <div className="demo-panel-title">Demo Control</div>

      <div className="demo-panel-section">
        <div className="demo-panel-label">시나리오</div>
        {SCENARIOS.map((s) => (
          <button
            key={s.type}
            className={`scenario-card ${scenario === s.type ? 'active' : ''}`}
            onClick={() => setScenario(s.type)}
            style={{ '--scenario-color': s.color } as React.CSSProperties}
          >
            <span className="scenario-emoji">{s.emoji}</span>
            <div className="scenario-info">
              <div className="scenario-name">{s.label}</div>
              <div className="scenario-number">{s.number}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="demo-panel-section">
        <div className="demo-panel-label">현재 상태</div>
        <div className="state-display">
          <div className="state-dot" style={{
            background: state === 'IDLE' ? '#34c759' :
              state === 'ALERT_SENT' || state === 'EMERGENCY_ALERT' ? '#ff3b30' :
              '#f59e0b'
          }} />
          <span>{STATE_LABELS[state]}</span>
        </div>
      </div>

      <button className="reset-btn" onClick={reset}>
        초기화
      </button>
    </div>
  )
}
