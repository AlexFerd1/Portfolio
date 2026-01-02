
// Smooth Scrolling and Section Highlighting

document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-links a");
  const dots = document.querySelectorAll(".scroll-dots .dot");

  let isScrolling = false;
  let currentSectionIndex = 0;

  function scrollToSection(index) {
    if (index < 0) index = 0;
    if (index >= sections.length) index = sections.length - 1;

    if (isScrolling) return;
    isScrolling = true;

    sections[index].scrollIntoView({ behavior: "smooth" });
    currentSectionIndex = index;

    // Wait for scroll animation to finish before allowing next scroll
    setTimeout(() => {
      isScrolling = false;
    }, 700); // adjust timing if needed
  }

  // -------- Wheel scroll --------
  window.addEventListener("wheel", (e) => {
    if (isScrolling) return;
    if (e.deltaY > 0) currentSectionIndex++;
    else currentSectionIndex--;
    scrollToSection(currentSectionIndex);
  }, { passive: true });

  // -------- Auto-highlight nav links & dots --------
  function updateActiveNav() {
    let scrollPos = window.scrollY + 100; // offset for navbar
    let currentId = sections[0].id;

    sections.forEach((section, idx) => {
      if (scrollPos >= section.offsetTop) {
        currentSectionIndex = idx; // update current index
        currentId = section.id;
      }
    });

    navLinks.forEach(link => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + currentId);
    });

    dots.forEach(dot => {
      dot.classList.toggle("active", dot.dataset.target === currentId);
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav(); // run on page load

  // -------- Dot click scroll --------
  dots.forEach(dot => {
    dot.addEventListener("click", () => {
      const target = document.getElementById(dot.dataset.target);
      if (target) target.scrollIntoView({ behavior: "smooth" });
    });
  });
});



// Neon Trail Effect for Mouse Cursor
document.addEventListener("DOMContentLoaded", () => {
  const canvas = document.getElementById("neon-trail");
  const ctx = canvas.getContext("2d");

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  const trail = [];
  const trailLength = 30; // length of the trail

  // Initialize trail points at center
  for (let i = 0; i < trailLength; i++) {
    trail.push({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  }

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  document.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  const neonColor = "rgba(255, 255, 255, 1)"; // your solid neon color

  function animate() {
    requestAnimationFrame(animate);

    // Smoothly update trail points
    let x = mouse.x;
    let y = mouse.y;
    for (let i = 0; i < trail.length; i++) {
      trail[i].x += (x - trail[i].x) * 0.25;
      trail[i].y += (y - trail[i].y) * 0.25;
      x = trail[i].x;
      y = trail[i].y;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw smooth solid neon trail
    for (let i = 1; i < trail.length; i++) {
      const alpha = i / trail.length; // fade older points
      ctx.strokeStyle = `rgba(255, 255, 255, 1 ${alpha})`; // neonColor with alpha
      ctx.lineWidth = 6;
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 15;
      ctx.lineCap = "round";

      ctx.beginPath();
      ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
      ctx.lineTo(trail[i].x, trail[i].y);
      ctx.stroke();
    }
  }

  animate();
});
