import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const API = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api$/, '') : 'https://qyaar-backend.onrender.com'

export default function QRScanPage() {
  const { qrId } = useParams()
  const [loading, setLoading] = useState(true)
  const [qrData, setQrData] = useState(null)
  const [error, setError] = useState(null)
  const [showNotify, setShowNotify] = useState(false)
  const [message, setMessage] = useState('')
  const [senderName, setSenderName] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetchQR()
  }, [qrId])

  const fetchQR = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/qr/${qrId}`)
      const data = await res.json()
      if (data.success) {
        setQrData(data.data)
      } else {
        setError(data.message || 'QR code not found')
      }
    } catch {
      setError('Could not connect to server')
    } finally {
      setLoading(false)
    }
  }

  const sendNotification = async () => {
    if (!message.trim()) { toast.error('Please type a message'); return }
    setSending(true)
    try {
      const res = await fetch(`${API}/api/qr/${qrId}/notify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: message.trim(), senderName: senderName.trim() || 'Anonymous' }),
      })
      const data = await res.json()
      if (data.success) {
        setSent(true)
        toast.success('Owner notified!')
      } else {
        toast.error(data.message || 'Failed to send')
      }
    } catch {
      toast.error('Connection error')
    } finally {
      setSending(false)
    }
  }

  const maskText = (text, show = 3) => {
    if (!text || text.length <= show) return text
    return text.slice(0, show) + '•'.repeat(text.length - show)
  }

  /* ── LOADING ────────────────────────────────── */
  if (loading) {
    return (
      <div style={styles.page}>
        <div style={styles.loadContainer}>
          <div style={{
            width: 64, height: 64, borderRadius: 20,
            background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            marginBottom: 24, animation: 'glow-pulse 2s ease-in-out infinite',
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#073B3A" strokeWidth="2.5" strokeLinecap="round">
              <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
              <rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>
            </svg>
          </div>
          <p style={{ color: 'var(--text-dim)', fontSize: 16, fontWeight: 600 }}>Loading QR details...</p>
        </div>
      </div>
    )
  }

  /* ── ERROR ──────────────────────────────────── */
  if (error) {
    return (
      <div style={styles.page}>
        <div className="anim-fade-up" style={styles.center}>
          <div style={{ ...styles.iconCircle, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/>
            </svg>
          </div>
          <h2 style={styles.heading}>QR Not Found</h2>
          <p style={{ color: 'var(--text-dim)', marginBottom: 32 }}>{error}</p>
          <Link to="/" className="btn btn-primary">← Go Home</Link>
        </div>
      </div>
    )
  }

  /* ── UNUSED QR (Street-sold, not registered) ── */
  if (qrData?.status === 'UNUSED') {
    return (
      <div style={styles.page}>
        <div className="container" style={{ maxWidth: 560, textAlign: 'center' }}>
          <div className="anim-fade-up">
            {/* Animated QR icon */}
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'linear-gradient(135deg, #F59E0B, #D97706)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              boxShadow: '0 8px 32px rgba(245,158,11,0.3)',
              animation: 'float 4s ease-in-out infinite',
            }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/><path d="M14 14h3v3h-3zM18 18h3v3h-3z"/>
              </svg>
            </div>

            <h1 style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 800, color: 'var(--white)', marginBottom: 12 }}>
              Welcome to <span className="gradient-text">Q Yaar!</span>
            </h1>
            <p style={{ fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 40 }}>
              This QR sticker is ready to be activated! Download the Q Yaar app to register it to your vehicle.
            </p>
          </div>

          {/* Steps card */}
          <div className="anim-fade-up delay-2 glass-card" style={{ padding: 32, textAlign: 'left', marginBottom: 24 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>
              Activate in 3 Steps
            </h3>
            {[
              { step: '1', text: 'Download the Q Yaar App', icon: '📱' },
              { step: '2', text: 'Scan this QR from inside the App', icon: '📷' },
              { step: '3', text: 'Enter your vehicle details & done!', icon: '✅' },
            ].map(item => (
              <div key={item.step} style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 0',
                borderBottom: item.step !== '3' ? '1px solid var(--border)' : 'none',
              }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 12,
                  background: 'rgba(94,234,212,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 18, flexShrink: 0,
                }}>{item.icon}</div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* QR ID */}
          <div className="anim-fade-up delay-3" style={{
            background: 'rgba(94,234,212,0.05)', border: '1px solid var(--border)',
            borderRadius: 16, padding: '16px 20px', marginBottom: 32, textAlign: 'center',
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>QR ID</p>
            <p style={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: 'var(--teal)', wordBreak: 'break-all' }}>{qrData.qrId}</p>
          </div>

          {/* Download buttons */}
          <div className="anim-fade-up delay-4" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Download App
            </button>
            <Link to="/" className="btn btn-outline" style={{ flex: 1, justifyContent: 'center', minWidth: 160 }}>
              Learn More
            </Link>
          </div>
        </div>
      </div>
    )
  }

  /* ── USED QR (On someone's car) ─────────────── */
  if (sent) {
    return (
      <div style={styles.page}>
        <div className="container anim-scale-in" style={{ maxWidth: 480, textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, #10B981, #059669)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 24px',
            boxShadow: '0 8px 32px rgba(16,185,129,0.3)',
          }}>
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h2 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: 'var(--white)', marginBottom: 12 }}>
            Owner Notified! ✅
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: 40 }}>
            The vehicle owner has been sent your message. They'll see it in the Q Yaar app.
          </p>
          <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--teal)', marginBottom: 8 }}>Want more features?</p>
            <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 1.7 }}>
              Download Q Yaar to register your own vehicle, track scans, and get instant notifications!
            </p>
          </div>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary">Download Q Yaar App</button>
            <Link to="/" className="btn btn-outline">Visit Homepage</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div className="container" style={{ maxWidth: 560 }}>
        {/* Vehicle Identity Card */}
        <div className="anim-fade-up">
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div style={{
              width: 72, height: 72, borderRadius: 22,
              background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 20px',
              boxShadow: '0 8px 32px var(--teal-glow)',
            }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#073B3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2.7-3.6A2 2 0 0013.7 5H10.3c-.7 0-1.3.3-1.6.9L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2"/>
                <circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/>
              </svg>
            </div>
            <h1 style={{ fontFamily: 'Outfit', fontSize: 28, fontWeight: 800, color: 'var(--white)', marginBottom: 8 }}>
              Vehicle Identified
            </h1>
            <p style={{ fontSize: 15, color: 'var(--text-dim)' }}>
              This QR is registered to a vehicle on Q Yaar.
            </p>
          </div>
        </div>

        {/* Vehicle Card */}
        <div className="anim-fade-up delay-2 glass-card" style={{ overflow: 'hidden', marginBottom: 20 }}>
          {/* Status bar */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(94,234,212,0.08), rgba(94,234,212,0.02))',
            padding: '14px 24px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981' }} />
                <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: '#10B981', animation: 'pulse-ring 2s ease-out infinite' }} />
              </div>
              <span style={{ fontSize: 12, fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: 2 }}>Active Profile</span>
            </div>
            {qrData.scanCount > 0 && (
              <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.05)', padding: '4px 12px', borderRadius: 100 }}>
                Scanned {qrData.scanCount}×
              </span>
            )}
          </div>

          <div style={{ padding: 28 }}>
            {/* Vehicle Number */}
            <div style={{
              background: 'var(--darker)', borderRadius: 16,
              padding: 24, textAlign: 'center', marginBottom: 20,
              border: '1px solid var(--border)',
            }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>License Plate</p>
              <p style={{ fontFamily: 'Outfit', fontSize: 32, fontWeight: 900, color: 'var(--white)', letterSpacing: 4 }}>
                {maskText(qrData.vehicleData?.vehicleNumber, 5)}
              </p>
            </div>

            {/* Details grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 14, padding: 18, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Owner</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{maskText(qrData.vehicleData?.ownerName, 3)}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 14, padding: 18, border: '1px solid var(--border)' }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Model</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--text)' }}>{qrData.vehicleData?.model || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Notify Owner Button / Form */}
        {!showNotify ? (
          <div className="anim-fade-up delay-3">
            <button onClick={() => setShowNotify(true)} className="btn btn-primary" style={{
              width: '100%', justifyContent: 'center', padding: '18px 32px', fontSize: 16,
              borderRadius: 20, marginBottom: 16,
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              🔔 Notify Vehicle Owner
            </button>
            <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)' }}>
              Wrong parking? Lights on? Emergency? Let the owner know.
            </p>
          </div>
        ) : (
          <div className="anim-fade-up glass-card" style={{ padding: 28, marginBottom: 16 }}>
            <h3 style={{ fontFamily: 'Outfit', fontSize: 18, fontWeight: 700, color: 'var(--white)', marginBottom: 20 }}>
              Send a Message to the Owner
            </h3>

            {/* Quick messages */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {['🚗 Your car is blocking', '💡 Headlights are on', '🚨 Emergency contact needed', '🅿️ Wrong parking zone'].map(m => (
                <button key={m} onClick={() => setMessage(m)} style={{
                  background: message === m ? 'rgba(94,234,212,0.15)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${message === m ? 'var(--teal)' : 'var(--border)'}`,
                  borderRadius: 10, padding: '8px 14px', fontSize: 13, fontWeight: 600,
                  color: message === m ? 'var(--teal)' : 'var(--text-dim)',
                  cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}>{m}</button>
              ))}
            </div>

            <textarea
              value={message} onChange={e => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={3}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', borderRadius: 14,
                padding: '14px 18px', fontSize: 15, color: 'var(--text)',
                fontFamily: 'Inter, sans-serif', resize: 'vertical',
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--teal)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />

            <input
              type="text" value={senderName} onChange={e => setSenderName(e.target.value)}
              placeholder="Your name (optional)"
              style={{
                width: '100%', background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--border)', borderRadius: 14,
                padding: '14px 18px', fontSize: 14, color: 'var(--text)',
                fontFamily: 'Inter, sans-serif', marginTop: 12,
                outline: 'none', transition: 'border-color 0.2s',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--teal)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
            />

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <button onClick={sendNotification} disabled={sending} className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center', opacity: sending ? 0.6 : 1 }}>
                {sending ? 'Sending...' : '🔔 Send Notification'}
              </button>
              <button onClick={() => setShowNotify(false)} className="btn btn-outline" style={{ padding: '14px 20px' }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Download CTA */}
        <div className="anim-fade-up delay-5" style={{
          background: 'linear-gradient(135deg, #073B3A, #0A4D4A)',
          borderRadius: 20, padding: 24, marginTop: 24,
          display: 'flex', alignItems: 'center', gap: 20,
          border: '1px solid rgba(94,234,212,0.12)',
        }}>
          <div style={{
            width: 52, height: 52, borderRadius: 16,
            background: 'rgba(94,234,212,0.15)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            border: '1px solid rgba(94,234,212,0.2)',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round">
              <rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/>
            </svg>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 16, fontWeight: 800, color: 'white', marginBottom: 4 }}>Want Q Yaar for your vehicle?</p>
            <p style={{ fontSize: 13, color: 'rgba(94,234,212,0.8)' }}>Download the app & get your own smart QR!</p>
          </div>
        </div>

        <Link to="/" style={{
          display: 'block', textAlign: 'center', marginTop: 32,
          fontSize: 14, fontWeight: 600, color: 'var(--teal)',
        }}>← Visit Q Yaar Homepage</Link>
      </div>
    </div>
  )
}

const styles = {
  page: {
    minHeight: '100vh', display: 'flex', alignItems: 'center',
    justifyContent: 'center', paddingTop: 100, paddingBottom: 60,
  },
  loadContainer: {
    textAlign: 'center',
  },
  center: {
    textAlign: 'center', maxWidth: 400, margin: '0 auto',
  },
  iconCircle: {
    width: 64, height: 64, borderRadius: 20,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    margin: '0 auto 20px',
  },
  heading: {
    fontFamily: 'Outfit', fontSize: 24, fontWeight: 800,
    color: 'var(--white)', marginBottom: 12,
  },
}
