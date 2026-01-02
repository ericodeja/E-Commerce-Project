// js/config.js

const API_URL = 'http://localhost:5000/api';

const config = {
  API_URL,
  endpoints: {
    signup: `${API_URL}/auth/signup`,
    login: `${API_URL}/auth/login`,
    me: `${API_URL}/auth/me`
  }
};