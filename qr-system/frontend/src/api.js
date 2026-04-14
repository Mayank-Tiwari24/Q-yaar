import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://qyaar-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── QR API Calls (Website — Admin/Dashboard Only) ──────────────────────────

export const generateQR = async () => {
    const response = await api.post('/qr/generate');
    return response.data;
};

export const getQRDetails = async (qrId) => {
    const response = await api.get(`/qr/${qrId}`);
    return response.data;
};

export const listAllQRs = async (params = {}) => {
    const response = await api.get('/qr', { params });
    return response.data;
};

// ─── These APIs are used by the mobile app, kept here for reference ─────────
// POST /api/qr/claim    → App sends: { qrId, mobileNumber, vehicleNumber, ownerName, model }
// PUT  /api/qr/update   → App sends: { qrId, mobileNumber, vehicleNumber, ownerName, model }

// ─── Notify vehicle owner (from QR scanner) ─────────────────────────────────
export const notifyOwner = async (qrId, { message, senderName }) => {
    const response = await api.post(`/qr/${qrId}/notify`, { message, senderName });
    return response.data;
};

export default api;
