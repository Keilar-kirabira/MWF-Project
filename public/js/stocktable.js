

// // Wait until the DOM is fully loaded
// document.addEventListener('DOMContentLoaded', () => {
//   const searchInput = document.getElementById('searchInput');
//   const productTable = document.getElementById('productTable');

//   // Listen for any changes in the input
//   searchInput.addEventListener('input', () => {
//     const filter = searchInput.value.trim().toLowerCase();
//     const rows = productTable.querySelectorAll('tr');

//     rows.forEach(row => {
//       const nameCell = row.querySelector('td:nth-child(1)');
//       const typeCell = row.querySelector('td:nth-child(2)');

//       if (nameCell && typeCell) {
//         const nameText = nameCell.textContent.toLowerCase();
//         const typeText = typeCell.textContent.toLowerCase();

//         // Show row if either name or type includes the search text
//         row.style.display = (nameText.includes(filter) || typeText.includes(filter)) ? '' : 'none';
//       }
//     });
//   });
// });
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const productTable = document.getElementById('productTable');
  const totalQuantityEl = document.getElementById('totalQuantity');
  const totalSellingEl = document.getElementById('totalSelling');

  const updateTotals = () => {
    const rows = productTable.querySelectorAll('tr');
    let totalQuantity = 0;
    let totalSelling = 0;

    rows.forEach(row => {
      if (row.style.display !== 'none') { // only sum visible rows
        const quantity = parseFloat(row.querySelector('td.quantity').textContent) || 0;
        const selling = parseFloat(row.querySelector('td.sellingPrice').textContent) || 0;
        totalQuantity += quantity;
        totalSelling += selling;
      }
    });

    totalQuantityEl.textContent = new Intl.NumberFormat().format(totalQuantity);
    totalSellingEl.textContent = new Intl.NumberFormat().format(totalSelling);
  };

  // Search filter
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.trim().toLowerCase();
    const rows = productTable.querySelectorAll('tr');

    rows.forEach(row => {
      const nameCell = row.querySelector('td:nth-child(1)');
      const typeCell = row.querySelector('td:nth-child(2)');

      if (nameCell && typeCell) {
        const nameText = nameCell.textContent.toLowerCase();
        const typeText = typeCell.textContent.toLowerCase();
        row.style.display = (nameText.includes(filter) || typeText.includes(filter)) ? '' : 'none';
      }
    });

    updateTotals(); // recalculate totals after filtering
  });

  // Initial totals
  updateTotals();
});
