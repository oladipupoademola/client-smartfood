import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../../api/axios";           // use centralized API
import AuthContext from "../../context/AuthContext";
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [submitting, setSubmitting] = useState(false);

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;

    try {
      setSubmitting(true);

      // Ensure we hit /api/auth/login (axios base should include /api)
      const res = await API.post("/auth/login", formData, {
        withCredentials: false,
        headers: { "Content-Type": "application/json" },
      });

      const { token, user } = res.data || {};
      if (!token || !user) {
        throw new Error("Invalid login response");
      }

      // Keep your existing auth state
      login(token, user);
      toast.success("Login successful!");

      // Optional convenience IDs
      localStorage.setItem("userId", user._id || "");

      // Set/clear vendorId based on role (what your vendor CRUD uses)
      if (user.role === "vendor") {
        localStorage.setItem("vendorId", user._id);
      } else {
        localStorage.removeItem("vendorId");
      }

      // Role-based redirect (unchanged)
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
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Login failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
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
            autoComplete="email"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="login-input"
            autoComplete="current-password"
          />
          <button type="submit" className="login-button" disabled={submitting}>
            {submitting ? "Logging in…" : "Login"}
          </button>
        </form>
        <p className="login-footer">
          Don&apos;t have an account{" "}
          <Link to="/register" className="login-link">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
