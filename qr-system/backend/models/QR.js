const mongoose = require('mongoose');

const qrSchema = new mongoose.Schema(
    {
        qrId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        status: {
            type: String,
            enum: ['UNUSED', 'USED'],
            default: 'UNUSED',
        },
        mobileNumber: {
            type: String,
            default: null,
            index: true,
        },
        vehicleData: {
            vehicleNumber: { type: String, default: null },
            ownerName: { type: String, default: null },
            model: { type: String, default: null },
            color: { type: String, default: null },
            fuel: { type: String, default: null },
        },
        scanCount: {
            type: Number,
            default: 0,
        },
        claimedAt: {
            type: Date,
            default: null,
        },
        lastUpdated: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// Prevent duplicate claims at schema level
qrSchema.pre('save', function (next) {
    if (this.isModified('status') && this.status === 'USED') {
        if (!this.mobileNumber) {
            return next(new Error('Mobile number is required to claim a QR code'));
        }
        if (!this.vehicleData.vehicleNumber || !this.vehicleData.ownerName || !this.vehicleData.model) {
            return next(new Error('Vehicle data is required to claim a QR code'));
        }
    }
    next();
});

module.exports = mongoose.model('QR', qrSchema);
