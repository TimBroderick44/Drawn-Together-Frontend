import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // without this the order is out of sync
  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    console.log(
      "ProtectedRoute: User is not authenticated, redirecting to login page"
    );
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
