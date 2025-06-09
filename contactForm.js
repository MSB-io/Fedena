// contactForm.js - Handles form validation and submission for Contact.html
document.addEventListener("DOMContentLoaded", function() {
    // Load EmailJS library dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    script.async = true;
    script.onload = function() {
        // Initialize EmailJS with your public key
        emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your actual EmailJS public key
        console.log("EmailJS loaded and initialized");
    };
    document.head.appendChild(script);

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
    
    // Get form data - personal information
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const fullName = `${firstName} ${lastName}`;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    
    // Get form data - organization information
    const organization = document.getElementById('organization').value;
    const jobTitle = document.getElementById('jobTitle').value || 'Not specified';
    const city = document.getElementById('city').value;
    const country = document.getElementById('country').value;
    const orgSize = document.getElementById('orgSize').value || 'Not specified';
    
    // Get form data - inquiry information
    const interest = document.getElementById('interest').value;
    const timeframe = document.getElementById('timeframe').value || 'Not specified';
    const source = document.getElementById('source').value || 'Not specified';
    const message = document.getElementById('message').value || 'No additional information provided';
    
    // Show loading state
    const submitButton = e.target.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Create template parameters for EmailJS
    const templateParams = {
        from_name: fullName,
        first_name: firstName,
        last_name: lastName,
        from_email: email,
        phone: phone,
        organization: organization,
        job_title: jobTitle,
        city: city,
        country: country,
        org_size: orgSize,
        interest: interest,
        timeframe: timeframe,
        source: source,
        message: message
    };
    
    // Check if EmailJS is loaded
    if (typeof emailjs !== 'undefined') {
        // Send email using EmailJS
        emailjs.send('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', templateParams)
            .then(function(response) {
                console.log('SUCCESS!', response.status, response.text);
                showNotification('Form submitted successfully! We will get back to you soon.', 'success');
                // Reset form
                e.target.reset();
                // Generate new captcha
                generateCaptcha();
            })
            .catch(function(error) {
                console.error('FAILED...', error);
                showNotification('Oops! There was a problem submitting your form. Please try again later.', 'error');
            })
            .finally(function() {
                // Restore button state
                submitButton.disabled = false;
                submitButton.innerHTML = originalButtonText;
            });
    } else {
        // EmailJS not loaded - fallback to simple notification
        showNotification('Email service not available. Please try again later.', 'error');
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

// Validate form fields
function validateForm() {
    // Get form fields - personal information
    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    
    // Get form fields - organization information
    const organization = document.getElementById('organization');
    const city = document.getElementById('city');
    const country = document.getElementById('country');
    
    // Get form fields - inquiry information
    const interest = document.getElementById('interest');
    const captcha = document.getElementById('captcha');
    const captchaDisplay = document.getElementById('captchaDisplay');
    
    // Validate first name
    if (!firstName.value.trim()) {
        showNotification('Please enter your first name', 'error');
        firstName.focus();
        return false;
    }
    
    // Validate last name
    if (!lastName.value.trim()) {
        showNotification('Please enter your last name', 'error');
        lastName.focus();
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
