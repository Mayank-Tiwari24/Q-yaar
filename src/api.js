import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'https://qyaar-backend.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

export const getStats = () => api.get('/admin/stats').then(r => r.data);
export const getQRs = (params = {}) => api.get('/admin/qrs', { params }).then(r => r.data);
export const getNotifications = (params = {}) => api.get('/admin/notifications', { params }).then(r => r.data);
export const deleteQR = (qrId) => api.delete(`/admin/qrs/${qrId}`).then(r => r.data);

export default api;
