

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function OTP() {
  const [inputOtp, setInputOtp] = useState("");
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedMobile = localStorage.getItem("mobile");
    if (savedMobile) setMobile(savedMobile);
  }, []);

  const handleVerify = async () => {
    if (!inputOtp || inputOtp.length !== 4) {
      return alert("Please enter a valid 4-digit OTP");
    }

    setLoading(true);

    try {
      // Call the backend API to verify OTP
      const response = await fetch('http://localhost:5000/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile, otp: inputOtp }),
      });

      const data = await response.json();
      localStorage.setItem("isSuperAdmin", JSON.stringify(data.isSuperAdmin)); // Store user data

      if (data.success) {
        console.log('data of admin',data);
        alert("Login successful!");
        if(data.isSuperAdmin){
          navigate("/admins");
          
        }else{
          navigate("/head"); 
        }

       
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      alert("Failed to verify OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);

    try {
      // Call the backend API to resend OTP
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.success) {
        // In development, you might want to show the OTP for testing
        if (process.env.NODE_ENV === 'development') {
          alert(`New OTP sent to +91${mobile}: ${data.otp}`);
        } else {
          alert(`New OTP sent to +91${mobile}`);
        }
      } else {
        alert(data.message || "Failed to resend OTP");
      }
    } catch (error) {
      console.error("Error resending OTP:", error);
      alert("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeNumber = () => {
    localStorage.removeItem("mobile");
    navigate("/");
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center px-4">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex justify-center items-center mb-4">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-700 text-center">Verify OTP</h2>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          We've sent a 4-digit OTP to <span className="font-medium text-gray-800">+91{mobile || "your number"}</span>
        </p>

        <input
          type="text"
          maxLength={4}
          placeholder="Enter OTP"
          value={inputOtp}
          onChange={(e) => setInputOtp(e.target.value.replace(/\D/g, "").slice(0, 4))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 text-center tracking-widest text-lg"
        />

        <button
          onClick={handleVerify}
          disabled={loading || inputOtp.length !== 4}
          className={`w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold ${loading || inputOtp.length !== 4 ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Verifying...' : 'Verify & Continue'}
        </button>

        <div className="mt-4 text-center space-y-2">
          <button
            onClick={handleResendOTP}
            disabled={loading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            Resend OTP
          </button>
          <br />
          <button
            onClick={handleChangeNumber}
            disabled={loading}
            className="text-sm text-blue-600 hover:underline disabled:opacity-50"
          >
            Change Mobile Number
          </button>
        </div>
      </div>
    </div>
  );
}