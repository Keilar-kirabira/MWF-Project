document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("stockTableBody");
  const rows = Array.from(tableBody.querySelectorAll("tr"));
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const typeFilter = document.getElementById("typeFilter");
  const filterBtn = document.getElementById("filterBtn");
  const resetBtn = document.getElementById("resetBtn");
  const downloadPDF = document.getElementById("downloadPDF");

  const totalCostEl = document.getElementById("totalCost");
  const totalQtyEl = document.getElementById("totalQty");
  const totalSellingEl = document.getElementById("totalSelling");

  // Format numbers with commas
  const formatNum = (num) =>
    new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(num);

  // Calculate totals for visible rows
  function calculateTotals(visibleRows) {
    let totalCost = 0;
    let totalQty = 0;
    let totalSelling = 0;

    visibleRows.forEach((row) => {
      if (row.style.display !== 'none') {
        const cells = row.querySelectorAll("td");
        const cost = parseFloat(cells[2].innerText.replace(/,/g, "")) || 0;
        const qty = parseFloat(cells[3].innerText.replace(/,/g, "")) || 0;
        const selling = parseFloat(cells[4].innerText.replace(/,/g, "")) || 0;

        totalCost += cost;
        totalQty += qty;
        totalSelling += selling;
      }
    });

    totalCostEl.textContent = formatNum(totalCost);
    totalQtyEl.textContent = formatNum(totalQty);
    totalSellingEl.textContent = formatNum(totalSelling);
  }

  // Filter rows by date and type - FIXED VERSION
  function filterRows() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    const type = typeFilter.value;

    const visibleRows = [];

    rows.forEach((row) => {
      const dateAttr = row.getAttribute("data-date");
      if (!dateAttr) return;

      const rowDateStr = dateAttr; // This is already in "YYYY-MM-DD" format
      const rowType = row.children[1].innerText.trim();

      let show = true;

      // Date filter - compare as strings to avoid timezone issues
      if (startDate && rowDateStr < startDate) show = false;
      if (endDate && rowDateStr > endDate) show = false;

      // Type filter
      if (type !== "All" && rowType !== type) show = false;

      row.style.display = show ? "" : "none";
      if (show) visibleRows.push(row);
    });

    calculateTotals(visibleRows);
  }

  // Reset filters
  resetBtn.addEventListener("click", () => {
    startDateInput.value = "";
    endDateInput.value = "";
    typeFilter.value = "All";

    rows.forEach((row) => (row.style.display = ""));
    calculateTotals(rows);
  });

  // Apply filters
  filterBtn.addEventListener("click", filterRows);

  // Download PDF - IMPROVED VERSION
  downloadPDF.addEventListener("click", () => {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add filter info to PDF
    const startDate = startDateInput.value || 'All';
    const endDate = endDateInput.value || 'All';
    const type = typeFilter.value;
    
    doc.text("Stock Report", 14, 15);
    doc.text(`Date Range: ${startDate} to ${endDate} | Type: ${type}`, 14, 22);

    // Get only visible rows for PDF
    const visibleRows = rows.filter(row => row.style.display !== 'none');
    
    if (visibleRows.length === 0) {
      doc.text("No data to display", 14, 35);
    } else {
      const tableData = visibleRows.map(row => {
        const cells = Array.from(row.querySelectorAll('td'));
        return cells.map(cell => cell.innerText);
      });

      doc.autoTable({
        head: [['Product Name', 'Type', 'Cost Price', 'Quantity', 'Selling Price', 'Supplier', 'Date', 'Quality', 'Color', 'Measurements']],
        body: tableData,
        startY: 30,
        theme: "grid",
        headStyles: { fillColor: [0, 0, 0] },
      });
    }

    doc.save("stock_report.pdf");
  });

  // Initial totals on page load
  calculateTotals(rows);
});