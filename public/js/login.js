document.addEventListener('DOMContentLoaded', () => {
  
  // Toggle password visibility
  const togglePassword = document.querySelector('#togglePassword');
  const password = document.querySelector('#password');

  if (togglePassword && password) {
    togglePassword.addEventListener('click', () => {
      const type = password.getAttribute('type') === 'password' ? 'text' : 'password';
      password.setAttribute('type', type);
      togglePassword.innerHTML = type === 'password' 
        ? '<i class="bi bi-eye"></i>' 
        : '<i class="bi bi-eye-slash"></i>';
    });
  }

  // Form validation
  const form = document.querySelector('#loginForm');
  const emailInput = document.querySelector('#email');
  const passwordInput = document.querySelector('#password');
  const successMsg = document.querySelector('#successMsg');

  // Email validation regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validate email
  function validateEmail() {
    const value = emailInput.value.trim();
    
    if (value === '') {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
      emailInput.nextElementSibling.textContent = 'Email is required.';
      return false;
    }
    
    // Check if it's a valid email
    if (!emailRegex.test(value)) {
      emailInput.classList.add('is-invalid');
      emailInput.classList.remove('is-valid');
      emailInput.nextElementSibling.textContent = 'Please enter a valid email address.';
      return false;
    }
    
    emailInput.classList.remove('is-invalid');
    emailInput.classList.add('is-valid');
    return true;
  }

  // Validate password
  function validatePassword() {
    const value = passwordInput.value;
    
    if (value === '') {
      passwordInput.classList.add('is-invalid');
      passwordInput.classList.remove('is-valid');
      passwordInput.parentElement.querySelector('.invalid-feedback').textContent = 'Password is required.';
      return false;
    }
    
    if (value.length < 6) {
      passwordInput.classList.add('is-invalid');
      passwordInput.classList.remove('is-valid');
      passwordInput.parentElement.querySelector('.invalid-feedback').textContent = 'Password must be at least 6 characters.';
      return false;
    }
    
    passwordInput.classList.remove('is-invalid');
    passwordInput.classList.add('is-valid');
    return true;
  }

  // Real-time validation
  if (emailInput) {
    emailInput.addEventListener('blur', validateEmail);
    emailInput.addEventListener('input', () => {
      if (emailInput.classList.contains('is-invalid') || emailInput.classList.contains('is-valid')) {
        validateEmail();
      }
    });
  }

  if (passwordInput) {
    passwordInput.addEventListener('blur', validatePassword);
    passwordInput.addEventListener('input', () => {
      if (passwordInput.classList.contains('is-invalid') || passwordInput.classList.contains('is-valid')) {
        validatePassword();
      }
    });
  }

  // Form submission
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Clear previous success message
      if (successMsg) {
        successMsg.textContent = '';
      }
      
      // Validate all fields
      const isEmailValid = validateEmail();
      const isPasswordValid = validatePassword();
      
      // If all validations pass
      if (isEmailValid && isPasswordValid) {
        // Show success message
        if (successMsg) {
          successMsg.textContent = 'Validation successful! Logging in...';
          
          // Submit form after brief delay
          setTimeout(() => {
            form.submit();
          }, 1000);
        }
      } else {
        // Focus on first invalid field
        if (!isEmailValid) {
          emailInput.focus();
        } else if (!isPasswordValid) {
          passwordInput.focus();
        }
      }
    });
  }
});