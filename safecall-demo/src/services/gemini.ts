import { GoogleGenAI } from '@google/genai'
import type { ScenarioType } from '../context/AppStateContext'

// ── 타입 정의 ──

export interface AnalysisResult {
  category: string
  confidence: number
  isFalseAlarm: boolean
  findings: { emoji: string; text: string }[]
  reasoning: string
  recommendedAction: string
}

// ── 시나리오별 영상 매핑 ──

const SCENARIO_VIDEO_MAP: Record<ScenarioType, string> = {
  fire_false_alarm: '/videos/scenario-fire.mp4',
  fall_detected: '/videos/scenario-fall.mp4',
  burglar_false_alarm: '/videos/scenario-burglar.mp4',
}

// ── 영상 → Base64 변환 (브라우저) ──

async function fetchVideoAsBase64(videoPath: string): Promise<string> {
  const response = await fetch(videoPath)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      const base64 = result.split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

// ── 시스템 프롬프트 ──

const SYSTEM_PROMPT = `당신은 SafeCall AI 상황 분석 시스템입니다. 치매/인지장애 어르신이 긴급전화(119/112)를 걸었을 때, 가정 내 홈캠 영상과 어르신의 상황 설명을 종합 분석하여 실제 응급 상황인지 판단합니다.

분석 기준:
1. 홈캠 영상에서 실제 위험 징후를 확인하세요 (화재, 연기, 쓰러진 사람, 침입자 등)
2. 어르신의 음성/텍스트 설명과 영상 상황을 교차 검증하세요
3. 치매 환자의 특성을 고려하세요: 환각, 망상, 오인 가능성이 높습니다
4. 실제 응급(낙상 등)과 오인/망상을 구분하세요

판단 카테고리:
- "화재 오인": 수증기/김/조리 연기를 화재로 오인한 경우
- "낙상 감지": 실제로 사람이 바닥에 쓰러져 있는 경우 (실제 응급)
- "침입 오인": 거울에 비친 자신이나 TV 속 인물을 보고 침입자로 오인한 경우 (치매 환각/망상)

응답 규칙:
- confidence는 0~100 사이의 정수로 판단 확신도를 표시
- isFalseAlarm은 오인/망상인 경우 true, 실제 응급인 경우 false
- findings 배열에는 2~4개의 핵심 발견사항을 이모지와 함께 제공
- reasoning에 판단 근거를 1~2문장으로 설명
- recommendedAction에 가족에게 권장하는 조치를 제공
- 모든 텍스트는 한국어로 작성`

// ── JSON 응답 스키마 ──

const ANALYSIS_RESPONSE_SCHEMA = {
  type: 'object' as const,
  properties: {
    category: {
      type: 'string' as const,
      description: '분석 카테고리 (예: 화재 오인, 낙상 감지, 침입 오인)',
    },
    confidence: {
      type: 'number' as const,
      description: '판단 확신도 (0-100)',
    },
    isFalseAlarm: {
      type: 'boolean' as const,
      description: '오인/망상이면 true, 실제 응급이면 false',
    },
    findings: {
      type: 'array' as const,
      items: {
        type: 'object' as const,
        properties: {
          emoji: { type: 'string' as const, description: '상태를 나타내는 이모지' },
          text: { type: 'string' as const, description: '발견사항 설명' },
        },
        required: ['emoji', 'text'],
      },
      description: '핵심 발견사항 목록 (2-4개)',
    },
    reasoning: {
      type: 'string' as const,
      description: '판단 근거 설명 (1-2문장)',
    },
    recommendedAction: {
      type: 'string' as const,
      description: '가족에게 권장하는 조치',
    },
  },
  required: ['category', 'confidence', 'isFalseAlarm', 'findings', 'reasoning', 'recommendedAction'],
}

// ── 메인 분석 함수 ──

export async function analyzeScenario(
  scenario: ScenarioType,
  callerMessage: string,
): Promise<AnalysisResult> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('Gemini API key not configured')
  }

  const ai = new GoogleGenAI({ apiKey })

  const videoPath = SCENARIO_VIDEO_MAP[scenario]
  const videoBase64 = await fetchVideoAsBase64(videoPath)

  const callNumber = scenario === 'burglar_false_alarm' ? '112' : '119'
  const userText = `어르신이 ${callNumber}에 전화했습니다.

어르신의 상황 설명: "${callerMessage}"

위 홈캠 영상을 분석하여 실제 응급 상황인지 판단해주세요.`

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: 'application/json',
      responseSchema: ANALYSIS_RESPONSE_SCHEMA,
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: 'video/mp4',
              data: videoBase64,
            },
          },
          { text: userText },
        ],
      },
    ],
  })

  const text = response.text
  if (!text) throw new Error('Empty response from Gemini')
  return JSON.parse(text) as AnalysisResult
}

