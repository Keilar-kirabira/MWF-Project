// Simple client-side search filter
      document.getElementById('searchInput').addEventListener('keyup', function() {
        const filter = this.value.toLowerCase();
        const rows = document.querySelectorAll('#supplierTable tr');
        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = text.includes(filter) ? '' : 'none';
        });
      });


// flash message

document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    const el = document.getElementById("flashMsg");
    if (el) {
      const alert = new bootstrap.Alert(el);
      alert.close(); // triggers Bootstrap’s fade-out animation
    }
  }, 3000);
});
