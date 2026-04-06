import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const scrollTo = (id) => {
    if (!isHome) { window.location.href = '/#' + id; return }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMenuOpen(false)
  }

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: scrolled ? 'rgba(5,13,12,0.85)' : 'transparent',
      backdropFilter: scrolled ? 'blur(20px) saturate(180%)' : 'none',
      borderBottom: scrolled ? '1px solid rgba(94,234,212,0.08)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <div style={{
        maxWidth: 1200, margin: '0 auto', padding: '0 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: scrolled ? 64 : 80, transition: 'height 0.3s ease',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'linear-gradient(135deg, #5EEAD4, #2DD4AA)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(94,234,212,0.3)',
          }}>
            <span style={{ fontSize: 18, fontWeight: 900, color: '#073B3A' }}>Q</span>
          </div>
          <span style={{
            fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800,
            background: 'linear-gradient(135deg, #5EEAD4, #A7F3D0)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>Q Yaar</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hide-mobile" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {[
            { label: 'How It Works', id: 'how-it-works' },
            { label: 'Features', id: 'features' },
            { label: 'Pricing', id: 'pricing' },
            { label: 'About', id: 'about' },
          ].map(item => (
            <button key={item.id} onClick={() => scrollTo(item.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-dim)', fontSize: 14, fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
              padding: '8px 16px', borderRadius: 10,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.target.style.color = '#5EEAD4'; e.target.style.background = 'rgba(94,234,212,0.08)' }}
            onMouseLeave={e => { e.target.style.color = 'var(--text-dim)'; e.target.style.background = 'none' }}
            >{item.label}</button>
          ))}
          <button className="btn btn-primary" style={{ padding: '10px 24px', fontSize: 13, marginLeft: 8 }}
            onClick={() => scrollTo('download')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download App
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)}
          style={{
            display: 'none', background: 'none', border: 'none', cursor: 'pointer',
            padding: 8, color: 'var(--teal)',
          }}
          className="mobile-menu-btn"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            {menuOpen
              ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
              : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>
            }
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(5,13,12,0.95)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px 24px', display: 'flex', flexDirection: 'column', gap: 4,
          animation: 'fadeUp 0.3s ease',
        }}>
          {['how-it-works', 'features', 'pricing', 'about'].map(id => (
            <button key={id} onClick={() => scrollTo(id)} style={{
              background: 'none', border: 'none', color: 'var(--text)',
              fontSize: 16, fontWeight: 600, padding: '12px 16px',
              textAlign: 'left', borderRadius: 12, cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
            }}>{id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</button>
          ))}
          <button className="btn btn-primary" style={{ marginTop: 8, justifyContent: 'center' }}
            onClick={() => scrollTo('download')}>Download App</button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .mobile-menu-btn { display: block !important; }
        }
      `}</style>
    </nav>
  )
}
