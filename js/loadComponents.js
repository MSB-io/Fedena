// Load navbar and footer dynamically
window.addEventListener("DOMContentLoaded", () => {
  fetch("/components/navbar.html")
    .then(res => res.text())
    .then(data => document.getElementById("navbar").innerHTML = data);

  fetch("/components/footer.html")
    .then(res => res.text())
    .then(data => document.getElementById("footer").innerHTML = data);
});

// Load footer component
async function loadFooter() {
    try {
        const response = await fetch('/components/footer.html');
        const footerHTML = await response.text();
        document.getElementById('footer').innerHTML = footerHTML;
        
        // Load footer CSS if not already loaded
        if (!document.querySelector('link[href*="footer.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = '/css/footer.css';
            document.head.appendChild(link);
        }
        
        // Load footer JS
        const script = document.createElement('script');
        script.src = '/js/footer.js';
        document.body.appendChild(script);
        
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load components when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    loadFooter();
});
