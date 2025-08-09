import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="smartfood-footer">
      <div className="footer-content">
        <h3>SmartFood</h3>
        <p>Your trusted multi-restaurant food ordering and delivery platform.</p>
        <div className="footer-links">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy">Privacy Policy</a>
        </div>
        <p className="footer-credit">
          &copy; {new Date().getFullYear()} SmartFood. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
