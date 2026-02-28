import { Page } from 'framework7-react'
import { useState, useEffect, useRef } from 'react'
import { useAppState } from '../../context/AppStateContext'

const AI_MESSAGES = [
  '어머니, 안녕하세요.',
  '아까 확인했는데 집 안은 안전해요.',
  '부엌에서 수증기가 올라온 것이었어요.',
  '불은 나지 않았으니 걱정 마세요.',
  '따님께도 알려드렸으니 안심하세요.',
]

export default function InterceptPage({ f7router }: { f7router: any }) {
  const { setState } = useAppState()
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

  // 3초마다 다음 메시지 표시
  useEffect(() => {
    if (seconds > 0 && seconds % 3 === 0) {
      setMessageIndex(prev => Math.min(prev + 1, AI_MESSAGES.length - 1))
    }
    // 모든 메시지 완료 후 RECALL_ALERT
    if (messageIndex === AI_MESSAGES.length - 1 && seconds > AI_MESSAGES.length * 3) {
      setState('RECALL_ALERT')
    }
  }, [seconds, messageIndex, setState])

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
          <div className="call-number" style={{ color: '#34c759' }}>119</div>
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
            {AI_MESSAGES.slice(0, messageIndex + 1).map((msg, i) => (
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
