import { Page } from 'framework7-react'
import { useState, useEffect, useRef } from 'react'
import { useAppState, type ScenarioType } from '../../context/AppStateContext'

const AI_MESSAGES: Record<ScenarioType, string[]> = {
  fire_false_alarm: [
    '어머니, 안녕하세요.',
    '아까 확인했는데 집 안은 안전해요.',
    '부엌에서 수증기가 올라온 것이었어요.',
    '불은 나지 않았으니 걱정 마세요.',
    '따님께도 알려드렸으니 안심하세요.',
  ],
  fall_detected: [
    '어머니, 안녕하세요.',
    '아까 확인했는데 집 안은 안전해요.',
    '부엌에서 수증기가 올라온 것이었어요.',
    '불은 나지 않았으니 걱정 마세요.',
    '따님께도 알려드렸으니 안심하세요.',
  ],
  burglar_false_alarm: [
    '어머니, 안녕하세요.',
    '집 안을 확인해봤는데 아무도 없어요.',
    '거울에 비친 모습이거나 TV 속 사람이었을 거예요.',
    '현관문도 잠겨있고, 집 안은 안전해요.',
    '따님께도 알려드렸으니 안심하세요.',
  ],
}

export default function InterceptPage({ f7router }: { f7router: any }) {
  const { scenario, dialedNumber, setState } = useAppState()
  const [seconds, setSeconds] = useState(0)
  const [messageIndex, setMessageIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setState('AI_CONVERSATION')

    timerRef.current = setInterval(() => {
      setSeconds(prev => prev + 1)
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [setState])

  const messages = AI_MESSAGES[scenario]
  const callNumber = dialedNumber || (scenario === 'burglar_false_alarm' ? '112' : '119')

  // 3초마다 다음 메시지 표시
  useEffect(() => {
    if (seconds > 0 && seconds % 3 === 0) {
      setMessageIndex(prev => Math.min(prev + 1, messages.length - 1))
    }
    // 모든 메시지 완료 후 RECALL_ALERT
    if (messageIndex === messages.length - 1 && seconds > messages.length * 3) {
      setState('RECALL_ALERT')
    }
  }, [seconds, messageIndex, setState, messages])

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${min}:${sec}`
  }

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setState('RECALL_ALERT')
    f7router.back()
  }

  return (
    <Page noNavbar noToolbar>
      <div className="call-screen">
        <div className="call-info">
          <div className="call-number" style={{ color: '#34c759' }}>{callNumber}</div>
          <div className="call-status connected">통화 중</div>
          <div className="call-timer">{formatTime(seconds)}</div>
        </div>

        <div className="ai-conversation-box">
          <div className="ai-wave">
            <div className="wave-bars">
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
              <div className="wave-bar" />
            </div>
            <span>AI 음성</span>
          </div>
          <div className="ai-text">
            {messages.slice(0, messageIndex + 1).map((msg: string, i: number) => (
              <p key={i} style={{ marginBottom: 8, opacity: i === messageIndex ? 1 : 0.6 }}>
                {msg}
              </p>
            ))}
          </div>
        </div>

        <button className="end-call-button" onClick={handleEndCall}>
          <svg viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </button>
      </div>
    </Page>
  )
}
