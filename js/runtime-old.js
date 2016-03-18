/* **************** Start Draw Function (runtime) ********************* */
function draw() {
/* **************** Start Draw Function (runtime) ********************* */

// frame rate
  frameRate = 60;
// Each frame reset color overlay mode
  c.globalCompositeOperation = 'source-over';
// background
  // c.fillStyle = rgb(0,0,0);
  c.clearRect(0,0,canvas.width,canvas.height);

  if (bgClouds <= 200) {
    makeClouds(200);
  } else {
    makeClouds(0);
  }

if (startGame) {

  bulletDeltaX = mouseX - p.x;
  bulletDeltaY = mouseY - p.y;
  bulletAngle = Math.atan2(bulletDeltaY,bulletDeltaX);
  bulletXVel = Math.cos(bulletAngle) * bulletSpeed;
  bulletYVel = Math.sin(bulletAngle) * bulletSpeed;

  if (populateAsteroids) {
    if (asteroidsL < 10) {
      makeAsteroidL(10);
      populateAsteroids = false;
    } else {
    makeAsteroidL(0);  
    }
  }
/* **************** runtime function list ********************* */
cloudRenderer();
asteroidLargeUpdater();
asteroidSmallUpdater();
explosionsUpdater();
bulletUpdater();
bulletEmmisionFunct();
playerRender();
playerUpdate();
playerControls();

}
gameOverAnim();
/* **************** close runtime function list ********************* */

/* **************** update counter ********************* */
counter++;
/* ****************  debug output ********************* */
debugOutput();
/* **************** Close Draw Function ******************** */
};
/* **************** Close Draw Function ******************** */