// Mobile menu functionality with debugging
document.addEventListener("DOMContentLoaded", function () {
  console.log("JavaScript loaded!");

  const menuBtn = document.querySelector(".menu-btn a");
  const menuClose = document.querySelector(".menu-close a");
  const aside = document.querySelector("nav.mobile-menu aside");

  // Check if elements exist
  console.log("Menu button:", menuBtn);
  console.log("Close button:", menuClose);
  console.log("Aside element:", aside);

  if (!menuBtn) {
    console.error(
      "Menu button not found! Check if .menu-btn a exists in your HTML"
    );
    return;
  }

  if (!menuClose) {
    console.error(
      "Close button not found! Check if .menu-close a exists in your HTML"
    );
    return;
  }

  if (!aside) {
    console.error(
      "Aside element not found! Check if nav.mobile-menu aside exists in your HTML"
    );
    return;
  }

  // Function to prevent body scroll without layout shift
  function preventBodyScroll() {
    const scrollY = window.scrollY;
    // document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;
    document.body.style.width = "100%";
  }

  // Function to restore body scroll
  function restoreBodyScroll() {
    const scrollY = document.body.style.top;
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.width = "";
    window.scrollTo(0, parseInt(scrollY || "0") * -1);
  }

  // Open sidebar when menu button is clicked
  menuBtn.addEventListener("click", function (e) {
    console.log("Menu button clicked!");
    e.preventDefault();
    aside.classList.add("menu-open");
    console.log("Added menu-open class");
    preventBodyScroll();
  });

  // Close sidebar when close button is clicked
  menuClose.addEventListener("click", function (e) {
    console.log("Close button clicked!");
    e.preventDefault();
    aside.classList.remove("menu-open");
    console.log("Removed menu-open class");
    restoreBodyScroll();
  });

  // Close sidebar when clicking on the overlay (aside::after)
  aside.addEventListener("click", function (e) {
    console.log("Aside clicked, target:", e.target);
    // Only close if clicking on the overlay area (not the menu itself)
    if (e.target === aside) {
      console.log("Closing menu via overlay click");
      aside.classList.remove("menu-open");
      restoreBodyScroll();
    }
  });

  // Close sidebar when pressing Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && aside.classList.contains("menu-open")) {
      console.log("Closing menu via Escape key");
      aside.classList.remove("menu-open");
      restoreBodyScroll();
    }
  });
});
