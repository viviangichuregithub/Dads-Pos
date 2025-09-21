import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000", // Flask backend
  withCredentials: true, // required for Flask-Login sessions
});

export default api;
