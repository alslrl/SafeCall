import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import type { AnalysisResult } from '../services/gemini'

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

export type { AnalysisResult }

interface AppStateContextType {
  state: AppState
  scenario: ScenarioType
  dialedNumber: string
  analysisResult: AnalysisResult | null
  isAnalyzing: boolean
  setState: (state: AppState) => void
  setScenario: (scenario: ScenarioType) => void
  setDialedNumber: (number: string) => void
  setAnalysisResult: (result: AnalysisResult | null) => void
  setIsAnalyzing: (analyzing: boolean) => void
  reset: () => void
}

const AppStateContext = createContext<AppStateContextType | null>(null)

export function AppStateProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<AppState>('IDLE')
  const [scenario, setScenario] = useState<ScenarioType>('fire_false_alarm')
  const [dialedNumber, setDialedNumber] = useState('')
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const setState = useCallback((newState: AppState) => {
    setStateRaw(newState)
  }, [])

  const reset = useCallback(() => {
    setStateRaw('IDLE')
    setDialedNumber('')
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }, [])

  return (
    <AppStateContext.Provider
      value={{ state, scenario, dialedNumber, analysisResult, isAnalyzing, setState, setScenario, setDialedNumber, setAnalysisResult, setIsAnalyzing, reset }}
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
