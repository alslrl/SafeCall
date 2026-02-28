import { Page } from 'framework7-react'
import { useState, useEffect, useRef } from 'react'
import { useAppState } from '../../context/AppStateContext'

export default function CallPage({ f7router }: { f7router: any }) {
  const { state, setState } = useAppState()
  const [connected, setConnected] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // 2초 후 연결됨 전환
  useEffect(() => {
    const timeout = setTimeout(() => {
      setConnected(true)
    }, 2000)
    return () => clearTimeout(timeout)
  }, [])

  // 연결 후 타이머 시작
  useEffect(() => {
    if (connected) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => prev + 1)
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [connected])

  // 연결 3초 후 AI 분석 시작 → 알림 전송
  useEffect(() => {
    if (connected && seconds === 3 && state === 'CALLING_119') {
      setState('ANALYZING')
    }
    if (connected && seconds === 5 && state === 'ANALYZING') {
      setState('ALERT_SENT')
    }
  }, [connected, seconds, state, setState])

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${min}:${sec}`
  }

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (state === 'CALLING_119' || state === 'ANALYZING') {
      setState('IDLE')
    }
    f7router.back()
  }

  return (
    <Page noNavbar noToolbar>
      <div className="call-screen">
        <div className="call-info">
          <div className="call-number">119</div>
          <div className={`call-status ${connected ? 'connected' : ''}`}>
            {connected ? '119 연결됨' : '119 연결 중...'}
          </div>
          {connected && (
            <div className="call-timer">{formatTime(seconds)}</div>
          )}

          {state === 'ANALYZING' && (
            <div style={{ marginTop: 20, color: '#f59e0b', fontSize: 13 }}>
              AI 분석 중...
            </div>
          )}
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
