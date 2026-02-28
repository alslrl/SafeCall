import { Page, Navbar, Block, Button, Card, CardContent } from 'framework7-react'
import { useState, useEffect, useRef } from 'react'
import { useAppState } from '../../context/AppStateContext'
import HomecamView from '../shared/HomecamView'
import FamilyBottomNav from './FamilyBottomNav'

export default function FamilyInterceptPage({ f7router }: { f7router: any }) {
  const { scenario, setState } = useAppState()
  const isBurglar = scenario === 'burglar_false_alarm'
  const callNumber = isBurglar ? '112' : '119'
  const targetLabel = isBurglar ? '침입 오인 건' : '화재 오인 건'
  const [remainingSeconds, setRemainingSeconds] = useState(2 * 60 * 60) // 2시간
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setRemainingSeconds(prev => Math.max(0, prev - 1))
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const formatCountdown = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600)
    const m = Math.floor((totalSec % 3600) / 60)
    const s = totalSec % 60
    return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  const handleRelease = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setState('IDLE')
    f7router.back()
  }

  return (
    <Page pageContent={false}>
      <Navbar title="SafeCall" backLink="뒤로" />
      <div className="page-content">
        <div className="homecam-top-section">
          <HomecamView mode="normal" />
        </div>

        <Block strong inset>
          <div className="intercept-status">
            <div style={{ fontSize: 28, marginBottom: 8 }}>🛡️</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#007aff' }}>
              인터셉트 모드 활성화
            </div>
          </div>
        </Block>

        <Card>
          <CardContent>
            <div style={{ fontSize: 14, color: '#8e8e93' }}>대상</div>
            <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{targetLabel}</div>

            <div style={{ marginTop: 16, fontSize: 14, color: '#8e8e93' }}>남은 시간</div>
            <div className="intercept-timer">{formatCountdown(remainingSeconds)}</div>

            <div style={{ fontSize: 13, color: '#8e8e93', textAlign: 'center' }}>
              어머니가 다시 {callNumber}를 누르면<br />AI가 안심 대화를 진행합니다
            </div>
          </CardContent>
        </Card>

        <Block>
          <Button large fill color="red" onClick={handleRelease}>
            🔴 인터셉트 해제
          </Button>
        </Block>
      </div>
      <FamilyBottomNav active="home" />
    </Page>
  )
}
