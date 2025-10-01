

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const el = document.getElementById("flashMsg");
    if (el) {
      const alert = new bootstrap.Alert(el);
      alert.close(); // triggers Bootstrap’s fade-out animation
    }
  }, 3000);
});

 

