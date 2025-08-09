import { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const UserRoute = ({ children }) => {
  const { auth } = useContext(AuthContext);

  if (!auth?.token) return <Navigate to="/login" replace />;
  if (auth.user?.role !== "user") return <Navigate to="/" replace />;

  return children;
};

export default UserRoute;
