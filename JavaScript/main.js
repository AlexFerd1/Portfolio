// Intersection Observer for animations
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

//Hamburger navbar
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("nav-links");

  // Toggle navigation and update the hamburger icon
  hamburgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburgerMenu.classList.toggle("active");

    // Toggle between ☰ (hamburger) and × (close) icons
    if (navLinks.classList.contains("active")) {
      hamburgerMenu.innerHTML = "×"; // "X" icon (close)
    } else {
      hamburgerMenu.innerHTML = "&#9776;"; // Hamburger icon (☰)
    }
  });
});

// smooth scrolling
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
      scrollToSection(currentSectionIndex + 1);
    }
  } else {
    // Scroll up: go to the previous section
    if (currentSectionIndex > 0) {
      scrollToSection(currentSectionIndex - 1);
    }
  }

  // Allow scrolling again after a short delay
  setTimeout(function () {
    isScrolling = false;
  }, 800); // You can adjust the timeout for scroll speed
});

// Prevent default scrolling behavior to avoid interference with full-screen scrolling
document.body.addEventListener("wheel", function (e) {
  passive: false;
});
