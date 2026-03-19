document.addEventListener("DOMContentLoaded", function () {
  // Select all elements with the 'anim-scroll' class.
  const animatedElements = document.querySelectorAll(".anim-scroll");

  // Function to get current breakpoint
  function getCurrentBreakpoint() {
    const width = window.innerWidth;
    if (width < 576) return "xs";
    if (width < 768) return "sm";
    if (width < 992) return "md";
    if (width < 1200) return "lg";
    return "xl";
  }

  // Default thresholds for each breakpoint
  const defaultThresholds = {
    xs: 0.05, // Extra small screens - very sensitive
    sm: 0.1, // Small screens - sensitive
    md: 0.15, // Medium screens - moderate
    lg: 0.2, // Large screens - less sensitive
    xl: 0.25, // Extra large screens - least sensitive
  };

  // Function to detect and handle positioned elements
  function handlePositionedElements() {
    animatedElements.forEach((element) => {
      const computedStyle = window.getComputedStyle(element);
      const position = computedStyle.position;

      // Check if element is positioned
      if (position === 'relative' || position === 'absolute' || position === 'fixed') {
        // Add positioned class if not already present
        if (!element.classList.contains('positioned')) {
          element.classList.add('positioned');
        }

        // Check if it's a header-like element
        const tagName = element.tagName.toLowerCase();
        const hasHeaderClass = element.classList.contains('header') ||
          element.classList.contains('navbar') ||
          element.classList.contains('nav') ||
          element.id.includes('header') ||
          element.id.includes('nav');

        if (tagName === 'header' || tagName === 'nav' || hasHeaderClass) {
          element.classList.add('header-element');
        }
      }
    });
  }

  // Function to get threshold from element classes
  function getThreshold(element) {
    // Check for explicit threshold classes first
    if (element.classList.contains("anim-threshold-10")) return 0.1;
    if (element.classList.contains("anim-threshold-20")) return 0.2;
    if (element.classList.contains("anim-threshold-30")) return 0.3;
    if (element.classList.contains("anim-threshold-40")) return 0.4;
    if (element.classList.contains("anim-threshold-50")) return 0.5;
    if (element.classList.contains("anim-threshold-60")) return 0.6;
    if (element.classList.contains("anim-threshold-70")) return 0.7;
    if (element.classList.contains("anim-threshold-80")) return 0.8;
    if (element.classList.contains("anim-threshold-90")) return 0.9;
    if (element.classList.contains("anim-threshold-100")) return 1.0;

    // Check for breakpoint-specific threshold classes
    const breakpoint = getCurrentBreakpoint();
    if (element.classList.contains(`anim-threshold-${breakpoint}-10`))
      return 0.1;
    if (element.classList.contains(`anim-threshold-${breakpoint}-20`))
      return 0.2;
    if (element.classList.contains(`anim-threshold-${breakpoint}-30`))
      return 0.3;
    if (element.classList.contains(`anim-threshold-${breakpoint}-40`))
      return 0.4;
    if (element.classList.contains(`anim-threshold-${breakpoint}-50`))
      return 0.5;
    if (element.classList.contains(`anim-threshold-${breakpoint}-60`))
      return 0.6;
    if (element.classList.contains(`anim-threshold-${breakpoint}-70`))
      return 0.7;
    if (element.classList.contains(`anim-threshold-${breakpoint}-80`))
      return 0.8;
    if (element.classList.contains(`anim-threshold-${breakpoint}-90`))
      return 0.9;
    if (element.classList.contains(`anim-threshold-${breakpoint}-100`))
      return 1.0;

    // Return breakpoint-specific default
    return defaultThresholds[breakpoint];
  }

  // Function to initialize observers
  function initializeObservers() {
    // Handle positioned elements first
    handlePositionedElements();

    // Clear existing observers
    if (window.animationObservers) {
      window.animationObservers.forEach((observer) => observer.disconnect());
    }
    window.animationObservers = [];

    // Group elements by their threshold values
    const thresholdGroups = {};

    animatedElements.forEach((element) => {
      const threshold = getThreshold(element);
      if (!thresholdGroups[threshold]) {
        thresholdGroups[threshold] = [];
      }
      thresholdGroups[threshold].push(element);
    });

    // Create observers for each threshold group
    Object.keys(thresholdGroups).forEach((threshold) => {
      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: parseFloat(threshold),
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("scrolled-in");
            }, 50);
          } else {
            entry.target.classList.remove("scrolled-in");
          }
        });
      }, observerOptions);

      // Observe all elements in this threshold group
      thresholdGroups[threshold].forEach((element) => {
        observer.observe(element);
      });

      // Store observer for cleanup
      window.animationObservers.push(observer);
    });
  }

  // Initialize observers
  initializeObservers();

  // Reinitialize on window resize to handle breakpoint changes
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      initializeObservers();
    }, 250);
  });
});