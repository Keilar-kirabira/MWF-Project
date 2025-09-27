document.getElementById("unitPrice").addEventListener("change",function(){
  const unitPrice = parseFloat(document.getElementById("unitPrice").value)
    const quantity = parseFloat(document.getElementById("quantity").value)
    const totalPrice = document.getElementById("totalPrice")
    if(!isNaN(quantity) && !isNaN(unitPrice)){
        const totalCost = (quantity * unitPrice).toFixed(0);
        totalPrice.value = totalCost
    }else{
        totalPrice.value = ""
    }  
})