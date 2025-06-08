// Load navbar and footer dynamically
window.addEventListener("DOMContentLoaded", () => {
  // Get the base URL dynamically - this helps with GitHub Pages deployments
  const getBasePath = () => {
    // Get the current path
    const path = window.location.pathname;
    
    // If we're at the root, use "./", otherwise calculate relative path to root
    if (path.endsWith('/') || path.endsWith('index.html')) {
      return './';
    } else {
      // Count directory levels to go back to root
      const pathParts = path.split('/').filter(p => p.length > 0);
      // Last part is the file, so we go back n-1 levels
      const levels = Math.max(0, pathParts.length - 1);
      return levels > 0 ? '../'.repeat(levels) : './';
    }
  };

  const basePath = getBasePath();
  
  // Load navbar with proper path
  fetch(`${basePath}components/navbar.html`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load navbar: ${res.status} ${res.statusText}`);
      }
      return res.text();
    })
    .then(data => {
      const navbarElement = document.getElementById("navbar");
      if (navbarElement) {
        navbarElement.innerHTML = data;
        
        // Initialize mobile menu after navbar is loaded
        // This function is defined in mobileMenu.js
        if (typeof window.initMobileMenu === 'function') {
          window.initMobileMenu();
        }
      } else {
        console.error("Navbar element not found in the DOM");
      }
    })
    .catch(err => console.error("Error loading navbar:", err));

  // Load footer with proper path
  fetch(`${basePath}components/footer.html`)
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load footer: ${res.status} ${res.statusText}`);
      }
      return res.text();
    })
    .then(data => {
      const footerElement = document.getElementById("footer");
      if (footerElement) {
        footerElement.innerHTML = data;
      } else {
        console.error("Footer element not found in the DOM");
      }
    })
    .catch(err => console.error("Error loading footer:", err));
});
