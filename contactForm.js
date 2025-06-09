// contactForm.js - Handles form validation and submission for Contact.html
document.addEventListener("DOMContentLoaded", function() {
    // Initialize captcha on page load
    generateCaptcha();
    
    // Add event listener for captcha refresh button
    const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
    if (refreshCaptchaBtn) {
        refreshCaptchaBtn.addEventListener('click', generateCaptcha);
    }
    
    // Add event listener for form submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add input validation for phone number
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            // Remove non-numeric characters except + (for country code)
            const value = e.target.value;
            const sanitizedValue = value.replace(/[^\d+]/g, '');
            e.target.value = sanitizedValue;
        });
    }
});

// Generate a random captcha
function generateCaptcha() {
    const captchaDisplay = document.getElementById('captchaDisplay');
    if (!captchaDisplay) return;
    
    // Generate a random string of alphanumeric characters
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
    let captcha = '';
    
    // Generate a 6-character captcha
    for (let i = 0; i < 6; i++) {
        captcha += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    
    // Store the captcha for verification
    captchaDisplay.textContent = captcha;
    captchaDisplay.dataset.value = captcha;
    
    // Clear the captcha input field
    const captchaInput = document.getElementById('captcha');
    if (captchaInput) {
        captchaInput.value = '';
    }
}

// Handle form submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    // Validate form fields
    if (!validateForm()) {
        return;
    }
    
    // Form data is valid, show success message
    showNotification('Form submitted successfully! We will get back to you soon.', 'success');
    
    // Reset form
    e.target.reset();
    
    // Generate new captcha
    generateCaptcha();
}

// Validate form fields
function validateForm() {
    // Get form fields
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const location = document.getElementById('location');
    const interest = document.getElementById('interest');
    const captcha = document.getElementById('captcha');
    const captchaDisplay = document.getElementById('captchaDisplay');
    
    // Validate name
    if (!name.value.trim()) {
        showNotification('Please enter your name', 'error');
        name.focus();
        return false;
    }
    
    // Validate email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        showNotification('Please enter a valid email address', 'error');
        email.focus();
        return false;
    }
    
    // Validate phone
    if (!phone.value.trim() || phone.value.length < 8) {
        showNotification('Please enter a valid phone number with country code', 'error');
        phone.focus();
        return false;
    }
    
    // Validate location
    if (!location.value.trim()) {
        showNotification('Please enter your location', 'error');
        location.focus();
        return false;
    }
    
    // Validate interest
    if (!interest.value) {
        showNotification('Please select your interest', 'error');
        interest.focus();
        return false;
    }
    
    // Validate captcha
    if (!captcha.value.trim() || captcha.value !== captchaDisplay.dataset.value) {
        showNotification('Invalid captcha. Please try again', 'error');
        captcha.focus();
        generateCaptcha();
        return false;
    }
    
    return true;
}

// Show notification message
function showNotification(message, type) {
    // Check if a notification already exists and remove it
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification fixed bottom-4 right-4 py-3 px-6 rounded-lg shadow-lg z-50 transition-all duration-300 transform translate-y-0 opacity-100 ${type === 'error' ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`;
    notification.textContent = message;
    
    // Add notification to the document
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
