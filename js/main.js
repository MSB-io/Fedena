document.addEventListener('DOMContentLoaded', function() {
    // Hero section interactions
    const primaryBtn = document.querySelector('.btn-primary');
    const secondaryBtn = document.querySelector('.btn-secondary');
    
    // Request Live Demo button
    if (primaryBtn) {
        primaryBtn.addEventListener('click', function() {
            // Add smooth scroll or modal functionality
            console.log('Request Live Demo clicked');
            // You can add modal popup or form here
        });
    }
    
    // Pricing & Plans button
    if (secondaryBtn) {
        secondaryBtn.addEventListener('click', function() {
            console.log('Pricing & Plans clicked');
            // Navigate to pricing section or page
        });
    }
    
    // Animate hero elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe hero elements
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
    
    // Device mockup hover effects
    const deviceMockups = document.querySelectorAll('.device-mockup');
    deviceMockups.forEach(device => {
        device.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px) scale(1.02)';
        });
        
        device.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});
