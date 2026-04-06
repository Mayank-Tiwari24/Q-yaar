import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getStats, getQRs, getNotifications, deleteQR } from '../api';

/* ═══════════════════════════════════════════════════════
   STAT CARD COMPONENT
   ═══════════════════════════════════════════════════════ */
function StatCard({ label, value, icon, color, glow, sub, delay = 0 }) {
    return (
        <div className="anim-fade-up" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '24px 28px',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            animationDelay: `${delay}ms`,
            cursor: 'default',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
            {/* Glow */}
            <div style={{
                position: 'absolute', top: -40, right: -40, width: 120, height: 120,
                background: `radial-gradient(circle, ${glow}, transparent 70%)`,
                borderRadius: '50%', pointerEvents: 'none',
            }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
                <div>
                    <p style={{ fontSize: 11, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 8 }}>{label}</p>
                    <p style={{ fontSize: 36, fontWeight: 900, fontFamily: 'Outfit, sans-serif', color: 'var(--white)', lineHeight: 1, animation: 'count-up 0.6s ease-out' }}>{value}</p>
                    {sub && <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 6, fontWeight: 600 }}>{sub}</p>}
                </div>
                <div style={{
                    width: 52, height: 52, borderRadius: 16,
                    background: `${color}12`, border: `1px solid ${color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <span style={{ fontSize: 24 }}>{icon}</span>
                </div>
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   QR TABLE ROW
   ═══════════════════════════════════════════════════════ */
function QRRow({ qr, onDelete }) {
    const isUsed = qr.status === 'USED';
    const [confirmDelete, setConfirmDelete] = useState(false);

    return (
        <div style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius)',
            padding: '16px 20px',
            marginBottom: 8,
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            flexWrap: 'wrap',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
        >
            {/* Status dot */}
            <div style={{
                width: 10, height: 10, borderRadius: '50%', flexShrink: 0,
                background: isUsed ? 'var(--green)' : 'var(--amber)',
                boxShadow: isUsed ? '0 0 8px var(--green-glow)' : '0 0 8px var(--amber-glow)',
                animation: !isUsed ? 'pulse-dot 2s ease-in-out infinite' : 'none',
            }} />

            {/* QR ID */}
            <div style={{ minWidth: 200, flex: 1 }}>
                <p style={{
                    fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 600,
                    color: 'var(--text-dim)', marginBottom: 4,
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{qr.qrId}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                        fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1,
                        padding: '3px 10px', borderRadius: 100,
                        background: isUsed ? 'var(--green-glow)' : 'var(--amber-glow)',
                        color: isUsed ? 'var(--green)' : 'var(--amber)',
                        border: `1px solid ${isUsed ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)'}`,
                    }}>{isUsed ? '✓ Registered' : '⏳ Unused'}</span>
                    {qr.scanCount > 0 && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-muted)' }}>
                            {qr.scanCount} scan{qr.scanCount > 1 ? 's' : ''}
                        </span>
                    )}
                </div>
            </div>

            {/* Vehicle Info */}
            <div style={{ minWidth: 200, flex: 1 }}>
                {isUsed && qr.vehicleData ? (
                    <>
                        <p style={{
                            fontSize: 14, fontWeight: 800, color: 'var(--white)', marginBottom: 2,
                            fontFamily: 'JetBrains Mono, monospace',
                        }}>{qr.vehicleData.vehicleNumber}</p>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-dim)' }}>
                            {qr.vehicleData.ownerName} · {qr.vehicleData.model || '—'}
                        </p>
                    </>
                ) : (
                    <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        No vehicle linked
                    </p>
                )}
            </div>

            {/* Mobile */}
            <div style={{ minWidth: 120 }}>
                {qr.mobileNumber ? (
                    <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', fontFamily: 'JetBrains Mono, monospace' }}>
                        +91 {qr.mobileNumber}
                    </p>
                ) : (
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>—</p>
                )}
            </div>

            {/* Date */}
            <div style={{ minWidth: 100 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)' }}>
                    {new Date(qr.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' })}
                </p>
                {qr.claimedAt && (
                    <p style={{ fontSize: 10, fontWeight: 600, color: 'var(--green)' }}>
                        Reg: {new Date(qr.claimedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                    </p>
                )}
            </div>

            {/* Delete */}
            <div style={{ flexShrink: 0 }}>
                {confirmDelete ? (
                    <div style={{ display: 'flex', gap: 6 }}>
                        <button onClick={() => { onDelete(qr.qrId); setConfirmDelete(false); }} style={{
                            padding: '6px 14px', borderRadius: 10, border: '1px solid rgba(239,68,68,0.3)',
                            background: 'var(--red-glow)', color: 'var(--red)',
                            fontSize: 11, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
                        }}>Confirm</button>
                        <button onClick={() => setConfirmDelete(false)} style={{
                            padding: '6px 12px', borderRadius: 10, border: '1px solid var(--border)',
                            background: 'transparent', color: 'var(--text-muted)',
                            fontSize: 11, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                        }}>✕</button>
                    </div>
                ) : (
                    <button onClick={() => setConfirmDelete(true)} style={{
                        width: 34, height: 34, borderRadius: 10, border: '1px solid var(--border)',
                        background: 'transparent', color: 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(239,68,68,0.3)'; e.currentTarget.style.color = 'var(--red)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                    </button>
                )}
            </div>
        </div>
    );
}

/* ═══════════════════════════════════════════════════════
   MAIN DASHBOARD
   ═══════════════════════════════════════════════════════ */
export default function Dashboard() {
    const [stats, setStats] = useState(null);
    const [qrs, setQrs] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [tab, setTab] = useState('qrs'); // 'qrs' | 'notifications'

    const fetchData = useCallback(async () => {
        try {
            const [statsRes, qrsRes, notifsRes] = await Promise.all([
                getStats(),
                getQRs({ status: filter !== 'all' ? filter : undefined, search: search || undefined }),
                getNotifications(),
            ]);
            if (statsRes.success) setStats(statsRes.data);
            if (qrsRes.success) setQrs(qrsRes.data);
            if (notifsRes.success) setNotifications(notifsRes.data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    }, [filter, search]);

    useEffect(() => { fetchData(); }, [fetchData]);

    // Auto refresh every 30s
    useEffect(() => {
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, [fetchData]);

    const handleDelete = async (qrId) => {
        try {
            await deleteQR(qrId);
            toast.success('QR deleted');
            fetchData();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchData();
        toast.success('Refreshed!');
    };

    if (loading && !stats) {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
                <div style={{ width: 40, height: 40, border: '3px solid var(--border)', borderTopColor: 'var(--teal)', borderRadius: '50%', animation: 'pulse-dot 1s linear infinite' }} />
                <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-muted)' }}>Loading dashboard...</p>
            </div>
        );
    }

    const filterOptions = [
        { value: 'all', label: 'All QRs', count: stats?.totalQRs },
        { value: 'USED', label: 'Registered', count: stats?.usedQRs },
        { value: 'UNUSED', label: 'Unused', count: stats?.unusedQRs },
    ];

    return (
        <div style={{ minHeight: '100vh', padding: '24px 32px 60px', maxWidth: 1400, margin: '0 auto' }}>
            {/* ── HEADER ──────────────────────────────── */}
            <header className="anim-fade-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 14,
                        background: 'linear-gradient(135deg, var(--teal), var(--teal-dim))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 4px 16px var(--teal-glow)',
                    }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#073B3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <rect x="14" y="14" width="3" height="3" rx="0.5" />
                            <rect x="18" y="18" width="3" height="3" rx="0.5" />
                        </svg>
                    </div>
                    <div>
                        <h1 style={{ fontFamily: 'Outfit, sans-serif', fontSize: 24, fontWeight: 900, color: 'var(--white)', lineHeight: 1.2 }}>
                            Q Yaar <span style={{ color: 'var(--teal)' }}>Admin</span>
                        </h1>
                        <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)' }}>QR Registration Monitor</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    {/* Live indicator */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', borderRadius: 100,
                        background: 'var(--green-glow)', border: '1px solid rgba(16,185,129,0.15)',
                    }}>
                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--green)', animation: 'pulse-dot 2s ease-in-out infinite' }} />
                        <span style={{ fontSize: 11, fontWeight: 800, color: 'var(--green)', textTransform: 'uppercase', letterSpacing: 1 }}>Live</span>
                    </div>

                    {/* Refresh button */}
                    <button onClick={handleRefresh} style={{
                        width: 40, height: 40, borderRadius: 12, border: '1px solid var(--border)',
                        background: 'transparent', color: 'var(--text-dim)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.color = 'var(--teal)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-dim)'; }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M23 4v6h-6M1 20v-6h6" />
                            <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
                        </svg>
                    </button>
                </div>
            </header>

            {/* ── STAT CARDS ──────────────────────────── */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 32 }}>
                <StatCard label="Total QRs" value={stats?.totalQRs || 0} icon="📊" color="var(--teal)" glow="var(--teal-glow)" sub={`+${stats?.recentGenerations || 0} this week`} delay={0} />
                <StatCard label="Registered" value={stats?.usedQRs || 0} icon="✅" color="var(--green)" glow="var(--green-glow)" sub={`${stats?.registrationRate || 0}% rate`} delay={60} />
                <StatCard label="Unused" value={stats?.unusedQRs || 0} icon="⏳" color="var(--amber)" glow="var(--amber-glow)" sub="Awaiting registration" delay={120} />
                <StatCard label="Total Scans" value={stats?.totalScans || 0} icon="📱" color="var(--blue)" glow="var(--blue-glow)" sub={`${stats?.totalNotifications || 0} notifications`} delay={180} />
            </div>

            {/* ── TAB SWITCHER ────────────────────────── */}
            <div className="anim-fade-up delay-3" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
                <div style={{
                    display: 'flex', background: 'var(--bg-card)', border: '1px solid var(--border)',
                    borderRadius: 14, padding: 4, gap: 4,
                }}>
                    {[
                        { key: 'qrs', label: 'QR Codes', icon: '📋' },
                        { key: 'notifications', label: 'Notifications', icon: '🔔' },
                    ].map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)} style={{
                            padding: '10px 20px', borderRadius: 10,
                            background: tab === t.key ? 'linear-gradient(135deg, var(--teal), var(--teal-dim))' : 'transparent',
                            color: tab === t.key ? '#073B3A' : 'var(--text-muted)',
                            fontWeight: 800, fontSize: 13, fontFamily: 'inherit',
                            border: 'none', cursor: 'pointer', transition: 'all 0.3s',
                            display: 'flex', alignItems: 'center', gap: 6,
                        }}>
                            <span>{t.icon}</span> {t.label}
                        </button>
                    ))}
                </div>

                {/* Search & Filters (QRs tab only) */}
                {tab === 'qrs' && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        {/* Search */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 12, padding: '0 14px', transition: 'all 0.3s',
                        }}>
                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2.5" strokeLinecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search QR, vehicle, owner..."
                                style={{
                                    padding: '10px 0', background: 'transparent', border: 'none',
                                    color: 'var(--white)', fontSize: 13, fontWeight: 500,
                                    fontFamily: 'inherit', outline: 'none', width: 200,
                                }}
                            />
                        </div>

                        {/* Status Filters */}
                        <div style={{ display: 'flex', gap: 4, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 4 }}>
                            {filterOptions.map(f => (
                                <button key={f.value} onClick={() => setFilter(f.value)} style={{
                                    padding: '8px 14px', borderRadius: 8,
                                    background: filter === f.value ? 'rgba(94,234,212,0.1)' : 'transparent',
                                    color: filter === f.value ? 'var(--teal)' : 'var(--text-muted)',
                                    fontWeight: 700, fontSize: 12, fontFamily: 'inherit',
                                    border: filter === f.value ? '1px solid rgba(94,234,212,0.15)' : '1px solid transparent',
                                    cursor: 'pointer', transition: 'all 0.2s',
                                    display: 'flex', alignItems: 'center', gap: 6,
                                }}>
                                    {f.label}
                                    <span style={{
                                        fontSize: 10, fontWeight: 800, padding: '2px 6px', borderRadius: 6,
                                        background: filter === f.value ? 'rgba(94,234,212,0.1)' : 'rgba(255,255,255,0.04)',
                                        color: filter === f.value ? 'var(--teal)' : 'var(--text-muted)',
                                    }}>{f.count ?? '—'}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* ── QRS TAB CONTENT ─────────────────────── */}
            {tab === 'qrs' && (
                <div className="anim-fade-in">
                    {/* Table Header */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px',
                        fontSize: 10, fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 2,
                        borderBottom: '1px solid var(--border)', marginBottom: 8,
                    }}>
                        <span style={{ width: 10 }} />
                        <span style={{ minWidth: 200, flex: 1 }}>QR Identity</span>
                        <span style={{ minWidth: 200, flex: 1 }}>Vehicle</span>
                        <span style={{ minWidth: 120 }}>Mobile</span>
                        <span style={{ minWidth: 100 }}>Date</span>
                        <span style={{ width: 34 }} />
                    </div>

                    {qrs.length > 0 ? (
                        qrs.map(qr => <QRRow key={qr.qrId} qr={qr} onDelete={handleDelete} />)
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: 60,
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>📭</span>
                            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>No QR codes found</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                                {search ? 'Try a different search term' : 'No QRs generated yet'}
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* ── NOTIFICATIONS TAB ───────────────────── */}
            {tab === 'notifications' && (
                <div className="anim-fade-in">
                    {notifications.length > 0 ? (
                        notifications.map(n => (
                            <div key={n._id} style={{
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                borderRadius: 'var(--radius)', padding: '16px 20px',
                                marginBottom: 8, transition: 'all 0.3s',
                                display: 'flex', alignItems: 'flex-start', gap: 14,
                            }}
                            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                            >
                                <div style={{
                                    width: 38, height: 38, borderRadius: 12, flexShrink: 0,
                                    background: 'var(--blue-glow)', border: '1px solid rgba(59,130,246,0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <span style={{ fontSize: 16 }}>🔔</span>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                                        <span style={{ fontSize: 13, fontWeight: 800, color: 'var(--white)' }}>{n.senderName}</span>
                                        <span style={{ fontSize: 10, color: 'var(--text-muted)', fontWeight: 600 }}>→</span>
                                        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, fontWeight: 600, color: 'var(--teal)', background: 'var(--teal-glow)', padding: '2px 8px', borderRadius: 6 }}>
                                            {n.qrId.slice(0, 8)}...
                                        </span>
                                    </div>
                                    <p style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, fontWeight: 500 }}>{n.message}</p>
                                </div>
                                <span style={{ fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, flexShrink: 0 }}>
                                    {new Date(n.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                                </span>
                            </div>
                        ))
                    ) : (
                        <div style={{
                            textAlign: 'center', padding: 60,
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-xl)',
                        }}>
                            <span style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>🔕</span>
                            <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--white)', marginBottom: 4 }}>No notifications yet</p>
                            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>When someone scans a QR and sends a message, it will appear here.</p>
                        </div>
                    )}
                </div>
            )}

            {/* ── FOOTER ──────────────────────────────── */}
            <div style={{ marginTop: 48, paddingTop: 24, borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Q Yaar Admin · Auto-refresh every 30s</p>
                <div style={{ display: 'flex', gap: 12 }}>
                    <a href="http://localhost:5173" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--teal)', textDecoration: 'none' }}>QR Generator →</a>
                    <a href="http://localhost:5174" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-dim)', textDecoration: 'none' }}>Website →</a>
                </div>
            </div>
        </div>
    );
}
