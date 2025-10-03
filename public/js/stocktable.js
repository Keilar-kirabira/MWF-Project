

// Wait until the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('searchInput');
  const productTable = document.getElementById('productTable');

  // Listen for any changes in the input
  searchInput.addEventListener('input', () => {
    const filter = searchInput.value.trim().toLowerCase();
    const rows = productTable.querySelectorAll('tr');

    rows.forEach(row => {
      const nameCell = row.querySelector('td:nth-child(1)');
      const typeCell = row.querySelector('td:nth-child(2)');

      if (nameCell && typeCell) {
        const nameText = nameCell.textContent.toLowerCase();
        const typeText = typeCell.textContent.toLowerCase();

        // Show row if either name or type includes the search text
        row.style.display = (nameText.includes(filter) || typeText.includes(filter)) ? '' : 'none';
      }
    });
  });
});
