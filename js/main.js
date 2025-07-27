/* ========================================
   LIMITLESS FUNDRAISING - MAIN JAVASCRIPT
   ======================================== */

// DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  initNavigation();
  initContactForm();
  initSmoothScrolling();
  initImageFallbacks();
  initVideoHandling();
  updateCopyrightYear();
});

/* ========================================
   NAVIGATION FUNCTIONS
   ======================================== */

function initNavigation() {
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const navbarPill = document.querySelector(".navbar-pill");
  const logoContainer = document.querySelector(".logo-container");

  // Mobile menu toggle
  if (mobileMenuToggle) {
    mobileMenuToggle.addEventListener("click", toggleMobileMenu);
  }

  // Logo click - scroll to top
  if (logoContainer) {
    logoContainer.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Active section detection
  window.addEventListener("scroll", handleScroll);

  // Initialize active section on page load
  handleScroll();

  // Close mobile menu on link click and add pulse animation
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      closeMobileMenuOnClick();

      // Add pulse animation
      this.classList.add("clicked");

      // Remove the class after animation completes
      setTimeout(() => {
        this.classList.remove("clicked");
      }, 600);
    });
  });
}

function toggleMobileMenu() {
  const navbarPill = document.querySelector(".navbar-pill");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const hamburgerLines = document.querySelectorAll(".hamburger-line");

  if (navbarPill) {
    navbarPill.classList.toggle("mobile-active");
    mobileMenuToggle.classList.toggle("active");

    // Animate hamburger using CSS classes instead of inline styles
    if (navbarPill.classList.contains("mobile-active")) {
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    } else {
      // Restore body scroll when menu is closed
      document.body.style.overflow = "";
    }
  }
}

function closeMobileMenuOnClick() {
  const navbarPill = document.querySelector(".navbar-pill");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");

  if (navbarPill && navbarPill.classList.contains("mobile-active")) {
    navbarPill.classList.remove("mobile-active");
    mobileMenuToggle.classList.remove("active");

    // Restore body scroll
    document.body.style.overflow = "";
  }
}

function handleScroll() {
  const sections = ["hero", "how-it-works", "about", "mission", "contact"];
  const navLinks = document.querySelectorAll(".nav-link");

  let currentSection = "";

  sections.forEach((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      const rect = section.getBoundingClientRect();
      const offset = 80; // Offset for fixed glassmorphism navbar

      if (rect.top <= offset && rect.bottom >= offset) {
        currentSection = sectionId;
      }
    }
  });

  // Update active nav link and aria-current attribute
  navLinks.forEach((link) => {
    link.classList.remove("active");
    link.removeAttribute("aria-current");

    if (link.getAttribute("href") === `#${currentSection}`) {
      link.classList.add("active");
      link.setAttribute("aria-current", "page");
    }
  });
}

/* ========================================
   SMOOTH SCROLLING FUNCTIONS
   ======================================== */

