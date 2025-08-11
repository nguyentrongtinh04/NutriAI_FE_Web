import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from "./pages/Welcome";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Home from "./pages/Home";
import ProfileSettings from "./pages/Settings/Profile/ProfileSettings";
import Settings from "./pages/Settings/Account/Settings";
import NotificationSettings from "./pages/Settings/Notifications/NotificationSettings";
import UserSupport from "./pages/Settings/Support/UserSupport";
import Goals from "./pages/Goals";
import Reports from "./pages/Reports";
// ⚠️ Đảm bảo đúng tên file: PlansList.tsx hay Planslist.tsx?
import Plans from "./pages/Plans/Planslist";
import NotificationsPage from "./components/NotificationsPage";

// Nếu bạn đã thêm hệ thống thông báo:
import { NotificationsProvider } from "./components/notifications/NotificationsProvider";

function App() {
  return (
      <NotificationsProvider position="top-right">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<ProfileSettings />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/notifications" element={<NotificationSettings />} />
          <Route path="/support" element={<UserSupport />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/plans" element={<Plans />} />
          <Route path="/notificationpages" element={<NotificationsPage />} />
        </Routes>
      </NotificationsProvider>
  );
}

export default App;
