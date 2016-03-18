/* ****************  housekeeping ********************* */

// define the canvas as a variable. define the canvas context as 2d
var canvas = document.getElementById('myCanvas'),
    c = canvas.getContext('2d');

// Set Canvas full screen

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

/* ****************  close housekeeping ********************* */

var gameOverText = {
  colR : 255,
  colG : 255,
  colB : 255,
  colA : 1,
  font : "100pt arial",
  x : canvas.width/2,
  y : canvas.height/2,
  align : "center"
}

var gT = gameOverText;

var gameOverAnim = function() {
  if (gameOver) {
    startGame = false;
    c.font = gT.font;
    c.fillStyle = rgba(gT.colR,gT.colG,gT.colB,gT.colA);
    c.textAlign = gT.align;
    c.fillText("GAME OVER",gT.x,gT.y);
    c.font = "50pt arial"
    c.fillText("SCORE: "+score,gT.x,gT.y + 120);

    gT.colA -= 0.005;

    if (counter%240 == 0) {
      $('.startButton.off').removeClass('off').addClass('on');
      $('.playerControls.off').removeClass('off').addClass('on');
      initGame();
    }
  }
}

// create an object to control

var player = {
  x : canvas.width/2,
  y : canvas.height/2,
  r : 20,
  colR : 150,
  colG : 150,
  colB : 150,
  xVel : 0,
  yVel : 0
};

var firing = false;
var colPointX = 0;
var colPointY = 0;
// shorthand variable for player
var p = player;

// create render function player 
var playerRender = function() {

if (playerAlive) {
  if ((playerLeftKey)||(playerRightKey)) {
  boosterXRender();
  }
  if ((playerUpKey)||(playerDownKey)) {
  boosterYRender();
  }

  c.fillStyle = rgb(p.colR,p.colG,p.colB);
  c.fillCircle(p.x,p.y,p.r);
  c.lineWidth = 4;

  var deltaX = mouseX - p.x;
  var deltaY = mouseY - p.y;
  var thisRot = Math.atan2(deltaY,deltaX);

  c.strokeStyle = rgb(200,0,0);
  c.save();
  c.translate(p.x,p.y);
  c.rotate(thisRot);
  c.beginPath()
  c.moveTo(0,0);
  c.lineTo(20,0);
  c.stroke();
  c.restore();
  }
};

var boosterXRender = function() {
  var boostLength = random(50,150);
  c.globalCompositeOperation = 'lighter';
  if (playerLeftKey) {
  var boostGrad = c.createLinearGradient(p.x,p.y-10,p.x+boostLength,p.y+10);
  boostGrad.addColorStop(0,'rgba(255,255,255,1)');
  boostGrad.addColorStop(1,'rgba(0,0,255,0)');
  c.fillStyle = boostGrad;
  c.fillRect(p.x,p.y-10,boostLength,20);
  }
  if (playerRightKey) {
    var boostGrad = c.createLinearGradient(p.x,p.y-10,p.x-boostLength,p.y+10);
    boostGrad.addColorStop(0,'rgba(255,255,255,1)');
    boostGrad.addColorStop(1,'rgba(0,0,255,0)');
    c.fillStyle = boostGrad;
    c.fillRect(p.x,p.y-10,-boostLength,20);
    }
  c.globalCompositeOperation = 'source-over';
}

var boosterYRender = function() {
  var boostLength = random(50,150);
  c.globalCompositeOperation = 'lighter';
  if (playerUpKey) {
    var boostGrad = c.createLinearGradient(p.x-10,p.y,p.x+10,p.y+boostLength);
    boostGrad.addColorStop(0,'rgba(255,255,255,1)');
    boostGrad.addColorStop(1,'rgba(0,0,255,0)');
    c.fillStyle = boostGrad;
    c.fillRect(p.x-10,p.y,20,boostLength);
  }
  if (playerDownKey) {
    var boostGrad = c.createLinearGradient(p.x-10,p.y,p.x+10,p.y-boostLength);
    boostGrad.addColorStop(0,'rgba(255,255,255,1)');
    boostGrad.addColorStop(1,'rgba(0,0,255,0)');
    c.fillStyle = boostGrad;
    c.fillRect(p.x-10,p.y,20,-boostLength);
  }
  c.globalCompositeOperation = 'source-over';
}

var boundaryWrap = function() {
  if (p.x  > canvas.width + p.r) {
    p.x = 0 - p.r;
  }

  if ((p.x < 0 - p.r)&&(p.xVel < 0)) {
    p.x = canvas.width;
  }

  if (p.y > canvas.height) {
    p.y = 0 - p.r;
  }

  if ((p.y < 0 - p.r)&&(p.yVel < 0)) {
    p.y = canvas.height;
  }
};

