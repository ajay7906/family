// routes/familyMemberRoutes.js
const express = require('express');
const router = express.Router();
const familyMemberController = require('../controllers/memberController');

// Add a new family member
router.post('/members', familyMemberController.addFamilyMember);

// // Bulk add family members
// router.post('/members/bulk', familyMemberController.addBulkFamilyMembers);

// // Get all members for a family
// router.get('/families/:familyId/members', familyMemberController.getFamilyMembers);

// // Get a specific family member
// router.get('/members/:id', familyMemberController.getFamilyMember);

// // Update a family member
// router.put('/members/:id', familyMemberController.updateFamilyMember);

// // Delete a family member
// router.delete('/members/:id', familyMemberController.deleteFamilyMember);

module.exports = router;