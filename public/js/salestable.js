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


//search and total
document.addEventListener('DOMContentLoaded', () => {
  const table = document.querySelector('table.table');
  const rows = table.querySelectorAll('tbody tr');
  const searchInput = document.getElementById('searchInput');
  const totalQuantityEl = document.getElementById('totalQuantity');
  const totalPriceEl = document.getElementById('totalPrice');

  const updateTotals = () => {
    let totalQuantity = 0;
    let totalPrice = 0;

    rows.forEach(row => {
      if (row.style.display !== 'none') { // only visible rows
        const quantity = parseFloat(row.cells[3].textContent) || 0;
        const price = parseFloat(row.cells[6].textContent) || 0;
        totalQuantity += quantity;
        totalPrice += price;
      }
    });

    totalQuantityEl.textContent = totalQuantity;
    totalPriceEl.textContent = new Intl.NumberFormat().format(totalPrice);
  };

  // Search functionality
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.toLowerCase();
    rows.forEach(row => {
      const customerName = row.cells[0].textContent.toLowerCase();
      const productName = row.cells[2].textContent.toLowerCase();
      if (customerName.includes(term) || productName.includes(term)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
    updateTotals();
  });

  // Initial totals
  updateTotals();
});
