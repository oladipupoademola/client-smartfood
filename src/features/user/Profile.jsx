import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../context/AuthContext";
import API from "../../api/axios"; // ✅ Centralized axios instance
import "./Profile.css";

const Profile = () => {
  const { auth } = useContext(AuthContext);
  const [userData, setUserData] = useState(auth?.user || null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get("/auth/profile", {
          headers: {
            Authorization: `Bearer ${auth.token}`,
          },
        });
        setUserData(res.data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    if (auth?.token) fetchProfile();
  }, [auth?.token]);

  return (
    <div className="profile-container">
      <h2 className="profile-heading">My Profile</h2>

      {userData ? (
        <div className="profile-card">
          <p>
            <strong>Full Name:</strong> {userData.name}
          </p>
          <p>
            <strong>Email:</strong> {userData.email}
          </p>
          <p>
            <strong>Role:</strong> {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
          </p>
          <p>
            <strong>Joined On:</strong>{" "}
            {new Date(userData.createdAt).toLocaleDateString()}
          </p>
        </div>
      ) : (
        <p className="profile-message">No user information available.</p>
      )}
    </div>
  );
};

export default Profile;
