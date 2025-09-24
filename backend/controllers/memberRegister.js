const db = require('../config/database');

const submitRegistration = async (req, res) => {
  try {
    const {
      head_name,
      head_mobile,
      email,
      occupation,
      occupation_details,
      flat_no,
      block,
      address_line1,
      address_line2,
      city,
      state,
      pincode,
      members
    } = req.body;

    // Step 1: Check if family already exists
    const [existingFamilies] = await db.promise().execute(
      'SELECT id FROM families WHERE head_mobile = ?',
      [head_mobile]
    );

    let familyId;

    if (existingFamilies.length > 0) {
      // Family exists, use existing ID
      familyId = existingFamilies[0].id;
      
      // Update family data
      await db.promise().execute(
        `UPDATE families SET 
          head_name = ?, email = ?, occupation = ?, occupation_details = ?,
          flat_no = ?, block = ?, address_line1 = ?, address_line2 = ?,
          city = ?, state = ?, pincode = ?, updated_at = NOW()
         WHERE id = ?`,
        [
          head_name, email, occupation, occupation_details,
          flat_no, block, address_line1, address_line2,
          city, state, pincode, familyId
        ]
      );

      // Delete existing members (except primary)
      await db.promise().execute(
        'DELETE FROM family_members WHERE family_id = ? AND is_primary = 0',
        [familyId]
      );
    } else {
      // Insert new family
      const [familyResult] = await db.promise().execute(
        `INSERT INTO families (
          head_name, head_mobile, email, occupation, occupation_details,
          flat_no, block, address_line1, address_line2, city, state, pincode, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
        [
          head_name, head_mobile, email, occupation, occupation_details,
          flat_no, block, address_line1, address_line2, city, state, pincode
        ]
      );
      familyId = familyResult.insertId;

      // Insert family head as primary member
      const headMember = {
        name: head_name,
        relation: 'Self',
        marital_status: '',
        gender: '',
        blood_group: '',
        dob: '',
        doa: '',
        spouse_name: '',
        occupation: occupation,
        occupation_details: occupation_details,
        mobile: head_mobile,
        email: email,
        photo_base64: null,
        is_primary: 1,
        status: 'approved'
      };

      await db.promise().execute(
        `INSERT INTO family_members (
          family_id, name, relation, marital_status, gender, blood_group,
          dob, doa, spouse_name, occupation, occupation_details,
          mobile, email, photo_base64, is_primary, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          familyId,
          headMember.name,
          headMember.relation,
          headMember.marital_status,
          headMember.gender,
          headMember.blood_group,
          headMember.dob,
          headMember.doa,
          headMember.spouse_name,
          headMember.occupation,
          headMember.occupation_details,
          headMember.mobile,
          headMember.email,
          headMember.photo_base64,
          headMember.is_primary,
          headMember.status
        ]
      );
    }

    // Step 2: Insert family members with approved status
    for (const member of members) {
      await db.promise().execute(
        `INSERT INTO family_members (
          family_id, name, relation, marital_status, gender, blood_group,
          dob, doa, spouse_name, occupation, occupation_details,
          mobile, email, photo_base64, is_primary, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          familyId,
          member.name,
          member.relation || member.relationship_to_head,
          member.marital_status,
          member.gender,
          member.blood_group,
          member.dob,
          member.doa,
          member.spouse_name,
          member.occupation,
          member.occupation_details,
          member.mobile,
          member.email,
          member.photo_base64,
          0, // is_primary = 0
          'approved' // Set status to approved
        ]
      );
    }

    // Step 3: Update family status to approved
    await db.promise().execute(
      'UPDATE families SET status = "approved", updated_at = NOW() WHERE id = ?',
      [familyId]
    );

    res.json({
      success: true,
      familyId: familyId,
      message: 'Registration submitted and approved successfully'
    });

  } catch (error) {
    console.error('Registration submission error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to submit registration',
      error: error.message
    });
  }
};

// Simple status update endpoint using familyId
const approveFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    // Update family status
    await db.promise().execute(
      'UPDATE family_members SET status = "approved", updated_at = NOW() WHERE id = ?',
      [familyId]
    );

    // Update all members status
    await db.promise().execute(
      'UPDATE family_members SET status = "approved", updated_at = NOW() WHERE family_id = ?',
      [familyId]
    );

    res.json({
      success: true,
      message: 'Family and all members approved successfully'
    });

  } catch (error) {
    console.error('Approve family error:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to approve family',
      error: error.message
    });
  }
};

// Get registration status by familyId
const getRegistrationByFamilyId = async (req, res) => {
  try {
    const { familyId } = req.params;

    const [families] = await db.promise().execute(
      'SELECT * FROM families WHERE id = ?',
      [familyId]
    );

    if (families.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Family not found'
      });
    }

    const family = families[0];

    // Get family members
    const [members] = await db.promise().execute(
      'SELECT * FROM family_members WHERE family_id = ? ORDER BY is_primary DESC',
      [familyId]
    );

    res.json({
      success: true,
      data: {
        ...family,
        members: members
      }
    });

  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration data'
    });
  }
};

// Get registration by mobile number
const getRegistrationByMobile = async (req, res) => {
  try {
    const { mobile } = req.params;

    const [families] = await db.promise().execute(
      'SELECT * FROM families WHERE head_mobile = ?',
      [mobile]
    );

    if (families.length === 0) {
      return res.json({
        success: true,
        data: null,
        message: 'No registration found for this mobile number'
      });
    }

    const family = families[0];

    // Get family members
    const [members] = await db.promise().execute(
      'SELECT * FROM family_members WHERE family_id = ? ORDER BY is_primary DESC',
      [family.id]
    );

    res.json({
      success: true,
      data: {
        ...family,
        members: members
      }
    });

  } catch (error) {
    console.error('Get registration by mobile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch registration data'
    });
  }
};

module.exports = {
  submitRegistration,
  approveFamily,
  getRegistrationByFamilyId,
  getRegistrationByMobile
};