function initSmoothScrolling() {
  // Global scroll functions for CTA buttons
  window.scrollToContact = function () {
    const contactSection = document.getElementById("contact");
    if (contactSection) {
      contactSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  window.scrollToHowItWorks = function () {
    const howItWorksSection = document.getElementById("how-it-works");
    if (howItWorksSection) {
      howItWorksSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
}

/* ========================================
   CONTACT FORM FUNCTIONS
   ======================================== */

function initContactForm() {
  const form = document.getElementById("consultation-form");
  if (!form) return;

  // Form submission
  form.addEventListener("submit", handleFormSubmit);

  // Clear any initial red styling on page load
  const inputs = form.querySelectorAll("input, textarea");
  inputs.forEach((input) => {
    // Remove any error classes that might be present on load
    input.classList.remove("error", "valid");

    // Ensure clean initial state
    input.style.borderColor = "rgba(255, 255, 255, 0.1)";
    input.style.borderBottomColor = "rgba(255, 255, 255, 0.1)";
    input.style.backgroundColor = "rgba(255, 255, 255, 0.02)";
  });

  // Real-time validation
  const requiredInputs = form.querySelectorAll("input[required], textarea");
  requiredInputs.forEach((input) => {
    input.addEventListener("blur", function () {
      validateField(this);
    });

    input.addEventListener("input", function () {
      if (this.classList.contains("error")) {
        validateField(this);
      }
    });
  });
}

function validateField(field) {
  const value = field.value.trim();
  const fieldName = field.name;
  const errorElement = document.getElementById(fieldName + "-error");

  // Clear previous error and validation classes
  hideError(fieldName);
  field.classList.remove("error", "valid");

  // If field is empty, don't show any validation styling
  if (value.length === 0) {
    return true;
  }

  // Validation rules
  let isValid = true;
  let errorMessage = "";

  switch (fieldName) {
    case "fullName":
      if (value.length < 2) {
        isValid = false;
        errorMessage = "Please enter your full name (at least 2 characters)";
      }
      break;

    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address";
      }
      break;

    case "chapter":
      if (value.length < 2) {
        isValid = false;
        errorMessage = "Please enter your chapter or organization name";
      }
      break;

    case "goal":
      if (value.length < 5) {
        isValid = false;
        errorMessage = "Please describe your fundraising goal";
      }
      break;
  }

  // Show/hide error and apply appropriate styling
  if (!isValid) {
    showError(fieldName, errorMessage);
    field.classList.add("error");
  } else {
    // Field is valid and has content
    field.classList.add("valid");
  }

  return isValid;
}

function validateAllFields() {
  const form = document.getElementById("consultation-form");
  const requiredFields = form.querySelectorAll("input[required]");
  let allValid = true;

  requiredFields.forEach((field) => {
    if (!validateField(field)) {
      allValid = false;
    }
  });

  return allValid;
}

function showError(fieldName, message) {
  const errorElement = document.getElementById(fieldName + "-error");
  if (errorElement) {
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }
}

function hideError(fieldName) {
  const errorElement = document.getElementById(fieldName + "-error");
  if (errorElement) {
    errorElement.textContent = "";
    errorElement.style.display = "none";
  }
}

function handleFormSubmit(event) {
  event.preventDefault();

  // Validate all fields first
  if (!validateAllFields()) {
    return;
  }

  // Show loading state
  showLoadingState();

  // Prepare form data for EmailJS
  const formData = {
    name: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    chapter: document.getElementById("chapter").value,
    goal: document.getElementById("goal").value,
    message:
      document.getElementById("message").value ||
      "No additional message provided",
  };

  // Send email using EmailJS
  emailjs
    .send("service_sd9b6tp", "template_hc960g6", formData)
    .then(function (response) {
      console.log("Email sent successfully:", response);
      hideLoadingState();
      showSuccessMessage();
      resetForm();
    })
    .catch(function (error) {
      console.error("Email send failed:", error);
      hideLoadingState();
      showErrorMessage(
        "Oops! Something went wrong. Please try again or contact us directly at Team@limitlessfundraising.com"
      );
    });
}

function showLoadingState() {
  const submitBtn = document.getElementById("submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  submitBtn.disabled = true;
  btnText.style.display = "none";
  btnLoading.style.display = "inline-flex";
}

function hideLoadingState() {
  const submitBtn = document.getElementById("submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  submitBtn.disabled = false;
  btnText.style.display = "inline";
  btnLoading.style.display = "none";
}

function showSuccessMessage() {
  // Create success message
  const form = document.getElementById("consultation-form");
  const successDiv = document.createElement("div");
  successDiv.className = "success-message";
  successDiv.innerHTML = `
        <div style="background: #10B981; color: white; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
            <i class="fa-solid fa-check-circle" style="margin-right: 8px;"></i>
            Thank you! Your message has been sent successfully. We'll get back to you within 24 hours.
        </div>
    `;

  form.appendChild(successDiv);

  // Remove after 5 seconds
  setTimeout(() => {
    if (successDiv.parentNode) {
      successDiv.parentNode.removeChild(successDiv);
    }
  }, 5000);
}

function showErrorMessage(message) {
  // Create error message
  const form = document.getElementById("consultation-form");
  const errorDiv = document.createElement("div");
  errorDiv.className = "error-message-global";
  errorDiv.innerHTML = `
        <div style="background: #DC2626; color: white; padding: 16px; border-radius: 8px; margin-top: 16px; text-align: center;">
            <i class="fa-solid fa-exclamation-circle" style="margin-right: 8px;"></i>
            ${message}
        </div>
    `;

  form.appendChild(errorDiv);

  // Remove after 5 seconds
  setTimeout(() => {
    if (errorDiv.parentNode) {
      errorDiv.parentNode.removeChild(errorDiv);
    }
  }, 5000);
}

function resetForm() {
  const form = document.getElementById("consultation-form");
  form.reset();

  // Clear any error and valid states
  const validationFields = form.querySelectorAll(".error, .valid");
  validationFields.forEach((field) => {
    field.classList.remove("error", "valid");
  });

  // Clear error messages
  const errorMessages = form.querySelectorAll(".error-message");
  errorMessages.forEach((msg) => {
    msg.textContent = "";
    msg.style.display = "none";
  });
}

/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

function initImageFallbacks() {
  // Image fallback handling is done via onerror attribute in HTML
  // This function can be used for additional image handling if needed
}

function initVideoHandling() {
  const video = document.querySelector(".logo-animation-video");

  if (video) {
    // Handle video load success
    video.addEventListener("loadeddata", function () {
      console.log("Video loaded successfully");
    });

    // Handle video load error
    video.addEventListener("error", function () {
      console.log("Video failed to load");
    });

    // Handle video play error
    video.addEventListener("stalled", function () {
      console.log("Video playback stalled");
    });
  }
}

function handleImageError(img) {
  img.style.display = "none";
  const placeholder = img.parentElement.querySelector(".photo-placeholder");
  if (placeholder) {
    placeholder.style.display = "flex";
  }
}

function updateCopyrightYear() {
  const copyrightElement = document.querySelector(".copyright-text");
  if (copyrightElement) {
    const currentYear = new Date().getFullYear();
    copyrightElement.textContent = `© ${currentYear} Limitless Fundraising. All rights reserved.`;
  }
}

/* ========================================
   PERFORMANCE & ACCESSIBILITY
   ======================================== */

// Intersection Observer for animations (optional enhancement)
function initIntersectionObserver() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-in");
      }
    });
  }, observerOptions);

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".team-card, .step-card, .mission-card"
  );
  animateElements.forEach((el) => observer.observe(el));
}

