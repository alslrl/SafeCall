import DialerPage from './components/elder/DialerPage'
import CallPage from './components/elder/CallPage'
import InterceptPage from './components/elder/InterceptPage'
import MonitorPage from './components/family/MonitorPage'
import AlertPage from './components/family/AlertPage'
import FamilyInterceptPage from './components/family/InterceptPage'
import RecallPage from './components/family/RecallPage'

export const elderRoutes = [
  { path: '/', component: DialerPage },
  { path: '/call/', component: CallPage },
  { path: '/intercept/', component: InterceptPage },
]

export const familyRoutes = [
  { path: '/', component: MonitorPage },
  { path: '/alert/', component: AlertPage },
  { path: '/intercept/', component: FamilyInterceptPage },
  { path: '/recall/', component: RecallPage },
]
