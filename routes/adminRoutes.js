const express = require('express');
const router = express.Router();
const QR = require('../models/QR');
const Notification = require('../models/Notification');

// ─── Admin Dashboard Stats ─────────────────────────────────────────────────
router.get('/stats', async (req, res) => {
    try {
        const totalQRs = await QR.countDocuments();
        const usedQRs = await QR.countDocuments({ status: 'USED' });
        const unusedQRs = await QR.countDocuments({ status: 'UNUSED' });
        const totalNotifications = await Notification.countDocuments();
        const totalScans = await QR.aggregate([
            { $group: { _id: null, total: { $sum: '$scanCount' } } }
        ]);

        // Recent registrations (last 7 days)
        const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const recentRegistrations = await QR.countDocuments({
            status: 'USED',
            claimedAt: { $gte: sevenDaysAgo },
        });

        // Recent QR generations (last 7 days)
        const recentGenerations = await QR.countDocuments({
            createdAt: { $gte: sevenDaysAgo },
        });

        res.json({
            success: true,
            data: {
                totalQRs,
                usedQRs,
                unusedQRs,
                totalNotifications,
                totalScans: totalScans[0]?.total || 0,
                recentRegistrations,
                recentGenerations,
                registrationRate: totalQRs > 0 ? Math.round((usedQRs / totalQRs) * 100) : 0,
            },
        });
    } catch (error) {
        console.error('Admin Stats Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch stats' });
    }
});

// ─── All QRs with full details (admin) ──────────────────────────────────────
router.get('/qrs', async (req, res) => {
    try {
        const { status, search, page = 1, limit = 50, sort = '-createdAt' } = req.query;

        const filter = {};
        if (status && status !== 'all') filter.status = status.toUpperCase();
        if (search) {
            filter.$or = [
                { qrId: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } },
                { 'vehicleData.vehicleNumber': { $regex: search, $options: 'i' } },
                { 'vehicleData.ownerName': { $regex: search, $options: 'i' } },
            ];
        }

        const qrs = await QR.find(filter)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await QR.countDocuments(filter);

        res.json({
            success: true,
            data: qrs,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
                limit: parseInt(limit),
            },
        });
    } catch (error) {
        console.error('Admin QRs Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch QRs' });
    }
});

// ─── All Notifications (admin) ──────────────────────────────────────────────
router.get('/notifications', async (req, res) => {
    try {
        const { page = 1, limit = 50 } = req.query;

        const notifications = await Notification.find()
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Notification.countDocuments();

        res.json({
            success: true,
            data: notifications,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Admin Notifications Error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch notifications' });
    }
});

// ─── Delete a QR (admin) ────────────────────────────────────────────────────
router.delete('/qrs/:qrId', async (req, res) => {
    try {
        const { qrId } = req.params;
        const qr = await QR.findOneAndDelete({ qrId });
        if (!qr) {
            return res.status(404).json({ success: false, message: 'QR not found' });
        }
        // Also delete related notifications
        await Notification.deleteMany({ qrId });
        res.json({ success: true, message: 'QR deleted successfully' });
    } catch (error) {
        console.error('Admin Delete QR Error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete QR' });
    }
});

module.exports = router;
