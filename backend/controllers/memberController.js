// controllers/familyMemberController.js
const db = require('../config/database');

const familyMemberController = {
  ensureTableExists: (callback) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS family_members (
        id INT AUTO_INCREMENT PRIMARY KEY,
        family_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        relation VARCHAR(50) NOT NULL, 
        marital_status VARCHAR(20) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        blood_group VARCHAR(10),
        dob DATE,
        doa DATE,
        spouse_name VARCHAR(100),
        occupation VARCHAR(100),
        occupation_details TEXT,
        mobile VARCHAR(15),
        email VARCHAR(100),
        photo_base64 LONGTEXT,
        is_primary BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
      )
    `;
    
    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating family_members table:', err);
        return callback(err);
      }
      
      // Add the new column if it doesn't exist (for existing tables)
      const alterTableQuery = `
        ALTER TABLE family_members 
        ADD COLUMN IF NOT EXISTS relation VARCHAR(50) AFTER name,
        ADD COLUMN IF NOT EXISTS marital_status VARCHAR(20) AFTER relation,
        ADD COLUMN IF NOT EXISTS blood_group VARCHAR(10) AFTER gender,
        ADD COLUMN IF NOT EXISTS dob DATE AFTER blood_group,
        ADD COLUMN IF NOT EXISTS doa DATE AFTER dob,
        ADD COLUMN IF NOT EXISTS spouse_name VARCHAR(100) AFTER doa,
        ADD COLUMN IF NOT EXISTS occupation_details TEXT AFTER occupation,
        ADD COLUMN IF NOT EXISTS photo_base64 LONGTEXT AFTER email
      `;
      
      db.query(alterTableQuery, (alterErr) => {
        if (alterErr) {
          console.error('Error altering table:', alterErr);
        }
        callback(null);
      });
    });
  },

  // Add a new family member
  addFamilyMember: (req, res) => {
    familyMemberController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const {
        family_id,
        name,
        relationship_to_head,  // Now matches frontend
        marital_status,
        gender,
        blood_group,
        dob,
        doa,
        spouse_name,
        occupation,
        occupation_details,
        mobile,
        email,
        photo_base64,
        is_primary = false
      } = req.body;
       
      let relation = relationship_to_head; // Map to correct field name

      // Validate required fields
      if (!family_id || !name || !relation || !marital_status || !gender) {
        return res.status(400).json({
          success: false,
          message: 'Family ID, name, relationship, marital status, and gender are required'
        });
      }

      // Insert family member with correct column names
      const insertMemberQuery = `
        INSERT INTO family_members 
        (family_id, name, relation, marital_status, gender, blood_group, dob, doa, spouse_name, occupation, occupation_details, mobile, email, photo_base64, is_primary)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertMemberQuery,
        [
          family_id,
          name,
          relation,  // Correct field name
          marital_status,
          gender,
          blood_group || null,
          dob || null,
          doa || null,
          spouse_name || null,
          occupation || null,
          occupation_details || null,
          mobile || null,
          email || null,
          photo_base64 || null,
          is_primary
        ],
        (err, results) => {
          if (err) {
            console.error('Error inserting family member:', err);
            return res.status(500).json({
              success: false,
              message: 'Error saving family member: ' + err.message
            });
          }

          res.status(201).json({
            success: true,
            message: 'Family member added successfully',
            memberId: results.insertId
          });
        }
      );
    });
  }
};

module.exports = familyMemberController;