
// Decipher loading Screen//

document.addEventListener("DOMContentLoaded", () =>
 {
  const homeSection = document.getElementById("Home");
  const FINAL_MESSAGE = "𓂀 𓊹 𓋹";
  const GLYPH_POOL = ["𓂀","𓊹","𓋹","𓆣","𓀀","𓏏","𓎛","𓐍","𓇋","𓄿"];
  const SCRAMBLE_SPEED = 40;
  const LOCK_SPEED = 180;

  const loader = document.getElementById("loader");
  const target = document.getElementById("glyph-decoder");
  const coords = loader.querySelector(".glyph-coords");

  let revealed = 0;

  if (homeSection) {
// Jump to top of Home immediately
homeSection.scrollIntoView({ behavior: "auto" });
}
  function randomGlyph() {
    return GLYPH_POOL[Math.floor(Math.random() * GLYPH_POOL.length)];
  }

  function render() {
    let out = "";
    for (let i = 0; i < FINAL_MESSAGE.length; i++) {
      if (i < revealed) out += FINAL_MESSAGE[i];
      else if (FINAL_MESSAGE[i] === " ") out += " ";
      else out += randomGlyph();
    }
    target.textContent = out;
  }

  const scrambleInterval = setInterval(render, SCRAMBLE_SPEED);

  const revealInterval = setInterval(() => {
    revealed++;
    if (revealed > FINAL_MESSAGE.length) {
      clearInterval(scrambleInterval);
      clearInterval(revealInterval);
      target.textContent = FINAL_MESSAGE;

      // ---- Show coordinates ----
      coords.style.opacity = "0.6";

      // ---- Wait 1.5s THEN fade out loader ----
      setTimeout(() => {
        loader.style.transition = "opacity 0.6s ease";
        loader.style.opacity = "0";
        setTimeout(() => loader.remove(), 600);
      }, 2000);
    }
  }, LOCK_SPEED);
});