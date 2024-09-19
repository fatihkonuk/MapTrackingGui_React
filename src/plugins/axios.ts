import axios from "axios";
import useAuthStore from "../stores/auth.store";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5260/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
