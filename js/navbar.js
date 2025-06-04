document.addEventListener('DOMContentLoaded', function() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (mobileToggle && navbarMenu) {
        mobileToggle.addEventListener('click', function() {
            navbarMenu.classList.toggle('active');
            mobileToggle.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!navbarMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
            navbarMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });
});
