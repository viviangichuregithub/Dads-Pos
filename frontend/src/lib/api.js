import axios from "axios";

const api = axios.create({
  baseURL: "https://pos-app-1-ncks.onrender.com", 
  withCredentials: true,
});

export default api;