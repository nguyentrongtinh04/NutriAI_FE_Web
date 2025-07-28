import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login"; 
import Register from "./pages/Register";  
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProfileSettings from "./pages/Settings/Profile/ProfileSettings";
import EditProfile from "./pages/Settings/Profile/EditProfile";
import ChangeAvatar from "./pages/Settings/Profile/ChangeAvatar"; 
import Settings from "./pages/Settings/Account/Settings";
import NotificationSettings from "./pages/Settings/Notifications/NotificationSettings"; 
import UserSupport from "./pages/Settings/Support/UserSupport";

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
        <Route path="/settings" element={<Settings />} />
        <Route path="/notifications" element={<NotificationSettings />} />
        <Route path="/support" element={<UserSupport />} />
      </Routes>
    </Router>
  );
}

export default App;
