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
      const cells = row.querySelectorAll("td");
      const cost = parseFloat(cells[2].innerText.replace(/,/g, "")) || 0;
      const qty = parseFloat(cells[3].innerText.replace(/,/g, "")) || 0;
      const selling = parseFloat(cells[4].innerText.replace(/,/g, "")) || 0;

      totalCost += cost;
      totalQty += qty;
      totalSelling += selling;
    });

    totalCostEl.textContent = formatNum(totalCost);
    totalQtyEl.textContent = formatNum(totalQty);
    totalSellingEl.textContent = formatNum(totalSelling);
  }

  // Filter rows by date and type
  function filterRows() {
    const startDate = startDateInput.value
      ? new Date(startDateInput.value)
      : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
    const type = typeFilter.value;

    const visibleRows = [];

    rows.forEach((row) => {
      const dateAttr = row.getAttribute("data-date");
      if (!dateAttr) return;

      const rowDate = new Date(dateAttr);
      const rowType = row.children[1].innerText.trim();

      let show = true;

      // Date filter
      if (startDate && rowDate < startDate) show = false;
      if (endDate && rowDate > endDate) show = false;

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

  // Download PDF
  downloadPDF.addEventListener("click", () => {
    const { jsPDF } = window.jspdf; // get jsPDF from global
    const doc = new jsPDF();

    doc.text("Stock Report", 14, 15);

    // Generate table from HTML
    doc.autoTable({
      html: "#stockTable",
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [0, 0, 0] }, // black header
    });

    doc.save("stock_report.pdf");
  });

  // Initial totals on page load
  calculateTotals(rows);
});
