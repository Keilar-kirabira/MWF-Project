// flash message

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const el = document.getElementById("flashMsg");
    if (el) {
      const alert = new bootstrap.Alert(el);
      alert.close(); // triggers Bootstrap’s fade-out animation
    }
  }, 3000);
});

 

//for filters and search
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.mb-4 button');
  const rows = document.querySelectorAll('#productTable tr');
  const searchInput = document.getElementById('searchInput');

  let currentFilter = 'All';

  // Filter buttons
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class from all buttons
      buttons.forEach(b => b.classList.remove('active'));
      
      // Add active class to clicked button
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter');
      updateTable();
    });
  });

  // Search input
  searchInput.addEventListener('input', () => {
    updateTable();
  });

  function updateTable() {
    const searchTerm = searchInput.value.toLowerCase();

    rows.forEach(row => {
      const productName = row.cells[0].innerText.toLowerCase(); // Search only in Product Name
      const type = row.getAttribute('data-type');

      const matchesFilter = currentFilter === 'All' || type === currentFilter;
      const matchesSearch = productName.includes(searchTerm);

      if (matchesFilter && matchesSearch) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  }

  // Set "All" as active by default
  buttons[0].classList.add('active');
});
