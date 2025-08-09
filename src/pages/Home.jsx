import React from "react";
import { Link } from "react-router-dom";
import "./Home.css"; // 👈 Import your CSS file

const Home = () => {
  return (
    <div className="home-wrapper">
      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">Welcome To SmartFood</h1>
        <p className="hero-subtitle">
          Order from multiple restaurants, anytime, anywhere.
        </p>
        <Link to="/login" className="cta-button">
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-heading">Why Choose Us?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Multi-Restaurant Support</h3>
            <p>Order from multiple restaurants in a single checkout process.</p>
          </div>
          <div className="feature-card">
            <h3>Real-Time Tracking</h3>
            <p>Track your food from kitchen to doorstep with live updates.</p>
          </div>
          <div className="feature-card">
            <h3>Easy Vendor Management</h3>
            <p>Vendors can manage menus, orders, and delivery—all from one dashboard.</p>
          </div>
        </div>
      </section>

      {/* Call-to-Action */}
      <section className="cta-section">
        <h2 className="cta-heading">Ready to place your order?</h2>
        <Link to="/register" className="cta-button-secondary">
          Create Account
        </Link>
      </section>
    </div>
  );
};

export default Home;
