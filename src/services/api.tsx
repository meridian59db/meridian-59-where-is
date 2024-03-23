import axios from 'axios';

// Creates the connection
const api = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
});

export default api;
