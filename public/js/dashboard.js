

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with data-bs-toggle="tooltip"
  const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

  // Initialize tooltips for each element
  tooltipTriggerList.forEach(function (tooltipTriggerEl) {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
