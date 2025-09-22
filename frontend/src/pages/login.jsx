// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// export default function Login() {
//   const [mobile, setMobile] = useState("");
//   const navigate = useNavigate();

//   // Regex for 10 digit Indian numbers only (without +91)
//   const indianMobileRegex = /^[6-9]\d{9}$/;

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!mobile) {
//       return alert("Please enter your mobile number");
//     }

//     if (!indianMobileRegex.test(mobile)) {
//       return alert(
//         "Invalid mobile number. Enter 10 digits starting with 6-9"
//       );
//     }

//     // Add +91 prefix
//     const fullNumber = `+91${mobile}`;

//     // Generate OTP (frontend only)
//     const otp = Math.floor(1000 + Math.random() * 9000).toString();
//     localStorage.setItem("otp", otp);
//     localStorage.setItem("mobile", fullNumber);

//     alert(`OTP sent to ${fullNumber}: ${otp}`);
//     navigate("/otp");
//   };

//   return (
//     <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
//       <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
//         {/* Header */}
//         <div className="flex justify-center items-center mb-6">
//           <h1 className="text-xl sm:text-2xl font-bold text-blue-700 text-center">
//             Society Manager
//           </h1>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit}>
//           <h2 className="text-lg font-semibold text-gray-800 mb-2">
//             Login / Register
//           </h2>
//           <p className="text-sm text-gray-500 mb-4">
//             Enter your 10-digit mobile number. +91 code is indian Mobile Regex.
//           </p>

//           <label
//             htmlFor="mobile"
//             className="block text-sm font-medium text-gray-700 mb-1"
//           >
//             Mobile Number
//           </label>
//           <div className="flex">
//             <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-700">
//               +91
//             </span>
//             <input
//               id="mobile"
//               type="tel"
//               value={mobile}
//               onChange={(e) =>
//                 setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
//               }
//               placeholder="9876543210"
//               required
//               className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
//           >
//             Send OTP
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [mobile, setMobile] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Regex for 10 digit Indian numbers only (without +91)
  const indianMobileRegex = /^[6-9]\d{9}$/;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mobile) {
      return alert("Please enter your mobile number");
    }

    if (!indianMobileRegex.test(mobile)) {
      return alert(
        "Invalid mobile number. Enter 10 digits starting with 6-9"
      );
    }

    setLoading(true);

    try {
      // Call the backend API to send OTP
      const response = await fetch('http://localhost:5000/api/auth/request-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile }),
      });

      const data = await response.json();

      if (data.success) {
        // Store mobile in localStorage for OTP verification
        localStorage.setItem("mobile", mobile);
        
        // In development, you might want to show the OTP for testing
        if (process.env.NODE_ENV === 'development') {
          alert(`OTP sent to +91${mobile}: ${data.otp}`);
        } else {
          alert(`OTP sent to +91${mobile}`);
        }
        
        navigate("/otp");
      } else {
        alert(data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert("Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex justify-center items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-blue-700 text-center">
            Society Manager
          </h1>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <h2 className="text-lg font-semibold text-gray-800 mb-2">
            Login / Register
          </h2>
          <p className="text-sm text-gray-500 mb-4">
            Enter your 10-digit mobile number. We'll send you an OTP to verify.
          </p>

          <label
            htmlFor="mobile"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Mobile Number
          </label>
          <div className="flex">
            <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-300 bg-gray-100 text-gray-700">
              +91
            </span>
            <input
              id="mobile"
              type="tel"
              value={mobile}
              onChange={(e) =>
                setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))
              }
              placeholder="9876543210"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-r-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-base"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 mt-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Sending OTP...' : 'Send OTP'}
          </button>
        </form>
      </div>
    </div>
  );
}