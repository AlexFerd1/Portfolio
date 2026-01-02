//import { Application } from '@splinetool/runtime';

//const canvas = document.getElementById('canvas3d');
//const app = new Application(canvas);
//app.load('https://prod.spline.design/DAfOz-HSjvbMttZV/scene.splinecode');

import { Application } from '@splinetool/runtime';

const canvas = document.getElementById('canvas3d');

if (canvas) {
  const app = new Application(canvas);
  app.load('https://prod.spline.design/DAfOz-HSjvbMttZV/scene.splinecode');

  // --- Camera zoom setup ---
  let targetZoom = 5; // desired camera z
  let zoom = targetZoom;

  // --- Smooth zoom on wheel only near blob ---
  canvas.addEventListener('wheel', (e) => {
    const rect = canvas.getBoundingClientRect();
    const cx = rect.left + rect.width/2;
    const cy = rect.top + rect.height/2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx*dx + dy*dy);

    if(dist < 400){  // only zoom if cursor is within 200px of blob center
      e.preventDefault(); // prevent page scroll
      targetZoom += e.deltaY * 0.001;  // adjust sensitivity
      targetZoom = Math.max(2, Math.min(10, targetZoom)); // clamp zoom
    }
  }, { passive: false });

  // --- Animate camera smoothly ---
  function animate() {
    requestAnimationFrame(animate);

    // Lerp towards target zoom
    zoom += (targetZoom - zoom) * 0.1;

    if(app.scene && app.scene.camera){
      app.scene.camera.position.z = zoom;
    }
  }

  animate();
}
