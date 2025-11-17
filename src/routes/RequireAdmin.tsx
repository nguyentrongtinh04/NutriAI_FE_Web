import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";

export default function RequireAdmin({ children }: { children: JSX.Element }) {
  const accessToken =
    useSelector((s: RootState) => s.auth.accessToken) ||
    localStorage.getItem("accessToken");
  const role =
    useSelector((s: RootState) => s.user?.user?.role) ||
    localStorage.getItem("role");

  if (!accessToken) return <Navigate to="/login" replace />;
  if (role !== "admin") return <Navigate to="/" replace />;

  return children;
}
