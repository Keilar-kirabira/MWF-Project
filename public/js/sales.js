document.addEventListener("DOMContentLoaded", function () {
  const saleForm = document.getElementById("saleForm");

  const customerName = document.getElementById("customerName");
  const productName = document.getElementById("productName");
  const productType = document.getElementById("productType");
  const quantity = document.getElementById("quantity");
  const unitPrice = document.getElementById("unitPrice");
  const totalPrice = document.getElementById("totalPrice");
  const paymentType = document.getElementById("paymentType");
  const paymentDate = document.getElementById("paymentDate");
  const transportCheck = document.getElementById("transportCheck");

  // Auto-set today's date and restrict date picker
  const today = new Date().toLocaleDateString('en-CA'); 
  paymentDate.value = today;
  paymentDate.setAttribute("min", today);
  



  // Real-time validation feedback
  function addRealTimeValidation(input, validator) {
    input.addEventListener('blur', function() {
      if (validator(this)) {
        this.classList.remove('is-invalid');
        this.classList.add('is-valid');
      } else {
        this.classList.remove('is-valid');
        this.classList.add('is-invalid');
      }
    });
  }

  // Add real-time validation for all fields
  addRealTimeValidation(customerName, (input) => 
    input.value.trim().length >= 3 && /^[a-zA-Z\s]+$/.test(input.value.trim())
  );
  
  addRealTimeValidation(productName, (input) => input.value !== '');
  addRealTimeValidation(productType, (input) => input.value !== '');
  addRealTimeValidation(quantity, (input) => input.value && parseInt(input.value) >= 1);
  addRealTimeValidation(unitPrice, (input) => input.value && parseFloat(input.value) >= 100);
  addRealTimeValidation(paymentType, (input) => input.value !== '');
  addRealTimeValidation(paymentDate, (input) => input.value === today);

  // Auto-format customer name
  customerName.addEventListener('blur', function() {
    if (this.value.trim()) {
      this.value = this.value.trim().replace(/\b\w/g, l => l.toUpperCase());
    }
  });

  // Total price calculation
  function calculateTotalPrice() {
    const unitPriceVal = parseFloat(unitPrice.value) || 0;
    const quantityVal = parseFloat(quantity.value) || 0;
    
    if (!isNaN(quantityVal) && !isNaN(unitPriceVal)) {
      const totalCost = (quantityVal * unitPriceVal).toFixed(0);
      totalPrice.value = totalCost;
    } else {
      totalPrice.value = "";
    }  
  }

  // Event listeners for price calculation
  unitPrice.addEventListener("input", calculateTotalPrice);
  quantity.addEventListener("input", calculateTotalPrice);

  // Form submission validation
  saleForm.addEventListener("submit", function (e) {
    let isValid = true;

    // Reset previous errors
    [
      customerName, productName, productType, quantity, unitPrice, paymentType, paymentDate
    ].forEach(input => {
      input.classList.remove("is-invalid");
      input.classList.remove("is-valid");
    });

    // Validate Customer Name - FIXED THIS LINE
    if (customerName.value.trim().length < 3 || !/^[a-zA-Z\s]+$/.test(customerName.value.trim())) {
      customerName.classList.add("is-invalid");
      isValid = false;
    } else {
      customerName.classList.add("is-valid");
    }

    // Validate Product Name
    if (!productName.value) {
      productName.classList.add("is-invalid");
      isValid = false;
    } else {
      productName.classList.add("is-valid");
    }

    // Validate Product Type
    if (!productType.value) {
      productType.classList.add("is-invalid");
      isValid = false;
    } else {
      productName.classList.add("is-valid");
    }

    // Validate Quantity
    if (!quantity.value || parseInt(quantity.value) < 1) {
      quantity.classList.add("is-invalid");
      isValid = false;
    } else {
      quantity.classList.add("is-valid");
    }

    // Validate Unit Price
    if (!unitPrice.value || parseFloat(unitPrice.value) < 100) {
      unitPrice.classList.add("is-invalid");
      isValid = false;
    } else {
      unitPrice.classList.add("is-valid");
    }

    // Validate Payment Type
    if (!paymentType.value) {
      paymentType.classList.add("is-invalid");
      isValid = false;
    } else {
      paymentType.classList.add("is-valid");
    }  

    // Validate Date (must be today)
    if (!paymentDate.value || paymentDate.value !== today) {
      paymentDate.classList.add("is-invalid");
      isValid = false;
    } else {
      paymentDate.classList.add("is-valid");
    }

    if (!isValid) {
      e.preventDefault();
      
      // Scroll to first error
      const firstInvalid = document.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      return;
    }
  });

  // Flash message handling
  const flash = document.getElementById("flashMsg");
  if (flash) {
    setTimeout(() => {
      const alert = new bootstrap.Alert(flash);
      alert.close();
    }, 3000);
  }
});





// document.getElementById("unitPrice").addEventListener("change",function(){                                        //the event listener is listenning to a change
//   const unitPrice = parseFloat(document.getElementById("unitPrice").value)
//     const quantity = parseFloat(document.getElementById("quantity").value)
//     const totalPrice = document.getElementById("totalPrice")
//     if(!isNaN(quantity) && !isNaN(unitPrice)){
//         const totalCost = (quantity * unitPrice).toFixed(0);
//         totalPrice.value = totalCost
//     }else{
//         totalPrice.value = ""
//     }  
// });

// //flash message
// document.addEventListener("DOMContentLoaded", () => {
//   const flash = document.getElementById("flashMsg");
//   if (flash) {
//     // Use Bootstrap's alert method to fade out
//     setTimeout(() => {
//       const alert = new bootstrap.Alert(flash);
//       alert.close(); // fades out the alert
//     }, 3000); // 3000ms = 3 seconds
//   }
// });
