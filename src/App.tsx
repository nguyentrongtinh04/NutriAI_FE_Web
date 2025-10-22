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
import Plans from "./pages/Plans/Planslist";
import NotificationsPage from "./components/NotificationsPage";
import { NotificationsProvider } from "./components/notifications/NotificationsProvider";
import ScanMealPage from "./pages/ScanMeals/ScanMealPage";
import { AuthProvider } from "./contexts/Authcontext";
import PrivateRoute from "./components/PrivateRoute";
import SearchFoodPage from "./pages/SearchFoodPage";
import ProfilePage from ".././src/demo";
import ChangePassword from "./pages/Settings/Account/ChangePassWord";
import ScanHistoryPage from "./pages/ScanMeals/ScanHistoryPage";

function App() {
  return (
    <AuthProvider>
      <NotificationsProvider position="top-right">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/scan-meal" element={<ScanMealPage />} />
          <Route path="/search-food" element={<SearchFoodPage />} />
          <Route path="/scan-history" element={<ScanHistoryPage />} />
          
          {/* Private routes */}
          <Route path="/settings/change-password" element={<PrivateRoute><ChangePassword /></PrivateRoute>} />
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><ProfileSettings /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><NotificationSettings /></PrivateRoute>} />
          <Route path="/support" element={<PrivateRoute><UserSupport /></PrivateRoute>} />
          <Route path="/goals" element={<PrivateRoute><Goals /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/plans" element={<PrivateRoute><Plans /></PrivateRoute>} />
          <Route path="/notificationpages" element={<PrivateRoute><NotificationsPage /></PrivateRoute>} />
          <Route path="/demo" element={<ProfilePage />} />
        </Routes>
      </NotificationsProvider>
    </AuthProvider>
  );
}

export default App;
