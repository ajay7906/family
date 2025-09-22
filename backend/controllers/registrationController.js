const db = require('../config/database');

const registrationController = {
  // Create families table if not exists
  ensureTableExists: (callback) => {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS families (
        id INT AUTO_INCREMENT PRIMARY KEY,
        head_name VARCHAR(100) NOT NULL,
        head_mobile VARCHAR(15) NOT NULL UNIQUE,
        email VARCHAR(100),
        occupation VARCHAR(100),
        occupation_details TEXT,
        address_line1 VARCHAR(255),
        address_line2 VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        block VARCHAR(50),
        flat_no VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `;
    
    db.query(createTableQuery, (err) => {
      if (err) {
        console.error('Error creating families table:', err);
        return callback(err);
      }
      
      // Create family_members table
      const createMembersTableQuery = `
        CREATE TABLE IF NOT EXISTS family_members (
          id INT AUTO_INCREMENT PRIMARY KEY,
          family_id INT,
          name VARCHAR(100) NOT NULL,
          relation VARCHAR(50) NOT NULL,
          age INT,
          mobile VARCHAR(15),
          email VARCHAR(100),
          occupation VARCHAR(100),
          is_primary BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE CASCADE
        )
      `;
      
      db.query(createMembersTableQuery, (err) => {
        if (err) {
          console.error('Error creating family_members table:', err);
          return callback(err);
        }
        callback(null);
      });
    });
  },

  // Submit family registration
  submitRegistration: (req, res) => {
    // First ensure tables exist
    registrationController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const {
        head_name,
        head_mobile,
        email,
        occupation,
        occupation_details,
        address_line1,
        address_line2,
        city,
        state,
        pincode,
        block,
        flat_no,
        members
      } = req.body;

      // Validate required fields
      if (!head_name || !head_mobile) {
        return res.status(400).json({
          success: false,
          message: 'Head name and mobile are required'
        });
      }

      // Start transaction
      db.beginTransaction((err) => {
        if (err) {
          return res.status(500).json({
            success: false,
            message: 'Database error'
          });
        }

        // Insert family data
        const insertFamilyQuery = `
          INSERT INTO families 
          (head_name, head_mobile, email, occupation, occupation_details, address_line1, address_line2, city, state, pincode, block, flat_no)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
          insertFamilyQuery,
          [head_name, head_mobile, email, occupation, occupation_details, address_line1, address_line2, city, state, pincode, block, flat_no],
          (err, results) => {
            if (err) {
              db.rollback(() => {
                if (err.code === 'ER_DUP_ENTRY') {
                  return res.status(400).json({
                    success: false,
                    message: 'Mobile number already registered'
                  });
                }
                console.error('Error inserting family:', err);
                res.status(500).json({
                  success: false,
                  message: 'Error saving family data'
                });
              });
              return;
            }

            const familyId = results.insertId;

            // Insert family members if any
            if (members && members.length > 0) {
              const insertMemberQuery = `
                INSERT INTO family_members 
                (family_id, name, relation, age, mobile, email, occupation, is_primary)
                VALUES ?
              `;

              const memberValues = members.map(member => [
                familyId,
                member.name,
                member.relation,
                member.age,
                member.mobile,
                member.email,
                member.occupation,
                member.is_primary || false
              ]);

              db.query(insertMemberQuery, [memberValues], (err) => {
                if (err) {
                  db.rollback(() => {
                    console.error('Error inserting members:', err);
                    res.status(500).json({
                      success: false,
                      message: 'Error saving family members'
                    });
                  });
                  return;
                }

                // Commit transaction
                db.commit((err) => {
                  if (err) {
                    db.rollback(() => {
                      console.error('Error committing transaction:', err);
                      res.status(500).json({
                        success: false,
                        message: 'Error completing registration'
                      });
                    });
                    return;
                  }

                  res.json({
                    success: true,
                    message: 'Registration completed successfully',
                    familyId: familyId
                  });
                });
              });
            } else {
              // No members to insert, just commit
              db.commit((err) => {
                if (err) {
                  db.rollback(() => {
                    console.error('Error committing transaction:', err);
                    res.status(500).json({
                      success: false,
                      message: 'Error completing registration'
                    });
                  });
                  return;
                }

                res.json({
                  success: true,
                  message: 'Registration completed successfully',
                  familyId: familyId
                });
              });
            }
          }
        );
      });
    });
  },

  // Get all families
  getAllFamilies: (req, res) => {
    registrationController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const query = `
        SELECT f.*, COUNT(fm.id) as member_count 
        FROM families f 
        LEFT JOIN family_members fm ON f.id = fm.family_id 
        GROUP BY f.id 
        ORDER BY f.created_at DESC
      `;

      db.query(query, (err, results) => {
        if (err) {
          console.error('Error fetching families:', err);
          return res.status(500).json({
            success: false,
            message: 'Error fetching families'
          });
        }

        res.json({
          success: true,
          families: results
        });
      });
    });
  },

  // Get family by ID with members
  getFamilyById: (req, res) => {
    registrationController.ensureTableExists((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Database error'
        });
      }

      const familyId = req.params.id;

      // Get family details
      const familyQuery = 'SELECT * FROM families WHERE id = ?';
      db.query(familyQuery, [familyId], (err, familyResults) => {
        if (err) {
          console.error('Error fetching family:', err);
          return res.status(500).json({
            success: false,
            message: 'Error fetching family'
          });
        }

        if (familyResults.length === 0) {
          return res.status(404).json({
            success: false,
            message: 'Family not found'
          });
        }

        // Get family members
        const membersQuery = 'SELECT * FROM family_members WHERE family_id = ? ORDER BY is_primary DESC, id ASC';
        db.query(membersQuery, [familyId], (err, memberResults) => {
          if (err) {
            console.error('Error fetching family members:', err);
            return res.status(500).json({
              success: false,
              message: 'Error fetching family members'
            });
          }

          res.json({
            success: true,
            family: familyResults[0],
            members: memberResults
          });
        });
      });
    });
  }
};

module.exports = registrationController;