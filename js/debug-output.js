var debugTextYPos = 30;
var generalDebugXPos = 20;
var debugOutput = function() {
  c.textAlign = "left";
  c.font = "16pt arial";
  c.fillStyle = "#333";
  
  // c.fillText("numClouds "+bgClouds.length,canvas.width/2,50);
  // c.fillText("playerLives "+playerLives,200,50);

if (debugDisplay || debugGeneral) {
  // player x/y
  c.fillText("workerBee X "+workerBee.worldX,generalDebugXPos,debugTextYPos);
  c.fillText("workerBee Y "+workerBee.worldY,generalDebugXPos,debugTextYPos*2);

  // player xVel/yVel
  c.fillText("workerBee xVel "+workerBee.worldXVel,generalDebugXPos,debugTextYPos*3);
  c.fillText("workerBee yVel "+workerBee.worldYVel,generalDebugXPos,debugTextYPos*4);

  // player turbulence/ turbulence factor
  c.fillText("localTurbulenceOffsetFactor "+localTurbulenceOffsetFactor,generalDebugXPos,debugTextYPos*5);

    // player turbulence/ turbulence factor
  c.fillText("workerBee.xVelDiff "+workerBee.xVelDiff,generalDebugXPos,debugTextYPos*6);

  c.fillText("Floor Y pos "+floorY,generalDebugXPos,debugTextYPos*7);

    // player states walking
  c.fillText("isLanded "+workerBee.isLanded,generalDebugXPos,debugTextYPos*8);

  // player states walking
  c.fillText("isWalking "+workerBee.isWalking,generalDebugXPos,debugTextYPos*9);

  // player states flying
  c.fillText("isFlying "+workerBee.isFlying,generalDebugXPos,debugTextYPos*10);

  // player states flying
  c.fillText("isSkidding "+workerBee.isSkidding,generalDebugXPos,debugTextYPos*11);

  // altitude
  c.fillText("Altitude "+altitude,generalDebugXPos,debugTextYPos*12);

  // spray amount
  c.fillText("spray "+sprayAmount,generalDebugXPos,debugTextYPos*13);
}


};