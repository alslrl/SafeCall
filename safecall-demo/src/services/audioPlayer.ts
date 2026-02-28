let audioContext: AudioContext | null = null
let currentSource: AudioBufferSourceNode | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext({ sampleRate: 24000 })
  }
  return audioContext
}

export async function playPCMAudio(pcmData: ArrayBuffer): Promise<void> {
  const ctx = getAudioContext()

  // PCM 16-bit signed → Float32
  const int16 = new Int16Array(pcmData)
  const float32 = new Float32Array(int16.length)
  for (let i = 0; i < int16.length; i++) {
    float32[i] = int16[i] / 32768
  }

  const buffer = ctx.createBuffer(1, float32.length, 24000)
  buffer.getChannelData(0).set(float32)

  // 이전 재생 중지
  stopAudio()

  const source = ctx.createBufferSource()
  source.buffer = buffer
  source.connect(ctx.destination)
  currentSource = source
  source.start()

  return new Promise<void>((resolve) => {
    source.onended = () => {
      if (currentSource === source) currentSource = null
      resolve()
    }
  })
}

export function stopAudio(): void {
  if (currentSource) {
    try { currentSource.stop() } catch { /* already stopped */ }
    currentSource = null
  }
}
