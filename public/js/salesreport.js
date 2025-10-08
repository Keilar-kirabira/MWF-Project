document.addEventListener("DOMContentLoaded", () => {
  const table = document.getElementById("salesTable");
  const tbody = table.querySelector("tbody");
  const rows = Array.from(tbody.querySelectorAll("tr"));

  // Filter inputs
  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");
  const typeFilterInput = document.getElementById("typeFilter");
  const agentInput = document.getElementById("SalesAgent");

  const filterBtn = document.getElementById("filterBtn");
  const resetBtn = document.getElementById("resetBtn");
  const downloadBtn = document.getElementById("downloadPDF");

  // Totals elements
  const totalQuantityEl = document.getElementById("totalQuantity");
  const totalUnitPriceEl = document.getElementById("totalUnitPrice");
  const totalPriceEl = document.getElementById("TotalPrice");

  // Function to format numbers with commas
  const formatNum = (num) => num.toLocaleString();

  // Update totals based on visible rows
  function updateTotals() {
    let totalQuantity = 0;
    let totalUnitPrice = 0;
    let totalPrice = 0;

    const visibleRows = rows.filter((row) => row.style.display !== "none");

    visibleRows.forEach((row) => {
      const quantity = parseInt(row.cells[3].innerText.replace(/,/g, "")) || 0;
      const unitPrice = parseInt(row.cells[4].innerText.replace(/,/g, "")) || 0;
      const total = parseInt(row.cells[5].innerText.replace(/,/g, "")) || 0;

      totalQuantity += quantity;
      totalUnitPrice += unitPrice;
      totalPrice += total;
    });

    totalQuantityEl.textContent = formatNum(totalQuantity);
    totalUnitPriceEl.textContent = formatNum(totalUnitPrice);
    totalPriceEl.textContent = formatNum(totalPrice);
  }

  // Filter function
  function filterRows() {
    const startDate = startDateInput.value ? new Date(startDateInput.value) : null;
    const endDate = endDateInput.value ? new Date(endDateInput.value) : null;
    const typeValue = typeFilterInput.value.toLowerCase();
    const agentValue = agentInput.value.toLowerCase();

    rows.forEach((row) => {
      const paymentDate = new Date(row.getAttribute("data-date"));
      const productType = row.cells[1].innerText.toLowerCase();
      const agent = row.cells[9].innerText.toLowerCase();

      let isVisible = true;

      if (startDate && paymentDate < startDate) isVisible = false;
      if (endDate && paymentDate > endDate) isVisible = false;
      if (typeValue !== "all" && !productType.includes(typeValue)) isVisible = false;
      if (agentValue && !agent.includes(agentValue)) isVisible = false;

      row.style.display = isVisible ? "" : "none";
    });

    updateTotals();
  }

  // Reset filters
  function resetFilters() {
    startDateInput.value = "";
    endDateInput.value = "";
    typeFilterInput.value = "All";
    agentInput.value = "";

    rows.forEach((row) => (row.style.display = ""));
    updateTotals();
  }

  // PDF Download
  function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("Sales Report", 14, 10);

    doc.autoTable({
      html: "#salesTable",
      startY: 20,
      theme: "grid",
      headStyles: { fillColor: [40, 40, 40] },
      styles: { fontSize: 8 },
    });

    doc.save("sales_report.pdf");
  }

  // Event Listeners
  filterBtn.addEventListener("click", filterRows);
  resetBtn.addEventListener("click", resetFilters);
  downloadBtn.addEventListener("click", downloadPDF);

  // Live filtering for agent name and type
  agentInput.addEventListener("input", filterRows);
  typeFilterInput.addEventListener("input", filterRows);

  // Initial calculation
  updateTotals();
});
