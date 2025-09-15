// components/ProtectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/authcontext";
import Loader from "@/layouts/Loading"
interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <><Loader /></>;
  if (!user) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