// ── TTS 음성 생성 ──

export async function generateTTS(text: string): Promise<ArrayBuffer> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY
  if (!apiKey || apiKey === 'your_api_key_here') {
    throw new Error('Gemini API key not configured')
  }

  const ai = new GoogleGenAI({ apiKey })

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-preview-tts',
    contents: [{ parts: [{ text: `따뜻하고 차분한 목소리로 말해주세요: ${text}` }] }],
    config: {
      responseModalities: ['AUDIO'],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Kore' },
        },
      },
    },
  })

  const data = (response as any).candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
  if (!data) throw new Error('No audio data in TTS response')

  // base64 → ArrayBuffer
  const binaryString = atob(data)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }
  return bytes.buffer
}

// ── Fallback 결과 (API 실패 시) ──

export function getFallbackResult(scenario: ScenarioType): AnalysisResult {
  const FALLBACK_RESULTS: Record<ScenarioType, AnalysisResult> = {
    fire_false_alarm: {
      category: '화재 오인',
      confidence: 95,
      isFalseAlarm: true,
      findings: [
        { emoji: '🟢', text: '수증기 감지 — 조리 중 발생한 김으로 확인' },
        { emoji: '❌', text: '화재 징후 없음 — 열원/불꽃 미감지' },
      ],
      reasoning: '부엌 홈캠에서 수증기가 감지되었으나, 실제 화재 징후(불꽃, 연기 확산)는 확인되지 않았습니다.',
      recommendedAction: '오인으로 판단됩니다. 어르신에게 안심 전달을 권장합니다.',
    },
    fall_detected: {
      category: '낙상 감지',
      confidence: 94,
      isFalseAlarm: false,
      findings: [
        { emoji: '🔴', text: '바닥에 누운 사람 감지' },
        { emoji: '❌', text: '정상 활동 아님 — 움직임 감소 확인' },
      ],
      reasoning: '거실 홈캠에서 바닥에 누워있는 사람이 감지되었으며, 정상적인 활동 패턴이 아닌 것으로 판단됩니다.',
      recommendedAction: '실제 응급 상황으로 판단됩니다. 즉시 확인이 필요합니다.',
    },
    burglar_false_alarm: {
      category: '침입 오인',
      confidence: 95,
      isFalseAlarm: true,
      findings: [
        { emoji: '🟢', text: '침입 흔적 없음 — 문/창문 정상' },
        { emoji: '📺', text: 'TV 화면 또는 거울 반사 감지' },
        { emoji: '❌', text: '외부 침입자 미확인 — 오인 가능성 높음' },
      ],
      reasoning: '홈캠에서 침입 흔적이 없으며, 거울에 비친 본인 또는 TV 속 인물을 침입자로 오인한 것으로 판단됩니다.',
      recommendedAction: '오인으로 판단됩니다. 어르신에게 안심 전달을 권장합니다.',
    },
  }
  return FALLBACK_RESULTS[scenario]
}
