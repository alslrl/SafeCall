import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type AppState =
  | 'IDLE'
  | 'DIALING'
  | 'CALLING_119'
  | 'ANALYZING'
  | 'ALERT_SENT'
  | 'EMERGENCY_ALERT'
  | 'CONFIRMED'
  | 'INTERCEPT_ACTIVE'
  | 'INTERCEPT_CALL'
  | 'AI_CONVERSATION'
  | 'RECALL_ALERT'

export type ScenarioType = 'fire_false_alarm' | 'fall_detected' | 'burglar_false_alarm'

interface AppStateContextType {
  state: AppState
  scenario: ScenarioType
  dialedNumber: string
  setState: (state: AppState) => void
  setScenario: (scenario: ScenarioType) => void
  setDialedNumber: (number: string) => void
  reset: () => void
}

const AppStateContext = createContext<AppStateContextType | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>('IDLE')
  const [scenario, setScenario] = useState<ScenarioType>('fire_false_alarm')
  const [dialedNumber, setDialedNumber] = useState('')

  const setState = useCallback((newState: AppState) => {
    setStateRaw(newState)
  }, [])

  const reset = useCallback(() => {
    setStateRaw('IDLE')
    setDialedNumber('')
  }, [])

  return (
    <AppStateContext.Provider
      value={{ state, scenario, dialedNumber, setState, setScenario, setDialedNumber, reset }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)
  if (!context) throw new Error('useAppState must be used within AppStateProvider')
  return context
}
