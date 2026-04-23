require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const qrRoutes = require('./routes/qrRoutes');
const adminRoutes = require('./routes/adminRoutes');
const chatRoutes = require('./routes/chatRoutes');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// ─── Connect to MongoDB ─────────────────────────────────────────────────────
connectDB();

// ─── Allowed Origins ────────────────────────────────────────────────────────
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:8081',
    // Production origins (always allowed)
    'https://qyaar-qr.vercel.app',
    'https://qyaar-admin.vercel.app',
    'https://q-yaar.vercel.app',
    ...(process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',').map(url => url.trim().replace(/\/$/, '')) : []),
];

// ─── Socket.io Setup ────────────────────────────────────────────────────────
const io = new Server(server, {
    cors: {
        origin: function (origin, callback) {
            if (!origin) return callback(null, true);
            const cleanOrigin = origin.replace(/\/$/, '');
            if (allowedOrigins.indexOf(cleanOrigin) !== -1) {
                return callback(null, true);
            }
            return callback(null, true); // Allow all for mobile app
        },
        methods: ['GET', 'POST'],
        credentials: true,
    },
    transports: ['websocket', 'polling'],
});

// Socket.io connection handling
io.on('connection', (socket) => {
    console.log('🔌 User connected:', socket.id);

    // Join a chat session room
    socket.on('join_session', (sessionId) => {
        socket.join(sessionId);
        console.log(`📱 ${socket.id} joined session: ${sessionId}`);
    });

    // Leave a chat session room
    socket.on('leave_session', (sessionId) => {
        socket.leave(sessionId);
        console.log(`📱 ${socket.id} left session: ${sessionId}`);
    });

    // Handle new message — broadcast to room
    socket.on('send_message', (data) => {
        // Broadcast to everyone in the session room (except sender)
        socket.to(data.sessionId).emit('receive_message', data);
    });

    // Typing indicator
    socket.on('typing', (data) => {
        socket.to(data.sessionId).emit('user_typing', {
            sessionId: data.sessionId,
            mobile: data.mobile,
            isTyping: data.isTyping,
        });
    });

    // Disconnect
    socket.on('disconnect', () => {
        console.log('🔌 User disconnected:', socket.id);
    });
});

// ─── Middleware ──────────────────────────────────────────────────────────────
app.set('trust proxy', 1); // Trust Render load balancer for rate limiter

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);
        
        // Check if origin matches any of the allowed origins (strip trailing slash from incoming too)
        const cleanOrigin = origin.replace(/\/$/, '');
        if (allowedOrigins.indexOf(cleanOrigin) !== -1) {
            return callback(null, true);
        }
        
        return callback(new Error('CORS policy violation'), false);
    },
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
app.use('/api/chat', chatRoutes);

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
server.listen(PORT, () => {
    console.log(`\n🚀 Q Yaar QR Backend running on http://localhost:${PORT}`);
    console.log(`📋 Health: http://localhost:${PORT}/api/health`);
    console.log(`📋 QR API: http://localhost:${PORT}/api/qr`);
    console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
    console.log(`🔌 Socket.io ready for connections\n`);
});
