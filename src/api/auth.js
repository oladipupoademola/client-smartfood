import axios from "./axios";

// Login user
export const loginUser = async (formData) => {
  return axios.post("/auth/login", formData);
};

// Register user
export const registerUser = async (formData) => {
  return axios.post("/auth/register", formData);
};

// Optional: Logout user
export const logoutUser = async () => {
  return axios.post("/auth/logout");
};
