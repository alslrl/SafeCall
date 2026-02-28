import { App, View } from 'framework7-react'
import { AppStateProvider } from './context/AppStateContext'
import PhoneFrame from './components/PhoneFrame'
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
            <div className="phone-column">
              <PhoneFrame label="어르신 폰">
                <View
                  url="/"
                  routes={elderRoutes}
                  iosSwipeBack={false}
                  browserHistory={false}
                />
              </PhoneFrame>
            </div>

            <div className="phone-column">
              <PhoneFrame label="가족 폰">
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
