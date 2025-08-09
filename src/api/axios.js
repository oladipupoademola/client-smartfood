import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // ✅ match your .env
  withCredentials: true, // send cookies if needed
});

export default instance;
