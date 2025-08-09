import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [adminStats, setAdminStats] = useState(null);

  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setAdminStats(res.data);
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };

    fetchAdminStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <h1 className="dashboard-title">SmartFood Admin Dashboard</h1>

      {adminStats && (
        <div className="stats-bar">
          <p>Total Users: {adminStats.totalUsers}</p>
          <p>Total Vendors: {adminStats.totalVendors}</p>
          <p>Total Orders: {adminStats.totalOrders}</p>
        </div>
      )}

      <div className="dashboard-grid">
        <div className="dashboard-card" onClick={() => navigate("/admin/manage-vendors")}>
          <h2 className="card-title">Manage Vendors</h2>
          <p className="card-text">Add, remove, or update restaurant vendors.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/admin/manage-users")}>
          <h2 className="card-title">Manage Users</h2>
          <p className="card-text">View and manage all platform users.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/admin/orders")}>
          <h2 className="card-title">Orders Overview</h2>
          <p className="card-text">Track orders placed across all vendors.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/admin/analytics")}>
          <h2 className="card-title">Analytics</h2>
          <p className="card-text">View platform usage, vendor stats & charts.</p>
        </div>

        <div className="dashboard-card" onClick={() => navigate("/")}>
          <h2 className="card-title">Go to Homepage</h2>
          <p className="card-text">Return to main SmartFood user page.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
