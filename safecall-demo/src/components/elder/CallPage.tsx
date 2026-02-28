import { Page } from 'framework7-react'
import { useState, useEffect, useRef } from 'react'
import { useAppState, type ScenarioType } from '../../context/AppStateContext'
import { analyzeScenario, getFallbackResult } from '../../services/gemini'

interface Preset {
  label: string
  text: string
  audio: string
}

const PRESETS: Record<ScenarioType, Preset[]> = {
  fire_false_alarm: [
    {
      label: '"불이 났어요! 빨리 와주세요..."',
      text: '서울 세빛둥둥섬 3층 비스타인데요!! 불이 났어요! 빨리 와주세요 빨리!!!',
      audio: '/audio/fire-1.mp3',
    },
    {
      label: '"큰불이 났어! 소방차 빨리 보내요..."',
      text: '아이고 119죠? 우리 집에 큰불이 났어! 가스레인지 쪽에서 하얀 연기가 천장까지 덮쳤어! 주소? 주소가... 여기 은평구... 아유 몰라, 불길이 번지고 있으니까 소방차부터 빨리 보내요!!',
      audio: '/audio/fire-2.mp3',
    },
  ],
  fall_detected: [
    {
      label: '"넘어졌는데 꼼짝을 못 하겠어..."',
      text: '아이고... 119 좀... 나 좀 살려줘요. 걷다가 넘어졌는데... 허리가 끊어질 것 같아서 바닥에서 꼼짝을 못 하겠어... 나 혼자 있는데 어떡해, 피도 나는 것 같아...',
      audio: '/audio/fall-1.mp3',
    },
    {
      label: '"다리가 안 움직여... 구급차 보내줘요..."',
      text: '여보세요... 거기 구급차 좀 보내줘요... 방금 넘어졌는데 다리가 아예 안 움직여... 전화기도 겨우 잡았어... 너무 아파 죽겠어, 제발 빨리 와서 문 좀 따고 들어와 줘요...',
      audio: '/audio/fall-2.mp3',
    },
  ],
  burglar_false_alarm: [
    {
      label: '"남자가 칼 들고 서 있어! 빨리 와주세요..."',
      text: '경찰서죠? 빨리 무장하고 와주세요! 저기 시커먼 옷 입은 남자가 칼을 들고 서 있어! 내가 나가라고 소리쳐도 안 나가고 나를 계속 노려봐! 무서워 죽겠어, 빨리 와서 잡아 가요!',
      audio: '/audio/burglar-1.mp3',
    },
    {
      label: '"도둑이야! 현관문을 부수려고 해..."',
      text: '여보세요 경찰이죠? 도둑이야 도둑! 지금 누가 밖에서 우리 집 도어락을 계속 누르고 현관문을 부수려고 해! 문고리가 막 덜컹거린다니까? 나 묶어놓고 돈 훔쳐 가려나 봐, 빨리 경찰차 보내요!',
      audio: '/audio/burglar-2.mp3',
    },
  ],
}

export default function CallPage({ f7router }: { f7router: any }) {
  const { state, scenario, dialedNumber, setState, setAnalysisResult, setIsAnalyzing } = useAppState()
  const [connected, setConnected] = useState(false)
  const [seconds, setSeconds] = useState(0)
  const [sent, setSent] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

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

    // 기존 오디오 정지
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current = null
    }

    // TTS 오디오 재생
    const preset = PRESETS[scenario][index]
    const audio = new Audio(preset.audio)
    audioRef.current = audio
    setIsPlaying(true)
    audio.play().catch(() => {})
    audio.onended = () => setIsPlaying(false)
    audio.onerror = () => setIsPlaying(false)
  }

  const handleSend = async () => {
    if (selectedPreset === null) return
    setSent(true)
    setIsAnalyzing(true)
    setState('ANALYZING')

    const callerMessage = PRESETS[scenario][selectedPreset].text

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
  }

  const handleEndCall = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    if (state === 'CALLING_119' || state === 'ANALYZING') {
      setState('IDLE')
    }
    f7router.back()
  }

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

        {/* 음성 입력 영역 - 연결 후 & 전송 전에만 표시 */}
        {connected && !sent && (
          <div className="voice-input-section">
            <div className="voice-section-title">상황 설명</div>

            {/* 프리셋 목록 */}
            <div className="preset-list">
              {PRESETS[scenario].map((preset, i) => (
                <button
                  key={i}
                  className={`preset-item ${selectedPreset === i ? 'selected' : ''}`}
                  onClick={() => handleSelectPreset(i)}
                >
                  <span className="preset-icon">{selectedPreset === i && isPlaying ? '🔊' : '📋'}</span>
                  <span className="preset-text">{preset.label}</span>
                </button>
              ))}
            </div>

            {/* 전송 버튼 */}
            <button
              className="send-voice-btn"
              disabled={selectedPreset === null}
              onClick={handleSend}
            >
              전송
            </button>
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
