const db = require('../config/database');

class Otp {
  // Create a new OTP
  static create(mobile, otp, expiresAt, callback) {
    const query = 'INSERT INTO otps (mobile, otp_code, expires_at) VALUES (?, ?, ?)';
    db.query(query, [mobile, otp, expiresAt], (err, results) => {
      if (err) return callback(err);
      callback(null, { id: results.insertId, mobile, otp, expiresAt });
    });
  }

  // Find valid OTP for mobile
  static findByMobile(mobile, callback) {
    const query = 'SELECT * FROM otps WHERE mobile = ? AND is_used = FALSE AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1';
    db.query(query, [mobile], (err, results) => {
      if (err) return callback(err);
      callback(null, results[0]);
    });
  }

  // Verify OTP
  static verify(mobile, otp, callback) {
    // First find the valid OTP
    const findQuery = 'SELECT * FROM otps WHERE mobile = ? AND otp_code = ? AND is_used = FALSE AND expires_at > NOW()';
    db.query(findQuery, [mobile, otp], (err, results) => {
      if (err) return callback(err);
      
      if (results.length === 0) {
        return callback(null, { valid: false, message: 'Invalid or expired OTP' });
      }
      
      // Mark OTP as used
      const updateQuery = 'UPDATE otps SET is_used = TRUE WHERE id = ?';
      db.query(updateQuery, [results[0].id], (err) => {
        if (err) return callback(err);
        callback(null, { valid: true, message: 'OTP verified successfully' });
      });
    });
  }

  // Invalidate previous OTPs for a mobile number
  static invalidatePrevious(mobile, callback) {
    const query = 'UPDATE otps SET is_used = TRUE WHERE mobile = ? AND is_used = FALSE';
    db.query(query, [mobile], (err) => {
      if (err) return callback(err);
      callback(null);
    });
  }
}

module.exports = Otp;