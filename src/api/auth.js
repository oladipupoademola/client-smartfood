import axios from "./axios";

// Login user
export const loginUser = async (formData) => {
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/login`,
    formData
  );
};

// Register user
export const registerUser = async (formData) => {
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`,
    formData
  );
};

// Logout user
export const logoutUser = async () => {
  return axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`
  );
};
