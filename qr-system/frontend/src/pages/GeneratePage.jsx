import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { generateQR } from '../api';

/* ── Floating Particles Background ───────────────── */
function FloatingParticles() {
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{
                    position: 'absolute',
                    width: Math.random() * 4 + 2,
                    height: Math.random() * 4 + 2,
                    borderRadius: '50%',
                    background: i % 3 === 0 ? 'var(--teal)' : i % 3 === 1 ? 'var(--mint)' : 'var(--teal-dim)',
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    opacity: Math.random() * 0.4 + 0.1,
                    animation: `float ${Math.random() * 8 + 6}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 5}s`,
                }} />
            ))}
        </div>
    );
}

/* ── 3D QR Icon with Orbit ───────────────────────── */
function QRIcon3D() {
    return (
        <div style={{ position: 'relative', width: 120, height: 120, margin: '0 auto 32px' }}>
            {/* Orbit rings */}
            <div style={{
                position: 'absolute', inset: -20,
                border: '1px solid rgba(94,234,212,0.1)',
                borderRadius: '50%',
                animation: 'rotate-slow 20s linear infinite',
            }}>
                <div style={{
                    position: 'absolute', top: -3, left: '50%', width: 6, height: 6,
                    borderRadius: '50%', background: 'var(--teal)',
                    boxShadow: '0 0 12px var(--teal-glow)',
                }} />
            </div>
            <div style={{
                position: 'absolute', inset: -40,
                border: '1px solid rgba(94,234,212,0.05)',
                borderRadius: '50%',
                animation: 'rotate-slow 30s linear infinite reverse',
            }}>
                <div style={{
                    position: 'absolute', bottom: -3, right: '30%', width: 4, height: 4,
                    borderRadius: '50%', background: 'var(--mint)',
                    boxShadow: '0 0 8px rgba(167,243,208,0.3)',
                }} />
            </div>
            
            {/* Main icon */}
            <div style={{
                width: 120, height: 120, borderRadius: 32,
                background: 'linear-gradient(135deg, rgba(94,234,212,0.15), rgba(94,234,212,0.05))',
                border: '1px solid rgba(94,234,212,0.2)',
                backdropFilter: 'blur(20px)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                animation: 'float-slow 6s ease-in-out infinite',
                boxShadow: '0 8px 40px var(--teal-glow)',
                perspective: 800,
            }}>
                <div style={{
                    animation: 'spin3d 8s ease-in-out infinite alternate',
                    transformStyle: 'preserve-3d',
                }}>
                    <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        <path d="M14 14h3v3h-3z" />
                        <path d="M18 18h3v3h-3z" />
                        <path d="M14 18h3v3h-3z" />
                    </svg>
                </div>
            </div>
            
            {/* Glow pulse */}
            <div style={{
                position: 'absolute', inset: -8, borderRadius: 36,
                background: 'transparent',
                border: '1px solid rgba(94,234,212,0.1)',
                animation: 'pulse-glow 3s ease-in-out infinite',
            }} />
        </div>
    );
}

/* ── Benefit Card ────────────────────────────────── */
function BenefitCard({ icon, label, desc, delay = 0 }) {
    return (
        <div className="glass-card" style={{
            padding: 24, textAlign: 'center',
            animationDelay: `${delay}ms`,
        }}>
            <span style={{ fontSize: 28, display: 'block', marginBottom: 10 }}>{icon}</span>
            <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--white)', marginBottom: 4 }}>{label}</p>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{desc}</p>
        </div>
    );
}

