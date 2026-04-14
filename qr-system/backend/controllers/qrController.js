const { v4: uuidv4 } = require('uuid');
const QR = require('../models/QR');
const Notification = require('../models/Notification');

// ─── Generate a new QR code ─────────────────────────────────────────────────
const generateQR = async (req, res) => {
    try {
        const qrId = uuidv4();
        const frontendUrl = process.env.FRONTEND_URL || 'https://qyaar-qr.vercel.app';

        const newQR = await QR.create({
            qrId,
            status: 'UNUSED',
        });

        return res.status(201).json({
            success: true,
            message: 'QR code generated successfully',
            data: {
                qrId: newQR.qrId,
                qrURL: `${frontendUrl}/qr/${newQR.qrId}`,
                status: newQR.status,
                createdAt: newQR.createdAt,
            },
        });
    } catch (error) {
        console.error('Generate QR Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to generate QR code',
            error: error.message,
        });
    }
};

// ─── Claim a QR code (link mobile + vehicle data) ───────────────────────────
const claimQR = async (req, res) => {
    try {
        const { qrId, mobileNumber, vehicleNumber, ownerName, model } = req.body;

        // Find the QR
        const qr = await QR.findOne({ qrId });

        if (!qr) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found. Invalid QR ID.',
            });
        }

        if (qr.status === 'USED') {
            return res.status(409).json({
                success: false,
                message: 'This QR code has already been claimed and cannot be reused.',
                data: {
                    qrId: qr.qrId,
                    status: qr.status,
                    mobileNumber: qr.mobileNumber,
                    vehicleData: qr.vehicleData,
                    claimedAt: qr.claimedAt,
                },
            });
        }

        // Update QR with mobile + vehicle data and mark as USED
        qr.status = 'USED';
        qr.mobileNumber = mobileNumber.trim();
        qr.vehicleData = {
            vehicleNumber: vehicleNumber.toUpperCase().trim(),
            ownerName: ownerName.trim(),
            model: model.trim(),
        };
        qr.claimedAt = new Date();
        qr.lastUpdated = new Date();

        await qr.save();

        return res.status(200).json({
            success: true,
            message: 'QR code claimed successfully! Vehicle linked.',
            data: {
                qrId: qr.qrId,
                status: qr.status,
                mobileNumber: qr.mobileNumber,
                vehicleData: qr.vehicleData,
                claimedAt: qr.claimedAt,
            },
        });
    } catch (error) {
        console.error('Claim QR Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to claim QR code',
            error: error.message,
        });
    }
};

// ─── Update Vehicle Details (owner verified by mobile) ──────────────────────
const updateVehicleData = async (req, res) => {
    try {
        const { qrId, mobileNumber, vehicleNumber, ownerName, model, color, fuel } = req.body;

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
                message: 'This QR has not been claimed yet. Claim it first.',
            });
        }

        // Verify ownership via mobile number
        if (qr.mobileNumber !== mobileNumber.trim()) {
            return res.status(403).json({
                success: false,
                message: 'Mobile number does not match the QR owner. Update denied.',
            });
        }

        // Update only vehicle data — mobileNumber and qrId stay fixed
        if (vehicleNumber) qr.vehicleData.vehicleNumber = vehicleNumber.toUpperCase().trim();
        if (ownerName) qr.vehicleData.ownerName = ownerName.trim();
        if (model) qr.vehicleData.model = model.trim();
        if (color !== undefined) qr.vehicleData.color = color.trim();
        if (fuel !== undefined) qr.vehicleData.fuel = fuel.trim();
        qr.lastUpdated = new Date();

        await qr.save();

        return res.status(200).json({
            success: true,
            message: 'Vehicle details updated successfully.',
            data: {
                qrId: qr.qrId,
                status: qr.status,
                mobileNumber: qr.mobileNumber,
                vehicleData: qr.vehicleData,
                lastUpdated: qr.lastUpdated,
            },
        });
    } catch (error) {
        console.error('Update Vehicle Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to update vehicle details',
            error: error.message,
        });
    }
};

// ─── Get QR details by ID (+ increment scan count) ─────────────────────────
const getQRDetails = async (req, res) => {
    try {
        const { qrId } = req.params;

        const qr = await QR.findOne({ qrId });

        if (!qr) {
            return res.status(404).json({
                success: false,
                message: 'QR code not found.',
            });
        }

        // Increment scan count
        qr.scanCount = (qr.scanCount || 0) + 1;
        await qr.save();

        return res.status(200).json({
            success: true,
            data: {
                qrId: qr.qrId,
                status: qr.status,
                mobileNumber: qr.mobileNumber,
                vehicleData: qr.vehicleData,
                scanCount: qr.scanCount,
                createdAt: qr.createdAt,
                claimedAt: qr.claimedAt,
                lastUpdated: qr.lastUpdated,
            },
        });
    } catch (error) {
        console.error('Get QR Details Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch QR details',
            error: error.message,
        });
    }
};

// ─── List all QR codes (admin/debug) ────────────────────────────────────────
const listAllQRs = async (req, res) => {
    try {
        const { status, page = 1, limit = 20 } = req.query;

        const filter = {};
        if (status) filter.status = status.toUpperCase();

        const qrs = await QR.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await QR.countDocuments(filter);

        return res.status(200).json({
            success: true,
            data: qrs.map((qr) => ({
                qrId: qr.qrId,
                status: qr.status,
                mobileNumber: qr.mobileNumber,
                vehicleData: qr.vehicleData,
                scanCount: qr.scanCount,
                createdAt: qr.createdAt,
                claimedAt: qr.claimedAt,
                lastUpdated: qr.lastUpdated,
            })),
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('List QRs Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to fetch QR codes',
            error: error.message,
        });
    }
};

// ─── Notify Vehicle Owner (by QR scanner) ───────────────────────────────────
const notifyOwner = async (req, res) => {
    try {
        const { qrId } = req.params;
        const { message, senderName } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Message is required.',
            });
        }

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
                message: 'This QR has not been registered to any vehicle yet.',
            });
        }

        const notification = await Notification.create({
            qrId,
            message: message.trim().substring(0, 500),
            senderName: (senderName || 'Anonymous').trim().substring(0, 100),
        });

        return res.status(201).json({
            success: true,
            message: 'Vehicle owner has been notified successfully!',
            data: {
                notificationId: notification._id,
                qrId: notification.qrId,
                message: notification.message,
                senderName: notification.senderName,
                createdAt: notification.createdAt,
            },
        });
    } catch (error) {
        console.error('Notify Owner Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Failed to send notification',
            error: error.message,
        });
    }
};

module.exports = {
    generateQR,
    claimQR,
    updateVehicleData,
    getQRDetails,
    listAllQRs,
    notifyOwner,
};
