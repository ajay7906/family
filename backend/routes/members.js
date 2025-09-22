const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Add a new family member
router.post('/add', memberController.addMember);

// Update a family member
router.put('/:id', memberController.updateMember);

// Delete a family member
router.delete('/:id', memberController.deleteMember);

// Get all members for a family
router.get('/family/:familyId', memberController.getMembersByFamily);

// Get a specific member
router.get('/:id', memberController.getMemberById);

module.exports = router;