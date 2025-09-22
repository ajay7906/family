const express = require('express');
const router = express.Router();
const registrationController = require('../controllers/registrationController');

// Submit family registration
router.post('/submit', registrationController.submitRegistration);

// Get all families
router.get('/families', registrationController.getAllFamilies);

// Get family by ID
router.get('/family/:id', registrationController.getFamilyById);

module.exports = router;