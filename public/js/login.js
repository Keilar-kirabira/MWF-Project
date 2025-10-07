document.addEventListener('DOMContentLoaded', () => {
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
});



//validations
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById("loginForm");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
});
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let valid = true;

    if (email.value.trim() === ""){
        email.classList.add("is-invalid");
        email.classList.remove("is-valid");
        valid = false;
    }else{
        email.classList.add("is-valid");
        email.classList.remove("is-invalid");
    }


    if (password.value.length < 6) {
      password.classList.add("is-invalid");
      password.classList.remove("is-valid");
      valid = false;
    } else {
      password.classList.add("is-valid");
      password.classList.remove("is-invalid");
    }
     const successMsg = document.getElementById("successMsg");
    if(valid) {
        successMsg.textContent = " Login successful!";
    } else {
        successMsg.textContent = ""; 
    }
})