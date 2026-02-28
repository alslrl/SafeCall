import { App, View } from 'framework7-react'
import { AppStateProvider } from './context/AppStateContext'
import PhoneFrame from './components/PhoneFrame'
import DemoControlPanel from './components/DemoControlPanel'
import { elderRoutes, familyRoutes } from './routes'

const f7params = {
  name: 'SafeCall',
  theme: 'ios' as const,
  colors: { primary: '#007AFF' },
  darkMode: false,
  iosTranslucentBars: true,
  iosTranslucentModals: true,
}

export default function SafeCallApp() {
  return (
    <App {...f7params}>
      <AppStateProvider>
        <div className="demo-container">
          <div className="demo-header">
            <h1>SafeCall Demo</h1>
          </div>

          <div className="phones-wrapper">
            <DemoControlPanel />

            <div className="phone-column">
              <PhoneFrame label="김영숙 (78세)">
                <View
                  url="/"
                  routes={elderRoutes}
                  iosSwipeBack={false}
                  browserHistory={false}
                />
              </PhoneFrame>
            </div>

            <div className="phone-column">
              <PhoneFrame label="김지현 (딸)" statusBarBg="#efeff4">
                <View
                  url="/"
                  routes={familyRoutes}
                  iosSwipeBack={false}
                  browserHistory={false}
                />
              </PhoneFrame>
            </div>
          </div>
        </div>
      </AppStateProvider>
    </App>
  )
}
