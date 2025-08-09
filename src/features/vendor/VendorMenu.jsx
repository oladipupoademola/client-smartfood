import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./VendorMenu.css";

const CATEGORY_OPTIONS = [
  "Appetizer",
  "Main Course",
  "Dessert",
  "Beverages",
  "Salad",
  "Soup",
];

const VendorMenu = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: CATEGORY_OPTIONS[0],
    available: true,
    image: null,
    imagePreview: "",
  });

  // ✅ Get vendorId (swap to your auth store if different)
  const vendorId =
    localStorage.getItem("vendorId") ||
    localStorage.getItem("userId") ||
    "";

  useEffect(() => {
    if (!vendorId) {
      toast.error("No vendorId found. Please log in again as a vendor.");
    }
    fetchMenuItems();

    // cleanup preview URL on unmount
    return () => {
      if (formData.imagePreview?.startsWith("blob:")) {
        URL.revokeObjectURL(formData.imagePreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchMenuItems = async () => {
    try {
      const params = vendorId ? { vendor: vendorId } : {};
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/menu`, { params });
      setMenuItems(res.data || []);
    } catch (err) {
      toast.error("Failed to fetch menu items.");
      console.error(err);
    }
  };

  const handleOpenModal = (item = null) => {
    setEditItem(item);
    if (item) {
      setFormData({
        name: item.name || "",
        price: item.price || "",
        category: item.category || CATEGORY_OPTIONS[0],
        available: item.available ?? true,
        image: null,
        imagePreview: item.imageUrl || "",
      });
    } else {
      setFormData({
        name: "",
        price: "",
        category: CATEGORY_OPTIONS[0],
        available: true,
        image: null,
        imagePreview: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditItem(null);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      const file = files?.[0];
      if (!file) return;
      setFormData((prev) => {
        if (prev.imagePreview?.startsWith("blob:")) {
          URL.revokeObjectURL(prev.imagePreview);
        }
        return {
          ...prev,
          image: file,
          imagePreview: URL.createObjectURL(file),
        };
      });
    } else if (type === "checkbox") {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!vendorId) {
        toast.error("Missing vendorId. Please sign in again as a vendor.");
        return;
      }

      const data = new FormData();
      data.append("name", formData.name);
      data.append("price", formData.price);
      data.append("category", formData.category);
      data.append("available", formData.available);
      data.append("vendorId", vendorId); // ✅ critical for POST & PUT
      if (formData.image) data.append("image", formData.image);

      if (editItem) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/menu/${editItem._id}`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Menu item updated successfully");
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/menu`, data, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Menu item added successfully");
      }

      fetchMenuItems();
      handleCloseModal();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        (editItem ? "Error updating menu item." : "Error creating menu item.");
      toast.error(msg);
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/menu/${id}`);
      toast.success("Menu item deleted");
      fetchMenuItems();
    } catch (err) {
      toast.error("Failed to delete menu item");
      console.error(err);
    }
  };

  return (
    <div className="vendor-menu-wrapper">
      <div className="vendor-menu-header">
        <h1>Vendor Menu Management</h1>
        <button className="add-item-btn" onClick={() => handleOpenModal()}>
          + Add New Item
        </button>
      </div>

      <div className="menu-items-container">
        {menuItems.map((item) => (
          <div key={item._id} className="menu-card">
            {item.imageUrl && (
              <img src={item.imageUrl} alt={item.name} className="menu-item-image" />
            )}
            <div className="menu-info">
              <h3>{item.name}</h3>
              <p>Price: ₦{item.price}</p>
              <p>Category: {item.category}</p>
              <p className={item.available ? "status-available" : "status-unavailable"}>
                {item.available ? "Available" : "Not Available"}
              </p>
            </div>
            <div className="menu-actions">
              <button className="edit-btn" onClick={() => handleOpenModal(item)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>{editItem ? "Edit Item" : "Add New Item"}</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </label>

              <label>
                Price:
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                />
              </label>

              <label>
                Category:
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </label>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  name="available"
                  checked={formData.available}
                  onChange={handleChange}
                />
                Available
              </label>

              <label>
                Image:
                <input type="file" name="image" accept="image/*" onChange={handleChange} />
              </label>

              {formData.imagePreview && (
                <img src={formData.imagePreview} alt="Preview" className="image-preview" />
              )}

              <div className="modal-buttons">
                <button type="submit">{editItem ? "Update" : "Add"}</button>
                <button type="button" onClick={handleCloseModal}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorMenu;
