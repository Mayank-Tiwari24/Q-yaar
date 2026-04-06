import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import toast from 'react-hot-toast';
import { listAllQRs } from '../api';
import Loader from '../components/Loader';

export default function DashboardPage() {
    const [qrs, setQrs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchQRs();
    }, []);

    const fetchQRs = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter !== 'all') params.status = filter;
            const response = await listAllQRs(params);
            if (response.success) {
                setQrs(response.data);
            }
        } catch (err) {
            toast.error('Failed to fetch QR codes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQRs();
    }, [filter]);

    const filteredQRs = qrs.filter((qr) => {
        if (filter === 'all') return true;
        return qr.status === filter.toUpperCase();
    });

    const stats = {
        total: qrs.length,
        unused: qrs.filter((q) => q.status === 'UNUSED').length,
        used: qrs.filter((q) => q.status === 'USED').length,
    };

    const handleCopyLink = (qrId) => {
        const url = `${window.location.origin}/qr/${qrId}`;
        navigator.clipboard.writeText(url);
        toast.success('Link copied!');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-12 w-full">
            {/* Header */}
            <div className="mb-8 animate-fade-in-up flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073B3A] tracking-tight">
                        Dashboard
                    </h1>
                    <p className="mt-2 text-base font-medium text-[#0A4D4A]/70">
                        Manage and track all generated QR identities.
                    </p>
                </div>
                {/* Generate New Button Top Right */}
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 py-2.5 px-5 bg-[#073B3A] text-white font-bold rounded-xl shadow-lg shadow-[#073B3A]/20 hover:shadow-xl hover:shadow-[#073B3A]/30 hover:-translate-y-0.5 transition-all duration-300"
                >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="3" strokeLinecap="round">
                        <line x1="12" y1="5" x2="12" y2="19"></line>
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                    </svg>
                    New QR
                </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-10 animate-fade-in-up delay-100" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                {/* Total */}
                <div className="bg-white rounded-3xl border border-[#0D6B5E]/10 p-6 shadow-xl shadow-[#0D6B5E]/5 flex items-center justify-between group">
                    <div>
                        <p className="text-sm font-bold text-[#0A4D4A]/50 uppercase tracking-widest mb-1">Total</p>
                        <p className="text-4xl font-black text-[#073B3A]">{stats.total}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-[#0D6B5E]/10 flex items-center justify-center text-[#0D6B5E] group-hover:scale-110 transition-transform duration-300">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="3" y1="9" x2="21" y2="9"></line>
                            <line x1="9" y1="21" x2="9" y2="9"></line>
                        </svg>
                    </div>
                </div>

                {/* Unclaimed */}
                <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl border border-amber-400 p-6 shadow-xl shadow-amber-500/20 flex items-center justify-between group text-white">
                    <div>
                        <p className="text-sm font-bold text-amber-100 uppercase tracking-widest mb-1">Unprocessed</p>
                        <p className="text-4xl font-black">{stats.unused}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <line x1="12" y1="8" x2="12" y2="12"></line>
                            <line x1="12" y1="16" x2="12.01" y2="16"></line>
                        </svg>
                    </div>
                </div>

                {/* Claimed */}
                <div className="bg-gradient-to-br from-[#10B981] to-[#047857] rounded-3xl border border-[#059669] p-6 shadow-xl shadow-[#10B981]/20 flex items-center justify-between group text-white">
                    <div>
                        <p className="text-sm font-bold text-emerald-100 uppercase tracking-widest mb-1">Allocated</p>
                        <p className="text-4xl font-black">{stats.used}</p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 backdrop-blur-sm">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                    </div>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="flex bg-white p-2 rounded-2xl border border-slate-200 shadow-sm mb-6 animate-fade-in-up delay-200 w-full sm:w-auto overflow-hidden text-sm font-semibold text-[#0A4D4A]/60 items-center justify-between" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                <div className="flex gap-1 overflow-x-auto no-scrollbar">
                    {['all', 'UNUSED', 'USED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-5 py-2.5 rounded-xl transition-all duration-300 relative whitespace-nowrap ${
                                filter === f
                                    ? 'text-[#073B3A]'
                                    : 'hover:bg-slate-50 hover:text-[#073B3A]'
                            }`}
                        >
                            {filter === f && (
                                <span className="absolute inset-0 bg-[#5EEAD4]/20 rounded-xl -z-10" />
                            )}
                            {f === 'all' ? 'View All' : f === 'UNUSED' ? 'Pending Action' : 'Fully Registered'}
                        </button>
                    ))}
                </div>

                {/* Refresh */}
                <button
                    onClick={fetchQRs}
                    className="p-3 mr-1 rounded-xl hover:bg-slate-100 text-[#0D6B5E] transition-all ml-4"
                    title="Refresh Data"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <path d="M23 4v6h-6M1 20v-6h6" />
                        <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                </button>
            </div>

            {/* QR List */}
            {loading ? (
                <Loader text="Loading QR codes..." />
            ) : filteredQRs.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-3xl border border-slate-100 shadow-sm animate-fade-in">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-50 mb-5 border-4 border-white shadow-inner">
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <path d="M14 14h3v3h-3zM18 18h3v3h-3z" />
                        </svg>
                    </div>
                    <p className="text-lg font-bold text-[#073B3A] mb-1">No QR codes found</p>
                    <p className="text-[#64748B] mb-6">You haven't generated any QR tags in this category.</p>
                </div>
            ) : (
                <div className="grid gap-4 animate-fade-in-up delay-300" style={{ opacity: 0, animationFillMode: 'forwards' }}>
                    {filteredQRs.map((qr) => (
                        <div key={qr.qrId} className="bg-white rounded-[20px] border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:shadow-[#0D6B5E]/5 transition-all duration-300 flex flex-col sm:flex-row gap-5 items-start sm:items-center relative overflow-hidden group">
                            
                            {qr.status === 'UNUSED' && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                            )}
                            {qr.status === 'USED' && (
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#10B981]/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                            )}

                            {/* Mini QR */}
                            <div className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0 hidden sm:block shadow-inner ring-1 ring-black/5">
                                <QRCodeSVG
                                    value={`${window.location.origin}/qr/${qr.qrId}`}
                                    size={60}
                                    level="L"
                                    bgColor="transparent"
                                    fgColor="#073B3A"
                                />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className="font-mono text-sm font-bold text-[#0A4D4A]/50 bg-slate-100 px-2 py-0.5 rounded-md truncate">
                                        ID: {qr.qrId}
                                    </span>
                                    {qr.status === 'USED' ? (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-[#059669] bg-[#D1FAE5] px-2.5 py-1 rounded-full border border-[#34D399]/30">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                                            Registered
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full border border-amber-300/50">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                                            Needs Scan
                                        </span>
                                    )}
                                </div>

                                {qr.status === 'USED' && qr.vehicleData ? (
                                    <div className="space-y-1.5 mt-2">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[#334155]">
                                            <span className="font-bold text-[#073B3A] text-base px-2 py-0.5 bg-[#5EEAD4]/20 rounded-md border border-[#5EEAD4]/40">{qr.vehicleData.vehicleNumber}</span>
                                            <span className="font-semibold">{qr.vehicleData.ownerName}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-semibold text-[#64748B]">
                                            {qr.mobileNumber && (
                                                <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0D6B5E" strokeWidth="2.5"><rect x="5" y="2" width="14" height="20" rx="2.5"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>
                                                    +91 {qr.mobileNumber}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-[#64748B] mt-2 mb-1">Waiting for user interaction via Mobile App.</p>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex sm:flex-col items-center gap-2 flex-shrink-0 w-full sm:w-auto mt-4 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                                <Link
                                    to={`/qr/${qr.qrId}`}
                                    className="flex-1 sm:flex-none flex items-center justify-center gap-2 sm:px-4 py-2.5 sm:py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm font-bold text-[#073B3A] hover:bg-[#F0FDF8] hover:border-[#5EEAD4]/50 hover:text-[#0D6B5E] transition-all"
                                >
                                    Review
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <path d="M5 12h14M12 5l7 7-7 7"/>
                                    </svg>
                                </Link>
                                <button
                                    onClick={() => handleCopyLink(qr.qrId)}
                                    className="p-2.5 sm:p-2 rounded-xl bg-slate-50 border border-slate-200 text-[#94A3B8] hover:text-[#073B3A] hover:bg-slate-100 transition-all"
                                    title="Copy Label Link"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" />
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
