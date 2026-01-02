// js/signup.js

const signupForm = document.getElementById("signupForm");
const submitBtn = document.getElementById("submitBtn");
const errorMessage = document.getElementById("errorMessage");
const successMessage = document.getElementById("successMessage");

// Show error message
const showError = (message) => {
  errorMessage.textContent = message;
  errorMessage.classList.add("show");
  successMessage.classList.remove("show");
};

// Show success message
const showSuccess = (message) => {
  successMessage.textContent = message;
  successMessage.classList.add("show");
  errorMessage.classList.remove("show");
};

// Hide all messages
const hideMessages = () => {
  errorMessage.classList.remove("show");
  successMessage.classList.remove("show");
};

// Handle form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault(); // Prevent page reload

  hideMessages();

  // Get form values
  const fullName = document.getElementById("fullName").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const role = document.getElementById("role").value;

  // Validation
  if (password !== confirmPassword) {
    showError("Passwords do not match!");
    return;
  }

  if (password.length < 6) {
    showError("Password must be at least 6 characters!");
    return;
  }

  // Disable button and show loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Creating Account<span class="loading"></span>';

  try {
    // Make API call to backend
    const response = await fetch(config.endpoints.signup, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName,
        email,
        password,
        role,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      // Success! Save token and user data
      saveToken(data.data.token);
      saveUser(data.data);

      showSuccess("Account created successfully! Redirecting...");

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        window.location.href = "/html/dashboard.html";
      }, 2000);
    } else {
      // Show error from backend
      showError(data.message || "Something went wrong!");
      submitBtn.disabled = false;
      submitBtn.textContent = "Create Account";
    }
  } catch (error) {
    console.error("Signup error:", error);
    showError("Unable to connect to server. Please try again.");
    submitBtn.disabled = false;
    submitBtn.textContent = "Create Account";
  }
});
