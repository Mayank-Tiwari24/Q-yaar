import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getQRDetails } from '../api';
import Loader from '../components/Loader';

export default function QRScanPage() {
    const { qrId } = useParams();
    const [loading, setLoading] = useState(true);
    const [qrData, setQrData] = useState(null);
    const [error, setError] = useState(null);

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
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    // ── Loading State ──
    if (loading) {
        return (
            <div className="max-w-lg mx-auto px-4 pt-24">
                <Loader text="Fetching QR details..." />
            </div>
        );
    }

    // ── Error State ──
    if (error) {
        return (
            <div className="max-w-lg mx-auto px-4 sm:px-6 pt-24 pb-12">
                <div className="text-center animate-fade-in-up">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-50 mb-5">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--color-error)" strokeWidth="2" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M15 9l-6 6M9 9l6 6" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">QR Not Found</h2>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-6">{error}</p>
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 py-2.5 px-5 bg-[var(--color-primary)] text-white font-semibold rounded-xl text-sm hover:bg-[var(--color-primary-dark)] transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    // ── USED: Show Vehicle + Owner Details ──
    if (qrData?.status === 'USED') {
        return (
            <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-12 w-full">
                <div className="animate-fade-in-up">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-gradient-to-br from-[#5EEAD4] to-[#0D6B5E] shadow-xl shadow-[#0D6B5E]/30 mb-6 group hover:scale-105 transition-transform duration-300">
                            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#073B3A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 6L9 17l-5-5" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-[#073B3A] tracking-tight">Digital Identity Card</h1>
                        <p className="text-base font-semibold text-[#0A4D4A]/60 mt-2">This QR is permanently attached to the following vehicle.</p>
                    </div>

                    {/* Vehicle Card */}
                    <div className="bg-white rounded-3xl border border-[#0D6B5E]/10 overflow-hidden shadow-2xl shadow-[#0D6B5E]/10 relative">
                        {/* Decorative Blur */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#10B981]/10 to-transparent rounded-full blur-3xl -mt-20 -mr-20 pointer-events-none" />

                        {/* Status Banner */}
                        <div className="bg-gradient-to-r from-[#F0FDF8] to-white px-8 py-5 border-b border-[#0D6B5E]/10">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <div className="w-3 h-3 rounded-full bg-[#10B981] absolute" />
                                        <div className="w-3 h-3 rounded-full bg-[#10B981] animate-ping opacity-75" />
                                    </div>
                                    <span className="text-sm font-black uppercase tracking-widest text-[#059669]">Active Profile</span>
                                </div>
                                {qrData.scanCount > 0 && (
                                    <span className="text-xs font-bold bg-slate-100 text-slate-500 px-3 py-1 rounded-full">
                                        Scanned {qrData.scanCount}x
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            {/* Mobile Number - Primary Identity */}
                            {qrData.mobileNumber && (
                                <div className="bg-[#073B3A] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-5 sm:justify-between shadow-xl shadow-[#073B3A]/20 relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-[#5EEAD4]/20 flex items-center justify-center flex-shrink-0 border border-[#5EEAD4]/30 backdrop-blur-md">
                                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2.5" strokeLinecap="round">
                                                <rect x="5" y="2" width="14" height="20" rx="2.5" />
                                                <line x1="12" y1="18" x2="12.01" y2="18" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-bold text-[#5EEAD4]/70 uppercase tracking-widest mb-1.5">Registered Owner</p>
                                            <p className="text-2xl font-black text-white tracking-widest">
                                                +91-XXXXX-{qrData.mobileNumber?.slice(5)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="self-start sm:self-center px-3 py-1 rounded-lg bg-[#5EEAD4]/10 border border-[#5EEAD4]/30 text-[#5EEAD4] text-xs font-bold uppercase tracking-wider">
                                        Verified Key
                                    </span>
                                </div>
                            )}

                            {/* Vehicle Number */}
                            <div className="bg-slate-50 rounded-2xl p-6 text-center border-2 border-dashed border-slate-200">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">License Plate</p>
                                <p className="text-4xl font-black text-[#073B3A] tracking-widest">
                                    {qrData.vehicleData?.vehicleNumber || '—'}
                                </p>
                            </div>

                            {/* Other Details */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Owner Name</p>
                                    <p className="text-lg font-bold text-[#073B3A]">{qrData.vehicleData?.ownerName || '—'}</p>
                                </div>
                                <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
                                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Vehicle Model</p>
                                    <p className="text-lg font-bold text-[#073B3A]">{qrData.vehicleData?.model || '—'}</p>
                                </div>
                            </div>

                            {/* Timestamps */}
                            <div className="mt-8 pt-6 border-t border-slate-100 space-y-3">
                                <div className="flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl">
                                    <span>Initial Registration</span>
                                    <span className="text-[#073B3A]">
                                        {qrData.claimedAt ? new Date(qrData.claimedAt).toLocaleDateString('en-IN', {
                                            day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                        }) : '—'}
                                    </span>
                                </div>
                                {qrData.lastUpdated && qrData.lastUpdated !== qrData.claimedAt && (
                                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 bg-slate-50 px-4 py-2.5 rounded-xl">
                                        <span>Last Data Update</span>
                                        <span className="text-[#073B3A]">
                                            {new Date(qrData.lastUpdated).toLocaleDateString('en-IN', {
                                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Back Button */}
                    <Link to="/dashboard" className="block text-center mt-8 font-bold text-[#0D6B5E] hover:text-[#073B3A] transition-colors">
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    // ── UNUSED: Show "Not Yet Claimed" message (NO FORM — claiming happens via app only) ──
    return (
        <div className="max-w-xl mx-auto px-4 sm:px-6 pt-24 pb-12 w-full">
            <div className="animate-fade-in-up">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-[24px] bg-gradient-to-br from-amber-400 to-amber-600 shadow-xl shadow-amber-500/20 mb-6">
                        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                            <rect x="3" y="3" width="7" height="7" rx="1.5" />
                            <rect x="14" y="3" width="7" height="7" rx="1.5" />
                            <rect x="3" y="14" width="7" height="7" rx="1.5" />
                            <path d="M14 14h3v3h-3zM18 18h3v3h-3zM14 18h3v3h-3z" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-black text-[#073B3A] tracking-tight">Setup Required</h1>
                    <p className="text-base font-semibold text-[#0A4D4A]/60 mt-2">This Identity Tag requires owner activation.</p>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-2xl shadow-slate-200/50">
                    {/* Status Badge */}
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 px-8 py-5 border-b border-amber-100">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-3 h-3 rounded-full bg-amber-500 absolute" />
                                <div className="w-3 h-3 rounded-full bg-amber-500 animate-ping opacity-75" />
                            </div>
                            <span className="text-sm font-black uppercase tracking-widest text-amber-700">Awaiting Registration</span>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* QR ID */}
                        <div className="bg-slate-50 border border-slate-100 rounded-2xl px-6 py-5 mb-8 text-center">
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Unique Identity Number</p>
                            <p className="text-lg font-mono font-black text-[#073B3A] break-all">{qrData.qrId}</p>
                        </div>

                        {/* How to claim steps */}
                        <p className="text-sm font-black text-[#073B3A] uppercase tracking-wider mb-5">Activation Steps:</p>
                        <div className="space-y-4">
                            {[
                                { step: '1', text: 'Open the Q Yaar Mobile App' },
                                { step: '2', text: 'Tap on "Register New"' },
                                { step: '3', text: 'Scan the physical QR Code using the camera' },
                                { step: '4', text: 'Provide ownership & vehicle credentials' },
                                { step: '5', text: 'Submit to permanently lock the identity' },
                            ].map((item) => (
                                <div key={item.step} className="flex items-center gap-4 bg-white p-2 rounded-xl border border-transparent hover:border-slate-100 hover:shadow-sm transition-all group">
                                    <div className="w-10 h-10 rounded-xl bg-[#F0FDF8] group-hover:bg-[#5EEAD4]/20 flex items-center justify-center flex-shrink-0 transition-colors">
                                        <span className="text-sm font-black text-[#0D6B5E]">{item.step}</span>
                                    </div>
                                    <p className="text-[15px] font-bold text-slate-600">{item.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* App Download CTA */}
                <div className="mt-6 bg-gradient-to-br from-[#073B3A] to-[#0A4D4A] rounded-3xl p-6 flex items-center gap-5 shadow-xl shadow-[#073B3A]/20">
                    <div className="w-14 h-14 rounded-2xl bg-[#5EEAD4]/20 flex items-center justify-center flex-shrink-0 border border-[#5EEAD4]/30">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5EEAD4" strokeWidth="2.5" strokeLinecap="round">
                            <rect x="5" y="2" width="14" height="20" rx="3" />
                            <line x1="12" y1="18" x2="12.01" y2="18" />
                        </svg>
                    </div>
                    <div>
                        <p className="text-lg font-black text-white tracking-wide mb-1">Q Yaar Mobile App</p>
                        <p className="text-sm font-semibold text-[#5EEAD4]">Download & Register to activate</p>
                    </div>
                </div>
                
                {/* Back Button */}
                <Link to="/dashboard" className="block text-center mt-8 font-bold text-[#0D6B5E] hover:text-[#073B3A] transition-colors">
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}
