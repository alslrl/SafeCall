const VIDEO_MAP: Record<string, string> = {
  normal: '/videos/homecam-normal.mp4',
  fire: '/videos/scenario-fire.mp4',
  fall: '/videos/scenario-fall.mp4',
  burglar: '/videos/scenario-burglar.mp4',
}

type CamMode = 'normal' | 'fire' | 'fall' | 'burglar'

export default function HomecamView({ mode = 'normal' }: { mode?: CamMode }) {
  const videoSrc = VIDEO_MAP[mode]

  return (
    <div className="homecam-container">
      {videoSrc ? (
        <video
          className="homecam-video"
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
        />
      ) : (
        <div className="homecam-placeholder">
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>📹</div>
            <div style={{ fontSize: 13, color: '#888' }}>홈캠 영상</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              (Veo 영상 준비 후 재생)
            </div>
          </div>
        </div>
      )}
      <div className="homecam-overlay">
        <span className="homecam-live-dot" />
        <span className="homecam-live-text">LIVE</span>
      </div>
    </div>
  )
}
