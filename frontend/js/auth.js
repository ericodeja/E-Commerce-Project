// js/auth.js

// Save token to localStorage
const saveToken = (token) => {
  localStorage.setItem('token', token);
};

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Remove token (logout)
const removeToken = () => {
  localStorage.removeItem('token');
};

// Save user data
const saveUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Get user data
const getUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is logged in
const isLoggedIn = () => {
  return !!getToken();
};

// Logout
const logout = () => {
  removeToken();
  localStorage.removeItem('user');
  window.location.href = '/login.html';
};