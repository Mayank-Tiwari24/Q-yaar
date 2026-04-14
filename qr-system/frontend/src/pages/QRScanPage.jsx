import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getQRDetails, notifyOwner } from '../api';

/* ── Floating Particles (reused from GeneratePage) ── */
function FloatingParticles() {
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
            {Array.from({ length: 15 }).map((_, i) => (
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

/* ── Detail Row Component ── */
function DetailRow({ icon, label, value, accent = false }) {
    return (
        <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: '16px 20px',
            background: accent ? 'rgba(94,234,212,0.06)' : 'rgba(255,255,255,0.02)',
            borderRadius: 16,
            border: `1px solid ${accent ? 'rgba(94,234,212,0.12)' : 'var(--border)'}`,
            transition: 'all 0.3s ease',
        }}>
            <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: accent ? 'rgba(94,234,212,0.12)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${accent ? 'rgba(94,234,212,0.2)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            }}>
                {icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: accent ? 'var(--teal)' : 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 3 }}>{label}</p>
                <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{value || '—'}</p>
            </div>
        </div>
    );
}

export default function QRScanPage() {
    const { qrId } = useParams();
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState(null);
    const [error, setError] = useState(null);

    // Notification form state
    const [notifForm, setNotifForm] = useState({ senderName: '', message: '' });
    const [sendingNotif, setSendingNotif] = useState(false);
    const [notifSent, setNotifSent] = useState(false);

    useEffect(() => {
        fetchQRDetails();
    }, [qrId]);

    const fetchQRDetails = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await getQRDetails(qrId);
            if (response.success) {
                setQrData(response.data);
            }
        } catch (err) {
            const message = err.response?.data?.message || 'QR code not found';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    const handleSendNotification = async (e) => {
        e.preventDefault();
        if (!notifForm.message.trim()) {
            toast.error('Please enter a message');
            return;
        }
        setSendingNotif(true);
        try {
            const response = await notifyOwner(qrId, {
                message: notifForm.message.trim(),
                senderName: notifForm.senderName.trim() || 'Anonymous',
            });
            if (response.success) {
                toast.success('Notification sent to vehicle owner!');
                setNotifSent(true);
                setNotifForm({ senderName: '', message: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to send notification');
        } finally {
            setSendingNotif(false);
        }
    };

    /* ═══════════ LOADING ═══════════ */
    if (loading) {
        return (
            <div style={{ minHeight: '100vh', position: 'relative' }}>
                <FloatingParticles />
                <div className="bg-grid" />
                <div style={{ maxWidth: 520, margin: '0 auto', padding: '120px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div style={{
                        width: 56, height: 56, borderRadius: 18,
                        border: '3px solid var(--border)',
                        borderTopColor: 'var(--teal)',
                        animation: 'rotate-slow 0.8s linear infinite',
                        margin: '0 auto 20px',
                    }} />
                    <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-dim)' }}>Fetching vehicle details...</p>
                </div>
            </div>
        );
    }

    /* ═══════════ ERROR ═══════════ */
    if (error) {
        return (
            <div style={{ minHeight: '100vh', position: 'relative' }}>
                <FloatingParticles />
                <div className="bg-grid" />
                <div style={{ maxWidth: 520, margin: '0 auto', padding: '120px 20px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <div className="animate-scale-in">
                        <div style={{
                            width: 80, height: 80, borderRadius: 24,
                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 24px',
                        }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6M9 9l6 6"/></svg>
                        </div>
                        <h2 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 28, fontWeight: 900, color: 'var(--white)', marginBottom: 8 }}>QR Not Found</h2>
                        <p style={{ fontSize: 15, color: 'var(--text-dim)', marginBottom: 32, lineHeight: 1.7 }}>{error}</p>
                        <Link to="/" className="btn-glow" style={{ textDecoration: 'none', fontSize: 14 }}>← Back to Home</Link>
                    </div>
                </div>
            </div>
        );
    }

    /* ═══════════ USED — VEHICLE DETAILS + NOTIFY ═══════════ */
    if (qrData?.status === 'USED') {
        return (
            <div style={{ minHeight: '100vh', position: 'relative' }}>
                <FloatingParticles />
                <div className="bg-grid" />
                <div className="bg-glow-1" />
                <div className="bg-glow-2" />

                <div style={{ maxWidth: 560, margin: '0 auto', padding: '100px 20px 60px', position: 'relative', zIndex: 1 }}>

                    {/* ── Header ── */}
                    <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: 32 }}>
                        <div style={{
                            width: 80, height: 80, borderRadius: 24,
                            background: 'linear-gradient(135deg, #10B981, #059669)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            margin: '0 auto 20px',
                            boxShadow: '0 8px 40px rgba(16,185,129,0.3)',
                            animation: 'float 4s ease-in-out infinite',
                        }}>
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                        </div>
                        <div style={{
                            display: 'inline-flex', alignItems: 'center', gap: 8,
                            background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)',
                            borderRadius: 100, padding: '6px 16px', marginBottom: 16,
                        }}>
                            <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', boxShadow: '0 0 8px rgba(16,185,129,0.5)' }} />
                            <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: 2 }}>Verified Vehicle</span>
                        </div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--white)', lineHeight: 1.2 }}>
                            Digital <span className="gradient-text">Identity Card</span>
                        </h1>
                    </div>

                    {/* ── Vehicle Number — Hero ── */}
                    <div className="glass-card animate-fade-in-up delay-1" style={{ overflow: 'hidden', marginBottom: 16 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(94,234,212,0.08), rgba(94,234,212,0.02))',
                            padding: '28px 24px', textAlign: 'center',
                            borderBottom: '1px solid var(--border)',
                        }}>
                            <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 3, marginBottom: 10 }}>License Plate</p>
                            <p style={{ fontSize: 'clamp(2rem, 6vw, 3rem)', fontWeight: 900, color: 'var(--white)', letterSpacing: 6, fontFamily: 'Outfit, sans-serif' }}>
                                {qrData.vehicleData?.vehicleNumber || '—'}
                            </p>
                        </div>
                        <div style={{ padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--success)' }} />
                                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)' }}>Active Profile</span>
                            </div>
                            {qrData.scanCount > 0 && (
                                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '4px 12px', borderRadius: 8 }}>
                                    Scanned {qrData.scanCount}x
                                </span>
                            )}
                        </div>
                    </div>

                    {/* ── Vehicle Details ── */}
                    <div className="animate-fade-in-up delay-2" style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                        <DetailRow
                            accent
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--teal)" strokeWidth="2.5" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                            label="Owner Name"
                            value={qrData.vehicleData?.ownerName}
                        />
                        <DetailRow
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M7 17m-2 0a2 2 0 104 0 2 2 0 10-4 0"/><path d="M17 17m-2 0a2 2 0 104 0 2 2 0 10-4 0"/><path d="M5 17H3v-6l2-5h9l4 5h1a2 2 0 012 2v4h-2"/><path d="M9 17h6"/></svg>}
                            label="Vehicle Model"
                            value={qrData.vehicleData?.model}
                        />
                        {qrData.vehicleData?.color && (
                            <DetailRow
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"><circle cx="13.5" cy="6.5" r="2.5"/><path d="M17.5 10.5c0 6-6.5 10-6.5 10S4.5 16.5 4.5 10.5 7.5 2 11 2s6.5 2.5 6.5 8.5z"/></svg>}
                                label="Color"
                                value={qrData.vehicleData.color}
                            />
                        )}
                        {qrData.vehicleData?.fuel && (
                            <DetailRow
                                icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><path d="M14 2v6h6"/></svg>}
                                label="Fuel Type"
                                value={qrData.vehicleData.fuel}
                            />
                        )}
                        <DetailRow
                            icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>}
                            label="Registered On"
                            value={qrData.claimedAt ? new Date(qrData.claimedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        />
                    </div>

                    {/* ── Owner Contact (masked) ── */}
                    {qrData.mobileNumber && (
                        <div className="glass-card animate-fade-in-up delay-2" style={{ padding: '20px 24px', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 14 }}>
                            <div style={{
                                width: 44, height: 44, borderRadius: 14,
                                background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                boxShadow: '0 4px 16px var(--teal-glow)',
                            }}>
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--dark-teal)" strokeWidth="2.5" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="2.5"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 3 }}>Registered Owner</p>
                                <p style={{ fontSize: 20, fontWeight: 900, color: 'var(--white)', letterSpacing: 3 }}>
                                    +91 XXXXX-{qrData.mobileNumber?.slice(-5)}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ═══ SEND NOTIFICATION FORM ═══ */}
                    <div className="glass-card animate-fade-in-up delay-3" style={{ overflow: 'hidden', marginBottom: 24 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.02))',
                            padding: '16px 24px', borderBottom: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', gap: 12,
                        }}>
                            <div style={{
                                width: 36, height: 36, borderRadius: 10,
                                background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
                            </div>
                            <div>
                                <p style={{ fontSize: 14, fontWeight: 800, color: 'var(--white)' }}>Send a Message</p>
                                <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>Notify the vehicle owner directly</p>
                            </div>
                        </div>

                        <div style={{ padding: '24px' }}>
                            {notifSent ? (
                                <div className="animate-scale-in" style={{ textAlign: 'center', padding: '20px 0' }}>
                                    <div style={{
                                        width: 64, height: 64, borderRadius: 20,
                                        background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.2)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        margin: '0 auto 16px',
                                    }}>
                                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                                    </div>
                                    <p style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)', marginBottom: 6 }}>Message Sent!</p>
                                    <p style={{ fontSize: 13, color: 'var(--text-dim)', marginBottom: 20 }}>The vehicle owner will be notified.</p>
                                    <button onClick={() => setNotifSent(false)} style={{
                                        padding: '10px 24px', background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid var(--border)', borderRadius: 12,
                                        color: 'var(--teal)', fontSize: 13, fontWeight: 700,
                                        cursor: 'pointer', fontFamily: 'inherit',
                                    }}>Send Another</button>
                                </div>
                            ) : (
                                <form onSubmit={handleSendNotification} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Your Name (Optional)</label>
                                        <input
                                            className="input-dark"
                                            type="text"
                                            placeholder="Enter your name"
                                            value={notifForm.senderName}
                                            onChange={(e) => setNotifForm({ ...notifForm, senderName: e.target.value })}
                                            maxLength={100}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', fontSize: 10, fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Message *</label>
                                        <textarea
                                            className="input-dark"
                                            placeholder="e.g. Your car lights are on / Wrong parking / Need to talk..."
                                            value={notifForm.message}
                                            onChange={(e) => setNotifForm({ ...notifForm, message: e.target.value })}
                                            rows={3}
                                            maxLength={500}
                                            style={{ resize: 'none' }}
                                        />
                                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>{notifForm.message.length}/500</p>
                                    </div>

                                    {/* Quick messages */}
                                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                        {['🔦 Lights are on', '🅿️ Wrong parking', '🚗 Move your car', '📞 Call me'].map((msg) => (
                                            <button
                                                key={msg}
                                                type="button"
                                                onClick={() => setNotifForm({ ...notifForm, message: msg })}
                                                style={{
                                                    padding: '6px 14px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                    border: '1px solid var(--border)',
                                                    borderRadius: 10,
                                                    color: 'var(--text-dim)',
                                                    fontSize: 12, fontWeight: 600,
                                                    cursor: 'pointer', fontFamily: 'inherit',
                                                    transition: 'all 0.2s',
                                                }}
                                            >{msg}</button>
                                        ))}
                                    </div>

                                    <button type="submit" disabled={sendingNotif || !notifForm.message.trim()} className="btn-glow" style={{ width: '100%', marginTop: 4, fontSize: 15 }}>
                                        {sendingNotif ? (
                                            <>
                                                <div style={{ width: 20, height: 20, border: '3px solid rgba(7,59,58,0.2)', borderTopColor: 'var(--dark-teal)', borderRadius: '50%', animation: 'rotate-slow 0.8s linear infinite' }} />
                                                Sending...
                                            </>
                                        ) : (
                                            <>
                                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                                                Send Notification
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>

                    {/* ═══ DOWNLOAD APP CTA ═══ */}
                    <div className="glass-card animate-fade-in-up delay-4" style={{ overflow: 'hidden', marginBottom: 24 }}>
                        <div style={{
                            background: 'linear-gradient(135deg, rgba(94,234,212,0.06), rgba(94,234,212,0.02))',
                            padding: '28px 24px', display: 'flex', alignItems: 'center', gap: 18,
                        }}>
                            <div style={{
                                width: 56, height: 56, borderRadius: 18,
                                background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                boxShadow: '0 8px 30px var(--teal-glow)',
                            }}>
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--dark-teal)" strokeWidth="2.5" strokeLinecap="round"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                            </div>
                            <div style={{ flex: 1 }}>
                                <p style={{ fontSize: 18, fontWeight: 900, color: 'var(--white)', marginBottom: 4, fontFamily: 'Outfit, sans-serif' }}>Q Yaar App</p>
                                <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6 }}>Register your own vehicle, get instant notifications, view scan history & more.</p>
                            </div>
                        </div>
                        <div style={{
                            padding: '16px 24px', borderTop: '1px solid var(--border)',
                            display: 'flex', gap: 10,
                        }}>
                            <button className="btn-glow" style={{ flex: 1, padding: '14px 20px', fontSize: 14 }}>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                                Download App
                            </button>
                            <a href="https://q-yaar.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-outline-dark" style={{ flex: 1, padding: '14px 20px', fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
                                Visit Website
                            </a>
                        </div>
                    </div>

                    {/* ── Powered By ── */}
                    <p className="animate-fade-in-up delay-5" style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 20 }}>
                        Powered by <span style={{ color: 'var(--teal)', fontWeight: 700 }}>Q Yaar</span> · India's Smart Vehicle Identity
                    </p>
                </div>
            </div>
        );
    }

    /* ═══════════ UNUSED — NOT YET REGISTERED ═══════════ */
    return (
        <div style={{ minHeight: '100vh', position: 'relative' }}>
            <FloatingParticles />
            <div className="bg-grid" />
            <div className="bg-glow-1" />

            <div style={{ maxWidth: 520, margin: '0 auto', padding: '100px 20px 60px', position: 'relative', zIndex: 1 }}>
                <div className="animate-fade-in-up" style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{
                        width: 80, height: 80, borderRadius: 24,
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))',
                        border: '1px solid rgba(245,158,11,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 20px',
                        animation: 'float 4s ease-in-out infinite',
                    }}>
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                            <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                            <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                            <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 18h3v3h-3z"/>
                        </svg>
                    </div>
                    <div style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)',
                        borderRadius: 100, padding: '6px 16px', marginBottom: 16,
                    }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#F59E0B', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                        <span style={{ fontSize: 11, fontWeight: 800, color: '#F59E0B', textTransform: 'uppercase', letterSpacing: 2 }}>Awaiting Registration</span>
                    </div>
                    <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 'clamp(1.8rem, 4vw, 2.4rem)', fontWeight: 900, color: 'var(--white)', lineHeight: 1.2 }}>
                        Setup <span className="gradient-text">Required</span>
                    </h1>
                    <p style={{ fontSize: 15, color: 'var(--text-dim)', marginTop: 8, lineHeight: 1.7 }}>This QR code hasn't been registered to any vehicle yet.</p>
                </div>

                {/* QR ID */}
                <div className="glass-card animate-fade-in-up delay-1" style={{ padding: '20px 24px', marginBottom: 16 }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 6 }}>Unique Identity Number</p>
                    <p style={{ fontFamily: 'monospace', fontSize: 14, fontWeight: 700, color: 'var(--text)', wordBreak: 'break-all' }}>{qrData?.qrId}</p>
                </div>

                {/* How to activate */}
                <div className="glass-card animate-fade-in-up delay-2" style={{ padding: '28px 24px', marginBottom: 24 }}>
                    <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--amber)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 20 }}>🔒 Activation Steps</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                        {[
                            { step: '1', text: 'Download the Q Yaar Mobile App', icon: '📱' },
                            { step: '2', text: 'Tap "Register New Vehicle"', icon: '➕' },
                            { step: '3', text: 'Scan this QR code using the app camera', icon: '📷' },
                            { step: '4', text: 'Fill in your vehicle & ownership details', icon: '📝' },
                            { step: '5', text: 'Submit — QR permanently locked to your vehicle!', icon: '🔐' },
                        ].map((item) => (
                            <div key={item.step} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                <div style={{
                                    width: 40, height: 40, borderRadius: 12,
                                    background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    fontSize: 15, fontWeight: 900, color: 'var(--dark-teal)',
                                    boxShadow: '0 4px 12px var(--teal-glow)',
                                }}>{item.step}</div>
                                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
                                    <span style={{ marginRight: 6 }}>{item.icon}</span>
                                    {item.text}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Download App CTA */}
                <div className="animate-fade-in-up delay-3" style={{ display: 'flex', gap: 10 }}>
                    <button className="btn-glow" style={{ flex: 1, fontSize: 15 }}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Download App
                    </button>
                    <a href="https://q-yaar.vercel.app" target="_blank" rel="noopener noreferrer" className="btn-outline-dark" style={{ flex: 1, fontSize: 14, textDecoration: 'none', textAlign: 'center' }}>
                        Visit Website
                    </a>
                </div>

                <p className="animate-fade-in-up delay-4" style={{ textAlign: 'center', fontSize: 12, color: 'var(--text-muted)', marginTop: 24 }}>
                    Powered by <span style={{ color: 'var(--teal)', fontWeight: 700 }}>Q Yaar</span> · India's Smart Vehicle Identity
                </p>
            </div>
        </div>
    );
}
