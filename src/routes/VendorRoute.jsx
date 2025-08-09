import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const VendorRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth?.token) return <Navigate to="/login" replace />;
  if (auth.user?.role !== "vendor") return <Navigate to="/" replace />;

  return children;
};

export default VendorRoute;
