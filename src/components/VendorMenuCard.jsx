// src/components/VendorMenuCard.jsx
import React from "react";
import "./VendorMenuCard.css"; // optional CSS styling

const VendorMenuCard = ({ vendor }) => {
  return (
    <div className="vendor-card">
      <h2>{vendor.name}</h2>

      {vendor.menu && vendor.menu.length > 0 ? (
        <div className="menu-items">
          {vendor.menu.map((item, index) => (
            <div key={index} className="menu-item">
              <h4>{item.name}</h4>
              <p>{item.description}</p>
              <p>₦{item.price}</p>
              {item.image && (
                <img
                  src={item.image}
                  alt={item.name}
                  style={{ width: "100px", borderRadius: "8px" }}
                />
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No menu available for this vendor.</p>
      )}
    </div>
  );
};

export default VendorMenuCard;
