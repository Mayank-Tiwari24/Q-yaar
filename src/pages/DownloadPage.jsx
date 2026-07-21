import { useState } from 'react'
import { Link } from 'react-router-dom'

// APK served from website's own public folder — direct download, no redirects
const APK_FILE_PATH = '/Q-Yaar-v1.0.0.apk'
const APK_VERSION = '1.0.0'
const APK_SIZE = '~93 MB'

export default function DownloadPage() {
  const [clicked, setClicked] = useState(false)

  const handleDownload = () => {
    setClicked(true)
    // Direct download via anchor with download attribute (same-origin = instant)
    const a = document.createElement('a')
    a.href = APK_FILE_PATH
    a.download = 'Q-Yaar.apk'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      paddingTop: 100, paddingBottom: 60, position: 'relative',
    }}>
      {/* Background effects */}
      <div className="bg-grid" />
      <div className="bg-glow-tl" />
      <div className="bg-glow-br" style={{ top: '60%', right: '-5%' }} />

      <div className="container" style={{ maxWidth: 560, textAlign: 'center', position: 'relative', zIndex: 1 }}>
        
        {/* App Icon */}
        <div className="anim-scale-in" style={{
          width: 100, height: 100, borderRadius: 28,
          background: 'linear-gradient(135deg, #5EEAD4, #2DD4AA)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 32px',
          boxShadow: '0 12px 40px rgba(94,234,212,0.35)',
          animation: 'float 4s ease-in-out infinite',
        }}>
          <span style={{ fontSize: 40, fontWeight: 900, color: '#073B3A' }}>Q</span>
        </div>

        {/* Title */}
        <h1 className="anim-fade-up" style={{
          fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)',
          fontWeight: 800, color: 'var(--white)', marginBottom: 12,
        }}>
          Download <span className="gradient-text">Q Yaar</span>
        </h1>

        <p className="anim-fade-up delay-1" style={{
          fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.7,
          maxWidth: 420, margin: '0 auto 40px',
        }}>
          Your vehicle's digital identity. Get instant notifications when someone scans your QR.
        </p>

        {/* Main Download Button */}
        <div className="anim-fade-up delay-2" style={{ marginBottom: 32 }}>
          {!clicked ? (
            <button onClick={handleDownload} className="btn btn-primary" style={{
              width: '100%', justifyContent: 'center', padding: '20px 32px',
              fontSize: 18, borderRadius: 20,
              boxShadow: '0 8px 32px rgba(94,234,212,0.3)',
            }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download APK ({APK_SIZE})
            </button>
          ) : (
            <div className="glass-card" style={{
              padding: 28, border: '1px solid rgba(16,185,129,0.3)',
            }}>
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                gap: 12, marginBottom: 16,
              }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: '#10B981',
                  boxShadow: '0 0 12px rgba(16,185,129,0.5)',
                  animation: 'pulse-ring 1.5s ease-out infinite',
                }} />
                <span style={{ fontSize: 16, fontWeight: 700, color: '#10B981' }}>
                  Download Started! ✅
                </span>
              </div>

              {/* Progress animation */}
              <div style={{
                width: '100%', height: 6, borderRadius: 10,
                background: 'rgba(94,234,212,0.1)', overflow: 'hidden', marginBottom: 16,
              }}>
                <div style={{
                  height: '100%', borderRadius: 10,
                  background: 'linear-gradient(90deg, #5EEAD4, #2DD4BF)',
                  animation: 'progress-bar 3s ease-out forwards',
                }} />
              </div>

              <p style={{ fontSize: 14, color: 'var(--text-dim)', marginBottom: 16 }}>
                Check your downloads folder. If it didn't start, tap below.
              </p>

              <button onClick={handleDownload} className="btn btn-outline"
                style={{ justifyContent: 'center', width: '100%' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Again
              </button>
            </div>
          )}
        </div>

        {/* App Info Card */}
        <div className="anim-fade-up delay-3 glass-card" style={{ padding: 24, marginBottom: 28 }}>
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          }}>
            {[
              { label: 'Version', value: `v${APK_VERSION}` },
              { label: 'Size', value: APK_SIZE },
              { label: 'Platform', value: 'Android' },
            ].map(item => (
              <div key={item.label}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 4 }}>
                  {item.label}
                </p>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="anim-fade-up delay-4 glass-card" style={{ padding: 28, textAlign: 'left', marginBottom: 28 }}>
          <h3 style={{
            fontSize: 13, fontWeight: 700, color: 'var(--teal)',
            textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20,
          }}>
            📱 Installation Steps
          </h3>
          {[
            { step: '1', text: 'Allow "Install from unknown sources" in Settings', icon: '⚙️' },
            { step: '2', text: 'Open the downloaded APK file', icon: '📂' },
            { step: '3', text: 'Tap "Install" and wait for it to finish', icon: '✅' },
            { step: '4', text: 'Open Q Yaar & register your vehicle!', icon: '🚗' },
          ].map(item => (
            <div key={item.step} style={{
              display: 'flex', alignItems: 'center', gap: 16,
              padding: '12px 0',
              borderBottom: item.step !== '4' ? '1px solid var(--border)' : 'none',
            }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'rgba(94,234,212,0.08)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, flexShrink: 0,
              }}>{item.icon}</div>
              <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', lineHeight: 1.5 }}>{item.text}</p>
            </div>
          ))}
        </div>

        {/* iOS Notice */}
        <div className="anim-fade-up delay-5" style={{
          background: 'rgba(245,158,11,0.06)',
          border: '1px solid rgba(245,158,11,0.15)',
          borderRadius: 16, padding: '16px 20px', marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 20 }}>🍎</span>
          <p style={{ fontSize: 13, color: '#F59E0B', lineHeight: 1.6 }}>
            <strong>iOS users:</strong> App Store version coming soon! Stay tuned.
          </p>
        </div>

        {/* Back link */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 14, fontWeight: 600, color: 'var(--teal)',
          textDecoration: 'none', transition: 'opacity 0.2s',
        }}
          onMouseEnter={e => e.target.style.opacity = 0.7}
          onMouseLeave={e => e.target.style.opacity = 1}
        >
          ← Back to Homepage
        </Link>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes progress-bar {
          0% { width: 0%; }
          30% { width: 45%; }
          60% { width: 75%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
