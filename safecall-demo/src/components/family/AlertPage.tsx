import { Page, Navbar, Card, CardContent, Button, Block, Preloader } from 'framework7-react'
import { useAppState } from '../../context/AppStateContext'
import HomecamView from '../shared/HomecamView'
import FamilyBottomNav from './FamilyBottomNav'

export default function AlertPage({ f7router }: { f7router: any }) {
  const { scenario, analysisResult, isAnalyzing, setState } = useAppState()
  const isFire = scenario === 'fire_false_alarm'
  const isBurglar = scenario === 'burglar_false_alarm'
  const camMode = isFire ? 'fire' : isBurglar ? 'burglar' : 'fall'

  const handleConfirmFalseAlarm = () => {
    setState('INTERCEPT_ACTIVE')
    f7router.navigate('/intercept/')
  }

  if (isAnalyzing || !analysisResult) {
    return (
      <Page pageContent={false}>
        <Navbar title="SafeCall" backLink="뒤로" />
        <div className="page-content">
          <div className="homecam-top-section">
            <HomecamView mode={camMode} />
          </div>
          <Block strong inset>
            <div className="alert-header">
              <div style={{ fontSize: 28, marginBottom: 4 }}>🚨</div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#ff3b30' }}>
                긴급 알림
              </div>
              <div style={{ fontSize: 14, color: '#8e8e93', marginTop: 4 }}>
                어머니가 {isBurglar ? '112' : '119'}에 전화했습니다
              </div>
            </div>
          </Block>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 0' }}>
            <Preloader size={32} />
            <div style={{ marginTop: 16, fontSize: 14, color: '#8e8e93' }}>
              AI 분석 중...
            </div>
          </div>
        </div>
        <FamilyBottomNav active="alert" />
      </Page>
    )
  }

  return (
    <Page pageContent={false}>
      <Navbar title="SafeCall" backLink="뒤로" />
      <div className="page-content">
        <div className="homecam-top-section">
          <HomecamView mode={camMode} />
        </div>

        <div style={{ textAlign: 'center', padding: '12px 16px 0' }}>
          <span
            className={`alert-badge ${analysisResult.isFalseAlarm ? (isFire ? 'fire' : 'burglar') : 'fall'}`}
          >
            {analysisResult.isFalseAlarm ? (isFire ? '🔥' : '🚨') : '⚠️'} {analysisResult.category}
          </span>
          <div style={{ fontSize: 12, color: '#8e8e93', marginTop: 4 }}>
            어머니가 {isBurglar ? '112' : '119'}에 전화 · 오늘 {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>

        <Card>
          <CardContent>
            <div style={{ fontWeight: 600, fontSize: 13, color: '#8e8e93', marginBottom: 8 }}>
              AI 분석 결과
            </div>

            <div className="confidence-ring-wrapper">
              <svg className="confidence-ring" viewBox="0 0 100 100">
                <circle className="confidence-ring-bg" cx="50" cy="50" r="42" />
                <circle
                  className="confidence-ring-fill"
                  cx="50" cy="50" r="42"
                  style={{ strokeDashoffset: `${264 - (264 * analysisResult.confidence / 100)}` }}
                />
              </svg>
              <div className="confidence-number">{analysisResult.confidence}%</div>
            </div>

            <div style={{ fontSize: 12, textAlign: 'center', color: '#8e8e93', marginBottom: 12 }}>
              확신도
            </div>

            {analysisResult.findings.map((finding, i) => (
              <div className="analysis-item" key={i}>
                <span>{finding.emoji}</span>
                <span>{finding.text}</span>
              </div>
            ))}

            <div style={{
              marginTop: 12,
              padding: '10px 12px',
              background: '#f2f2f7',
              borderRadius: 8,
              fontSize: 13,
              color: '#3c3c43',
              lineHeight: 1.5,
            }}>
              {analysisResult.reasoning}
            </div>
          </CardContent>
        </Card>

        <Block style={{ paddingBottom: 70 }}>
          {analysisResult.isFalseAlarm ? (
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
      </div>
      <FamilyBottomNav active="alert" />
    </Page>
  )
}
