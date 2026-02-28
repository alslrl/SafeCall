import { Page, Navbar, Card, CardContent } from 'framework7-react'
import { useEffect } from 'react'
import { useAppState } from '../../context/AppStateContext'
import HomecamView from '../shared/HomecamView'

export default function MonitorPage({ f7router }: { f7router: any }) {
  const { state } = useAppState()

  useEffect(() => {
    if (state === 'ALERT_SENT') {
      f7router.navigate('/alert/')
    }
  }, [state, f7router])
  return (
    <Page>
      <Navbar title="SafeCall 보호자" />

      <Card>
        <CardContent>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>👩‍👧</span>
            <div>
              <div style={{ fontWeight: 600, fontSize: 16 }}>어머니</div>
              <div style={{ color: '#34c759', fontSize: 13, marginTop: 2 }}>
                ✅ 모니터링 중
              </div>
              <div style={{ color: '#8e8e93', fontSize: 12, marginTop: 1 }}>
                기기 연결됨
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div style={{ padding: '0 16px' }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#8e8e93', marginBottom: 8, paddingLeft: 4 }}>
          홈캠
        </div>
        <HomecamView mode="normal" />
      </div>

      <div style={{ padding: '20px 16px', textAlign: 'center', color: '#c7c7cc', fontSize: 13 }}>
        최근 이벤트 없음
      </div>
    </Page>
  )
}
