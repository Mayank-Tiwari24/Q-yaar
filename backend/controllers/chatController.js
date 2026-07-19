const { v4: uuidv4 } = require('uuid');
const ChatSession = require('../models/ChatSession');
const Message = require('../models/Message');
const QR = require('../models/QR');

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours
const MAX_SCANNER_MSGS = 3; // Scanner can send max 3 messages before owner replies

// ─── Initiate Chat Session ──────────────────────────────────────────────────
const initiateChat = async (req, res) => {
    try {
        const { qrId, scannerMobile } = req.body;

        if (!qrId || !scannerMobile) {
            return res.status(400).json({
                success: false,
                message: 'qrId and scannerMobile are required.',
            });
        }

        // Find the QR
        const qr = await QR.findOne({ qrId });
        if (!qr) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found.',
            });
        }

        if (qr.status !== 'USED') {
            return res.status(400).json({
                success: false,
                message: 'This QR is not registered to any vehicle yet.',
            });
        }

        const ownerMobile = qr.mobileNumber;

        // Cannot chat with yourself
        if (scannerMobile === ownerMobile) {
            return res.status(400).json({
                success: false,
                message: 'You cannot chat with your own vehicle QR.',
            });
        }

        // ─── Verify scanner is a registered user ────────────────────────
        const scannerQR = await QR.findOne({ mobileNumber: scannerMobile, status: 'USED' });
        if (!scannerQR) {
            return res.status(403).json({
                success: false,
                message: 'You must be a registered Q Yaar user to start a chat. Please register your vehicle first.',
            });
        }

        // Check for existing ACTIVE session between scanner & this QR
        let existingSession = await ChatSession.findOne({
            qrId,
            scannerMobile,
            status: 'ACTIVE',
        });

        if (existingSession) {
            // Check if expired
            if (existingSession.isExpired()) {
                existingSession.status = 'EXPIRED';
                await existingSession.save();
            } else {
                // Return existing active session
                return res.status(200).json({
                    success: true,
                    message: 'Existing chat session found.',
                    data: {
                        sessionId: existingSession.sessionId,
                        qrId: existingSession.qrId,
                        ownerName: qr.vehicleData.ownerName || 'Vehicle Owner',
                        vehicleNumber: qr.vehicleData.vehicleNumber || '',
                        status: existingSession.status,
                        expiresAt: existingSession.expiresAt,
                    },
                });
            }
        }

        // Check if scanner was previously blocked by this owner
        const blockedSession = await ChatSession.findOne({
            qrId,
            scannerMobile,
            status: 'BLOCKED',
        });

        if (blockedSession) {
            return res.status(403).json({
                success: false,
                message: 'You have been blocked from contacting this vehicle owner.',
            });
        }

        // Create new session
        const sessionId = uuidv4();
        const session = await ChatSession.create({
            sessionId,
            qrId,
            scannerMobile,
            ownerMobile,
            status: 'ACTIVE',
            expiresAt: new Date(Date.now() + SESSION_DURATION_MS),
        });

        return res.status(201).json({
            success: true,
            message: 'Chat session created successfully.',
            data: {
                sessionId: session.sessionId,
                qrId: session.qrId,
                ownerName: qr.vehicleData.ownerName || 'Vehicle Owner',
                vehicleNumber: qr.vehicleData.vehicleNumber || '',
                status: session.status,
                expiresAt: session.expiresAt,
            },
        });
    } catch (error) {
        console.error('Initiate Chat Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to initiate chat session.',
            error: error.message,
        });
    }
};

// ─── Send Message (with anti-spam) ──────────────────────────────────────────
const sendMessage = async (req, res) => {
    try {
        const { sessionId, senderMobile, text } = req.body;

        if (!sessionId || !senderMobile || !text?.trim()) {
            return res.status(400).json({
                success: false,
                message: 'sessionId, senderMobile, and text are required.',
            });
        }

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Chat session not found.',
            });
        }

        // Check session status
        if (session.status === 'BLOCKED') {
            return res.status(403).json({
                success: false,
                message: 'This chat has been blocked.',
            });
        }

        if (session.status === 'EXPIRED' || session.isExpired()) {
            if (session.status !== 'EXPIRED') {
                session.status = 'EXPIRED';
                await session.save();
            }
            return res.status(403).json({
                success: false,
                message: 'This chat session has expired. Scan the QR again to start a new conversation.',
            });
        }

        // Verify sender is part of this session
        const isScanner = senderMobile === session.scannerMobile;
        const isOwner = senderMobile === session.ownerMobile;

        if (!isScanner && !isOwner) {
            return res.status(403).json({
                success: false,
                message: 'You are not part of this chat session.',
            });
        }

        // ─── Anti-Spam: Scanner message limit ───────────────────────────
        if (isScanner && !session.ownerHasReplied && session.scannerMessageCount >= MAX_SCANNER_MSGS) {
            return res.status(429).json({
                success: false,
                message: `You can send a maximum of ${MAX_SCANNER_MSGS} messages before the vehicle owner replies. Please wait for their response.`,
                limitReached: true,
            });
        }

        // Save message
        const message = await Message.create({
            sessionId,
            senderMobile: senderMobile,
            text: text.trim().substring(0, 500),
        });

        // Update session tracking
        if (isScanner) {
            session.scannerMessageCount += 1;
        }
        if (isOwner && !session.ownerHasReplied) {
            session.ownerHasReplied = true;
            session.scannerMessageCount = 0; // Reset limit after owner replies
        }

        // Update last message preview
        session.lastMessage = {
            text: text.trim().substring(0, 100),
            senderMobile,
            timestamp: new Date(),
        };
        await session.save();

        return res.status(201).json({
            success: true,
            data: {
                _id: message._id,
                sessionId: message.sessionId,
                senderMobile: message.senderMobile,
                text: message.text,
                createdAt: message.createdAt,
                isRead: message.isRead,
            },
        });
    } catch (error) {
        console.error('Send Message Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send message.',
            error: error.message,
        });
    }
};

