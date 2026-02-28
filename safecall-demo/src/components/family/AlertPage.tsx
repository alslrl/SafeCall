import { Page, Navbar, Card, CardContent, Button, Block } from 'framework7-react'
import { useAppState } from '../../context/AppStateContext'
import HomecamView from '../shared/HomecamView'

export default function AlertPage({ f7router }: { f7router: any }) {
  const { scenario, setState } = useAppState()
  const isFire = scenario === 'fire_false_alarm'

  const handleConfirmFalseAlarm = () => {
    setState('INTERCEPT_ACTIVE')
    f7router.navigate('/intercept/')
  }

  return (
    <Page>
      <Navbar title="SafeCall 보호자" backLink="뒤로" />

      <Block strong inset>
        <div className="alert-header">
          <div style={{ fontSize: 28, marginBottom: 4 }}>🚨</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#ff3b30' }}>
            긴급 알림
          </div>
          <div style={{ fontSize: 14, color: '#8e8e93', marginTop: 4 }}>
            어머니가 119에 전화했습니다
          </div>
          <div style={{ fontSize: 12, color: '#c7c7cc', marginTop: 2 }}>
            오늘 {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </Block>

      <Card>
        <CardContent>
          <div style={{ fontWeight: 600, fontSize: 13, color: '#8e8e93', marginBottom: 8 }}>
            AI 분석 결과
          </div>

          <div style={{ textAlign: 'center', marginBottom: 12 }}>
            <span
              className={`alert-badge ${isFire ? 'fire' : 'fall'}`}
            >
              {isFire ? '🔥 화재 오인 가능성' : '⚠️ 낙상 감지'}
            </span>
          </div>

          <div className="confidence-number">
            {isFire ? '95' : '94'}%
          </div>

          <div style={{ fontSize: 12, textAlign: 'center', color: '#8e8e93', marginBottom: 12 }}>
            확신도
          </div>

          <div className="analysis-item">
            <span>{isFire ? '🟢' : '🔴'}</span>
            <span>{isFire ? '수증기 감지' : '바닥에 누운 사람 감지'}</span>
          </div>
          <div className="analysis-item">
            <span>{isFire ? '❌' : '❌'}</span>
            <span>{isFire ? '화재 징후 없음' : '정상 활동 아님'}</span>
          </div>
        </CardContent>
      </Card>

      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e93', marginBottom: 8, paddingLeft: 4 }}>
          홈캠 영상
        </div>
        <HomecamView mode={isFire ? 'fire' : 'fall'} />
      </div>

      <Block>
        {isFire ? (
          <>
            <Button large fill color="green" onClick={handleConfirmFalseAlarm}>
              ✅ 오인 확인
            </Button>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#8e8e93' }}>
              ⚠️ 이후 재전화 시 AI가 안심 대화합니다
            </div>
          </>
        ) : (
          <>
            <Button large fill color="blue">
              📞 어머니께 전화하기
            </Button>
            <div style={{ textAlign: 'center', marginTop: 8, fontSize: 12, color: '#ff3b30' }}>
              ⚠️ 119가 이미 연결되었습니다. 즉시 확인해 주세요
            </div>
          </>
        )}
      </Block>
    </Page>
  )
}
