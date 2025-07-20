import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login"; 
import Register from "./pages/Register";  
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProfileSettings from "./pages/Settings/ProfileSettings";
import EditProfile from "./pages/Settings/EditProfile";
import ChangeAvatar from "./pages/Settings/ChangeAvatar"; 
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<ProfileSettings />} />
        <Route path="/profile/edit" element={<EditProfile />} />
        <Route path="/profile/change-avatar" element={<ChangeAvatar />} />
      </Routes>
    </Router>
  );
}

export default App;
