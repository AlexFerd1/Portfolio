// ===============================
// Intersection Observer for animations
// ===============================
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    } else {
      entry.target.classList.remove("show");
    }
  });
});

// Apply observer to all elements with class "hidden"
const hiddenElements = document.querySelectorAll(".hidden");
hiddenElements.forEach((el) => observer.observe(el));


// ===============================
// DOMContentLoaded: Hamburger menu & anchor links
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navLinks = document.getElementById("nav-links");
  const navItems = document.querySelectorAll(".nav-links li a");

  // Toggle mobile navigation
  hamburgerMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");

    // Toggle hamburger icon between ☰ and ×
    hamburgerMenu.innerHTML = navLinks.classList.contains("active") ? "×" : "&#9776;";
  });

  // Close mobile menu when a nav item is clicked
  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navLinks.classList.remove("active");
      hamburgerMenu.innerHTML = "&#9776;";
    });
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }

      // Close mobile menu after click on mobile
      if (window.innerWidth <= 768) {
        navLinks.classList.remove("active");
        hamburgerMenu.innerHTML = "&#9776;";
      }
    });
  });
});


// ===============================
// Full-page mouse wheel scroll
// ===============================
const sections = document.querySelectorAll(".section");
let currentSectionIndex = 0;
let isScrolling = false;

function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    sections[index].scrollIntoView({ behavior: "smooth" });
    currentSectionIndex = index;
  }
}

document.addEventListener("wheel", function (e) {
  if (isScrolling) return;

  isScrolling = true;

  if (e.deltaY > 0) {
    currentSectionIndex++;
  } else {
    currentSectionIndex--;
  }

  scrollToSection(currentSectionIndex);

  setTimeout(function () {
    isScrolling = false;
  }, 800);
});


const dots = document.querySelectorAll(".scroll-dots .dot");

// Highlight the dot based on scroll
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200; // offset for navbar height
    if (pageYOffset >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  dots.forEach((dot) => {
    dot.classList.remove("active");
    if (dot.dataset.target === current) {
      dot.classList.add("active");
    }
  });
});

// Update active dot on scroll
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    const sectionTop = section.offsetTop - 200; // adjust if navbar is fixed
    if (window.scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  dots.forEach((dot) => {
    dot.classList.remove("active");
    if (dot.dataset.target === current) {
      dot.classList.add("active");
    }
  });
});

// Scroll to section when dot is clicked
dots.forEach((dot) => {
  dot.addEventListener("click", () => {
    const target = document.getElementById(dot.dataset.target);
    target.scrollIntoView({ behavior: "smooth" });
  });
});
