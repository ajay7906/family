const express = require('express');
const router = express.Router();
const authController = require('../controllers/authControllers');

// Request OTP route
router.post('/request-otp', authController.requestOTP);

// Verify OTP route
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;