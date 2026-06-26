import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div style={{
      minHeight: 'calc(100vh - 160px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '60px 20px',
      textAlign: 'center',
      background: 'linear-gradient(180deg, #040F0F 0%, #0A1A19 100%)',
    }}>
      {/* 404 Icon */}
      <div style={{
        width: 90, height: 90, borderRadius: '50%',
        background: 'rgba(239,68,68,0.08)',
        border: '2px solid rgba(239,68,68,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 28, fontSize: 40,
      }}>
        🚫
      </div>

      <h1 style={{
        fontSize: '2.2rem', fontWeight: 800,
        color: '#F1F5F9', marginBottom: 12,
        fontFamily: "'Space Grotesk', sans-serif",
      }}>
        Page Not Found
      </h1>

      <p style={{
        color: '#94A3B8', fontSize: '1.05rem',
        maxWidth: 440, marginBottom: 36, lineHeight: 1.7,
      }}>
        Oops! The page you're looking for doesn't exist. It might have been removed or the URL is incorrect.
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '14px 32px', borderRadius: 14,
          background: 'linear-gradient(135deg, #5EEAD4, #2DD4BF)',
          color: '#073B3A', fontWeight: 700, fontSize: '0.95rem',
          textDecoration: 'none',
          boxShadow: '0 4px 20px rgba(94,234,212,0.3)',
          transition: 'transform 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 8px 30px rgba(94,234,212,0.4)'; }}
          onMouseLeave={e => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 20px rgba(94,234,212,0.3)'; }}
        >
          ← Go Home
        </Link>

        <a href="https://qyaar-qr.vercel.app/" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '14px 32px', borderRadius: 14,
          background: 'transparent',
          color: '#5EEAD4', fontWeight: 700, fontSize: '0.95rem',
          textDecoration: 'none',
          border: '1.5px solid rgba(94,234,212,0.3)',
          transition: 'border-color 0.2s, background 0.2s',
        }}
          onMouseEnter={e => { e.target.style.borderColor = 'rgba(94,234,212,0.6)'; e.target.style.background = 'rgba(94,234,212,0.05)'; }}
          onMouseLeave={e => { e.target.style.borderColor = 'rgba(94,234,212,0.3)'; e.target.style.background = 'transparent'; }}
        >
          Get QR →
        </a>
      </div>
    </div>
  )
}
