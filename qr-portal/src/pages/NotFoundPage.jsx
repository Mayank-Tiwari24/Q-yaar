import { Link } from 'react-router-dom';

export default function NotFoundPage() {
    return (
        <div style={{
            minHeight: 'calc(100vh - 72px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            textAlign: 'center',
        }}>
            {/* 404 Icon */}
            <div style={{
                width: 80, height: 80, borderRadius: '50%',
                background: 'rgba(239,68,68,0.1)',
                border: '2px solid rgba(239,68,68,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 24, fontSize: 36,
            }}>
                🚫
            </div>

            <h1 style={{
                fontSize: '2rem', fontWeight: 800,
                color: '#F1F5F9', marginBottom: 12,
                fontFamily: "'Space Grotesk', sans-serif",
            }}>
                Page Not Found
            </h1>

            <p style={{
                color: '#94A3B8', fontSize: '1rem',
                maxWidth: 400, marginBottom: 32, lineHeight: 1.6,
            }}>
                The page you're looking for doesn't exist or has been moved.
            </p>

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
                ← Back to Home
            </Link>
        </div>
    );
}
