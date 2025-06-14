// Standardized Accordion functionality for all pages
document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM Content loaded, initializing accordion...");

  // Try to initialize immediately
  initAccordion();

  // Also initialize after a short delay to make sure all content is loaded
  setTimeout(initAccordion, 500);
});

function initAccordion() {
  console.log("Initializing accordion...");

  // Target all accordion containers across the site
  // This selector will find all the accordions that use the standard structure
  const accordionButtons = document.querySelectorAll(
    ".bg-white.rounded-xl.shadow-lg button"
  );

  console.log("Found accordion buttons:", accordionButtons.length);

  if (accordionButtons.length > 0) {
    // Initialize standard accordions
    initStandardAccordions(accordionButtons);
  } else {
    console.log(
      "No standard accordion buttons found. The page might be loading or using outdated structure."
    );
  }
}

function initStandardAccordions(accordionButtons) {
  // Preset FAQs and answers - used when dynamic content doesn't exist
  const faqAnswers = {
    "How is Fedena different from other school management software?": `<p class="text-gray-600 text-sm leading-relaxed">Fedena stands out with its 100+ integrated modules, mobile apps, and 24/7 support system. Unlike other systems, it offers a user-friendly interface, is compatible with all education boards, and provides comprehensive features from student management to financial reporting.</p>`,

    "What kind of software programs do I require to run Fedena?": `<p class="text-gray-600 text-sm leading-relaxed">Fedena is a web-based application that only requires a modern web browser like Chrome, Firefox, or Edge. No additional software installation is needed as it runs entirely in the cloud.</p>`,

    "Can Fedena ERP software be customized for my Institute?": `<p class="text-gray-600 text-sm leading-relaxed">Yes, Fedena can be fully customized to meet the specific requirements of your institution. We offer tailored solutions for different educational boards and institute types.</p>`,

    "Does Fedena provide data backup facility?": `<p class="text-gray-600 text-sm leading-relaxed">Yes, Fedena provides automated daily backups with enterprise-grade security. Your data is safely stored with redundancy to prevent any loss.</p>`,

    "What measures do we take for data security?": `<p class="text-gray-600 text-sm leading-relaxed">Fedena implements bank-grade security measures including encryption, secure data centers, regular security audits, and GDPR compliance to ensure your institution's data remains protected.</p>`,

    // Add more FAQ answers as needed
  };

  accordionButtons.forEach((button) => {
    // Skip if button has already been initialized
    if (button.hasAttribute("data-initialized")) {
      return;
    }

    // Mark as initialized
    button.setAttribute("data-initialized", "true");

    // Find the corresponding content div
    const contentDiv = button.nextElementSibling;

    // If the content is empty and we have a preset answer, populate it
    if (
      contentDiv &&
      (!contentDiv.querySelector(".p-6") ||
        contentDiv.querySelector(".p-6").innerHTML.trim() === "")
    ) {
      const question = button.querySelector("span").textContent.trim();
      if (faqAnswers[question]) {
        const innerContent = document.createElement("div");
        innerContent.className = "p-6 border-t border-gray-200";
        innerContent.innerHTML = faqAnswers[question];

        // Clear existing content and add our new content
        contentDiv.innerHTML = "";
        contentDiv.appendChild(innerContent);
      }
    }

    button.addEventListener("click", () => {
      // Close other open accordions
      accordionButtons.forEach((otherButton) => {
        if (otherButton !== button) {
          const otherContent = otherButton.nextElementSibling;
          if (otherContent) {
            // Reset height
            otherContent.style.maxHeight = "0px";

            // Reset styles on the button
            otherButton.classList.remove("text-red-600");
            const otherSpan = otherButton.querySelector("span");
            if (otherSpan) otherSpan.classList.remove("text-red-600");

            // Reset icon rotation
            const otherIcon = otherButton.querySelector("svg");
            if (otherIcon) otherIcon.style.transform = "rotate(0deg)";
          }
        }
      });

      // Toggle current accordion
      if (contentDiv) {
        if (
          contentDiv.style.maxHeight &&
          contentDiv.style.maxHeight !== "0px"
        ) {
          // Collapse
          contentDiv.style.maxHeight = "0px";

          // Reset styles
          button.classList.remove("text-red-600");
          const span = button.querySelector("span");
          if (span) span.classList.remove("text-red-600");

          // Reset icon rotation
          const icon = button.querySelector("svg");
          if (icon) icon.style.transform = "rotate(0deg)";
        } else {
          // Expand
          contentDiv.style.maxHeight = contentDiv.scrollHeight + "px";

          // Apply active styles
          button.classList.add("text-red-600");
          const span = button.querySelector("span");
          if (span) span.classList.add("text-red-600");

          // Rotate icon
          const icon = button.querySelector("svg");
          if (icon) icon.style.transform = "rotate(180deg)";
        }
      }
    });
  });
}

// Make sure to initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initAccordion);

// Export the function so it can be used in other files if needed
window.initAccordion = initAccordion;