// ─── Get Messages for a session ─────────────────────────────────────────────
const getMessages = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { mobile } = req.query;

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Chat session not found.',
            });
        }

        // Verify user is part of session
        if (mobile && mobile !== session.scannerMobile && mobile !== session.ownerMobile) {
            return res.status(403).json({
                success: false,
                message: 'You are not part of this chat session.',
            });
        }

        const messages = await Message.find({ sessionId })
            .sort({ createdAt: 1 })
            .limit(200);

        // Mark unread messages as read for this user
        if (mobile) {
            await Message.updateMany(
                { sessionId, senderMobile: { $ne: mobile }, isRead: false },
                { isRead: true }
            );
        }

        // Get QR info for display
        const qr = await QR.findOne({ qrId: session.qrId });

        return res.status(200).json({
            success: true,
            data: {
                session: {
                    sessionId: session.sessionId,
                    qrId: session.qrId,
                    scannerMobile: session.scannerMobile,
                    ownerMobile: session.ownerMobile,
                    status: session.isExpired() ? 'EXPIRED' : session.status,
                    expiresAt: session.expiresAt,
                    scannerMessageCount: session.scannerMessageCount,
                    ownerHasReplied: session.ownerHasReplied,
                },
                ownerName: qr?.vehicleData?.ownerName || 'Vehicle Owner',
                vehicleNumber: qr?.vehicleData?.vehicleNumber || '',
                messages,
            },
        });
    } catch (error) {
        console.error('Get Messages Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch messages.',
            error: error.message,
        });
    }
};

// ─── Get Chat List for a user ───────────────────────────────────────────────
const getChatList = async (req, res) => {
    try {
        const { mobile } = req.params;

        if (!mobile) {
            return res.status(400).json({
                success: false,
                message: 'Mobile number is required.',
            });
        }

        // Find all sessions where user is scanner OR owner
        const sessions = await ChatSession.find({
            $or: [
                { scannerMobile: mobile },
                { ownerMobile: mobile },
            ],
            status: { $in: ['ACTIVE', 'EXPIRED'] },
        }).sort({ 'lastMessage.timestamp': -1, updatedAt: -1 });

        // Enrich with QR/vehicle info and unread counts
        const enrichedSessions = await Promise.all(
            sessions.map(async (s) => {
                const qr = await QR.findOne({ qrId: s.qrId });

                // Count unread messages for this user
                const unreadCount = await Message.countDocuments({
                    sessionId: s.sessionId,
                    senderMobile: { $ne: mobile },
                    isRead: false,
                });

                const isScanner = s.scannerMobile === mobile;
                const isExpired = s.isExpired();

                // Auto-expire
                if (isExpired && s.status === 'ACTIVE') {
                    s.status = 'EXPIRED';
                    await s.save();
                }

                return {
                    sessionId: s.sessionId,
                    qrId: s.qrId,
                    status: isExpired ? 'EXPIRED' : s.status,
                    role: isScanner ? 'scanner' : 'owner',
                    otherPartyName: isScanner
                        ? (qr?.vehicleData?.ownerName || 'Vehicle Owner')
                        : 'Someone',
                    vehicleNumber: qr?.vehicleData?.vehicleNumber || '',
                    lastMessage: s.lastMessage,
                    unreadCount,
                    expiresAt: s.expiresAt,
                    createdAt: s.createdAt,
                };
            })
        );

        return res.status(200).json({
            success: true,
            data: enrichedSessions,
        });
    } catch (error) {
        console.error('Get Chat List Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch chat list.',
            error: error.message,
        });
    }
};

// ─── Block a session (owner only) ───────────────────────────────────────────
const blockSession = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { mobile } = req.body;

        const session = await ChatSession.findOne({ sessionId });
        if (!session) {
            return res.status(404).json({
                success: false,
                message: 'Chat session not found.',
            });
        }

        // Only owner can block
        if (mobile !== session.ownerMobile) {
            return res.status(403).json({
                success: false,
                message: 'Only the vehicle owner can block a chat session.',
            });
        }

        session.status = 'BLOCKED';
        await session.save();

        return res.status(200).json({
            success: true,
            message: 'Chat blocked successfully. This person can no longer contact you via this QR.',
        });
    } catch (error) {
        console.error('Block Session Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to block session.',
            error: error.message,
        });
    }
};

module.exports = {
    initiateChat,
    sendMessage,
    getMessages,
    getChatList,
    blockSession,
};
