
document.addEventListener("DOMContentLoaded", function () {
  const stockForm = document.getElementById("stockForm");

  // Inputs
  const productName = document.getElementById("productName");
  const productType = document.getElementById("productType");
  const quantity = document.getElementById("quantity");
  const costPrice = document.getElementById("costPrice");
  const dateBought = document.getElementById("dateBought");
  const quality = document.getElementById("quality");
  const measurements = document.getElementById("measurements");
  const supplierName = document.getElementById("supplierName");
  const supplierPhone = document.getElementById("supplierPhone");

  // Auto-set today's date and restrict date picker
  const today = new Date().toLocaleDateString('en-CA');
  dateBought.value = today;
  // dateBought.setAttribute("min", today);



  stockForm.addEventListener("submit", function (e) {
    let isValid = true;

    // Reset previous errors
    [
      productName, productType, quantity, costPrice, dateBought,
      quality, measurements, supplierName, supplierPhone
    ].forEach(input => {
      input.classList.remove("is-invalid");
      input.classList.remove("is-valid");
    });

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
      productType.classList.add("is-valid");
    }

    // Validate Quantity
    if (!quantity.value || parseInt(quantity.value) < 1) {
      quantity.classList.add("is-invalid");
      isValid = false;
    } else {
      quantity.classList.add("is-valid");
    }

    // Validate Cost Price
    if (!costPrice.value || parseFloat(costPrice.value) < 100) {
      costPrice.classList.add("is-invalid");
      isValid = false;
    } else {
      costPrice.classList.add("is-valid");
    }

    // Validate Date (allow any valid date, not just today)
    if (!dateBought.value) {
      dateBought.classList.add("is-invalid");
      isValid = false;
    } else {
      dateBought.classList.add("is-valid");
    }

    // Validate Quality
    if (!quality.value) {
      quality.classList.add("is-invalid");
      isValid = false;
    } else {
      quality.classList.add("is-valid");
    }

    // Validate Supplier Name
    if (!supplierName.value) {
      supplierName.classList.add("is-invalid");
      isValid = false;
    } else {
      supplierName.classList.add("is-valid");
    }

    // Validate Supplier Phone
    if (!supplierPhone.value) {
      supplierPhone.classList.add("is-invalid");
      isValid = false;
    } else {
      supplierPhone.classList.add("is-valid");
    }

    // Validate Measurements (optional field)
    if (measurements.value.trim() !== "" && !/cm/.test(measurements.value)) {
      measurements.classList.add("is-invalid");
      isValid = false;
    } else if (measurements.value.trim() !== "") {
      measurements.classList.add("is-valid");
    }

    if (!isValid) {
      e.preventDefault();
      
      // Scroll to first error
      const firstInvalid = document.querySelector('.is-invalid');
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: 'smooth', block: 'center' });
        firstInvalid.focus();
      }
      
      // Don't auto-reset the form - let user correct errors
      return;
    }
    
  });

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

  // Add real-time validation for key fields
  addRealTimeValidation(quantity, (input) => input.value && parseInt(input.value) >= 1);
  addRealTimeValidation(costPrice, (input) => input.value && parseFloat(input.value) >= 100);
  addRealTimeValidation(measurements, (input) => 
    !input.value.trim() || /cm/.test(input.value)
  );

  // Selling price calculation
  const priceInput = document.getElementById('productPrice');
  const markup = 0.7;
  
  costPrice.addEventListener('input', () => {
    const cost = parseFloat(costPrice.value) || 0;
    priceInput.value = (cost * (1 + markup)).toFixed(2);
  });

  // Supplier sync
  supplierName.addEventListener('change', function() {
    const phone = this.options[this.selectedIndex].dataset.phone;
    if (phone) {
      supplierPhone.value = phone;
    }
  });

  supplierPhone.addEventListener('change', function() {
    const name = this.options[this.selectedIndex].dataset.id;
    if (name) {
      supplierName.value = name;
    }
  });
});


