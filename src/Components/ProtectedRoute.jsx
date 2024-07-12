import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const playerInfo = useSelector((state) => state.authslice.playerdata);

  if (!playerInfo) {
    return <Navigate to="/" />;
  }

  return element;
};

export default ProtectedRoute;
