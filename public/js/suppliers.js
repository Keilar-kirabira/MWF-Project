document.addEventListener("DOMContentLoaded", function () {
    const supplierForm = document.getElementById("supplierForm");
    
    // Form inputs
    const supplierName = document.getElementById("supplierName");
    const supplierCategory = document.getElementById("supplierCategory");
    const phoneNumber = document.getElementById("phoneNumber");
    const email = document.getElementById("email");
    const physicalAddress = document.getElementById("physicaladdress");

    // Real-time validation function
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

    // Individual validation functions
    function validateSupplierName(input) {
        const value = input.value.trim();
        return value.length >= 3 && /^[a-zA-Z\s\-&]+$/.test(value);
    }

    function validateSupplierCategory(input) {
        return input.value !== '';
    }

    function validatePhoneNumber(input) {
        const value = input.value.trim();
        return value.length > 0;
    }

    function validateEmail(input) {
        const value = input.value.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validatePhysicalAddress(input) {
        const value = input.value.trim();
        return value.length >= 3;
    }

    // Add real-time validation for all fields
    addRealTimeValidation(supplierName, validateSupplierName);
    addRealTimeValidation(supplierCategory, validateSupplierCategory);
    addRealTimeValidation(phoneNumber, validatePhoneNumber);
    addRealTimeValidation(email, validateEmail);
    addRealTimeValidation(physicalAddress, validatePhysicalAddress);

    // Auto-format supplier name
    supplierName.addEventListener('blur', function() {
        if (this.value.trim()) {
            this.value = this.value.trim().replace(/\b\w/g, l => l.toUpperCase());
        }
    });

   

    // Form submission validation
    supplierForm.addEventListener("submit", function (e) {
        let isValid = true;

        // Reset previous errors
        [
            supplierName, supplierCategory, phoneNumber, email, physicalAddress
        ].forEach(input => {
            input.classList.remove("is-invalid");
            input.classList.remove("is-valid");
        });

        // Validate Supplier Name
        if (!validateSupplierName(supplierName)) {
            supplierName.classList.add("is-invalid");
            isValid = false;
        } else {
            supplierName.classList.add("is-valid");
        }

        // Validate Supplier Category
        if (!validateSupplierCategory(supplierCategory)) {
            supplierCategory.classList.add("is-invalid");
            isValid = false;
        } else {
            supplierCategory.classList.add("is-valid");
        }

        // Validate Phone Number
        if (!validatePhoneNumber(phoneNumber)) {
            phoneNumber.classList.add("is-invalid");
            isValid = false;
        } else {
            phoneNumber.classList.add("is-valid");
        }

        // Validate Email
        if (!validateEmail(email)) {
            email.classList.add("is-invalid");
            isValid = false;
        } else {
            email.classList.add("is-valid");
        }

        // Validate Physical Address
        if (!validatePhysicalAddress(physicalAddress)) {
            physicalAddress.classList.add("is-invalid");
            isValid = false;
        } else {
            physicalAddress.classList.add("is-valid");
        }

        if (!isValid) {
            e.preventDefault();
            
            // Scroll to first error
            const firstInvalid = document.querySelector('.is-invalid');
            if (firstInvalid) {
                firstInvalid.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
                firstInvalid.focus();
            }
        }
    });

    // Reset form validation when user starts typing/selecting
    function resetValidation(input) {
        input.addEventListener('input', function() {
            this.classList.remove('is-invalid', 'is-valid');
        });
    }

    // Apply reset validation to all inputs
    const allInputs = [supplierName, phoneNumber, email, physicalAddress];
    allInputs.forEach(input => {
        resetValidation(input);
    });

    // For select elements
    supplierCategory.addEventListener('change', function() {
        this.classList.remove('is-invalid', 'is-valid');
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