require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const qrRoutes = require('./routes/qrRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

// ─── Middleware ──────────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : []),
];
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));
app.use(express.json());

// ─── Rate Limiting ──────────────────────────────────────────────────────────
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: {
        success: false,
        message: 'Too many requests, please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

const generateLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: {
        success: false,
        message: 'Too many QR generation requests. Please wait.',
    },
});

app.use('/api', apiLimiter);
app.use('/api/qr/generate', generateLimiter);

// ─── Routes ─────────────────────────────────────────────────────────────────
app.use('/api/qr', qrRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'Q Yaar QR System Backend is running 🚀',
        timestamp: new Date().toISOString(),
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        success: false,
        message: 'Internal server error',
    });
});

// ─── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
    console.log(`\n🚀 Q Yaar QR Backend running on http://localhost:${PORT}`);
    console.log(`📋 Health: http://localhost:${PORT}/api/health`);
    console.log(`📋 QR API: http://localhost:${PORT}/api/qr\n`);
});
