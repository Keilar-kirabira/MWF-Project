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

 

// //for filters and search
// document.addEventListener('DOMContentLoaded', () => {
//   const buttons = document.querySelectorAll('.mb-4 button');
//   const rows = document.querySelectorAll('#productTable tr');
//   const searchInput = document.getElementById('searchInput');

//   let currentFilter = 'All';

//   // Filter buttons
//   buttons.forEach(btn => {
//     btn.addEventListener('click', () => {
//       // Remove active class from all buttons
//       buttons.forEach(b => b.classList.remove('active'));
      
//       // Add active class to clicked button
//       btn.classList.add('active');

//       currentFilter = btn.getAttribute('data-filter');
//       updateTable();
//     });
//   });

//   // Search input
//   searchInput.addEventListener('input', () => {
//     updateTable();
//   });

//   function updateTable() {
//     const searchTerm = searchInput.value.toLowerCase();

//     rows.forEach(row => {
//       const productName = row.cells[0].innerText.toLowerCase(); // Search only in Product Name
//       const type = row.getAttribute('data-type');

//       const matchesFilter = currentFilter === 'All' || type === currentFilter;
//       const matchesSearch = productName.includes(searchTerm);

//       if (matchesFilter && matchesSearch) {
//         row.style.display = '';
//       } else {
//         row.style.display = 'none';
//       }
//     });
//   }

//   // Set "All" as active by default
//   buttons[0].classList.add('active');
// });


// //calculate totals
// document.addEventListener('DOMContentLoaded', () => {
//   const quantityCells = document.querySelectorAll('#productTable td.quantity');
//   const costCells = document.querySelectorAll('#productTable td.costPrice');
//   const sellingCells = document.querySelectorAll('#productTable td.sellingPrice');

//   let totalQuantity = 0;
//   let totalCost = 0;
//   let totalSelling = 0;

//   quantityCells.forEach(td => {
//     totalQuantity += parseFloat(td.textContent) || 0;
//   });

//   costCells.forEach(td => {
//     totalCost += parseFloat(td.textContent) || 0;
//   });

//   sellingCells.forEach(td => {
//     totalSelling += parseFloat(td.textContent) || 0;
//   });

//   // Update footer
//   document.getElementById('totalQuantity').textContent = totalQuantity;
//   document.getElementById('totalCost').textContent = new Intl.NumberFormat().format(totalCost);
//   document.getElementById('totalSelling').textContent = new Intl.NumberFormat().format(totalSelling);
// });
document.addEventListener('DOMContentLoaded', () => {

  const buttons = document.querySelectorAll('.mb-4 button');
  const rows = document.querySelectorAll('#productTable tr');
  const searchInput = document.getElementById('searchInput');
  let currentFilter = 'All';

  // Function to update totals
  const updateTotals = () => {
    const quantityCells = document.querySelectorAll('#productTable td.quantity');
    const costCells = document.querySelectorAll('#productTable td.costPrice');
    const sellingCells = document.querySelectorAll('#productTable td.sellingPrice');

    let totalQuantity = 0;
    let totalCost = 0;
    let totalSelling = 0;

    quantityCells.forEach((td, i) => {
      const row = td.parentElement;
      if (row.style.display !== 'none') { // Only sum visible rows
        totalQuantity += parseFloat(td.textContent) || 0;
        totalCost += parseFloat(costCells[i].textContent) || 0;
        totalSelling += parseFloat(sellingCells[i].textContent) || 0;
      }
    });

    document.getElementById('totalQuantity').textContent = totalQuantity;
    document.getElementById('totalCost').textContent = new Intl.NumberFormat().format(totalCost);
    document.getElementById('totalSelling').textContent = new Intl.NumberFormat().format(totalSelling);
  };

  // Function to filter/search rows
  const updateTable = () => {
    const searchTerm = searchInput.value.toLowerCase();

    rows.forEach(row => {
      const productName = row.cells[0]?.innerText.toLowerCase() || '';
      const type = row.getAttribute('data-type');

      const matchesFilter = currentFilter === 'All' || type === currentFilter;
      const matchesSearch = productName.includes(searchTerm);

      row.style.display = (matchesFilter && matchesSearch) ? '' : 'none';
    });

    updateTotals(); // Update totals after filtering/search
  };

  // Filter buttons
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      currentFilter = btn.getAttribute('data-filter');
      updateTable();
    });
  });

  // Search input
  searchInput.addEventListener('input', updateTable);

  // Set "All" as active by default
  buttons[0].classList.add('active');

  // Initial totals
  updateTotals();
});
