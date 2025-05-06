

import React, { JSX } from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: JSX.Element;
  allowedRoles: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, allowedRoles }) => {
  const role = localStorage.getItem("role")?.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((r) => r.toLowerCase());

  if (!role || !normalizedAllowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default PrivateRoute;
