import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    avatarUrl: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const me = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`);
        setUser(me.data);

        const myOrders = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders/me`);
        setOrders(Array.isArray(myOrders.data) ? myOrders.data : []);
      } catch (e) {
        setError(e.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setUser((u) => ({ ...u, [e.target.name]: e.target.value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // 1) Update basic fields
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/users/me`, {
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
      });

      // 2) Upload avatar if chosen
      if (avatarFile) {
        const fd = new FormData();
        fd.append("avatar", avatarFile);
        const r = await axios.put(`${import.meta.env.VITE_API_BASE_URL}/users/me/avatar`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        setUser((u) => ({ ...u, avatarUrl: r.data.avatarUrl }));
      }

      alert("Profile updated");
    } catch (e) {
      setError(e.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="profile-wrap"><p>Loading profile…</p></div>;

  return (
    <div className="profile-wrap">
      <h1 className="profile-title">My Profile</h1>

      {error && <p className="profile-error">{error}</p>}

      <form className="profile-card" onSubmit={handleSave}>
        <div className="profile-avatar">
          <img
            src={user.avatarUrl || "https://via.placeholder.com/120"}
            alt="avatar"
          />
          <label className="file-btn">
            Change Avatar
            <input type="file" accept="image/*" onChange={(e) => setAvatarFile(e.target.files[0])} />
          </label>
        </div>

        <div className="profile-grid">
          <div className="form-row">
            <label>Full Name</label>
            <input name="fullName" value={user.fullName || ""} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input value={user.email || ""} disabled />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input name="phone" value={user.phone || ""} onChange={handleChange} />
          </div>

          <div className="form-row">
            <label>Address</label>
            <input name="address" value={user.address || ""} onChange={handleChange} />
          </div>
        </div>

        <button className="save-btn" disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </form>

      <div className="orders-card">
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p className="muted">No orders yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((o) => (
              <div className="order-item" key={o._id}>
                <div>
                  <strong>#{o._id.slice(-6)}</strong> • {o.deliveryType} • {new Date(o.createdAt).toLocaleString()}
                </div>
                <div>Status: <strong>{o.status}</strong> • Total: ₦{o.total}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
