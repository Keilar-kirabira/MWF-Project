document.addEventListener("DOMContentLoaded", function () {
    const Signup = document.getElementById("Signup");
    
    // Form inputs
    const profileImage = document.getElementById("profileImage");
    const userName = document.getElementById("userName");
    const email = document.getElementById("email");
    const birthDate = document.getElementById("birthDate");
    const gender = document.getElementById("gender");
    const nin = document.getElementById("nin");
    const phoneNumber = document.getElementById("phoneNumber");
    const role = document.getElementById("role");
    const password = document.getElementById("password");
    const nextofKin = document.getElementById("nextofKin");
    const nokNumber = document.getElementById("nokNumber");
    const employeeId = document.getElementById("employeeId");

    // Password toggle functionality
    const togglePassword = document.getElementById("togglePassword");
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = password.type === 'password' ? 'text' : 'password';
            password.type = type;
            
            // Toggle eye icon
            const icon = this.querySelector('i');
            if (type === 'password') {
                icon.classList.remove('bi-eye-slash');
                icon.classList.add('bi-eye');
            } else {
                icon.classList.remove('bi-eye');
                icon.classList.add('bi-eye-slash');
            }
        });
    }

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
    function validateProfileImage(input) {
        if (!input.files || input.files.length === 0) {
            return false;
        }
        const file = input.files[0];
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        
        return validTypes.includes(file.type) && file.size <= maxSize;
    }

    function validateUserName(input) {
        const value = input.value.trim();
        // Username: 3-20 characters, letters, numbers, underscore, hyphen
        return value.length >= 3 && value.length <= 20 && /^[a-zA-Z0-9_-]+$/.test(value);
    }

    function validateEmail(input) {
        const value = input.value.trim();
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    function validateBirthDate(input) {
        const value = input.value;
        if (!value) return false;
        
        const birthDate = new Date(value);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        
        // Must be at least 18 years old
        return age >= 18 && age <= 100;
    }

    function validateGender(input) {
        return input.value !== '';
    }

    function validateNIN(input) {
        const value = input.value.trim();
        // Uganda NIN: exactly 13 characters (alphanumeric)
        return value.length === 13 && /^[A-Z0-9]{13}$/i.test(value);
    }

    function validatePhoneNumber(input) {
        const value = input.value.trim();
        // Simple length check: 10-15 characters
        return value.length >= 10 && value.length <= 15;
    }

    function validateRole(input) {
        return input.value !== '';
    }

    function validatePassword(input) {
        const value = input.value;
        // At least 6 characters
        return value.length >= 6;
    }

    function validateNextOfKin(input) {
        const value = input.value.trim();
        // At least 3 characters, only letters and spaces
        return value.length >= 3 && /^[a-zA-Z\s]+$/.test(value);
    }

    function validateNokNumber(input) {
        const value = input.value.trim();
        // Simple length check: 10-15 characters
        return value.length >= 10 && value.length <= 15;
    }

    function validateEmployeeId(input) {
        const value = input.value.trim();
        // Format: MWF-XXX (at least 7 characters)
        return value.length >= 7 && /^MWF-[0-9]{3,}$/i.test(value);
    }

    // Add real-time validation for all fields
    addRealTimeValidation(profileImage, validateProfileImage);
    addRealTimeValidation(userName, validateUserName);
    addRealTimeValidation(email, validateEmail);
    addRealTimeValidation(birthDate, validateBirthDate);
    addRealTimeValidation(gender, validateGender);
    addRealTimeValidation(nin, validateNIN);
    addRealTimeValidation(phoneNumber, validatePhoneNumber);
    addRealTimeValidation(role, validateRole);
    addRealTimeValidation(password, validatePassword);
    addRealTimeValidation(nextofKin, validateNextOfKin);
    addRealTimeValidation(nokNumber, validateNokNumber);
    addRealTimeValidation(employeeId, validateEmployeeId);

    // Auto-format functions
    userName.addEventListener('input', function() {
        // Remove spaces and special characters except underscore and hyphen
        this.value = this.value.replace(/[^a-zA-Z0-9_-]/g, '');
    });

    nin.addEventListener('input', function() {
        // Convert to uppercase and remove spaces
        this.value = this.value.toUpperCase().replace(/\s/g, '');
    });

    nextofKin.addEventListener('blur', function() {
        if (this.value.trim()) {
            // Capitalize first letter of each word
            this.value = this.value.trim().replace(/\b\w/g, l => l.toUpperCase());
        }
    });

    employeeId.addEventListener('input', function() {
        // Convert to uppercase
        this.value = this.value.toUpperCase();
    });

    // Form submission validation
    Signup.addEventListener("submit", function (e) {
        let isValid = true;

        // Reset previous errors
        const allInputs = [
            profileImage, userName, email, birthDate, gender, nin,
            phoneNumber, role, password, nextofKin, nokNumber, employeeId
        ];
        
        allInputs.forEach(input => {
            input.classList.remove("is-invalid");
            input.classList.remove("is-valid");
        });

        // Validate Profile Image
        if (!validateProfileImage(profileImage)) {
            profileImage.classList.add("is-invalid");
            isValid = false;
        } else {
            profileImage.classList.add("is-valid");
        }

        // Validate Username
        if (!validateUserName(userName)) {
            userName.classList.add("is-invalid");
            isValid = false;
        } else {
            userName.classList.add("is-valid");
        }

        // Validate Email
        if (!validateEmail(email)) {
            email.classList.add("is-invalid");
            isValid = false;
        } else {
            email.classList.add("is-valid");
        }

        // Validate Birth Date
        if (!validateBirthDate(birthDate)) {
            birthDate.classList.add("is-invalid");
            isValid = false;
        } else {
            birthDate.classList.add("is-valid");
        }

        // Validate Gender
        if (!validateGender(gender)) {
            gender.classList.add("is-invalid");
            isValid = false;
        } else {
            gender.classList.add("is-valid");
        }

        // Validate NIN
        if (!validateNIN(nin)) {
            nin.classList.add("is-invalid");
            isValid = false;
        } else {
            nin.classList.add("is-valid");
        }

        // Validate Phone Number
        if (!validatePhoneNumber(phoneNumber)) {
            phoneNumber.classList.add("is-invalid");
            isValid = false;
        } else {
            phoneNumber.classList.add("is-valid");
        }

        // Validate Role
        if (!validateRole(role)) {
            role.classList.add("is-invalid");
            isValid = false;
        } else {
            role.classList.add("is-valid");
        }

        // Validate Password
        if (!validatePassword(password)) {
            password.classList.add("is-invalid");
            isValid = false;
        } else {
            password.classList.add("is-valid");
        }

        // Validate Next of Kin
        if (!validateNextOfKin(nextofKin)) {
            nextofKin.classList.add("is-invalid");
            isValid = false;
        } else {
            nextofKin.classList.add("is-valid");
        }

        // Validate Next of Kin Number
        if (!validateNokNumber(nokNumber)) {
            nokNumber.classList.add("is-invalid");
            isValid = false;
        } else {
            nokNumber.classList.add("is-valid");
        }

        // Validate Employee ID
        if (!validateEmployeeId(employeeId)) {
            employeeId.classList.add("is-invalid");
            isValid = false;
        } else {
            employeeId.classList.add("is-valid");
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
    const textInputs = [userName, email, nin, phoneNumber, password, nextofKin, nokNumber, employeeId];
    textInputs.forEach(input => {
        resetValidation(input);
    });

    // For select elements
    [gender, role].forEach(select => {
        select.addEventListener('change', function() {
            this.classList.remove('is-invalid', 'is-valid');
        });
    });

    // For date input
    birthDate.addEventListener('change', function() {
        this.classList.remove('is-invalid', 'is-valid');
    });

    // For file input
    profileImage.addEventListener('change', function() {
        this.classList.remove('is-invalid', 'is-valid');
    });
});