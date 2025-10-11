document.addEventListener("DOMContentLoaded", () =>{
    const searchInput = document.getElementById("searchInput");   //get searchinput 
    const rows = document.querySelectorAll("table tbody tr");     //get all rows inside the table body

    // listen for any key press inside the search field
    searchInput.addEventListener("keyup", () =>{
     
       // Convert the typed value to lowercase (for case-insensitive search)
    const filter = searchInput.value.toLowerCase();

    // Loop through each row in the table
    rows.forEach((row) => {
      // Get Username (column index 1) and EmployeeId (column index 5)
      const userName = row.cells[1]?.textContent.toLowerCase() || "";
      const employeeId = row.cells[5]?.textContent.toLowerCase() || "";

      // Check if either Username or EmployeeId contains the search text
      if (userName.includes(filter) || employeeId.includes(filter)) {
        row.style.display = ""; // show row
      } else {
        row.style.display = "none"; // hide row
      }
    });  
    });
});