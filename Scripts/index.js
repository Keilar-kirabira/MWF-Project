document.getElementById("loginForm") .addEventListener("submit",function(event) {
  event.preventDefault();

  const form = event.target;
  const email = form.email.value.trim();
  const role = form.role.value;

  //bootsrap validation class reset
    form.classList.remove('was-validated');

  // Simple client-side validation
  let valid = true;

  // Email validation
  if (!email || !validateEmail(email)) {
    form.email.classList.add('is-invalid');
    valid = false;
  } else {
    form.email.classList.remove('is-invalid');
  }

  // Password validation
  if (!password || password.length < 6) {
    form.password.classList.add('is-invalid');
    valid = false;
  } else {
    form.password.classList.remove('is-invalid');
  }

  // Role selection validation
  if (!role) {
    form.role.classList.add('is-invalid');
    valid = false;
  } else {
    form.role.classList.remove('is-invalid');
  }

  if (valid) {
    // Redirect based on role selection
    if (role === 'manager') {
      window.location.href = 'dashboard.html'; // Replace with your manager dashboard URL
    } else if (role === 'sales attendant') {
      window.location.href = 'attendant-dashboard.html'; // Replace with your attendant dashboard URL
    }
  } else {
    form.classList.add('was-validated'); // Bootstrap visual feedback
  }
});
  
// Helper function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}