// Decipher Loading Screen — random final logos, no race conditions

document.addEventListener("DOMContentLoaded", () => {
  const homeSection = document.getElementById("Home");
  const loader = document.getElementById("loader");
  const target = document.getElementById("glyph-decoder");
  const coords = loader?.querySelector(".glyph-coords");

  if (!loader || !target) return;

  // ----- CONFIG -----
  const GLYPH_POOL = [
    "𓂀","𓊹","𓋹","𓆣","𓀀",
    "𓏏","𓎛","𓐍","𓇋","𓄿"
  ];

  const LOGO_COUNT = 3;
  const SCRAMBLE_SPEED = 50;
  const LOCK_SPEED = 180;

  let revealed = -1;
  let lastGlyph = null;

  // ----- HELPERS -----
  function randomGlyph(exclude) {
    let g;
    do {
      g = GLYPH_POOL[Math.floor(Math.random() * GLYPH_POOL.length)];
    } while (g === exclude || g === lastGlyph);

    lastGlyph = g;
    return g;
  }

  function buildFinalMessage() {
    const result = [];
    for (let i = 0; i < LOGO_COUNT; i++) {
      result.push(randomGlyph());
      if (i < LOGO_COUNT - 1) result.push(" ");
    }
    return result;
  }

  const FINAL_MESSAGE = buildFinalMessage();

  // Jump to Home immediately
  homeSection?.scrollIntoView({ behavior: "auto" });

  // ----- RENDER -----
  function render() {
    let output = "";

    for (let i = 0; i < FINAL_MESSAGE.length; i++) {
      output += i <= revealed
        ? FINAL_MESSAGE[i]
        : randomGlyph(FINAL_MESSAGE[i]);
    }

    target.textContent = output;
  }

  const scrambleInterval = setInterval(render, SCRAMBLE_SPEED);

  // Delay reveal so scrambling is always visible
  setTimeout(() => {
    const revealInterval = setInterval(() => {
      revealed++;

      if (revealed >= FINAL_MESSAGE.length - 1) {
        clearInterval(scrambleInterval);
        clearInterval(revealInterval);

        target.textContent = FINAL_MESSAGE.join("");

        if (coords) coords.style.opacity = "0.6";

        setTimeout(() => {
          loader.style.animation = "none";
          loader.style.transition = "opacity 0.6s ease";
          loader.style.opacity = "0";

          setTimeout(() => loader.remove(), 800);
        }, 2000);
      }
    }, LOCK_SPEED);
  }, SCRAMBLE_SPEED);

  // ----- FAILSAFE -----
  setTimeout(() => {
    if (document.body.contains(loader)) {
      loader.remove();
    }
  }, 8000);
});
