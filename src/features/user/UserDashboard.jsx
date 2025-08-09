import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const [user, setUser] = useState({ name: "Guest" });
  const navigate = useNavigate();

  useEffect(() => {
    // Simulated user data fetch – replace with actual API call
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      // Simulate decoded token or API response
      setUser({ name: "John Doe", email: "john@example.com" });
    }
  }, [navigate]);

  return (
    <div className="dashboard-container">
      <h1>Welcome, {user.name} 👋</h1>
      <p>This is your SmartFood user dashboard.</p>

      <div className="dashboard-cards">
        <div className="card">
          <h3>My Orders</h3>
          <p>View your recent food orders and their statuses.</p>
        </div>
        <div className="card">
          <h3>Saved Addresses</h3>
          <p>Manage your delivery locations easily.</p>
        </div>
        <div className="card">
          <h3>Account Settings</h3>
          <p>Update your profile and preferences.</p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