// Keyboard navigation support
document.addEventListener("keydown", function (event) {
  // Escape key closes mobile menu
  if (event.key === "Escape") {
    const navbarPill = document.querySelector(".navbar-pill");
    if (navbarPill && navbarPill.classList.contains("mobile-active")) {
      closeMobileMenuOnClick();
    }
  }
});

// Performance monitoring
window.addEventListener("load", function () {
  // Log performance metrics
  if ("performance" in window) {
    const perfData = performance.getEntriesByType("navigation")[0];
    console.log(
      "Page load time:",
      perfData.loadEventEnd - perfData.loadEventStart,
      "ms"
    );
  }
});

/* ========================================
   SOCIAL MEDIA TRACKING (OPTIONAL)
   ======================================== */

function trackSocialClick(platform) {
  // Analytics tracking for social media clicks
  console.log(`Social media click: ${platform}`);

  // Example: Google Analytics event
  // if (typeof gtag !== 'undefined') {
  //     gtag('event', 'social_click', {
  //         'event_category': 'social',
  //         'event_label': platform
  //     });
  // }
}

// Add click tracking to social links
document.addEventListener("DOMContentLoaded", function () {
  const socialLinks = document.querySelectorAll(".social-link");
  socialLinks.forEach((link) => {
    link.addEventListener("click", function () {
      const platform = this.getAttribute("aria-label").toLowerCase();
      trackSocialClick(platform);
    });
  });
});
