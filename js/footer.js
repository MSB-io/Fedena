// Navbar and footer functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (mobileToggle && navbarMenu) {
        mobileToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
        });
    }
    
    // Smooth scrolling for anchor links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
    
    // Scroll to top functionality
    const scrollTopBtn = document.querySelector('.scroll-top');
    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Show/hide scroll to top button based on scroll position
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollTopBtn.style.display = 'block';
            } else {
                scrollTopBtn.style.display = 'none';
            }
        });
    }
    
    // Phone button functionality
    const phoneBtn = document.querySelector('.phone-btn');
    if (phoneBtn) {
        phoneBtn.addEventListener('click', function() {
            window.location.href = 'tel:+918047091807';
        });
    }
    
    // Email button functionality
    const emailBtn = document.querySelector('.email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', function() {
            window.location.href = 'mailto:info@fedena.com';
        });
    }
});
