const Otp = require('../models/Otp');

// Generate random OTP
const generateOTP = () => {
  return String(Math.floor(1000 + Math.random() * 9000));
};

const authController = {
  // Request OTP
  requestOTP: async (req, res, next) => {
    try {
      const { mobile } = req.body;
      
      // Validate mobile number
      if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid mobile number. Enter 10 digits starting with 6-9' 
        });
      }
      
      // Generate OTP
      const otp = generateOTP();
      
      // Set expiration time (5 minutes from now)
      const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
      
      // Invalidate previous OTPs for this mobile
      Otp.invalidatePrevious(mobile, (err) => {
        if (err) {
          console.error('Error invalidating previous OTPs:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
          });
        }
        
        // Store new OTP
        Otp.create(mobile, otp, expiresAt, (err, result) => {
          if (err) {
            console.error('Error storing OTP:', err);
            return res.status(500).json({ 
              success: false, 
              message: 'Internal server error' 
            });
          }
          
          // Log OTP to console for development/testing
          console.log(`[DEV] OTP for ${mobile} is: ${otp}`);
          
          // Here you would integrate with an SMS/WhatsApp gateway
          // For now, we just return success
          
          res.json({ 
            success: true, 
            message: 'OTP sent successfully',
            // In production, you wouldn't send the OTP in the response
            otp: process.env.NODE_ENV === 'development' ? otp : undefined
          });
        });
      });
    } catch (error) {
      next(error);
    }
  },
  
  // Verify OTP
  verifyOTP: async (req, res, next) => {
    try {
      const { mobile, otp } = req.body;
      
      // Validate inputs
      if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid mobile number' 
        });
      }
      
      if (!otp || !/^\d{4}$/.test(otp)) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid OTP format' 
        });
      }
      
      // Verify OTP
      Otp.verify(mobile, otp, (err, verification) => {
        if (err) {
          console.error('Error verifying OTP:', err);
          return res.status(500).json({ 
            success: false, 
            message: 'Internal server error' 
          });
        }
        
        if (!verification.valid) {
          return res.status(400).json({
            success: false,
            message: verification.message
          });
        }
        
        res.json({
          success: true,
          message: 'OTP verified successfully'
        });
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;