var playerUpdate = function() {

  if ((playerAlive)&&(playerLives > 0)) {

  boundaryWrap();

  p.x += p.xVel;
  p.y += p.yVel;

  // player collisions

  for(var i=asteroidsL.length-1; i>=0; i--) {
    aL = asteroidsL[i];

    var thisDist = dist(p.x, p.y, aL.x, aL.y);
    var minDist = p.r + aL.r;

      if (thisDist <= minDist) {
        colPointX = aL.x;
        colPointY = aL.y;
        p.x = null;
        p.y = null;
        thisTime = counter;
        playerCollision = true;
        playerLives-=1;
        playerAlive = false;
        asteroidsL.splice(i,1);
        makeAsteroidS(10);
        makeExplosions(1);
      }
    }
  
  for(var i=asteroidsS.length-1; i>=0; i--) {
    aS = asteroidsS[i];

    var thisDist = dist(p.x, p.y, aS.x, aS.y);
    var minDist = p.r + aS.r;

      if (thisDist <= minDist) {
        colPointX = aS.x;
        colPointY = aS.y;
        p.x = null;
        p.y = null;
        thisTime = counter;
        playerCollision = true;
        playerLives-=1;
        playerAlive = false;
        asteroidsS.splice(i,1);
        makeExplosions(1);
      }
    }
  
}
  if ((playerCollision)&&(playerLives > 0)) {
    if (counter - thisTime >= 120) {
      playerAlive = true;
      playerCollision = false;
      p.x = canvas.width/2;
      p.y = canvas.height/2;
      p.xVel = 0;
      p.yVel = 0;
    }
  }

    if (playerLives <= 0) {
    gameOver = true;
    startGame = false;
    }

};


// create array to hold bullets(particles)
var bullets = [];
var bulletDeltaX,bulletDeltaY,bulletAngle,bulletXVel,bulletYVel;
var bulletSpeed = 20;

function bulletEmmisionFunct() {

  if (playerAlive) {
    if(firing == true) {
        if (counter%10 == 0){
          makeBullet(1);
        }
      }
    if(firing == false) { 
      makeBullet(0);
    }
  }
  
} // close bulletEmmisionFunct


function makeBullet(numBullet) {
  
  for(var i=0; i<numBullet; i++){
    var b = {
    x : p.x,
    y : p.y,
    xVel : bulletXVel,
    yVel : bulletYVel,
    r : 3
    }; // close var bullet
      // create particles (bullet options)  
      bullets.push(b);
  } // close for loop
} // close function makeBullet

function bulletUpdater() {

  for(var i=bullets.length-1; i>=0; i--) {
    var b = bullets[i];

    c.fillStyle = 'white';
    c.fillCircle(b.x,b.y,b.r);

    b.x += b.xVel;
    b.y += b.yVel;
    
    if ((b.x > canvas.width)||(b.x < 0)||(b.y > canvas.height)||(b.y < 0)) {
      bullets.shift();
    }
  }
}



// create array to hold bullets(particles)
var asteroidsL = [];
function makeAsteroidL(numAsteroidL) {
  
  for(var i=0; i<numAsteroidL; i++){
    var aL = {
    x : random(0,canvas.width),
    y : random(0,canvas.height),
    xVel : random(-2,2),
    yVel : random(-2,2),
    r : 50
    }; // close var asteroidLarge
      // create particles (asteroidLarge options)  
      asteroidsL.push(aL);
  } // close for loop

} // close function makeAsteroidLarge

function asteroidLargeUpdater() {
// Particle 3 For Loop
  for(var i=asteroidsL.length-1; i>=0; i--) {
    var aL = asteroidsL[i];

    // c.drawImage(canvasDrawBuffer, aL.x, aL.y);
    c.fillStyle = rgb(150,150,255);
    c.fillCircle(aL.x,aL.y,aL.r);

    aL.x += aL.xVel;
    aL.y += aL.yVel;

    if (aL.x  > canvas.width + aL.r) {
    aL.x = 0 - aL.r;
    }
    if ((aL.x < 0 - aL.r)&&(aL.xVel < 0)) {
      aL.x = canvas.width+aL.r;
    }
    if (aL.y > canvas.height+aL.r) {
      aL.y = 0 - aL.r;
    }
    if ((aL.y < 0 - aL.r)&&(aL.yVel < 0)) {
      aL.y = canvas.height+aL.r;
    }

    // bullet collisions

    for(var j=bullets.length-1; j>=0; j--) {
      var bCol = bullets[j];

      var thisDist = dist(bCol.x, bCol.y, aL.x, aL.y);
      var minDist = bCol.r + aL.r;

      if (thisDist <= minDist) {
        colPointX = aL.x;
        colPointY = aL.y;
        score+=100;
        makeAsteroidS(10);
        makeExplosions(1);
        bullets.splice(j,1);
        asteroidsL.splice(i,1);
      }

    }

  }
}

