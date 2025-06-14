// FAQ Category filtering
document.addEventListener("DOMContentLoaded", function () {
  const faqItems = document.querySelectorAll(".bg-white.rounded-xl.shadow-lg");
  const categoryButtons = document.querySelectorAll(
    ".flex.flex-wrap.justify-center.gap-3 button"
  );

  // Category filtering
  categoryButtons.forEach((button) => {
    button.addEventListener("click", function () {
      // Reset all buttons
      categoryButtons.forEach((btn) => {
        btn.classList.remove("bg-[#0f1f40]", "text-white");
        btn.classList.add("bg-gray-200", "text-gray-700");
      });

      // Highlight active button
      this.classList.remove("bg-gray-200", "text-gray-700");
      this.classList.add("bg-[#0f1f40]", "text-white");

      // Show all FAQs for "All Questions" category
      if (this.textContent.trim() === "All Questions") {
        faqItems.forEach((item) => {
          item.style.display = "block";
        });
        return;
      }

      // Filter FAQs by category - this is a demo implementation
      // In a real implementation, you would tag each FAQ with categories
      const category = this.textContent.trim().toLowerCase();

      // Example mapping of questions to categories (would be better to use data attributes in HTML)
      const categoryMap = {
        features: [
          "How is Fedena different",
          "Can Fedena ERP software be customized",
          "Does Fedena provide GPS tracking",
        ],
        technical: [
          "What kind of software programs",
          "Does Fedena provide data backup",
          "Does Fedena Support third party plugins",
        ],
        pricing: [
          "How much does Fedena cost",
          "Will I be bound to any long-term contract",
          "Can I switch from one package to another",
        ],
        support: [
          "Does Fedena offer support and training",
          "What happens to the information",
          "Can I try Fedena before buying it",
        ],
      };

      faqItems.forEach((item) => {
        const question = item.querySelector("button span").textContent;

        // Check if the question contains any of the keywords for the selected category
        const matchesCategory = categoryMap[category]?.some((keyword) =>
          question.toLowerCase().includes(keyword.toLowerCase())
        );

        item.style.display = matchesCategory ? "block" : "none";
      });
    });
  });
});
