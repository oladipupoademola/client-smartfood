import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import CartContext from "../context/CartContext"; // optional; remove if not using
import "./Navbar.css";

const Navbar = ({ onSearch, onFilterChange, onLogout }) => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  // Optional cart badge
  const { cart = [] } = useContext(CartContext) || { cart: [] };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    onSearch && onSearch(query.trim());
  };

  const handleFilter = (e) => {
    setFilter(e.target.value);
    onFilterChange && onFilterChange(e.target.value);
  };

  const handleLogout = () => {
    // your logout logic (clear tokens, etc.)
    onLogout && onLogout();
    navigate("/login");
  };

  return (
    <nav className="sf-nav">
      {/* Left: Logo */}
      <div className="sf-left">
        <button
          className="sf-burger"
          aria-label="Menu"
          onClick={() => setOpen((v) => !v)}
        >
          ☰
        </button>

        <Link to="/user/home" className="sf-logo">
          <span className="sf-logo-mark">🍽️</span>
          <span className="sf-logo-text">SmartFood</span>
        </Link>
      </div>

      {/* Center: Search + Filter */}
      <div className={`sf-center ${open ? "open" : ""}`}>
        <form className="sf-search" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search meals, vendors..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>

        <select className="sf-filter" value={filter} onChange={handleFilter}>
          <option value="">All</option>
          <option value="rice">Rice</option>
          <option value="swallow">Swallow</option>
          <option value="soup">Soup</option>
          <option value="snacks">Snacks</option>
          <option value="drinks">Drinks</option>
          <option value="grill">Grill</option>
        </select>
      </div>

      {/* Right: Actions */}
      <div className="sf-right">
        <Link to="/checkout" className="sf-cart">
          <span>🛒</span>
          {cart?.length > 0 && <span className="sf-badge">{cart.length}</span>}
        </Link>

        <Link to="/user/profile" className="sf-link">Profile</Link>

        <button className="sf-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
