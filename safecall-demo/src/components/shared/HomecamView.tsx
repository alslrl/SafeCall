const STATUS_MAP = {
  normal: { text: '정상', emoji: '🟢', color: '#34c759' },
  fire: { text: '수증기 감지', emoji: '🔥', color: '#f59e0b' },
  fall: { text: '낙상 감지', emoji: '⚠️', color: '#ef4444' },
  burglar: { text: '움직임 감지', emoji: '🚨', color: '#8b5cf6' },
}

type CamMode = 'normal' | 'fire' | 'fall' | 'burglar'

export default function HomecamView({ mode = 'normal' }: { mode?: CamMode }) {
  const status = STATUS_MAP[mode]

  return (
    <div className="homecam-container">
      <div className="homecam-placeholder">
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>📹</div>
          <div style={{ fontSize: 13, color: '#888' }}>홈캠 영상</div>
          <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
            (Veo 영상 준비 후 재생)
          </div>
        </div>
      </div>
      <div className="homecam-overlay">
        <span className="homecam-badge badge-live">LIVE</span>
        <span
          className="homecam-badge badge-status"
          style={{ borderLeft: `3px solid ${status.color}` }}
        >
          {status.emoji} {status.text}
        </span>
      </div>
    </div>
  )
}
