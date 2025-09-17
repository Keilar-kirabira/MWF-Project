// accessing form elements
const quantityInput = document.getElementById("quantity");
const unitPriceInput = document.getElementById("unitPrice");
const subtotalInput  = document.getElementById("subTotal");
const transportCheck  = document.getElementById("transportCheck");
const totalPriceInput = document.getElementById("totalPrice"); 
//retrieving values, from strings to numbers
function calculatePrice(){
  const quantity = parseFloat(quantityInput.value)||0;
  const unitPrice = parseFloat(unitPriceInput.value)|0;
  
  //calculate subtotal
  const subtotal = quantity * unitPrice;
  subtotalInput.value = subtotal.toFixed(2); //2 decimal places

  //add transport fee if checked
  let total = subtotal;
  if(transportCheck.checked){
    total += subtotal * 0.05; // 5% transport fee
  }
  totalPriceInput.value = total.toFixed(2);
}
//event listeners to recalculate on change
quantityInput.addEventListener("input", calculatePrice);
unitPriceInput.addEventListener("input", calculatePrice);
transportCheck.addEventListener("change", calculatePrice);