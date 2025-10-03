//calculations for productprice
  const costInput = document.getElementById('costPrice');
  const priceInput = document.getElementById('productPrice');
  const markup = 0.3; // 30% markup

  costInput.addEventListener('input', () => {
    const cost = parseFloat(costInput.value) || 0;
    priceInput.value = (cost * (1 + markup)).toFixed(2);
  });

  

//function for syncing supplier phone number and supplier name
const supplierName = document.getElementById('supplierName');
const supplierPhone = document.getElementById('supplierPhone');

// When supplier name changes, update phone
supplierName.addEventListener('change', function() {
  const phone = this.options[this.selectedIndex].dataset.phone;
  Array.from(supplierPhone.options).forEach(option => {
    option.selected = option.value === phone;
  });
});

// When supplier phone changes, update name
supplierPhone.addEventListener('change', function() {
  const name = this.options[this.selectedIndex].dataset.id;
  Array.from(supplierName.options).forEach(option => {
    option.selected = option.value === name;
  });
});






                                //VALIDATION
//form elements
const mainError = document.getElementById("mainError");
const stockForm = document.getElementById("stockForm");
const successMessage = document.getElementById("successMessage")

//requires fields
const productName = document.getElementById("productName")

//error fields
const errorFields = {
    productName: document.getElementById("errorproductName")
}





//reset errors
function resetErrors(){
    mainError.style.display = "none";
    Object.values(errorFields).forEach(e => e.textContent = "");
    const inputs = stockForm.querySelectorAll("input, select");
    inputs.forEach(input => input.classList.remove("invalid"));
}

//validate form
function validateForm(){
    resetErrors();
    let isValid = true;



    if (!productName.value.trim()) {
        errorFields.productName.textContent = "Product name is required";
        productName.classList.add("invalid");
        isValid = false;
    }
    if (isValid) {
        mainError.style.display = "block";
        mainError.textContent = "Please fill in the form correctly."
    }
    return isValid;
}
// form submission
stockForm.addEventListener("submit", function(e) {
    if (!validateForm()) {
        e.preventDefault();   // stop only if invalid
    return;
    } 
     // ✅ If valid, form will submit normally to Express route
  successMessage.style.display = "block";
  successMessage.textContent = "Submitting stock...";

  // Hide after 3s
  setTimeout(() => {
    successMessage.style.display = "none";
  }, 3000);

})