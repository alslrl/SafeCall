import { Page } from 'framework7-react'
import { useState, useCallback } from 'react'
import { useAppState } from '../../context/AppStateContext'

const KEYS = [
  { num: '1', letters: '' },
  { num: '2', letters: 'ABC' },
  { num: '3', letters: 'DEF' },
  { num: '4', letters: 'GHI' },
  { num: '5', letters: 'JKL' },
  { num: '6', letters: 'MNO' },
  { num: '7', letters: 'PQRS' },
  { num: '8', letters: 'TUV' },
  { num: '9', letters: 'WXYZ' },
  { num: '*', letters: '' },
  { num: '0', letters: '+' },
  { num: '#', letters: '' },
]

export default function DialerPage({ f7router }: { f7router: any }) {
  const [number, setNumber] = useState('')
  const { state, setState } = useAppState()

  const handleKey = useCallback((key: string) => {
    setNumber(prev => prev + key)
  }, [])

  const handleBackspace = useCallback(() => {
    setNumber(prev => prev.slice(0, -1))
  }, [])

  const handleCall = useCallback(() => {
    if (number === '119' || number === '112') {
      setState('CALLING_119')
      if (state === 'INTERCEPT_ACTIVE') {
        setState('INTERCEPT_CALL')
        f7router.navigate('/intercept/')
      } else {
        f7router.navigate('/call/')
      }
      setNumber('')
    }
  }, [number, state, setState, f7router])

  return (
    <Page noNavbar className="dialer-page">
      <div className="dialer-content">
        {/* 번호 표시 */}
        <div className="dialer-display">
          <div className="dialer-display-side" />
          <span className={`dialer-number ${number ? '' : 'empty'}`}>
            {number}
          </span>
          <div className="dialer-display-side">
            {number && (
              <button className="dialer-add-contact">
                <svg viewBox="0 0 24 24" width="26" height="26">
                  <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#007AFF"/>
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* 키패드 */}
        <div className="keypad">
          {KEYS.map(({ num, letters }) => (
            <button
              key={num}
              className={`key-button ${num === '*' || num === '#' ? 'special' : ''}`}
              onClick={() => handleKey(num)}
            >
              <span className="key-number">{num}</span>
              {letters && <span className="key-letters">{letters}</span>}
            </button>
          ))}
        </div>

        {/* 통화 버튼 + 백스페이스 */}
        <div className="call-row">
          <div className="call-row-spacer" />
          <button className="call-button" onClick={handleCall}>
            <svg viewBox="0 0 24 24">
              <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
            </svg>
          </button>
          <div className="call-row-side">
            {number.length > 0 && (
              <button className="backspace-button" onClick={handleBackspace}>
                <svg width="33" height="24" viewBox="0 0 44 32" fill="none">
                  <path d="M12 0H40C42.2091 0 44 1.79086 44 4V28C44 30.2091 42.2091 32 40 32H12C10.643 32 9.37322 31.336 8.61803 30.2033L1.28456 19.2033C-0.428187 16.6343 -0.428187 15.3657 1.28456 12.7967L8.61803 1.7967C9.37322 0.663996 10.643 0 12 0Z" fill="#C7C7CC"/>
                  <path d="M19 10L29 20M29 10L19 20" stroke="#000" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 (pill 스타일) */}
      <div className="dialer-bottom-nav">
        <div className="nav-pill">
          <button className="nav-pill-item">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            <span>통화</span>
          </button>
          <button className="nav-pill-item">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
            </svg>
            <span>연락처</span>
          </button>
          <button className="nav-pill-item active">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="5" r="2"/><circle cx="12" cy="5" r="2"/><circle cx="19" cy="5" r="2"/>
              <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
              <circle cx="5" cy="19" r="2"/><circle cx="12" cy="19" r="2"/><circle cx="19" cy="19" r="2"/>
            </svg>
            <span>키패드</span>
          </button>
        </div>
        <button className="nav-search-btn">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
        </button>
      </div>
    </Page>
  )
}
