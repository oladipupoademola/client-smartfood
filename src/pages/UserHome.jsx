// src/pages/UserHome.jsx
import React, { useEffect, useMemo, useState, useContext } from "react";
import axios from "axios";
import CartModal from "../components/CartModal";
import CartContext from "../context/CartContext";
import Navbar from "../components/Navbar";
import "./UserHome.css";

const UserHome = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const { cart, addToCart } = useContext(CartContext);

  // tiny debounce helper
  const debounced = useMemo(() => {
    let t;
    return (fn, delay = 300) => {
      clearTimeout(t);
      t = setTimeout(fn, delay);
    };
  }, []);

  const fetchMenuItems = async (q = "", c = "") => {
    setLoading(true);
    try {
      const params = {};
      if (q) params.search = q;
      if (c) params.category = c;

      const res = await axios.get("http://localhost:5000/api/menu", { params });
      setMenuItems(res.data || []);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  // ✅ Ensure vendorId & menuItemId are included in cart item
  const handleAddToCart = (item) => {
    const payload = {
      ...item,
      menuItemId: item.menuItemId || item._id,
      vendorId: item.vendorId, // should be present if your MenuItem has vendorId
      quantity: item.quantity || 1,
    };
    addToCart(payload);
    alert(`${item.name} added to cart`);
  };

  // Navbar hooks
  const handleSearch = (q) => {
    setSearch(q);
    debounced(() => fetchMenuItems(q, category));
  };

  const handleFilterChange = (c) => {
    setCategory(c);
    fetchMenuItems(search, c);
  };

  return (
    <div className="user-home">
      {/* Navbar */}
      <Navbar
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onLogout={() => localStorage.clear()}
      />

      <h1 className="user-home-title">Browse Meals on SmartFood</h1>

      {loading ? (
        <p className="loading-text">Loading menus...</p>
      ) : menuItems.length === 0 ? (
        <p className="no-items">No meals available at the moment.</p>
      ) : (
        <div className="menu-grid">
          {menuItems.map((item) => (
            <div key={item._id} className="menu-card">
              <img
                src={item.imageUrl || "https://via.placeholder.com/250"}
                alt={item.name}
                className="menu-image"
              />
              <div className="menu-info">
                <h3>{item.name}</h3>
                <p>₦{item.price}</p>
                <button
                  className="add-btn"
                  onClick={() => handleAddToCart(item)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && <CartModal />}
    </div>
  );
};

export default UserHome;
