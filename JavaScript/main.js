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
