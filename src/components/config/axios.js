import axios from "axios";

const baseUrl = "http://localhost:8080/";
// const baseUrl = "https://swd392-server-vakx.onrender.com/";

const api = axios.create({
  baseURL: baseUrl,
  timeout: 3000000,
});

const handleBefore = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token.replaceAll('"', "")}`;
  }
  return config;
};

const handleError = (error) => {
  console.error("Lỗi API:", error.response ? error.response.data : error);
  return Promise.reject(error); // Trả về lỗi để Axios biết request thất bại
};

api.interceptors.request.use(handleBefore, handleError);
api.interceptors.response.use((response) => response, handleError);

export default api;
