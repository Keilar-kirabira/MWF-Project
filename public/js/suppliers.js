const form = document.getElementById("supplierForm");
const tableBody = document.getElementById("supplierTableBody")

form.addEventListener("submit",function(event){
    event.preventDefault();   //stop page from refreshing when form is sumbitted.

    //get values i want to be saved in the table
    const supplierName =document.getElementById("supplierName"). value;
    const phoneNumber=document.getElementById("phoneNumber"). value;
    const email=document.getElementById("email"). value;
     const physicalAddress  =document.getElementById("address"). value;
    const productSuppiled =document.getElementById("productsSupplied"). value;
      const status =document.getElementById("status"). value;

  //create new rows +cells
  
  const newRow = document.createElement("tr");
  newRow.innerHTML =`
  <td>${supplierName}</td>
  <td>${phoneNumber}</td>
  <td>${email}</td>
  <td>${physicalAddress}</td>
  <td>${productSuppiled}</td>
  <td>${status}</td>
  `;

  //add row to table
  tableBody.appendChild(newRow);


  //clear form
  form.reset();
});