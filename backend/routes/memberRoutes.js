const express = require('express');
const router = express.Router();
const {
 
  approveFamily,
  getRegistrationByFamilyId,
 
} = require('../controllers/memberRegister');
// const { validateRegistrationData } = require('../middleware/validation');

// Submit family registration (with full data - first time)
// router.post('/submit', validateRegistrationData, submitRegistration);

// Simple approval using familyId (without sending all data)
router.patch('/approve/:familyId', approveFamily);

// Get registration by familyId
router.get('/family/:familyId', getRegistrationByFamilyId);

// Get registration status by mobile number
// router.get('/status/:mobile', getRegistrationStatus);

module.exports = router;