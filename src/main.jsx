import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import './index.css';

import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx"; // ✅ Add this

import axios from "axios";

// ✅ Global Axios config
axios.defaults.baseURL = "http://localhost:5000/api";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* ✅ Wrap App with CartProvider */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
