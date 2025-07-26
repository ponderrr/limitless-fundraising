/* ========================================
   LIMITLESS FUNDRAISING - SMOOTH SCROLL
   ======================================== */

// Enhanced smooth scrolling functionality
document.addEventListener("DOMContentLoaded", function () {
  initEnhancedSmoothScroll();
});

function initEnhancedSmoothScroll() {
  // Get all navigation links
  const navLinks = document.querySelectorAll('a[href^="#"]');

  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        smoothScrollToElement(targetElement);
      }
    });
  });
}

function smoothScrollToElement(element) {
  const headerHeight = 80; // Height of fixed header
  const elementPosition = element.offsetTop - headerHeight;

  window.scrollTo({
    top: elementPosition,
    behavior: "smooth",
  });
}

// Enhanced scroll behavior with easing
function smoothScrollToElementWithEasing(element, duration = 800) {
  const headerHeight = 80;
  const startPosition = window.pageYOffset;
  const targetPosition = element.offsetTop - headerHeight;
  const distance = targetPosition - startPosition;
  let startTime = null;

  function animation(currentTime) {
    if (startTime === null) startTime = currentTime;
    const timeElapsed = currentTime - startTime;
    const run = easeInOutCubic(timeElapsed, startPosition, distance, duration);
    window.scrollTo(0, run);
    if (timeElapsed < duration) requestAnimationFrame(animation);
  }

  requestAnimationFrame(animation);
}

// Easing function for smooth animation
function easeInOutCubic(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return (c / 2) * t * t * t + b;
  t -= 2;
  return (c / 2) * (t * t * t + 2) + b;
}

// Scroll to top functionality
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

// Scroll to specific section with offset
function scrollToSection(sectionId, offset = 80) {
  const element = document.getElementById(sectionId);
  if (element) {
    const elementPosition = element.offsetTop - offset;
    window.scrollTo({
      top: elementPosition,
      behavior: "smooth",
    });
  }
}

// Export functions for global use
window.scrollToTop = scrollToTop;
window.scrollToSection = scrollToSection;
window.smoothScrollToElement = smoothScrollToElement;
