// key switches

var playerUpKey = false;
var playerDownKey = false;
var playerLeftKey = false;
var playerRightKey = false;
var playerBreakKey = false;

// key bindings

// up key

$(document).bind('keydown', 'w', function(){
    playerUpKey = true;
});

$(document).bind('keyup', 'w', function(){
    playerUpKey = false;
});

// down key

$(document).bind('keydown', 's', function(){
    playerDownKey = true;
});

$(document).bind('keyup', 's', function(){
    playerDownKey = false;
});

// left key

$(document).bind('keydown', 'a', function(){
    playerLeftKey = true;
});

$(document).bind('keyup', 'a', function(){
    playerLeftKey = false;
});

// right key

$(document).bind('keydown', 'd', function(){
    playerRightKey = true;
});

$(document).bind('keyup', 'd', function(){
    playerRightKey = false;
});

$(document).bind('keydown', 'space', function(){
    playerBreakKey = true;
});

$(document).bind('keyup', 'space', function(){
    playerBreakKey = false;
});

// playerControls - runtime
function playerControls() {

    // // remove localYVel if player movement = true
    // if (playerUpKey || playerDownKey) {
    //     if (localTurbulenceOffsetFactor > 0) {
    //         localTurbulenceOffsetFactor-=0.1;
    //     }
    //     // if (localTurbulenceOffsetY > 0) {
    //     //     localTurbulenceOffsetY-=0.1;
    //     // }
    // }

    // // add localYVel if player movement = true
    // if (!playerUpKey && !playerDownKey) {
    //     if (localTurbulenceOffsetFactor < 1) {
    //         localTurbulenceOffsetFactor+=0.1;
    //     }
    // }
    

    // Up Key Function
    if ((playerUpKey) && (workerBee.worldYVel > -5)) {
      workerBee.worldYVel-=0.25;
      switchBeeAnimation("climbing");

    }

    if (playerUpKey) {
        if (!workerBee.isLanded && workerBee.worldYVel > -0.5) {
            workerBee.isGliding = false;
            switchBeeAnimation("hovering");
        }

    }

    if (!playerUpKey) {
        if (!workerBee.isLanded && workerBee.worldYVel > -1.5) {
            workerBee.isGliding = false;
            switchBeeAnimation("hovering");
        }
    }

    // Down Key Function
    if ((playerDownKey) && (workerBee.worldYVel < 10)) {
      workerBee.worldYVel+=0.25;
    }

    // YVel dampening
    if (!playerUpKey && !playerDownKey) {
        if (workerBee.worldYVel > -0.05 && workerBee.worldYVel < 0.05) {
            workerBee.worldYVel = 0;
        } else {
            workerBee.worldYVel = workerBee.worldYVel * 0.95;
        }
    }

    // left Key Function
    if ((playerLeftKey) && (workerBee.worldXVel > -5)) {
      workerBee.worldXVel-=0.25;
    }
    // right Key Function
    if ((playerRightKey) && (workerBee.worldXVel < 5)) {
      workerBee.worldXVel+=0.25;
    }

    // XVel dampening
    if (!playerLeftKey && !playerRightKey) {
        if (workerBee.worldXVel > -0.05 && workerBee.worldXVel < 0.05) {
            workerBee.worldXVel = 0;
        } else {
            workerBee.worldXVel = workerBee.worldXVel * 0.95;
        }
    }

    // space Key function
    if (playerBreakKey) {
        if (workerBee.worldXVel > 0) {
          workerBee.worldXVel -= 0.125;
        }
        if (workerBee.worldXVel < 0) {
          workerBee.worldXVel += 0.125;
        }
        if (workerBee.worldYVel > 0) {
          workerBee.worldYVel -= 0.125;
        }
        if (workerBee.worldYVel < 0) {
          workerBee.worldYVel += 0.125;
        }
    }



// mouse functions

  canvas.addEventListener('mousedown',mousePressed); 
  function mousePressed(e) { 
    // firing = true;
    
    if (!testPlayer.targetAquired) {
        testTarget.x = mouseX;
        testTarget.y = mouseY;
        aquireTarget();
        setTargetCalculations();
    }
  }


  canvas.addEventListener('mouseup',mouseUp); 
  function mouseUp(e) { 
    firing = false;
  }


// $('.canvasBox').click(function(){
//     testTarget.x = mouseX;
//     testTarget.y = mouseY;
// });


  
} // End playerControls

// start button 

$('.startButton.on').click(function(){
  $(this).removeClass('on').addClass('off');
  $('.playerControls.on').removeClass('on').addClass('off');
  startGame = true;
});