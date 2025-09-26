import axios from "axios";

const api = axios.create({
  baseURL: "https://pos-app-7ubb.onrender.com", 
  withCredentials: true,
});

export default api;