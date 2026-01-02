// js/login.js

const loginForm = document.getElementById('loginForm');
const submitBtn = document.getElementById('submitBtn');
const errorMessage = document.getElementById('errorMessage');
const successMessage = document.getElementById('successMessage');

// Show error message
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.add('show');
  successMessage.classList.remove('show');
};

// Show success message
const showSuccess = (message) => {
  successMessage.textContent = message;
  successMessage.classList.add('show');
  errorMessage.classList.remove('show');
};

// Hide all messages
const hideMessages = () => {
  errorMessage.classList.remove('show');
  successMessage.classList.remove('show');
};

// Check if already logged in
if (isLoggedIn()) {
  window.location.href = 'dashboard.html';
}

// Handle form submission
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  hideMessages();
  
  // Get form values
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  
  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Logging in<span class="loading"></span>';
  
  try {
    // Make API call to backend
    const response = await fetch(config.endpoints.login, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    });
    
    const data = await response.json();
    
    if (response.ok && data.success) {
      // Success! Save token and user data
      saveToken(data.data.token);
      saveUser(data.data);
      
      showSuccess('Login successful! Redirecting...');
      
      // Redirect to dashboard after 1 second
      setTimeout(() => {
        window.location.href = 'dashboard.html';
      }, 1000);
      
    } else {
      // Show error from backend
      showError(data.message || 'Invalid email or password!');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Login';
    }
    
  } catch (error) {
    console.error('Login error:', error);
    showError('Unable to connect to server. Please try again.');
    submitBtn.disabled = false;
    submitBtn.textContent = 'Login';
  }
});