import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./VendorDashboard.css"; // reuse existing styles

const VendorOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");

  // prevent overlapping fetches
  const fetchingRef = useRef(false);

  const vendorId =
    localStorage.getItem("vendorId") ||
    localStorage.getItem("userId") ||
    "";

  const fetchOrders = async () => {
    if (!vendorId) {
      setLoading(false);
      setOrders([]);
      return;
    }
    if (fetchingRef.current) return; // skip if a fetch is in-flight
    fetchingRef.current = true;

    try {
      // Prefer vendor-scoped endpoint; fallback to query if needed
      let res;
      try {
        res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/${vendorId}`);
      } catch {
        res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
          params: { vendor: vendorId },
        });
      }
      setOrders(res.data || []);
    } catch (e) {
      console.error("Failed to load orders", e);
      setOrders([]);
    } finally {
      fetchingRef.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    // initial load
    fetchOrders();

    // 🔁 auto-refresh every 15s
    const interval = setInterval(() => {
      fetchOrders();
    }, 15000);

    // cleanup on unmount
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateStatus = async (orderId, next) => {
    if (!orderId) return;
    const yes = window.confirm(`Set order ${orderId.slice(-6)} to "${next}"?`);
    if (!yes) return;

    try {
      setUpdatingId(orderId);
      await axios.patch(`${import.meta.env.VITE_API_BASE_URL}/api/orders/${orderId}/status`, {
        status: next,
      });
      // quick refresh after update
      await fetchOrders();
    } catch (e) {
      console.error("Update status failed", e);
      alert("Failed to update order status. Please try again.");
    } finally {
      setUpdatingId("");
    }
  };

  // tiny inline btn style so we don't touch your CSS files
  const btn = {
    padding: ".45rem .7rem",
    borderRadius: "10px",
    border: "1px solid #eee",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  };
  const btnRow = { display: "flex", gap: ".5rem", marginTop: ".6rem" };

  if (!vendorId) {
    return (
      <div className="vendor-dashboard">
        <h1 className="dashboard-title">Orders</h1>
        <p className="card-text">Please log in again as a vendor.</p>
      </div>
    );
  }

  return (
    <div className="vendor-dashboard">
      <h1 className="dashboard-title">Orders</h1>

      {loading ? (
        <p className="card-text">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="card-text">No orders yet.</p>
      ) : (
        <div className="dashboard-grid">
          {orders.map((order) => {
            // Only show items that belong to this vendor
            const myItems = (order.items || []).filter(
              (it) => String(it.vendorId) === String(vendorId)
            );
            if (myItems.length === 0) return null;

            const subTotal = myItems.reduce(
              (sum, it) => sum + (it.price || 0) * (it.quantity || 1),
              0
            );

            // Which actions to show
            const showAccept = order.status === "pending";
            const showDeliver = order.status === "accepted";
            const showCancel = order.status === "pending" || order.status === "accepted";

            return (
              <div key={order._id} className="dashboard-card">
                <h2 className="card-title">Order #{order._id.slice(-6)}</h2>
                <p className="card-text">
                  <strong>Customer:</strong> {order.fullName} <br />
                  <strong>Phone:</strong> {order.phone} <br />
                  <strong>Delivery:</strong> {order.deliveryType} <br />
                  <strong>Status:</strong> {order.status}
                </p>

                <div style={{ marginTop: ".5rem" }}>
                  <strong>Items for you:</strong>
                  <ul style={{ marginTop: ".3rem" }}>
                    {myItems.map((it, idx) => (
                      <li key={idx}>
                        {it.name} × {it.quantity || 1} — ₦
                        {(it.price || 0) * (it.quantity || 1)}
                      </li>
                    ))}
                  </ul>
                  <p style={{ marginTop: ".4rem" }}>
                    <strong>Subtotal (your items): ₦{subTotal}</strong>
                  </p>
                </div>

                {/* Actions */}
                <div style={btnRow}>
                  {showAccept && (
                    <button
                      style={{ ...btn, background: "#fff5ef", color: "#ff6b00" }}
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, "accepted")}
                    >
                      {updatingId === order._id ? "Updating…" : "Accept"}
                    </button>
                  )}
                  {showDeliver && (
                    <button
                      style={{ ...btn, background: "#eaffea", color: "#169b00" }}
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, "delivered")}
                    >
                      {updatingId === order._id ? "Updating…" : "Delivered"}
                    </button>
                  )}
                  {showCancel && (
                    <button
                      style={{ ...btn, background: "#fff0f0", color: "#c41c1c" }}
                      disabled={updatingId === order._id}
                      onClick={() => updateStatus(order._id, "cancelled")}
                    >
                      {updatingId === order._id ? "Updating…" : "Cancel"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default VendorOrders;
