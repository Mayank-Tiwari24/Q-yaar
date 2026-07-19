import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
    const location = useLocation();
    const isQRPage = location.pathname.startsWith('/qr/');

    return (
        <nav style={{
            position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
            background: 'rgba(10,26,25,0.85)',
            backdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(94,234,212,0.06)',
        }}>
            <div style={{
                maxWidth: 1000, margin: '0 auto',
                padding: '0 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 64,
            }}>
                {/* Logo */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                    <div style={{
                        width: 40, height: 40, borderRadius: 14,
                        background: 'linear-gradient(135deg, #5EEAD4, #0D6B5E)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px rgba(94,234,212,0.2)',
                        transition: 'box-shadow 0.3s',
                    }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#073B3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <rect x="14" y="14" width="3" height="3" rx="0.5" />
                            <rect x="18" y="18" width="3" height="3" rx="0.5" />
                            <rect x="14" y="18" width="3" height="3" rx="0.5" />
                        </svg>
                    </div>
                    <span style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: -0.5 }}>
                        Q <span style={{ color: '#5EEAD4' }}>Yaar</span>
                    </span>
                </Link>

                {/* Right */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {!isQRPage && (
                        <Link to="/" style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            padding: '8px 16px', borderRadius: 12,
                            background: 'rgba(94,234,212,0.1)',
                            border: '1px solid rgba(94,234,212,0.2)',
                            color: '#5EEAD4', fontSize: 13, fontWeight: 700,
                            textDecoration: 'none', transition: 'all 0.3s',
                        }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                <rect x="3" y="3" width="7" height="7" rx="1.5" />
                                <rect x="14" y="3" width="7" height="7" rx="1.5" />
                                <rect x="3" y="14" width="7" height="7" rx="1.5" />
                                <path d="M14 14h3v3h-3z" />
                            </svg>
                            Get QR
                        </Link>
                    )}
                    <a href="https://q-yaar.vercel.app" style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '8px 16px', borderRadius: 12,
                        color: '#94A3B8', fontSize: 13, fontWeight: 600,
                        textDecoration: 'none', transition: 'all 0.3s',
                    }}>
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        Website
                    </a>
                </div>
            </div>
        </nav>
    );
}
