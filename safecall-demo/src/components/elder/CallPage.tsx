import { Page } from 'framework7-react'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useAppState, type ScenarioType } from '../../context/AppStateContext'
import { analyzeScenario, getFallbackResult } from '../../services/gemini'

const PRESETS: Record<ScenarioType, string[]> = {
  fire_false_alarm: [
    '불이요! 부엌에서 연기가 나요!',
    '화재입니다! 빨리 와주세요!',
  ],
  fall_detected: [
    '사람이 쓰러졌어요! 빨리 와주세요!',
    '엄마가 넘어졌어요! 움직이지 못해요!',
  ],
  burglar_false_alarm: [
    '도둑이요! 누가 집에 들어왔어요!',
    '누가 있어요! 무서워요! 빨리 와주세요!',
  ],
}

type VoiceState = 'idle' | 'preset_selected' | 'recording' | 'recorded' | 'sending' | 'analyzing'

export default function CallPage({ f7router }: { f7router: any }) {
  const { state, scenario, dialedNumber, setState, setAnalysisResult, setIsAnalyzing } = useAppState()
  const [connected, setConnected] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [voiceState, setVoiceState] = useState<VoiceState>('idle')
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const [recordSeconds, setRecordSeconds] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioBlobRef = useRef<Blob | null>(null)

  const callNumber = dialedNumber || (scenario === 'burglar_false_alarm' ? '112' : '119')

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

  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0')
    const sec = (s % 60).toString().padStart(2, '0')
    return `${min}:${sec}`
  }

  const handleSelectPreset = (index: number) => {
    setSelectedPreset(index)
    setVoiceState('preset_selected')
    // 녹음 관련 상태 초기화
    stopRecording()
  }

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks: BlobPart[] = []

      recorder.ondataavailable = (e) => chunks.push(e.data)
      recorder.onstop = () => {
        audioBlobRef.current = new Blob(chunks, { type: 'audio/webm' })
        stream.getTracks().forEach(t => t.stop())
        setVoiceState('recorded')
      }

      mediaRecorderRef.current = recorder
      recorder.start()
      setVoiceState('recording')
      setSelectedPreset(null)
      setRecordSeconds(0)

      recordTimerRef.current = setInterval(() => {
        setRecordSeconds(prev => prev + 1)
      }, 1000)
    } catch {
      // 마이크 권한 거부 시 무시
    }
  }, [])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current)
      recordTimerRef.current = null
    }
  }, [])

  const handleSend = useCallback(async () => {
    setVoiceState('sending')
    setIsAnalyzing(true)

    const callerMessage = selectedPreset !== null
      ? PRESETS[scenario][selectedPreset]
      : '사용자가 직접 음성으로 상황을 설명했습니다'

    await new Promise(resolve => setTimeout(resolve, 800))
    setState('ANALYZING')
    setVoiceState('analyzing')

    try {
      const result = await analyzeScenario(scenario, callerMessage)
      setAnalysisResult(result)
    } catch (error) {
      console.error('Gemini API error, using fallback:', error)
      setAnalysisResult(getFallbackResult(scenario))
    } finally {
      setIsAnalyzing(false)
      setState('ALERT_SENT')
    }
  }, [setState, setAnalysisResult, setIsAnalyzing, scenario, selectedPreset])

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    stopRecording()
    if (state === 'CALLING_119' || state === 'ANALYZING') {
      setState('IDLE')
    }
    f7router.back()
  }

  const canSend = voiceState === 'preset_selected' || voiceState === 'recorded'

  return (
    <Page noNavbar noToolbar>
      <div className="call-screen">
        <div className="call-info">
          <div className="call-number">{callNumber}</div>
          <div className={`call-status ${connected ? 'connected' : ''}`}>
            {connected ? `${callNumber} 연결됨` : `${callNumber} 연결 중...`}
          </div>
          {connected && (
            <div className="call-timer">{formatTime(seconds)}</div>
          )}
        </div>

        {/* 음성 입력 영역 - 연결 후 표시 */}
        {connected && voiceState !== 'sending' && voiceState !== 'analyzing' && (
          <div className="voice-input-section">
            <div className="voice-section-title">상황 설명</div>

            {/* 프리셋 목록 */}
            <div className="preset-list">
              {PRESETS[scenario].map((text, i) => (
                <button
                  key={i}
                  className={`preset-item ${selectedPreset === i ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(i)}
                >
                  <span className="preset-icon">📋</span>
                  <span className="preset-text">{text}</span>
                </button>
              ))}
            </div>

            {/* 구분선 */}
            <div className="voice-divider">
              <span>또는</span>
            </div>

            {/* 녹음 버튼 */}
            {voiceState === 'recording' ? (
              <button className="record-btn recording" onClick={stopRecording}>
                <span className="record-dot" />
                <span>녹음 중 {formatTime(recordSeconds)}</span>
              </button>
            ) : voiceState === 'recorded' ? (
              <div className="record-btn recorded">
                <span>✅ 녹음 완료 ({formatTime(recordSeconds)})</span>
              </div>
            ) : (
              <button className="record-btn" onClick={startRecording}>
                <span className="record-dot idle" />
                <span>🎙️ 직접 녹음</span>
              </button>
            )}

            {/* 전송 버튼 */}
            <button
              className="send-voice-btn"
              disabled={!canSend}
              onClick={handleSend}
            >
              📤 전송
            </button>
          </div>
        )}

        {/* 전송/분석 상태 */}
        {voiceState === 'sending' && (
          <div className="voice-status">
            <div className="voice-status-spinner" />
            <span>음성 전송 중...</span>
          </div>
        )}
        {voiceState === 'analyzing' && (
          <div className="voice-status analyzing">
            <div className="voice-status-spinner" />
            <span>AI 분석 중...</span>
          </div>
        )}

        <button className="end-call-button" onClick={handleEndCall}>
          <svg viewBox="0 0 24 24">
            <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
          </svg>
        </button>
      </div>
    </Page>
  )
}
