document.getElementById("unitPrice").addEventListener("change",function(){                                        //the event listener is listenning to a change
  const unitPrice = parseFloat(document.getElementById("unitPrice").value)
    const quantity = parseFloat(document.getElementById("quantity").value)
    const totalPrice = document.getElementById("totalPrice")
    if(!isNaN(quantity) && !isNaN(unitPrice)){
        const totalCost = (quantity * unitPrice).toFixed(0);
        totalPrice.value = totalCost
    }else{
        totalPrice.value = ""
    }  
});

//flash message
document.addEventListener("DOMContentLoaded", () => {
  const flash = document.getElementById("flashMsg");
  if (flash) {
    // Use Bootstrap's alert method to fade out
    setTimeout(() => {
      const alert = new bootstrap.Alert(flash);
      alert.close(); // fades out the alert
    }, 3000); // 3000ms = 3 seconds
  }
});
