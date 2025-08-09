// src/components/CartModal.jsx
import React, { useContext } from "react";
import CartContext from "../context/CartContext";
import { Link } from "react-router-dom";
import "./CartModal.css";

const CartModal = () => {
  const { cart } = useContext(CartContext);
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="cart-modal">
      <h2>Your Cart</h2>
      {cart.map((item, index) => (
        <div key={index} className="cart-item">
          <p>{item.name} - ₦{item.price}</p>
        </div>
      ))}
      <hr />
      <p className="cart-total">Total: ₦{total}</p>
      <Link to="/checkout">
        <button className="checkout-btn">Proceed to Checkout</button>
      </Link>
    </div>
  );
};

export default CartModal;