export default function GeneratePage() {
    const [tab, setTab] = useState('download');
    const [loading, setLoading] = useState(false);
    const [generated, setGenerated] = useState(null);

    const [orderForm, setOrderForm] = useState({
        name: '', phone: '', address: '', city: '', pincode: '', quantity: 1,
    });
    const [orderPlaced, setOrderPlaced] = useState(false);

    const handleGenerate = async () => {
        setLoading(true);
        try {
            const response = await generateQR();
            if (response.success) {
                setGenerated(response.data);
                toast.success('QR Code generated!');
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to generate');
        } finally {
            setLoading(false);
        }
    };

    const handleCopyLink = () => {
        if (generated?.qrURL) {
            navigator.clipboard.writeText(generated.qrURL);
            toast.success('Link copied!');
        }
    };

    const handleDownloadQR = () => {
        const svg = document.getElementById('qr-code-svg');
        if (!svg) return;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const svgData = new XMLSerializer().serializeToString(svg);
        const img = new Image();
        canvas.width = 1024; canvas.height = 1024;
        img.onload = () => {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, 1024, 1024);
            ctx.drawImage(img, 0, 0, 1024, 1024);
            const link = document.createElement('a');
            link.download = `qyaar-${generated.qrId.slice(0, 8)}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            toast.success('QR downloaded!');
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    };

    const handleOrderSubmit = (e) => {
        e.preventDefault();
        if (!orderForm.name || !orderForm.phone || !orderForm.address || !orderForm.city || !orderForm.pincode) {
            toast.error('Please fill all fields'); return;
        }
        if (orderForm.phone.length !== 10) {
            toast.error('Enter valid 10-digit phone number'); return;
        }
        toast.success('Order placed! We will contact you soon.');
        setOrderPlaced(true);
    };

    /* ═════════════════════════════════════════════════
       QR GENERATED — RESULT
       ═════════════════════════════════════════════════ */
    if (generated) {
        return (
            <div style={{ minHeight: '100vh', position: 'relative' }}>
                <FloatingParticles />
                <div className="bg-grid" />
                <div className="bg-glow-1" />
                <div className="bg-glow-2" />

                <div style={{ maxWidth: 520, margin: '0 auto', padding: '100px 20px 60px', position: 'relative', zIndex: 1 }}>
                    <div className="animate-scale-in" style={{ textAlign: 'center' }}>
                        {/* Success icon */}
                        <div style={{
                            width: 88, height: 88, borderRadius: 28,
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                            boxShadow: '0 8px 40px rgba(16,185,129,0.3)',
                            animation: 'float 4s ease-in-out infinite',
                        }}>
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>

                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--white)', marginBottom: 8 }}>
                            Your QR is <span className="gradient-text">Ready!</span>
                        </h1>
                        <p style={{ fontSize: 16, color: 'var(--text-dim)', marginBottom: 40, lineHeight: 1.7 }}>
                            Download it, print, and stick on your vehicle.
                        </p>
                    </div>

                    {/* QR Card */}
                    <div className="glass-card animate-fade-in-up delay-2" style={{ overflow: 'hidden', marginBottom: 24 }}>
                        <div style={{ padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            {/* QR with teal glow */}
                            <div style={{ position: 'relative', marginBottom: 32 }}>
                                <div style={{
                                    position: 'absolute', inset: -20,
                                    background: 'radial-gradient(circle, var(--teal-glow), transparent 70%)',
                                    borderRadius: 32, filter: 'blur(20px)', zIndex: 0,
                                }} />
                                <div style={{
                                    padding: 20, background: 'white', borderRadius: 24,
                                    position: 'relative', zIndex: 1,
                                    boxShadow: '0 4px 30px rgba(0,0,0,0.3)',
                                }}>
                                    <QRCodeSVG
                                        id="qr-code-svg"
                                        value={generated.qrURL}
                                        size={220}
                                        level="H"
                                        bgColor="#FFFFFF"
                                        fgColor="#073B3A"
                                    />
                                </div>
                            </div>

                            {/* QR ID */}
                            <div style={{
                                width: '100%', background: 'rgba(94,234,212,0.05)',
                                border: '1px solid var(--border)', borderRadius: 16,
                                padding: '14px 18px', marginBottom: 16,
                            }}>
                                <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 }}>QR Identity</p>
                                <p style={{ fontFamily: 'monospace', fontSize: 13, fontWeight: 700, color: 'var(--text)', wordBreak: 'break-all' }}>{generated.qrId}</p>
                            </div>

                            {/* Link */}
                            <div style={{
                                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)',
                                borderRadius: 14, padding: '8px 8px 8px 16px',
                            }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
                                <span style={{ flex: 1, fontSize: 13, color: 'var(--text-muted)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{generated.qrURL}</span>
                                <button onClick={handleCopyLink} style={{
                                    padding: '8px 16px', background: 'rgba(94,234,212,0.1)',
                                    border: '1px solid rgba(94,234,212,0.2)', borderRadius: 10,
                                    color: 'var(--teal)', fontSize: 12, fontWeight: 700,
                                    cursor: 'pointer', fontFamily: 'inherit',
                                }}>Copy</button>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
                        <button onClick={handleDownloadQR} className="btn-glow" style={{ padding: '16px 20px', fontSize: 14 }}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download PNG
                        </button>
                        <button onClick={handleCopyLink} className="btn-outline-dark" style={{ padding: '16px 20px', fontSize: 14 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
                            Copy Link
                        </button>
                    </div>

                    {/* Next step info */}
                    <div className="glass-card animate-fade-in-up delay-3" style={{ padding: 24, marginBottom: 20 }}>
                        <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: 12,
                                background: 'rgba(94,234,212,0.1)', border: '1px solid rgba(94,234,212,0.15)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--teal)', marginBottom: 4 }}>Next Step</p>
                                <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.7 }}>
                                    Print this QR and stick it on your vehicle. Then scan it from the Q Yaar app to register.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Generate Another */}
                    <button onClick={() => setGenerated(null)} className="btn-outline-dark" style={{ width: '100%', padding: '16px 32px', fontSize: 16 }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M3 12a9 9 0 109-9 9.75 9.75 0 00-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                        Generate Another
                    </button>
                </div>
            </div>
        );
    }

    /* ═════════════════════════════════════════════════
       ORDER PLACED
       ═════════════════════════════════════════════════ */
    if (orderPlaced) {
        return (
            <div style={{ minHeight: '100vh', position: 'relative' }}>
                <FloatingParticles />
                <div className="bg-grid" />

                <div style={{ maxWidth: 520, margin: '0 auto', padding: '100px 20px 60px', position: 'relative', zIndex: 1, textAlign: 'center' }}>
                    <div className="animate-scale-in">
                        <div style={{
                            width: 100, height: 100, borderRadius: 32,
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 28px',
                            boxShadow: '0 12px 50px rgba(16,185,129,0.35)',
                            animation: 'float 4s ease-in-out infinite',
                        }}>
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>

                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 36, fontWeight: 900, color: 'var(--white)', marginBottom: 12 }}>
                            Order Placed! 🎉
                        </h1>
                        <p style={{ fontSize: 16, color: 'var(--text-dim)', marginBottom: 8, lineHeight: 1.7 }}>Your QR sticker order has been received.</p>
                        <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 40 }}>
                            We will contact you on <span style={{ color: 'var(--teal)', fontWeight: 700 }}>+91 {orderForm.phone}</span>
                        </p>
                    </div>

                    {/* Order summary */}
                    <div className="glass-card animate-fade-in-up delay-2" style={{ padding: 28, textAlign: 'left', marginBottom: 32 }}>
                        <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 16 }}>Order Summary</p>
                        {[
                            ['Name', orderForm.name],
                            ['Quantity', `${orderForm.quantity} QR Sticker${orderForm.quantity > 1 ? 's' : ''}`],
                            ['QR Cost', 'FREE ✓'],
                            ['Delivery', 'Charges apply'],
                            ['Address', `${orderForm.address}, ${orderForm.city} - ${orderForm.pincode}`],
                        ].map(([k, v]) => (
                            <div key={k} style={{
                                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                padding: '10px 0',
                                borderBottom: k !== 'Address' ? '1px solid var(--border)' : 'none',
                            }}>
                                <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{k}</span>
                                <span style={{
                                    fontSize: 13, fontWeight: 700, textAlign: 'right', maxWidth: '60%',
                                    color: v === 'FREE ✓' ? 'var(--success)' : v === 'Charges apply' ? 'var(--amber)' : 'var(--white)',
                                }}>{v}</span>
                            </div>
                        ))}
                    </div>

                    <button onClick={() => { setOrderPlaced(false); setOrderForm({ name: '', phone: '', address: '', city: '', pincode: '', quantity: 1 }); }} className="btn-glow">
                        Place Another Order
                    </button>
                </div>
            </div>
        );
    }

    /* ═════════════════════════════════════════════════
       MAIN — DOWNLOAD / ORDER TABS
       ═════════════════════════════════════════════════ */
    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <FloatingParticles />
            <div className="bg-grid" />
            <div className="bg-glow-1" />
            <div className="bg-glow-2" />

            <div style={{ maxWidth: 600, margin: '0 auto', padding: '100px 20px 60px', position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="anim-fade-up" style={{ textAlign: 'center', marginBottom: 40 }}>
                    <QRIcon3D />

                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(94,234,212,0.08)', border: '1px solid rgba(94,234,212,0.15)',
                        borderRadius: 100, padding: '8px 18px', marginBottom: 20,
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
                        <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2 }}>100% Free</span>
                    </div>

                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(2rem, 5vw, 2.8rem)', fontWeight: 900, color: 'var(--white)', marginBottom: 12, lineHeight: 1.2 }}>
                        Get Your <span className="gradient-text">Q Yaar</span> QR
                    </h1>
                    <p style={{ fontSize: 16, color: 'var(--text-dim)', lineHeight: 1.8, maxWidth: 420, margin: '0 auto' }}>
                        Generate a free QR for your vehicle. Download instantly or get a premium sticker delivered.
                    </p>
                </div>

                {/* Tab Switcher */}
                <div className="anim-fade-up delay-2" style={{ marginBottom: 32 }}>
                    <div className="tab-container">
                        <div className={`tab-pill ${tab === 'download' ? 'left' : 'right'}`} />
                        <button onClick={() => setTab('download')} className={`tab-btn ${tab === 'download' ? 'active' : 'inactive'}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                            Download Free
                        </button>
                        <button onClick={() => setTab('order')} className={`tab-btn ${tab === 'order' ? 'active' : 'inactive'}`}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-2"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                            Order Physical
                        </button>
                    </div>
                </div>

                {/* ── DOWNLOAD TAB ─────────────────────── */}
                {tab === 'download' && (
                    <div className="animate-fade-in-up" key="dl">
                        {/* Benefit cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
                            <BenefitCard icon="⚡" label="Instant" desc="Ready in 2 sec" delay={0} />
                            <BenefitCard icon="🆓" label="100% Free" desc="No charges" delay={100} />
                            <BenefitCard icon="🖨️" label="Print Ready" desc="High-res PNG" delay={200} />
                        </div>

                        {/* Main card */}
                        <div className="glass-card card-3d" style={{ overflow: 'hidden' }}>
                            <div className="card-3d-inner" style={{ padding: '40px 32px' }}>
                                {/* Inner glow */}
                                <div style={{
                                    position: 'absolute', top: -60, right: -60, width: 200, height: 200,
                                    background: 'radial-gradient(circle, var(--teal-glow), transparent 70%)',
                                    borderRadius: '50%', pointerEvents: 'none',
                                }} />

                                <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 800, color: 'var(--white)', textAlign: 'center', marginBottom: 8, position: 'relative' }}>
                                    Instant Digital QR
                                </h2>
                                <p style={{ fontSize: 14, color: 'var(--text-dim)', textAlign: 'center', marginBottom: 32, lineHeight: 1.7, position: 'relative' }}>
                                    Generate your unique QR code instantly. Download as PNG and print at home.
                                </p>

                                {/* How it works mini */}
                                <div style={{
                                    background: 'rgba(94,234,212,0.04)', border: '1px solid var(--border)',
                                    borderRadius: 16, padding: 20, marginBottom: 28, position: 'relative',
                                }}>
                                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 14 }}>How it works</p>
                                    <div style={{ display: 'flex', gap: 12 }}>
                                        {[
                                            { step: '1', text: 'Generate QR' },
                                            { step: '2', text: 'Download & Print' },
                                            { step: '3', text: 'Stick on Vehicle' },
                                        ].map((s) => (
                                            <div key={s.step} style={{ flex: 1, textAlign: 'center' }}>
                                                <div style={{
                                                    width: 32, height: 32, borderRadius: 10,
                                                    background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    margin: '0 auto 8px',
                                                    fontSize: 14, fontWeight: 900, color: 'var(--dark-teal)',
                                                    boxShadow: '0 4px 12px var(--teal-glow)',
                                                }}>{s.step}</div>
                                                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-dim)' }}>{s.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <button onClick={handleGenerate} disabled={loading} className="btn-glow" style={{ width: '100%', fontSize: 17 }}>
                                    {loading ? (
                                        <>
                                            <div style={{ width: 22, height: 22, border: '3px solid rgba(7,59,58,0.2)', borderTopColor: 'var(--dark-teal)', borderRadius: '50%', animation: 'rotate-slow 0.8s linear infinite' }} />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                            Generate Free QR
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── ORDER TAB ───────────────────────── */}
                {tab === 'order' && (
                    <div className="animate-fade-in-up" key="ord">
                        <div className="glass-card" style={{ overflow: 'hidden' }}>
                            {/* Header bar */}
                            <div style={{
                                background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))',
                                padding: '20px 28px', borderBottom: '1px solid var(--border)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16,
                            }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: 'var(--success)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                                    QR FREE
                                </span>
                                <span style={{ color: 'var(--text-muted)' }}>·</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 800, color: 'var(--amber)' }}>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-2"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    + Delivery Charges
                                </span>
                            </div>

                            <div style={{ padding: '32px 28px' }}>
                                <div style={{ textAlign: 'center', marginBottom: 28 }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 20,
                                        background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 16px',
                                    }}>
                                        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-2"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                    </div>
                                    <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 22, fontWeight: 800, color: 'var(--white)', marginBottom: 6 }}>
                                        Order Physical Sticker
                                    </h2>
                                    <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>
                                        Premium weatherproof QR delivered to your door
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleOrderSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                                    <div>
                                        <label className="input-label">Full Name *</label>
                                        <input className="input-dark" type="text" value={orderForm.name} onChange={e => setOrderForm({...orderForm, name: e.target.value})} placeholder="Your full name" />
                                    </div>

                                    <div>
                                        <label className="input-label">Phone Number *</label>
                                        <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
                                            <span style={{ padding: '14px 16px', fontSize: 14, fontWeight: 700, color: 'var(--text-muted)', borderRight: '1px solid var(--border)' }}>+91</span>
                                            <input style={{ flex: 1, padding: '14px 16px', background: 'transparent', border: 'none', color: 'var(--white)', fontSize: 15, fontWeight: 500, fontFamily: 'inherit', outline: 'none' }} type="tel" maxLength={10} value={orderForm.phone} onChange={e => setOrderForm({...orderForm, phone: e.target.value.replace(/\D/g, '')})} placeholder="9876543210" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="input-label">Delivery Address *</label>
                                        <textarea className="input-dark" value={orderForm.address} onChange={e => setOrderForm({...orderForm, address: e.target.value})} placeholder="House no, street, landmark..." rows={2} style={{ resize: 'none' }} />
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                                        <div>
                                            <label className="input-label">City *</label>
                                            <input className="input-dark" type="text" value={orderForm.city} onChange={e => setOrderForm({...orderForm, city: e.target.value})} placeholder="City" />
                                        </div>
                                        <div>
                                            <label className="input-label">Pincode *</label>
                                            <input className="input-dark" type="tel" maxLength={6} value={orderForm.pincode} onChange={e => setOrderForm({...orderForm, pincode: e.target.value.replace(/\D/g, '')})} placeholder="110001" />
                                        </div>
                                    </div>

                                    {/* Quantity */}
                                    <div>
                                        <label className="input-label">Quantity</label>
                                        <div style={{
                                            display: 'flex', alignItems: 'center', gap: 16,
                                            background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)',
                                            borderRadius: 16, padding: 8,
                                        }}>
                                            <button type="button" onClick={() => setOrderForm({...orderForm, quantity: Math.max(1, orderForm.quantity - 1)})} style={{
                                                width: 48, height: 48, borderRadius: 12,
                                                background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)',
                                                color: 'var(--white)', fontSize: 22, fontWeight: 700,
                                                cursor: 'pointer', fontFamily: 'inherit',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.2s',
                                            }}>−</button>
                                            <span style={{ flex: 1, textAlign: 'center', fontSize: 28, fontWeight: 900, color: 'var(--white)', fontFamily: 'Outfit, sans-serif' }}>{orderForm.quantity}</span>
                                            <button type="button" onClick={() => setOrderForm({...orderForm, quantity: Math.min(10, orderForm.quantity + 1)})} style={{
                                                width: 48, height: 48, borderRadius: 12,
                                                background: 'rgba(94,234,212,0.08)', border: '1px solid rgba(94,234,212,0.15)',
                                                color: 'var(--teal)', fontSize: 22, fontWeight: 700,
                                                cursor: 'pointer', fontFamily: 'inherit',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.2s',
                                            }}>+</button>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-glow" style={{ width: '100%', marginTop: 8, fontSize: 16 }}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h4l3 3v5a1 1 0 01-1 1h-2"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                                        Place Order
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Bottom text */}
                <p className="anim-fade-up delay-5" style={{ textAlign: 'center', marginTop: 32, fontSize: 13, color: 'var(--text-muted)' }}>
                    Free forever · No hidden charges · Lifetime QR validity
                </p>
            </div>
        </div>
    );
}
