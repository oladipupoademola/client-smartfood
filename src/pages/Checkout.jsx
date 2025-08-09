import React, { useContext, useMemo, useState } from "react";
import CartContext from "../context/CartContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";

const Checkout = () => {
  const { cart, clearCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    deliveryType: "delivery",
  });

  // total with quantity
  const total = useMemo(
    () => cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
    [cart]
  );

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleDummyPay = async () => {
    // Build payload items with vendorId + menuItemId (required)
    const payloadItems = cart.map((it) => ({
      name: it.name,
      price: it.price,
      quantity: it.quantity || 1,
      imageUrl: it.imageUrl,
      vendorId: it.vendorId,                         // must be present
      menuItemId: it.menuItemId || it._id,           // for backend fallback
    }));

    // Guard: block if any item lacks vendorId (avoids 500)
    const badIdx = payloadItems.findIndex((x) => !x.vendorId);
    if (badIdx !== -1) {
      alert(
        `One or more items are missing vendor information.\n` +
        `Item: ${payloadItems[badIdx].name || "(unnamed)"}\n` +
        `Please remove and re-add the item from the menu (it should include a vendor).`
      );
      return;
    }

    setSubmitting(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/orders`, {
        ...formData,
        items: payloadItems,
        total,
      });

      alert("Payment successful. Order placed!");
      clearCart();
      navigate("/user/home");
    } catch (err) {
      console.error("Order submit error:", err);
      const apiMsg =
        err?.response?.data?.message ||
        (err?.response?.status === 422
          ? "One or more items are missing vendor info."
          : "Something went wrong. Please try again.");
      alert(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>

      <div className="checkout-form">
        <label>Full Name</label>
        <input type="text" name="fullName" onChange={handleChange} required />

        <label>Phone</label>
        <input type="text" name="phone" onChange={handleChange} required />

        <label>Delivery Address</label>
        <input type="text" name="address" onChange={handleChange} required />

        <label>Delivery Type</label>
        <select name="deliveryType" value={formData.deliveryType} onChange={handleChange}>
          <option value="delivery">Delivery</option>
          <option value="pickup">Pickup</option>
        </select>

        {/* mini order summary */}
        {cart.length > 0 && (
          <div style={{ marginTop: "1rem" }}>
            <strong>Order Summary</strong>
            <ul style={{ marginTop: ".5rem" }}>
              {cart.map((it, i) => (
                <li key={i}>
                  {it.name} × {it.quantity || 1} — ₦{(it.price || 0) * (it.quantity || 1)}
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className="total">Total: ₦{total}</p>

        <button className="pay-btn" onClick={handleDummyPay} disabled={submitting || cart.length === 0}>
          {submitting ? "Processing…" : "Make Payment"}
        </button>
      </div>
    </div>
  );
};

export default Checkout;
