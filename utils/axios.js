import axios from "axios";

// const baseUrl = import.meta.env.VITE_USER_API;
// console.log(baseUrl);

const baseUrl = "https://localhost:7211/api"
console.log(baseUrl)

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");
    if (token) {
      request.headers["Authorization"] = `Bearer ${token}`;
    }
    return request;
  },
  (error) => {
    Promise.reject(error);
  }
);

api.interceptors.response.use((response) => response),
  (error) => Promise.reject(error);

export default api;
