import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import OTP from "./pages/otp";
import Dashboard from "./pages/Dashboard";
import RegistrationPage from "./pages/registrationPage";
import HeadPage from "./pages/HeadPage";
import MemberPage from "./pages/Members";
import SuperAdminDashboard from "./pages/SuperAdminPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/otp" element={<OTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/head" element={<HeadPage />} />
        <Route path="/members" element={<MemberPage />} />
        <Route path="/admins" element={<SuperAdminDashboard/>}/>

      </Routes>
    </Router>
  );
}

export default App;
