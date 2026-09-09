import { Application } from '@splinetool/runtime';

const canvasBlob = document.getElementById('canvas3dBlob');
const canvasNebula = document.getElementById('canvas3dNebula');
const canvasRobot = document.getElementById('canvasRobot');

const loader = document.getElementById('loader');


// ========================================
// LOAD + SETUP A SPLINE SCENE
// ========================================

async function loadSpline(canvas, url, zoomRadius = 200) {

  // If this canvas does not exist on the page,
  // don't stop the loading screen forever.
  if (!canvas) {
    console.warn(`Canvas not found for: ${url}`);
    return null;
  }

  const app = new Application(canvas);

  // THIS WAITS UNTIL THE SPLINE SCENE IS LOADED
  await app.load(url);

  console.log(`Spline loaded: ${canvas.id}`);


  // ========================================
  // CAMERA ZOOM
  // ========================================

  let targetZoom = 5;
  let zoom = targetZoom;


  canvas.addEventListener(
    'wheel',
    (e) => {

      const rect = canvas.getBoundingClientRect();

      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      const dist = Math.sqrt(dx * dx + dy * dy);


      // Only zoom when mouse is near this Spline
      if (dist < zoomRadius) {

        e.preventDefault();

        targetZoom += e.deltaY * 0.001;

        // Keep zoom between 2 and 10
        targetZoom = Math.max(
          2,
          Math.min(10, targetZoom)
        );
      }

    },
    { passive: false }
  );


  // ========================================
  // SMOOTH CAMERA ANIMATION
  // ========================================

  function animate() {

    requestAnimationFrame(animate);

    zoom += (targetZoom - zoom) * 0.1;

    if (app.scene && app.scene.camera) {
      app.scene.camera.position.z = zoom;
    }
  }

  animate();


  // Return finished Spline application
  return app;
}



// ========================================
// LOAD ALL SPLINE SCENES
// ========================================

async function loadAllSplines() {

  try {

    console.log("Loading all Spline scenes...");


    await Promise.all([

      // BLOB
      loadSpline(
        canvasBlob,
        'https://prod.spline.design/u4tpncNcUwYflUBO/scene.splinecode',
        400
      ),


      // NEBULA
      loadSpline(
        canvasNebula,
        'https://prod.spline.design/0CiGop-E6om4WZE7/scene.splinecode',
        200
      ),


      // ROBOT
      loadSpline(
        canvasRobot,
        'https://prod.spline.design/TCZcX8moB-ezwS06/scene.splinecode',
        200
      )

    ]);


    console.log("ALL SPLINE SCENES LOADED");


    // ========================================
    // REMOVE LOADING SCREEN
    // ========================================

    if (loader) {

      loader.classList.add('loader-hidden');

      setTimeout(() => {
        loader.style.display = 'none';

        document.body.classList.remove('loading');

      }, 500);
    }


  } catch (error) {

    console.error(
      "A Spline scene failed to load:",
      error
    );


    // Don't trap the user on loading screen forever
    if (loader) {

      loader.classList.add('loader-hidden');

      setTimeout(() => {
        loader.style.display = 'none';

        document.body.classList.remove('loading');

      }, 500);
    }
  }
}



// ========================================
// START EVERYTHING
// ========================================

loadAllSplines();