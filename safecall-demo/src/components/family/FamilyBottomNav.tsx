interface FamilyBottomNavProps {
  active: 'home' | 'alert' | 'settings'
}

export default function FamilyBottomNav({ active }: FamilyBottomNavProps) {
  return (
    <div className="family-bottom-nav">
      <div className={`family-nav-item ${active === 'home' ? 'active' : ''}`}>
        <span className="material-symbols-outlined family-nav-icon">home</span>
        <span className="family-nav-label">홈</span>
      </div>
      <div className={`family-nav-item ${active === 'alert' ? 'active' : ''}`}>
        <span className="material-symbols-outlined family-nav-icon">notifications</span>
        <span className="family-nav-label">알림</span>
      </div>
      <div className={`family-nav-item ${active === 'settings' ? 'active' : ''}`}>
        <span className="material-symbols-outlined family-nav-icon">settings</span>
        <span className="family-nav-label">설정</span>
      </div>
    </div>
  )
}
