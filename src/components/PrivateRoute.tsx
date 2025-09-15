// src/components/PrivateRoute.tsx
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { JSX } from "react";

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  // Lấy token từ Redux
  const accessToken = useSelector((state: RootState) => state.auth.accessToken);
  // Nếu Redux chưa có thì fallback sang localStorage
  const token = accessToken || localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
