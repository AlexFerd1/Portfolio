/* ================================
   MAIN APP SCRIPT (SAFE VERSION)
   ================================ */

   console.log("MAIN.JS LOADED");
document.addEventListener("DOMContentLoaded", () => {

  /* ---------- GLOBAL STATE ---------- */
  const body = document.body;
  const isLoading = () => body.classList.contains("loading");

  /* ---------- SECTION SCROLLING ---------- */
  const sections = document.querySelectorAll(".section");
  const navLinks = document.querySelectorAll(".nav-links a");
  const dots = document.querySelectorAll(".scroll-dots .dot");

  let isScrolling = false;
  let currentSectionIndex = 0;

  function scrollToSection(index) {
    if (isLoading()) return;

    index = Math.max(0, Math.min(index, sections.length - 1));
    if (isScrolling) return;

    isScrolling = true;
    sections[index].scrollIntoView({ behavior: "smooth" });
    currentSectionIndex = index;

    setTimeout(() => (isScrolling = false), 700);
  }

  window.addEventListener(
    "wheel",
    (e) => {
      if (isLoading() || isScrolling) return;
      e.deltaY > 0 ? currentSectionIndex++ : currentSectionIndex--;
      scrollToSection(currentSectionIndex);
    },
    { passive: true }
  );

  function updateActiveNav() {
    if (isLoading()) return;

    let scrollPos = window.scrollY + 120;
    let currentId = sections[0]?.id;

    sections.forEach((section, idx) => {
      if (scrollPos >= section.offsetTop) {
        currentSectionIndex = idx;
        currentId = section.id;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentId}`
      );
    });

    dots.forEach((dot) => {
      dot.classList.toggle("active", dot.dataset.target === currentId);
    });
  }

  window.addEventListener("scroll", updateActiveNav);
  updateActiveNav();

  dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      if (isLoading()) return;
      const target = document.getElementById(dot.dataset.target);
      target?.scrollIntoView({ behavior: "smooth" });
    });
  });

  /* ---------- NEON CURSOR TRAIL ---------- */
  const trailCanvas = document.getElementById("neon-trail");
  if (trailCanvas) {
    const ctx = trailCanvas.getContext("2d");

    function resizeTrail() {
      trailCanvas.width = window.innerWidth;
      trailCanvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeTrail);
    resizeTrail();

    const trail = [];
    const trailLength = 30;
    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    for (let i = 0; i < trailLength; i++) {
      trail.push({ x: mouse.x, y: mouse.y });
    }

    document.addEventListener("mousemove", (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    function animateTrail() {
      requestAnimationFrame(animateTrail);

      let x = mouse.x;
      let y = mouse.y;

      trail.forEach((point) => {
        point.x += (x - point.x) * 0.25;
        point.y += (y - point.y) * 0.25;
        x = point.x;
        y = point.y;
      });

      ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);

      for (let i = 1; i < trail.length; i++) {
        ctx.strokeStyle = `rgba(255,255,255,${i / trail.length})`;
        ctx.lineWidth = 6;
        ctx.shadowColor = "white";
        ctx.shadowBlur = 15;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.moveTo(trail[i - 1].x, trail[i - 1].y);
        ctx.lineTo(trail[i].x, trail[i].y);
        ctx.stroke();
      }
    }

    animateTrail();
  }

  /* ---------- SKILLS ENERGY CANVAS ---------- */
  const skillsCanvas = document.querySelector("#Skills .skills-energy");

  if (skillsCanvas) {
    const ctx = skillsCanvas.getContext("2d");

    function resizeSkills() {
      const section = document.getElementById("Skills");
      if (!section) return;
      skillsCanvas.width = section.clientWidth;
      skillsCanvas.height = section.clientHeight;
    }

    resizeSkills();
    window.addEventListener("resize", resizeSkills);

    function branch(x, y, length, angle, depth) {
      if (depth === 0) return;

      const x2 = x + Math.cos(angle) * length;
      const y2 = y + Math.sin(angle) * length;

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      const newLength = length * (0.75 + Math.random() * 0.2);

      branch(x2, y2, newLength, angle - Math.random() * 0.6, depth - 1);
      branch(x2, y2, newLength, angle + Math.random() * 0.6, depth - 1);
    }

    function drawSkills() {
      ctx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

      ctx.globalCompositeOperation = "lighter";
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(180,220,255,0.7)";
      ctx.shadowBlur = 30;
      ctx.shadowColor = "rgba(180,220,255,1)";

      const startX = skillsCanvas.width * 0.5;
      const startY = skillsCanvas.height * 0.9;
      const time = Date.now() * 0.002;

      branch(
        startX,
        startY,
        skillsCanvas.height * 0.35,
        -Math.PI / 2 + Math.sin(time) * 0.05,
        7
      );

      requestAnimationFrame(drawSkills);
    }

    drawSkills();
  }
});
