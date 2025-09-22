const db = require('../config/database');

const memberController = {
  // Create family_members table if not exists
  ensureTableExists: (callback) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS family_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        family_id INT,
        name VARCHAR(100) NOT NULL,
        relationship_to_head VARCHAR(50) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        dob DATE,
        marital_status VARCHAR(20),
        blood_group VARCHAR(10),
        spouse_name VARCHAR(100),
        doa DATE,
        occupation VARCHAR(100),
        occupation_details TEXT,
        mobile VARCHAR(15),
        email VARCHAR(100),
        photo_base64 LONGTEXT,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE,
        INDEX family_index (family_id)
      )
    `;
    
    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating family_members table:', err);
        return callback(err);
      }
      callback(null);
    });
  },

  // Add a new family member
  addMember: (req, res) => {
    memberController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const {
        family_id,
        name,
        relationship_to_head,
        gender,
        dob,
        marital_status,
        blood_group,
        spouse_name,
        doa,
        occupation,
        occupation_details,
        mobile,
        email,
        photo_base64
      } = req.body;

      // Validate required fields
      if (!family_id || !name || !relationship_to_head || !gender) {
        return res.status(400).json({
          success: false,
          message: 'Family ID, name, relationship, and gender are required'
        });
      }

      const query = `
        INSERT INTO family_members 
        (family_id, name, relationship_to_head, gender, dob, marital_status, blood_group, 
         spouse_name, doa, occupation, occupation_details, mobile, email, photo_base64)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        query,
        [family_id, name, relationship_to_head, gender, dob, marital_status, blood_group, 
         spouse_name, doa, occupation, occupation_details, mobile, email, photo_base64],
        (err, results) => {
          if (err) {
            console.error('Error adding member:', err);
            return res.status(500).json({
              success: false,
              message: 'Error adding family member'
            });
          }

          res.json({
            success: true,
            message: 'Family member added successfully',
            memberId: results.insertId
          });
        }
      );
    });
  },

  // Update a family member
  updateMember: (req, res) => {
    memberController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const memberId = req.params.id;
      const {
        name,
        relationship_to_head,
        gender,
        dob,
        marital_status,
        blood_group,
        spouse_name,
        doa,
        occupation,
        occupation_details,
        mobile,
        email,
        photo_base64
      } = req.body;

      const query = `
        UPDATE family_members 
        SET name = ?, relationship_to_head = ?, gender = ?, dob = ?, marital_status = ?, 
            blood_group = ?, spouse_name = ?, doa = ?, occupation = ?, occupation_details = ?, 
            mobile = ?, email = ?, photo_base64 = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `;

      db.query(
        query,
        [name, relationship_to_head, gender, dob, marital_status, blood_group, 
         spouse_name, doa, occupation, occupation_details, mobile, email, photo_base64, memberId],
        (err) => {
          if (err) {
            console.error('Error updating member:', err);
            return res.status(500).json({
              success: false,
              message: 'Error updating family member'
            });
          }

          res.json({
            success: true,
            message: 'Family member updated successfully'
          });
        }
      );
    });
  },

  // Delete a family member
  deleteMember: (req, res) => {
    memberController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const memberId = req.params.id;

      const query = 'DELETE FROM family_members WHERE id = ?';

      db.query(query, [memberId], (err) => {
        if (err) {
          console.error('Error deleting member:', err);
          return res.status(500).json({
            success: false,
            message: 'Error deleting family member'
          });
        }

        res.json({
          success: true,
          message: 'Family member deleted successfully'
        });
      });
    });
  },

  // Get all members for a family
  getMembersByFamily: (req, res) => {
    memberController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const familyId = req.params.familyId;

      const query = 'SELECT * FROM family_members WHERE family_id = ? ORDER BY is_primary DESC, id ASC';

      db.query(query, [familyId], (err, results) => {
        if (err) {
          console.error('Error fetching members:', err);
          return res.status(500).json({
            success: false,
            message: 'Error fetching family members'
          });
        }

        res.json({
          success: true,
          members: results
        });
      });
    });
  },

  // Get a specific member
  getMemberById: (req, res) => {
    memberController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const memberId = req.params.id;

      const query = 'SELECT * FROM family_members WHERE id = ?';

      db.query(query, [memberId], (err, results) => {
        if (err) {
          console.error('Error fetching member:', err);
          return res.status(500).json({
            success: false,
            message: 'Error fetching family member'
          });
        }

        if (results.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Family member not found'
          });
        }

        res.json({
          success: true,
          member: results[0]
        });
      });
    });
  }
};

module.exports = memberController;