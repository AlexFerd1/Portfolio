// Decipher Loading Screen — Unicode-safe & failproof

document.addEventListener("DOMContentLoaded", () => {
  const homeSection = document.getElementById("Home");
  const loader = document.getElementById("loader");
  const target = document.getElementById("glyph-decoder");
  const coords = loader?.querySelector(".glyph-coords");

  if (!loader || !target) return;

  // ----- CONFIG -----
  const FINAL_MESSAGE = Array.from("𓂀 𓊹 𓋹"); // Unicode-safe
  const GLYPH_POOL = ["𓂀","𓊹","𓋹","𓆣","𓀀","𓏏","𓎛","𓐍","𓇋","𓄿"];
  const SCRAMBLE_SPEED = 40;
  const LOCK_SPEED = 180;

  let revealed = 0;

  // Jump to Home immediately
  if (homeSection) {
    homeSection.scrollIntoView({ behavior: "auto" });
  }

  function randomGlyph() {
    return GLYPH_POOL[Math.floor(Math.random() * GLYPH_POOL.length)];
  }

  function render() {
    let output = "";

    for (let i = 0; i < FINAL_MESSAGE.length; i++) {
      if (i < revealed) {
        output += FINAL_MESSAGE[i];
      } else if (FINAL_MESSAGE[i] === " ") {
        output += " ";
      } else {
        output += randomGlyph();
      }
    }

    target.textContent = output;
  }

  const scrambleInterval = setInterval(render, SCRAMBLE_SPEED);

  const revealInterval = setInterval(() => {
    revealed++;

    if (revealed >= FINAL_MESSAGE.length) {
      clearInterval(scrambleInterval);
      clearInterval(revealInterval);

      target.textContent = FINAL_MESSAGE.join("");

      // Show coordinates
      if (coords) coords.style.opacity = "0.6";

      // Kill any CSS animation + fade out loader
      setTimeout(() => {
        loader.style.animation = "none";
        loader.style.transition = "opacity 0.6s ease";
        loader.style.opacity = "0";

        setTimeout(() => loader.remove(), 600);
      }, 2000);
    }
  }, LOCK_SPEED);

  // ----- FAILSAFE -----
  // Loader can NEVER get stuck
  setTimeout(() => {
    if (document.body.contains(loader)) {
      loader.remove();
    }
  }, 8000);
});
