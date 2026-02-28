import type { ReactNode } from 'react'

interface PhoneFrameProps {
  label: string
  children: ReactNode
}

export default function PhoneFrame({ label, children }: PhoneFrameProps) {
  return (
    <div className="phone-outer">
      <div className="phone-frame">
        <div className="phone-notch" />
        <div className="phone-screen">
          {children}
        </div>
        <div className="phone-home-bar" />
      </div>
      <div className="phone-label">{label}</div>
    </div>
  )
}
