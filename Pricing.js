// Pricing data for both app types
const pricingData = {
  webApp: {
    standard: {
      price: "₹ 50,000",
      features: {
        coreModules: "21 Core Modules",
        standardModules: "17 Standard Modules",
        premiumModules: "10 Premium Modules",
        ultimateModules: "12 Ultimate Modules",
      },
    },
    premium: {
      price: "₹ 75,000",
      features: {
        coreModules: "21 Core Modules",
        standardModules: "17 Standard Modules",
        premiumModules: "10 Premium Modules",
        ultimateModules: "12 Ultimate Modules",
      },
    },
    ultimate: {
      price: "₹ 1,00,000",
      features: {
        coreModules: "21 Core Modules",
        standardModules: "17 Standard Modules",
        premiumModules: "10 Premium Modules",
        ultimateModules: "12 Ultimate Modules",
      },
    },
  },
  bothWebAndMobile: {
    standard: {
      price: "₹ 90,000",
      features: {
        coreModules: "21 Basic Modules",
        standardModules: "17 Standard Modules",
        premiumModules: "10 Premium Modules",
        ultimateModules: "12 Ultimate Modules",
      },
    },
    premium: {
      price: "₹ 1,15,000",
      features: {
        coreModules: "21 Basic Modules",
        standardModules: "17 Standard Modules",
        premiumModules: "10 Premium Modules",
        ultimateModules: "12 Ultimate Modules",
      },
    },
    ultimate: {
      price: "₹ 1,40,000",
      features: {
        coreModules: "21 Basic Modules",
        standardModules: "17 Standard Modules",
        premiumModules: "10 Premium Modules",
        ultimateModules: "12 Ultimate Modules",
      },
    },
  },
};

// Initialize pricing state
let currentAppType = "webApp"; // Default to 'webApp'

// DOM elements
document.addEventListener("DOMContentLoaded", function () {
  const webToggle = document.getElementById("web-toggle");
  const mobileToggle = document.getElementById("mobile-toggle");

  // Price elements - Using specific IDs for reliable targeting
  const standardPrice = document.getElementById("standard-price");
  const premiumPrice = document.getElementById("premium-price");
  const ultimatePrice = document.getElementById("ultimate-price");

  // Feature elements - Core Modules labels using specific IDs
  const standardCoreModules = document.getElementById("standard-core-modules");
  const premiumCoreModules = document.getElementById("premium-core-modules");
  const ultimateCoreModules = document.getElementById("ultimate-core-modules");
  const enterpriseCoreModules = document.querySelector(
    ".grid div:nth-child(4) ul li:first-child"
  );

  // Get the toggle slider element
  const toggleSlider = document.getElementById("toggle-slider");

  // Toggle between Web App and Both Web & Mobile App
  webToggle.addEventListener("click", function () {
    if (currentAppType !== "webApp") {
      currentAppType = "webApp";
      webToggle.classList.add("text-white");
      webToggle.classList.remove("text-gray-500");
      mobileToggle.classList.add("text-gray-500");
      mobileToggle.classList.remove("text-white");
      toggleSlider.classList.remove("translate-x-full");
      updatePrices();
    }
  });

  mobileToggle.addEventListener("click", function () {
    if (currentAppType !== "bothWebAndMobile") {
      currentAppType = "bothWebAndMobile";
      mobileToggle.classList.add("text-white");
      mobileToggle.classList.remove("text-gray-500");
      webToggle.classList.add("text-gray-500");
      webToggle.classList.remove("text-white");
      toggleSlider.classList.add("translate-x-full");
      updatePrices();
    }
  });

  // Update prices based on the selected app type
  function updatePrices() {
    const data = pricingData[currentAppType];

    // Update prices - Check if elements exist before updating
    if (standardPrice) standardPrice.textContent = data.standard.price;
    if (premiumPrice) premiumPrice.textContent = data.premium.price;
    if (ultimatePrice) ultimatePrice.textContent = data.ultimate.price;

    // Update core modules text (changes from "Core" to "Basic" depending on selection)
    const coreModuleText = currentAppType === "webApp" ? "Core" : "Basic";

    // Update the text content of the module labels - Check if elements exist
    if (standardCoreModules) {
      standardCoreModules.innerHTML = `<i class="fas fa-${currentAppType === "webApp" ? "times text-red-500" : "check text-green-500"} mr-2 sm:mr-3 flex-shrink-0"></i> <span>21 ${coreModuleText} Modules</span>`;
    }
    if (premiumCoreModules) {
      premiumCoreModules.innerHTML = `<i class="fas fa-check text-green-500 mr-2 sm:mr-3 flex-shrink-0"></i> <span>21 ${coreModuleText} Modules</span>`;
    }
    if (ultimateCoreModules) {
      ultimateCoreModules.innerHTML = `<i class="fas fa-check text-green-500 mr-2 sm:mr-3 flex-shrink-0"></i> <span>21 ${coreModuleText} Modules</span>`;
    }

    // Enterprise always shows "Core Modules" with responsive spacing
    if (enterpriseCoreModules) {
      enterpriseCoreModules.innerHTML = `<i class="fas fa-check text-white mr-2 sm:mr-3 flex-shrink-0"></i> <span>21 Core Modules</span>`;
    }
  }

  // Set initial prices
  updatePrices();
});
