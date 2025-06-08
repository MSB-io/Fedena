// Load navbar and footer dynamically
window.addEventListener("DOMContentLoaded", () => {
  // Load navbar
  fetch("/components/navbar.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("navbar").innerHTML = data;
      
      // Initialize mobile menu after navbar is loaded
      // This function is defined in mobileMenu.js
      if (typeof window.initMobileMenu === 'function') {
        window.initMobileMenu();
      }
    });

  // Load footer
  fetch("/components/footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);
});
