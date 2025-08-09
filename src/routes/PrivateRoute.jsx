import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  // Check if token exists to confirm authentication
  if (!auth || !auth.token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
