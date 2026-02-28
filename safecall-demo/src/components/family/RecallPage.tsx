import { Page, Navbar, Block, Card, CardContent } from 'framework7-react'
import { useAppState } from '../../context/AppStateContext'
import HomecamView from '../shared/HomecamView'

export default function RecallPage() {
  const { state, scenario } = useAppState()
  const isBurglar = scenario === 'burglar_false_alarm'
  const callNumber = isBurglar ? '112' : '119'
  const summaryText = isBurglar
    ? '"강도 침입 오인 상황 설명. 반려동물 움직임 확인 전달. 어르신 안심하심."'
    : '"화재 오인 상황 설명. 집 안 안전 확인 전달. 어르신 안심하심."'

  return (
    <Page>
      <Navbar title="SafeCall 보호자" backLink="뒤로" />

      <Block strong inset>
        <div style={{ textAlign: 'center', padding: '12px 0' }}>
          <div style={{ fontSize: 28, marginBottom: 4 }}>📞</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#007aff' }}>
            재전화 감지
          </div>
          <div style={{ fontSize: 14, color: '#8e8e93', marginTop: 6 }}>
            어머니가 {callNumber}를 다시 눌렀습니다
          </div>
          <div style={{ fontSize: 12, color: '#c7c7cc', marginTop: 2 }}>
            오늘 {new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </Block>

      {state === 'RECALL_ALERT' && (
        <Card>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span style={{ color: '#34c759', fontSize: 18 }}>✅</span>
              <span style={{ fontWeight: 600, fontSize: 15 }}>AI 안심 대화 완료</span>
            </div>

            <div style={{ fontSize: 13, color: '#8e8e93', marginBottom: 6 }}>대화 요약:</div>
            <div style={{
              background: '#f2f2f7',
              borderRadius: 10,
              padding: 12,
              fontSize: 14,
              lineHeight: 1.5,
              color: '#3a3a3c',
            }}>
              {summaryText}
            </div>
          </CardContent>
        </Card>
      )}

      {state === 'AI_CONVERSATION' && (
        <Card>
          <CardContent>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 18 }}>🔄</span>
              <span style={{ fontWeight: 600, fontSize: 15, color: '#f59e0b' }}>
                AI 안심 대화 진행 중...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div style={{ padding: '0 16px', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e93', marginBottom: 8, paddingLeft: 4 }}>
          홈캠
        </div>
        <HomecamView mode="normal" />
      </div>

      <Block>
        <div style={{ textAlign: 'center', fontSize: 13, color: '#007aff' }}>
          🛡️ 인터셉트 모드 유지 중
        </div>
      </Block>
    </Page>
  )
}
