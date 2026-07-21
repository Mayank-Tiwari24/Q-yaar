const { body, param } = require('express-validator');

const validateClaim = [
    body('qrId')
        .notEmpty()
        .withMessage('QR ID is required')
        .isString()
        .withMessage('QR ID must be a string')
        .trim(),
    body('mobileNumber')
        .notEmpty()
        .withMessage('Mobile number is required')
        .isString()
        .withMessage('Mobile number must be a string')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Enter a valid 10-digit Indian mobile number')
        .trim(),
    body('vehicleNumber')
        .notEmpty()
        .withMessage('Vehicle number is required')
        .isString()
        .withMessage('Vehicle number must be a string')
        .isLength({ min: 4, max: 15 })
        .withMessage('Vehicle number must be 4-15 characters')
        .trim(),
    body('ownerName')
        .notEmpty()
        .withMessage('Owner name is required')
        .isString()
        .withMessage('Owner name must be a string')
        .isLength({ min: 2, max: 100 })
        .withMessage('Owner name must be 2-100 characters')
        .trim(),
    body('model')
        .notEmpty()
        .withMessage('Vehicle model is required')
        .isString()
        .withMessage('Vehicle model must be a string')
        .isLength({ min: 2, max: 100 })
        .withMessage('Vehicle model must be 2-100 characters')
        .trim(),
];

const validateUpdate = [
    body('qrId')
        .notEmpty()
        .withMessage('QR ID is required')
        .isString()
        .trim(),
    body('mobileNumber')
        .notEmpty()
        .withMessage('Mobile number is required for verification')
        .matches(/^[6-9]\d{9}$/)
        .withMessage('Enter a valid 10-digit Indian mobile number')
        .trim(),
    body('vehicleNumber')
        .optional()
        .isString()
        .isLength({ min: 4, max: 15 })
        .withMessage('Vehicle number must be 4-15 characters')
        .trim(),
    body('ownerName')
        .optional()
        .isString()
        .isLength({ min: 2, max: 100 })
        .withMessage('Owner name must be 2-100 characters')
        .trim(),
    body('model')
        .optional()
        .isString()
        .isLength({ min: 2, max: 100 })
        .withMessage('Vehicle model must be 2-100 characters')
        .trim(),
    body('color')
        .optional()
        .isString()
        .isLength({ max: 30 })
        .trim(),
    body('fuel')
        .optional()
        .isString()
        .isLength({ max: 20 })
        .trim(),
];

const validateQrId = [
    param('qrId')
        .notEmpty()
        .withMessage('QR ID is required')
        .isUUID()
        .withMessage('Invalid QR ID format'),
];

module.exports = {
    validateClaim,
    validateUpdate,
    validateQrId,
};
