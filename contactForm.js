// contactForm.js - Handles form validation and submission for Contact.html

// EmailJS Configuration
const EMAILJS_CONFIG = {
  publicKey: "", // Replace with your actual EmailJS public key
  serviceId: "", // Replace with your EmailJS service ID
  templateId: "", // Replace with your EmailJS template ID
};

document.addEventListener("DOMContentLoaded", function () {
  // Load EmailJS library dynamically
  const script = document.createElement("script");
  script.src =
    "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";
  script.async = true;
  script.onload = function () {
    // Initialize EmailJS with your public key
    emailjs.init(EMAILJS_CONFIG.publicKey);
    console.log("EmailJS loaded and initialized");
  };
  document.head.appendChild(script);

  // Initialize captcha on page load
  generateCaptcha();

  // Add event listener for captcha refresh button
  const refreshCaptchaBtn = document.getElementById("refreshCaptcha");
  if (refreshCaptchaBtn) {
    refreshCaptchaBtn.addEventListener("click", generateCaptcha);
  }

  // Add event listener for form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  // Add input validation for phone number
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("input", function (e) {
      // Remove non-numeric characters except + (for country code)
      const value = e.target.value;
      const sanitizedValue = value.replace(/[^\d+]/g, "");
      e.target.value = sanitizedValue;
    });
  }

  // Add event listeners for interest selection styling
  const interestUse = document.getElementById("interest_use");
  const interestResell = document.getElementById("interest_resell");

  if (interestUse && interestResell) {
    const interestLabels = document.querySelectorAll(
      'label[for="interest_use"], label[for="interest_resell"]'
    );

    interestUse.addEventListener("change", function () {
      updateInterestSelection(interestLabels, "interest_use");
    });

    interestResell.addEventListener("change", function () {
      updateInterestSelection(interestLabels, "interest_resell");
    });
  }
});

// Generate a random captcha
function generateCaptcha() {
  const captchaDisplay = document.getElementById("captchaDisplay");
  if (!captchaDisplay) return;

  // Generate a random string of alphanumeric characters
  const characters =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
  let captcha = "";

  // Generate a 6-character captcha
  for (let i = 0; i < 6; i++) {
    captcha += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  // Store the captcha for verification
  captchaDisplay.textContent = captcha;
  captchaDisplay.dataset.value = captcha;

  // Clear the captcha input field
  const captchaInput = document.getElementById("captcha");
  if (captchaInput) {
    captchaInput.value = "";
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
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;

  // Get form data - location information
  const locationField = document.getElementById("location");
  const location = locationField ? locationField.value : "";

  // Get form data - inquiry information
  const interestUse = document.getElementById("interest_use");
  const interestResell = document.getElementById("interest_resell");
  const interest =
    interestUse && interestUse.checked
      ? interestUse.value
      : interestResell && interestResell.checked
      ? interestResell.value
      : "Not specified";
  const message =
    document.getElementById("message").value ||
    "No additional information provided";

  // Show loading state
  const submitButton = e.target.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

  // Create template parameters for EmailJS
  const templateParams = {
    from_name: name || "Contact Form Submission",
    from_email: email,
    phone: phone,
    location: location,
    interest: interest,
    message: message,
  };

  // Check if EmailJS is loaded
  if (typeof emailjs !== "undefined") {
    // Send email using EmailJS
    emailjs
      .send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, templateParams)
      .then(function (response) {
        console.log("SUCCESS!", response.status, response.text);
        showNotification(
          "Form submitted successfully! We will get back to you soon.",
          "success"
        );
        // Reset form
        e.target.reset();
        // Generate new captcha
        generateCaptcha();
      })
      .catch(function (error) {
        console.error("FAILED...", error);
        showNotification(
          "Oops! There was a problem submitting your form. Please try again later.",
          "error"
        );
      })
      .finally(function () {
        // Restore button state
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
      });
  } else {
    // EmailJS not loaded - fallback to simple notification
    showNotification(
      "Email service not available. Please try again later.",
      "error"
    );
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
}

// Validate form fields
function validateForm() {
  // Get form fields - personal information
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");

  // Get form fields - inquiry information
  const captcha = document.getElementById("captcha");
  const captchaDisplay = document.getElementById("captchaDisplay");

  // Validate name
  if (!name || !name.value.trim()) {
    showNotification("Please enter your name", "error");
    if (name) name.focus();
    return false;
  }

  // Validate email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailPattern.test(email.value)) {
    showNotification("Please enter a valid email address", "error");
    if (email) email.focus();
    return false;
  }

  // Validate phone
  if (!phone || !phone.value.trim() || phone.value.length < 8) {
    showNotification(
      "Please enter a valid phone number with country code",
      "error"
    );
    if (phone) phone.focus();
    return false;
  }

  // Validate location
  const locationField = document.getElementById("location");
  if (!locationField || !locationField.value.trim()) {
    showNotification("Please enter your location", "error");
    if (locationField) locationField.focus();
    return false;
  }

  // Validate interest
  const interestUse = document.getElementById("interest_use");
  const interestResell = document.getElementById("interest_resell");
  if (!interestUse.checked && !interestResell.checked) {
    showNotification("Please select your interest", "error");
    return false;
  }

  // Validate captcha
  if (!captcha.value.trim() || captcha.value !== captchaDisplay.dataset.value) {
    showNotification("Invalid captcha. Please try again", "error");
    captcha.focus();
    generateCaptcha();
    return false;
  }

  return true;
}

// Show notification message
function showNotification(message, type) {
  // Check if a notification already exists and remove it
  const existingNotification = document.querySelector(".notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification fixed bottom-4 right-4 py-4 px-6 rounded-lg shadow-xl z-50 transition-all duration-300 transform translate-y-0 opacity-100 ${
    type === "error" ? "bg-red-600 text-white" : "bg-green-600 text-white"
  } flex items-center`;

  // Add icon based on notification type
  const iconSpan = document.createElement("span");
  iconSpan.className = "mr-3 flex-shrink-0";
  iconSpan.innerHTML =
    type === "error"
      ? '<i class="fas fa-exclamation-circle text-2xl"></i>'
      : '<i class="fas fa-check-circle text-2xl"></i>';
  notification.appendChild(iconSpan);

  // Add message text
  const textSpan = document.createElement("span");
  textSpan.textContent = message;
  textSpan.className = "flex-grow";
  notification.appendChild(textSpan);

  // Add close button
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.className = "ml-4 text-white hover:text-gray-200 focus:outline-none";
  closeBtn.addEventListener("click", () => {
    notification.classList.add("translate-y-10", "opacity-0");
    setTimeout(() => {
      notification.remove();
    }, 300);
  });
  notification.appendChild(closeBtn);

  // Add notification to the document
  document.body.appendChild(notification);

  // Remove notification after 5 seconds
  setTimeout(() => {
    if (document.body.contains(notification)) {
      notification.classList.add("translate-y-10", "opacity-0");
      setTimeout(() => {
        if (document.body.contains(notification)) {
          notification.remove();
        }
      }, 300);
    }
  }, 5000);
}

// Function to update interest selection styling
function updateInterestSelection(labels, selectedId) {
  labels.forEach((label) => {
    if (label.getAttribute("for") === selectedId) {
      label.classList.add("border-red-500", "bg-red-50");
      label.classList.remove("border-gray-300");
    } else {
      label.classList.remove("border-red-500", "bg-red-50");
      label.classList.add("border-gray-300");
    }
  });
}
