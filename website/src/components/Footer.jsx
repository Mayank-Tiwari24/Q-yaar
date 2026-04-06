import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, var(--bg) 0%, #020807 100%)',
      borderTop: '1px solid var(--border)',
      padding: '80px 0 40px', position: 'relative',
    }}>
      <div className="bg-glow-br" />
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 48, marginBottom: 60,
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: 'linear-gradient(135deg, #5EEAD4, #2DD4AA)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#073B3A' }}>Q</span>
              </div>
              <span style={{ fontFamily: 'Outfit', fontSize: 20, fontWeight: 800, color: 'var(--teal)' }}>Q Yaar</span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: 260 }}>
              Your vehicle's digital identity. Smart QR system for instant contact and vehicle protection.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Quick Links</h4>
            {['How It Works', 'Features', 'Pricing', 'About Us'].map(item => (
              <a key={item} href={`/#${item.toLowerCase().replace(/ /g,'-')}`}
                style={{ display: 'block', fontSize: 14, color: 'var(--text-dim)', padding: '6px 0', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#5EEAD4'}
                onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
              >{item}</a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Contact</h4>
            <p style={{ fontSize: 14, color: 'var(--text-dim)', lineHeight: 2 }}>
              📧 support@qyaar.in<br />
              📱 +91-XXXXX-XXXXX<br />
              📍 India
            </p>
          </div>

          {/* Download */}
          <div>
            <h4 style={{ fontSize: 13, fontWeight: 700, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>Get The App</h4>
            <button className="btn btn-outline" style={{ padding: '10px 20px', fontSize: 13, width: '100%', justifyContent: 'center' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.523 2.242l-4.106 7.164 4.42 4.867 3.2-5.58c.97-1.692-.242-3.81-2.167-3.81h-1.347zM12.005 10.788L7.16 2.242H3.514c-1.925 0-3.137 2.118-2.167 3.81L7.586 16.07l4.419-5.282zM7.927 17.07L12 23.758l4.073-6.688H7.927z"/></svg>
              Google Play
            </button>
            <button className="btn btn-outline" style={{ padding: '10px 20px', fontSize: 13, width: '100%', justifyContent: 'center', marginTop: 8 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              App Store
            </button>
          </div>
        </div>

        {/* Bottom Bar */}
        <div style={{
          borderTop: '1px solid var(--border)', paddingTop: 24,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 16,
        }}>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            © {new Date().getFullYear()} Q Yaar. All rights reserved.
          </p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Privacy Policy', 'Terms of Service'].map(item => (
              <a key={item} href="#" style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = '#5EEAD4'}
                onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}
              >{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
