// Intersection Observer for animations (if needed for additional animations)
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

// Apply the observer to all hidden elements
const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));

// Hamburger Navbar Functionality
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-links li a"); // Select all anchor links in the navbar

  // Toggle navigation and update the hamburger icon
  hamburgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active"); // Toggle the 'active' class
    // Change the hamburger icon to an 'X' when menu is active
    if (navLinks.classList.contains("active")) {
      hamburgerMenu.innerHTML = "×"; // "X" icon (close)
    } else {
      hamburgerMenu.innerHTML = "&#9776;"; // Hamburger icon (☰)
    }
  });

  // Close the menu after clicking a link
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active"); // Close the mobile menu
      hamburgerMenu.innerHTML = "&#9776;"; // Reset hamburger icon to default
    });
  });

  // Smooth scroll to section when anchor links are clicked
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault(); // Prevent default scroll behavior

      // Scroll smoothly to the targeted section
      document.querySelector(this.getAttribute("href")).scrollIntoView({
        behavior: "smooth",
      });

      // Close the mobile menu after clicking a link (for mobile view)
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active"); // Close the menu
        hamburgerMenu.innerHTML = "&#9776;"; // Reset hamburger icon
      }
    });
  });
});

// Smooth Scroll to Specific Section on Mouse Wheel
let sections = document.querySelectorAll(".full-screen-section");
let currentSectionIndex = 0; // Keep track of the current section

// Function to scroll to a specific section
function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: "smooth" });
    currentSectionIndex = index;
  }
}

// Mouse wheel scrolling to move to next/previous section
let isScrolling = false;

document.addEventListener("wheel", function (e) {
  if (isScrolling) return; // Prevent rapid scrolling

  isScrolling = true; // Prevent multiple scroll triggers

  // Check if the wheel scrolls down (positive deltaY) or up (negative deltaY)
  if (e.deltaY > 0) {
    // Scroll down: go to the next section
    if (currentSectionIndex < sections.length - 1) {
      currentSectionIndex++; // Move to next section
    }
  } else {
    // Scroll up: go to the previous section
    if (currentSectionIndex > 0) {
      currentSectionIndex--; // Move to previous section
    }
  }

  // Scroll to the targeted section
  scrollToSection(currentSectionIndex);

  // Allow scrolling again after a short delay
  setTimeout(function () {
    isScrolling = false;
  }, 800); // Adjust timeout to control the scroll speed
});
