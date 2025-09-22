import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import OTP from "./pages/otp";
import Dashboard from "./pages/Dashboard";
import RegistrationPage from "./pages/registrationPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration" element={<RegistrationPage />} />
      </Routes>
    </Router>
  );
}

export default App;
