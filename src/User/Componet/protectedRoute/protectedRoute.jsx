import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ element }) => {
  if (localStorage.getItem("id")) {
    return element;
  }
  return <Navigate to={"/login"} />;
};

export default ProtectedRoute;
