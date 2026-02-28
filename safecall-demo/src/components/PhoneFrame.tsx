import type { ReactNode } from 'react'

interface PhoneFrameProps {
  label: string
  children: ReactNode
  statusBarBg?: string
}

export default function PhoneFrame({ label, children, statusBarBg = '#fff' }: PhoneFrameProps) {
  return (
    <div className="phone-outer">
      <div className="phone-frame">
        {/* 상태바 + Dynamic Island */}
        <div className="phone-status-bar" style={{ background: statusBarBg }}>
          <div className="status-bar-left">
            <span className="status-time">11:50</span>
          </div>
          <div className="dynamic-island" />
          <div className="status-bar-right">
            <span className="material-symbols-outlined status-bar-icon">signal_cellular_alt</span>
            <span className="material-symbols-outlined status-bar-icon">wifi</span>
            <span className="material-symbols-outlined status-bar-icon status-bar-battery">battery_5_bar</span>
          </div>
        </div>
        <div className="phone-screen">
          {children}
        </div>
        <div className="phone-home-bar" />
      </div>
      <div className="phone-label">{label}</div>
    </div>
  )
}
