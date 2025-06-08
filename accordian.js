// Accordion functionality
document.addEventListener("DOMContentLoaded", function() {
  initAccordion();
});

function initAccordion() {
  console.log("Initializing accordion...");
  const accordionButtons = document.querySelectorAll(
    ".bg-white.rounded-xl.shadow-lg button"
  );

  accordionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const answer = button.nextElementSibling;
      const icon = button.querySelector("svg");

      // Close other open accordions
      accordionButtons.forEach((otherButton) => {
        if (otherButton !== button) {
          const otherAnswer = otherButton.nextElementSibling;
          const otherIcon = otherButton.querySelector("svg");
          if (
            otherAnswer.style.maxHeight &&
            otherAnswer.style.maxHeight !== "0px"
          ) {
            otherAnswer.style.maxHeight = "0px";
            otherIcon.classList.remove("rotate-180");
            otherButton.parentElement.classList.remove("bg-red-50");
            otherButton.parentElement.classList.remove("ring-2");
            otherButton.parentElement.classList.remove("ring-red-200");
          }
        }
      });

      if (answer.style.maxHeight && answer.style.maxHeight !== "0px") {
        answer.style.maxHeight = "0px";
        icon.classList.remove("rotate-180");
        button.parentElement.classList.remove("bg-red-50");
        button.parentElement.classList.remove("ring-2");
        button.parentElement.classList.remove("ring-red-200");
      } else {
        answer.style.maxHeight = answer.scrollHeight + "px";
        icon.classList.add("rotate-180");
        button.parentElement.classList.add("bg-red-50");
        button.parentElement.classList.add("ring-2");
        button.parentElement.classList.add("ring-red-200");
      }
    });
  });
}

// Initialize accordion when DOM is loaded
document.addEventListener('DOMContentLoaded', initAccordion);

// Export the function so it can be used in other files if needed
window.initAccordion = initAccordion;
