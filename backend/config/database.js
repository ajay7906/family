const mysql = require('mysql2');
require('dotenv').config();

// Create connection
const connection = mysql.createConnection({
  host:  '82.29.162.171',
  user:  'upsb_upsb',
  // password:  'A1ay79/6@.c60',
  password: 'upsb1234',
  // password:'Ajay7906',
  database:  'upsb_upsb'
});

// Connect to MySQL and create database/table if not exists
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  
  console.log('Connected to MySQL server');
  
  // Create database if not exists
  connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME || 'society_manager'}`, (err) => {
    if (err) {
      console.error('Error creating database:', err);
      return;
    }
    
    console.log('Database ensured');
    
    // Switch to the database
    connection.changeUser({database: process.env.DB_NAME || 'society_manager'}, (err) => {
      if (err) {
        console.error('Error switching database:', err);
        return;
      }
      
      // Create OTP table if not exists
      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS otps (
          id INT AUTO_INCREMENT PRIMARY KEY,
          mobile VARCHAR(15) NOT NULL,
          otp_code VARCHAR(6) NOT NULL,
          expires_at DATETIME NOT NULL,
          is_used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          INDEX mobile_index (mobile),
          INDEX expires_at_index (expires_at)
        )
      `;
      
      connection.query(createTableQuery, (err) => {
        if (err) {
          console.error('Error creating table:', err);
          return;
        }
        
        console.log('OTP table ensured');
      });
    });
  });
});

module.exports = connection;