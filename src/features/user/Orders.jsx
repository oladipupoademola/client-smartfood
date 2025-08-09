import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import AuthContext from "../../context/AuthContext";
import "./Order.css";

const Order = () => {
  const { auth } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/api/user/orders", {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      });
      setOrders(res.data);
    } catch (err) {
      toast.error("Unable to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (auth?.token) fetchOrders();
  }, [auth?.token]);

  return (
    <div className="order-container">
      <h2 className="order-heading">My Orders</h2>

      {loading ? (
        <p className="order-loading">Loading orders...</p>
      ) : orders.length === 0 ? (
        <p className="order-empty">You have not placed any orders yet.</p>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <div className="order-card-header">
                <h3 className="order-id">
                  Order #{order._id.slice(-6).toUpperCase()}
                </h3>
                <span
                  className={`order-status ${
                    order.status === "Delivered"
                      ? "delivered"
                      : "pending"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <p className="order-date">
                Date: {new Date(order.createdAt).toLocaleDateString()}
              </p>

              <ul className="order-items">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <div className="order-total">
                Total: ₦{order.total.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;
