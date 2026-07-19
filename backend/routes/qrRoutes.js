const express = require('express');
const router = express.Router();
const { generateQR, claimQR, updateVehicleData, getQRDetails, listAllQRs, notifyOwner, registerPushToken, getQRNotifications, getUserQRs } = require('../controllers/qrController');
const { validateClaim, validateUpdate, validateQrId } = require('../middleware/validators');
const { handleValidation } = require('../middleware/errorHandler');

// Generate a new QR code
router.post('/generate', generateQR);

// Claim a QR code (link mobile + vehicle)
router.post('/claim', validateClaim, handleValidation, claimQR);

// Update vehicle details (owner verified by mobile)
router.put('/update', validateUpdate, handleValidation, updateVehicleData);

// Get all QRs + notifications for a user (by mobile number)
router.get('/user/:mobile', getUserQRs);

// Register Expo push token for a QR
router.post('/:qrId/push-token', registerPushToken);

// Get notifications for a specific QR
router.get('/:qrId/notifications', getQRNotifications);

// Notify vehicle owner (public — from QR scanner)
router.post('/:qrId/notify', notifyOwner);

// Get QR details by ID
router.get('/:qrId', validateQrId, handleValidation, getQRDetails);

// List all QR codes (admin/debug)
router.get('/', listAllQRs);

module.exports = router;