var asteroidsS = [];
function makeAsteroidS(numAsteroidS) {
  
  for(var i=0; i<numAsteroidS; i++){
    var aS = {
    x : colPointX,
    y : colPointY,
    xVel : random(-2,2),
    yVel : random(-2,2),
    r : 10
    }; // close var asteroidSmall
      // create particles (asteroidSmall options) 
      asteroidsS.push(aS);
  } // close for loop

} // close function makeAsteroidSmall

function asteroidSmallUpdater() {
// Particle 3 For Loop
  for(var i=asteroidsS.length-1; i>=0; i--) {
    var aS = asteroidsS[i];

    c.fillStyle = rgb(150,150,255);
    c.fillCircle(aS.x,aS.y,aS.r);

    aS.x += aS.xVel;
    aS.y += aS.yVel;

    if (aS.x  > canvas.width + aS.r) {
    aS.x = 0 - aS.r;
    }
    if ((aS.x < 0 - aS.r)&&(aS.xVel < 0)) {
      aS.x = canvas.width+aS.r;
    }
    if (aS.y > canvas.height+aS.r) {
      aS.y = 0 - aS.r;
    }
    if ((aS.y < 0 - aS.r)&&(aS.yVel < 0)) {
      aS.y = canvas.height+aS.r;
    }

    // bullet collisions
    for(var j=bullets.length-1; j>=0; j--) {
      var bCol = bullets[j];

      var thisDist = dist(bCol.x, bCol.y, aS.x, aS.y);
      var minDist = bCol.r + aS.r;

      if (thisDist <= minDist) {
        colPointX = aS.x;
        colPointY = aS.y;
        makeExplosions(1);
        score+=200;
        bullets.splice(j,1);
        asteroidsS.splice(i,1);
      }
    }
  }
}

var explosions = [];

function makeExplosions(numExplode) {
  
  for(var i=0; i<numExplode; i++){
    var ex = {
    x : colPointX,
    y : colPointY,
    colR : 255,
    colG : 255,
    colB : 255,
    colA : 1,
    line: 20,
    r : 10

    }; // close var makeExplosions
      // create particles (Explosions options)
      explosions.push(ex);
  } // close for loop

} // close function makeExplosions

function explosionsUpdater() {
// Particle 3 For Loop
  for(var i=explosions.length-1; i>=0; i--) {
    var ex = explosions[i];

    c.lineWidth = ex.line;
    c.strokeStyle = rgba(ex.colR,ex.colG,ex.colB,ex.colA);
    c.strokeCircle(ex.x,ex.y,ex.r);
    c.strokeCircle(ex.x,ex.y,ex.r*0.25);

    ex.colG-=10;
    ex.colB-=10;
    ex.colA-=0.05;
    ex.r+=25;
    ex.line-=2;
    if (ex.colA >= 1) {
      explosions.splice(i,1);
    }

  }
}

var bgClouds = [];

function makeClouds(numClouds) {
  
  for(var i=0; i<numClouds; i++){
    var cloud = {
    x : random(0,canvas.width),
    y : random(0,canvas.height),
    xVel : random(1,10),
    yVel : 0,
    colR : 255,
    colG : 255,
    colB : 255,
    r : random(2,20)

    }; // close var makeClouds
      // create particles (Clouds options)
      
      bgClouds.push(cloud);
  } // close for loop

} // close function makeStars

function cloudRenderer() {

  for(var i=bgClouds.length-1; i>=0; i--) {
    var cloud = bgCloud[i];

    c.fillStyle = rgb(cloud.colR,cloud.colG,cloud.colB);
    c.fillCircle(cloud.x,cloud.y,cloud.r);

    cloud.x = cloud.x + cloud.xVel;

  }
}

var initGame = function() {
  score = 0;
  startGame = false;
  gameOver = false;
  populateAsteroids = true;
  playerAlive = true;
  playerCollision = false;
  playerLives = 3;
  p.x = canvas.width/2;
  p.y = canvas.height/2;
  p.yVel = 0;
  p.xVel = 0;
  gT.colA = 1;
  asteroidsL.length = 0;
  asteroidsS.length = 0;
  explosions.length = 0;
  bullets.length = 0;
};

var debugOutput = function() {
  c.textAlign = "center";
  c.font = "20pt arial";
  c.fillStyle = "#ccc";
  
  c.fillText("numClouds "+bgClouds.length,canvas.width/2,50);
  c.fillText("playerLives "+playerLives,200,50);
};

