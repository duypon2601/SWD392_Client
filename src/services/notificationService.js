import axios from 'axios';

const API_URL = 'http://localhost:8080/api/notification'; // Thay bằng URL backend thực tế

export const fetchUnreadNotifications = async () => {
  const response = await axios.get(`${API_URL}/unread`);
  return response.data;
};

export const markNotificationAsRead = async (id) => {
  await axios.put(`${API_URL}/read/${id}`);
};

export const sendNotification = async (message) => {
  const response = await axios.post(`${API_URL}/send`, message, {
    headers: { 'Content-Type': 'application/json' },
  });
  return response.data;
};