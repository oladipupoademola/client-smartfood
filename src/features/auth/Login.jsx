import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUser } from "../../api/auth";
import AuthContext from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(formData);
      const { token, user } = res.data;

      // keep your existing auth state
      login(token, user);
      toast.success("Login successful!");

      // ✅ store userId for convenience (optional)
      localStorage.setItem("userId", user._id || "");

      // ✅ set/clear vendorId based on role (THIS is what your VendorMenu/CRUD needs)
      if (user.role === "vendor") {
        localStorage.setItem("vendorId", user._id);
      } else {
        localStorage.removeItem("vendorId"); // avoid stale vendorId for non‑vendors
      }

      // Role-based redirection (unchanged)
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "vendor":
          navigate("/vendor/dashboard");
          break;
        case "user":
          navigate("/user/home");
          break;
        default:
          navigate("/");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Welcome to SmartFood</h2>
        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="login-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
          />
          <button type="submit" className="login-button">Login</button>
        </form>
        <p className="login-footer">
          Don't have an account?{" "}
          <Link to="/register" className="login-link">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
