const cartItems = document.getElementById("cart-items");
const salesRecords = document.getElementById("sales-records");
const subtotalEl = document.getElementById("cart-subtotal");
const finalTotalEl = document.getElementById("final-total");
const transportCheck = document.getElementById("transportCheck");

let subtotal = 0;

// Add new row to cart
document.getElementById("addItemBtn").addEventListener("click", addRow);

function addRow() {
  const row = document.createElement("tr");
  const uniqueId = Date.now();

  row.innerHTML = `
    <td><input type="text" id="type-${uniqueId}" name="productType" class="form-control type" placeholder="Type"></td>
    <td><input type="text" id="product-${uniqueId}" name="productName" class="form-control product" placeholder="Product"></td>
    <td><input type="number" id="qty-${uniqueId}" name="quantity" class="form-control qty" value="1" min="1"></td>
    <td><input type="number" id="price-${uniqueId}" name="price" class="form-control price" value="0" min="0"></td>
    <td class="row-total">0</td>
    <td><button class="btn btn-sm btn-danger removeBtn">Remove</button></td>
  `;

  cartItems.appendChild(row);

  row.querySelector(".qty").addEventListener("input", updateTotals);
  row.querySelector(".price").addEventListener("input", updateTotals);
  row.querySelector(".removeBtn").addEventListener("click", () => {
    row.remove();
    updateTotals();
  });

  updateTotals();
}

// Update totals
function updateTotals() {
  subtotal = 0;
  const rows = cartItems.querySelectorAll("tr");

  rows.forEach(row => {
    const qty = parseFloat(row.querySelector(".qty").value) || 0;
    const price = parseFloat(row.querySelector(".price").value) || 0;
    const total = qty * price;
    row.querySelector(".row-total").textContent = total.toLocaleString();
    subtotal += total;
  });

  subtotalEl.textContent = subtotal.toLocaleString();

//apply 5% transport fee if checked
  let finalTotal = subtotal;
  if (transportCheck.checked) {
    finalTotal += subtotal * 0.05;
  }
  finalTotalEl.textContent = finalTotal.toLocaleString();
}

// Handle form submit
document.getElementById("saleForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const customer = document.getElementById("customerName").value;
  const agent = document.getElementById("salesAgent").value;
  const date = document.getElementById("date").value;
  const payment = document.getElementById("paymentMethod").value;

  const rows = cartItems.querySelectorAll("tr");
  let items = [];

  rows.forEach(row => {
    items.push({
      type: row.querySelector(".type").value,
      product: row.querySelector(".product").value,
      qty: row.querySelector(".qty").value,
      price: row.querySelector(".price").value
    });
  });

  const finalTotal = parseFloat(finalTotalEl.textContent.replace(/,/g, "")) || 0;

  const sale = { customer, agent, date, payment, items, total: finalTotal };

  // Save to localStorage
  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  sales.push(sale);
  localStorage.setItem("sales", JSON.stringify(sales));

  // Add to table
  addSaleToTable(sale);

  // Generate receipt
  generateReceipt(sale);

  // Reset form
  document.getElementById("saleForm").reset();
  cartItems.innerHTML = "";
  updateTotals();
});

// Add sale to table
function addSaleToTable(sale) {
  sale.items.forEach(item => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${sale.customer}</td>
      <td>${item.type}</td>
      <td>${item.product}</td>
      <td>${item.qty}</td>
      <td>${sale.agent}</td>
      <td>${sale.date}</td>
      <td>${sale.payment}</td>
      <td>${sale.total.toLocaleString()}</td>
    `;
    salesRecords.appendChild(row);
  });
}

// Load existing sales on page load
window.onload = () => {
  let sales = JSON.parse(localStorage.getItem("sales")) || [];
  sales.forEach(addSaleToTable);
};

// Generate receipt
function generateReceipt(sale) {
  let receiptWindow = window.open("", "Print Receipt", "width=600,height=600");
  let productList = sale.items.map(item =>
    `<li>${item.type} - ${item.product} (x${item.qty}) @ ${item.price} UGX</li>`
  ).join("");

  receiptWindow.document.write(`
    <h2>Mayondo Wood & Furniture</h2>
    <p><strong>Customer:</strong> ${sale.customer}</p>
    <p><strong>Sales Agent:</strong> ${sale.agent}</p>
    <p><strong>Date:</strong> ${sale.date}</p>
    <p><strong>Payment:</strong> ${sale.payment}</p>
    <h4>Products</h4>
    <ul>${productList}</ul>
    <h3>Total: ${sale.total.toLocaleString()} UGX</h3>
    <p>Thank you for your purchase!</p>
  `);
  receiptWindow.document.close();
  receiptWindow.print();
}
