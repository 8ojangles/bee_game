////////////////////////////////////////////////
// Store useful dimentions
////////////////////////////////////////////////

// store canvas dimensions and derivatives
var cWidth = canvas.width;
var cHeight = canvas.height;
var cWidthHalf = cWidth/2;
var cHeightHalf = cHeight/2;

// recalculate stored dimentions on window.resize function
$(window).resize(function(){
    cWidth = canvas.width;
    cHeight = canvas.height;
    cWidthHalf = cWidth/2;
    cHeightHalf = cHeight/2;
});

var counter = 0;

var debugDisplay = false;
var debugGeneral = false;
var debugCounter = false;
var debugBGGrass = false;
var debugPlayer = false;
var debugBalloon = false;
var debugTest = false;

var consoleLogging = false;


////////////////////////////////////////////////
// Floor plane -
// (temp)
////////////////////////////////////////////////
var floorY = cHeight - 200;

////////////////////////////////////////////////
// World Forces -
// forces applied to object movement
////////////////////////////////////////////////





var worldForces = {
    gravity: 1,
    wind : 0,
}

//////////////////////////////////////////////// 
// create worker BEE entity
////////////////////////////////////////////////

// store useful values for BEE entity

// give bee arbitrary start position for demo purposes (center canvas);
var beeStartX = cWidthHalf;
var beeStartY = cHeightHalf;

//////////////////////////////////////////////// 
// create worker BEE OBJECT
////////////////////////////////////////////////

// WORLD origin coordinates relate to absolute position of object
// LOCAL origin coordinates are position of object relative to the WORLD origin position

var workerBee = {

    // Co-ordinate Space Origins
    worldX : 0,
    worldY : 0,
    localX : 0,
    localY : 0,

    // Velocities
    worldXVel : 0,
    worldYVel : 0,
    localXVel : 0,
    localYVel : 0,

    // velocity store
    oldWorldXVel : 0,
    oldWorldYVel : 0,
    xVelDiff : 0,
    yVelDiff : 0,

    // Velocity limits
    worldXVelMax : 20,
    worldYVelMax : 20,

    // generated forces
    downforce : 0,

    // Movement States
    isAlive : true,
    isFlying : true,
    isHovering : false,
    isClimbing : false,
    isGliding : false,
    isFacingLeft : true,
    isFacingRight : false,
    isFlyingLeft : false,
    isFlyingRight : false,
    isLanded : false,
    isWalking : false,
    isWalkingLeft : false,
    isWalkingRight : false,
    isBlinking : false,
    walkingFactor : 20,
    isSkidding: false,
    isImpact : false,

    // sprite offsets
    backWingOffsetX : 20,
    backWingOffsetY : -20,
    frontWingOffsetX : 60,
    frontWingOffsetY : -22,
    eyesOffsetX : 12,
    eyesOffsetY : 35,
    eyeLidsOffsetX : 12,
    eyeLidsOffsetY : 35

} // CLOSE worker bee

var altitude;
var sprayAmount;

// create skid smoke sprite image
var skid_smoke_sprite = new Image();
skid_smoke_sprite.src = "assetCreation/effects/skid-smoke-sprites-40x40px-perFrame.png";
skid_smoke_sprite.frameW = 320;
skid_smoke_sprite.frameH = 40;
skid_smoke_sprite.frameList = [0,40,80,120,160,200,240,280];
skid_smoke_sprite.frameLen = skid_smoke_sprite.frameList.length;
skid_smoke_sprite.frameNum = 0;

var skidSmokeArr = [];

// make skid smoke effect
// takeOffAndLanding (true or false) state refers to floor impacts
function makeSkid(numObjects, takeOffAndLanding, additionalForce, xPos) {

    if (additionalForce == undefined) {
        additionalForce = 0;
    } else {
        additionalForce = additionalForce;
    }

    for(var i = 0; i <= numObjects; i++) {
        var skid = {
            thisX : xPos,
            thisY : floorY+75,
            thisXVel : takeOffAndLanding == true ? random(-10 - additionalForce,10 + additionalForce) : 0,
            thisYVel : 1,
            thisYVelAcc : 0,
            thisFrame : randomInteger(0,skid_smoke_sprite.frameLen),
            thisAlpha : 1,
            baseFrameW : 20,
            baseFrameH : 20,
            scaleFactor : 2,
            fadeFactor : 0.05
        }; // close skid_object
        skidSmokeArr.push(skid);
    } // close for loop
} // close makeSkid

function updateSkid(){

    var skidSmokeArr_len = skidSmokeArr.length - 1;

    for (var i = skidSmokeArr_len; i >= 0; i--) {

        var s = skidSmokeArr[i];

        s.thisX = s.thisX + s.thisXVel;
        s.thisY = s.thisY - s.thisYVel;
        s.thisYVel = s.thisYVel + s.thisYVelAcc;
        s.thisYVelAcc = s.thisYVelAcc + 0.001;
        s.thisXVel = s.thisXVel * 0.95;
        s.thisAlpha = s.thisAlpha - s.fadeFactor/2;
        // s.fadeFactor = s.fadeFactor - 0.01;
        s.baseFrameW = s.baseFrameW + s.scaleFactor*2;
        s.baseFrameH = s.baseFrameH + s.scaleFactor*2;
        // s.scaleFactor = s.scaleFactor * 1.2;
        if ( s.thisAlpha <= 0) {
            skidSmokeArr.splice(i,1);
        }
    }
}

function renderSkid(){
    var skidSmokeArr_len = skidSmokeArr.length - 1;
    for (var i = skidSmokeArr_len; i >= 0; i--) {

        c.globalAlpha = skidSmokeArr[i].thisAlpha;
        c.drawImage(
            skid_smoke_sprite, /* image object*/
            skid_smoke_sprite.frameList[skidSmokeArr[i].thisFrame], /* source image start point X */
            0, /* source image start point Y */
            40, /* source image width */
            40, /* source image height */
            skidSmokeArr[i].thisX, /* destination point X */
            skidSmokeArr[i].thisY, /* destination point Y */
            skidSmokeArr[i].baseFrameW, /* destination image width */
            skidSmokeArr[i].baseFrameH /* destination image height */
        );
        c.globalAlpha = 1;
    }
}


// create bee-hive image
var beehive_sprite = new Image();
beehive_sprite.src = "assetCreation/items/beehive_sprite.png";
beehive_sprite.frameW = 576;
beehive_sprite.frameH = 576;
beehive_sprite.frameList = [0,576];
beehive_sprite.frameListH = 576;
beehive_sprite.destX = cWidth - beehive_sprite.frameW/2 - 150;
beehive_sprite.destY = floorY - beehive_sprite.frameH/3.15;
beehive_sprite.destW = beehive_sprite.frameW / 2;
beehive_sprite.destH = beehive_sprite.frameH / 2;

function renderBeehive() {
    c.drawImage(
        beehive_sprite, /* image object*/
        beehive_sprite.frameList[0], /* source image start point X */
        0, /* source image start point Y */
        beehive_sprite.frameW, /* source image width */
        beehive_sprite.frameH, /* source image height */
        beehive_sprite.destX, /* destination point X */
        beehive_sprite.destY, /* destination point Y */
        beehive_sprite.destW, /* destination image width */
        beehive_sprite.destH /* destination image height */
    );

    // c.strokeRect(beehive_sprite.destX,beehive_sprite.destY,beehive_sprite.destW,beehive_sprite.destH);
}

function renderBeehiveMask() {
    c.drawImage(
        beehive_sprite, /* image object*/
        beehive_sprite.frameList[1], /* source image start point X */
        0, /* source image start point Y */
        beehive_sprite.frameW, /* source image width */
        beehive_sprite.frameH, /* source image height */
        beehive_sprite.destX, /* destination point X */
        beehive_sprite.destY, /* destination point Y */
        beehive_sprite.destW, /* destination image width */
        beehive_sprite.destH /* destination image height */
    );
}







// create grass image 
var grass_sprite = new Image();
grass_sprite.src = "assetCreation/grass/grass_sprite_144x104_perFrame.png";
grass_sprite.frameW = 144;
grass_sprite.frameH = 104;
grass_sprite.frameList = [0,144,288,432,576,720];
grass_sprite.frameListH = [0,104,208,312,416,520,624];
grass_sprite.frameLen = grass_sprite.frameList.length - 1;
grass_sprite.frameHLen = grass_sprite.frameListH.length - 1;
grass_sprite.frameNum = 0;


grassArr = [];

function calculateWidthFromAspectRatio(originalWidth, originalHeight, newWidth) {
    return (originalHeight/originalWidth)*newWidth;
}

function makeGrass(renderLayer){

    var spriteW = grass_sprite.frameW;
    var spriteH = grass_sprite.frameH;
    var multiplierW;
    var multiplierY;

    if (renderLayer == "farground") {
        multiplierW = 0.5;
        multiplierY = 2.1;
    }

    if (renderLayer == "background") {
        multiplierW = 0.75;
        multiplierY = 1.9;
    }

    if (renderLayer == "midground") {
        multiplierW = 1;
        multiplierY = 1.75;
    }

    if (renderLayer == "foreground") {
        multiplierW = 1.25;
        multiplierY = 1.5;
    }

    var calculatedSpriteW = spriteW * multiplierW;
    var calculatedSpriteH = calculateWidthFromAspectRatio(spriteW, spriteH, calculatedSpriteW);
    // var calculatedSpriteY = floorY - (calculatedSpriteH * multiplierY);
    var calculatedSpriteY = floorY+(calculatedSpriteH/1.25);

    // calculate number of grass objects to render per layer (includes overlapping)
    var numberGrass = parseInt(cWidth / (calculatedSpriteW/4),10);

    for(var i = 0; i < numberGrass; i++){

        var thisFrame = randomInteger(0, grass_sprite.frameLen);

        grass_sprite_object = {
            renderLayer : renderLayer,
            sourceX : grass_sprite.frameList[thisFrame],
            sourceY : grass_sprite.frameListH[3],
            frameW : grass_sprite.frameW,
            frameH : grass_sprite.frameH,
            // destX : i * (calculatedSpriteW/1.5),
            destX : (i * calculatedSpriteW/2.7) - (calculatedSpriteW) ,
            destY : calculatedSpriteY,
            destW : calculatedSpriteW,
            destH : calculatedSpriteH,
            forceResult : 0
        }

        grassArr.push(grass_sprite_object);
    }

}




function renderGrass(renderLayer) {

    var grassLen = grassArr.length - 1;

    for(var i = 0; i < grassLen; i++){

        var g = grassArr[i];

        if (g.renderLayer == renderLayer) {
            c.drawImage(
                grass_sprite, /* image object*/
                g.sourceX, /* source image start point X */
                g.sourceY, /* source image start point Y */
                g.frameW, /* source image width */
                g.frameH, /* source image height */
                g.destX, /* destination point X */
                g.destY, /* destination point Y */
                g.destW, /* destination image width */
                g.destH /* destination image height */
            );


            if (debugDisplay || debugBGGrass) {
                c.fillStyle = "#f00";
                c.strokeStyle = "#f00";
                c.strokeRect(g.destX,g.destY,g.destW,g.destH);
                c.fillCircle(g.destX+(g.destW/2),g.destY-10,5);
                c.textAlign = "center";
                c.font = "16pt arial";
                c.fillText("grassArr: "+grassLen,cWidth-100,200);
                c.fillText(i,g.destX+(g.destW/2),g.destY-30);
            }
        }
        
    }

} // close Render grass

function updateGrass() {
    
    // var grassLen = grassArr.length - 1;

    // // get bee x position
    // var beeX = workerBee.worldX;
    // var beeDownforce = workerBee.downforce;

    // for(var i = 0; i < grassLen; i++){
    //     var randNum = randomInteger(0, 10);
    //     var g = grassArr[i];

    //     if (altitude > 0.01 && altitude < 100) {

            

    //             if (beeX > g.destX) {
    //                 var dist = beeX - g.destX;

    //                 if ( dist > 450) {

    //                     g.sourceY = grass_sprite.frameListH[3];

    //                 } else if ( dist < 50 ) {
    //                     if (randNum > 6) {
    //                         g.sourceY = grass_sprite.frameListH[0];
    //                     } else {
    //                         g.sourceY = grass_sprite.frameListH[randNum];
    //                     }

    //                 } else if (dist > 50 && dist < 150 ) {

    //                     if (counter%2 == 0) {
    //                         if (randNum < 5) {
    //                             g.sourceY = grass_sprite.frameListH[0];
    //                         } else {
    //                             g.sourceY = grass_sprite.frameListH[1];
    //                         }
    //                     }

    //                 } else if ( dist > 150 && dist < 300) {

    //                     if (counter%4 == 0) {
    //                         if (randNum < 5) {
    //                             g.sourceY = grass_sprite.frameListH[1];
    //                         } else {
    //                             g.sourceY = grass_sprite.frameListH[2];
    //                         }
    //                     }

    //                 } else if ( dist > 300 && dist < 450) {

    //                     if (counter%6 == 0) {
    //                         if (randNum < 5) {
    //                             g.sourceY = grass_sprite.frameListH[2];
    //                         } else {
    //                             g.sourceY = grass_sprite.frameListH[3];
    //                         }
    //                     }
    //                 }

    //             }

    //             if (beeX < g.destX) {
    //                 var dist = g.destX - beeX;

    //                 if ( dist > 450) {

    //                     g.sourceY = grass_sprite.frameListH[3];

    //                 } else if ( dist < 50 ) {

    //                     if (randNum > 6) {
    //                         g.sourceY = grass_sprite.frameListH[6];
    //                     } else {
    //                         g.sourceY = grass_sprite.frameListH[randNum];
    //                     }

    //                 } else if ( dist > 50 && dist < 150 ) {

    //                     if (counter%2 == 0) {
    //                         if (randNum < 5) {
    //                             g.sourceY = grass_sprite.frameListH[6];
    //                         } else {
    //                             g.sourceY = grass_sprite.frameListH[5];
    //                         }
    //                     }

    //                 } else if ( dist > 150 && dist < 300) {

    //                     if (counter%4 == 0) {
    //                         if (randNum < 5) {
    //                             g.sourceY = grass_sprite.frameListH[5];
    //                         } else {
    //                             g.sourceY = grass_sprite.frameListH[4];
    //                         }
    //                     }

    //                 } else if ( dist > 300 && dist < 450) {
    //                     if (counter%6 == 0) {
    //                         if (randNum < 5) {
    //                             g.sourceY = grass_sprite.frameListH[4];
    //                         } else {
    //                             g.sourceY = grass_sprite.frameListH[3];
    //                         }
    //                     }

    //                 }

    //             } // close bee dist


    //     } else {
    //        g.sourceY = grass_sprite.frameListH[3]; 
    //     }

    //     if (workerBee.isLanded) {
    //         g.sourceY = grass_sprite.frameListH[3];
    //     }
        
        
    // }


} // close update grass

makeGrass("farground");
makeGrass("background");
makeGrass("midground");
makeGrass("foreground");

// create worker bee image library

var bee_body_sprite = new Image();
bee_body_sprite.src = "assetCreation/bees/worker/body-sprite-103.x79px-perFrame.png";
bee_body_sprite.frameW = 103;
bee_body_sprite.frameH = 78;
bee_body_sprite.frameList = [0,103,206,309,412,515,618];
bee_body_sprite.frameLen = bee_body_sprite.frameList.length - 1;
bee_body_sprite.frameNum = 0;

var bee_wings_front_sprite = new Image();
bee_wings_front_sprite.src = "assetCreation/bees/worker/wing-front-sprites-35x62pxPerFrame-test2.png";
bee_wings_front_sprite.frameW = 35;
bee_wings_front_sprite.frameH = 62;
bee_wings_front_sprite.frameList = [105,140,175,210,245,210,175,140];
bee_wings_front_sprite.frameLen = bee_wings_front_sprite.frameList.length - 1;
bee_wings_front_sprite.frameList2 = [105,175,245,175];
bee_wings_front_sprite.frameLen2 = bee_wings_front_sprite.frameList2.length - 1;
bee_wings_front_sprite.frameListResting = [0];
bee_wings_front_sprite.frameListRestingLen = 0;
bee_wings_front_sprite.frameListGliding = [35];
bee_wings_front_sprite.frameListGlidingLen = 0;
bee_wings_front_sprite.frameNum = 0;

bee_wings_front_sprite.currFrameList = bee_wings_front_sprite.frameList;
bee_wings_front_sprite.currFrameLen = bee_wings_front_sprite.frameLen;

var bee_wings_back_sprite = new Image();
bee_wings_back_sprite.src = "assetCreation/bees/worker/wing-behind-sprites-31x55pxPerFrame-test2.png";
bee_wings_back_sprite.frameW = 31;
bee_wings_back_sprite.frameH = 55;
bee_wings_back_sprite.frameList = [93,124,155,186,217,186,155,124];
bee_wings_back_sprite.frameLen = bee_wings_back_sprite.frameList.length - 1;
bee_wings_back_sprite.frameList2 = [93,155,217,155];
bee_wings_back_sprite.frameLen2 = bee_wings_back_sprite.frameList2.length - 1;
bee_wings_back_sprite.frameListResting = [0];
bee_wings_back_sprite.frameListRestingLen = 0;
bee_wings_back_sprite.frameListGliding = [31];
bee_wings_back_sprite.frameListGlidingLen = 0;
bee_wings_back_sprite.frameNum = 0;

bee_wings_back_sprite.currFrameList = bee_wings_back_sprite.frameList;
bee_wings_back_sprite.currFrameLen = bee_wings_back_sprite.frameLen;


var bee_eyes = new Image();
bee_eyes.src = "assetCreation/bees/worker/eyes-sprite-20x14px-PerFrame.png";
bee_eyes.frameW = 20;
bee_eyes.frameH = 14;
bee_eyes.frameList = [0,20,40,60,80,100,120,140];
bee_eyes.frameLen = bee_eyes.frameList.length - 1;
bee_eyes.frameNum = 0;

var bee_eyeLids = new Image();
bee_eyeLids.src = "assetCreation/bees/worker/eyeLids-sprite-20x14px-PerFrame.png";
bee_eyeLids.frameW = 20;
bee_eyeLids.frameH = 14;
bee_eyeLids.frameList = [0,20,40,60];
bee_eyeLids.frameLen = bee_eyeLids.frameList.length - 1;
bee_eyeLids.frameNum = 0;


workerBee.worldX = beeStartX;
workerBee.worldY = beeStartY;



var localTurbulenceStrength = 30;
var localTurbulenceSpeed = 0.02;
var localTurbulenceCounter = 0;
var localTurbulenceCounterComputation = 0;
var localTurbulenceOffsetFactor = 1;

function updateLocalTurbulence(){
    localTurbulenceCounter = localTurbulenceCounter - localTurbulenceSpeed;
    localTurbulenceCounterComputation = localTurbulenceCounter * Math.PI;
}

// var y = xAxis+unit*Math.sin(t);

function randomBlink(){
    if (!workerBee.isBlinking) {
        var randNum = random(0,200);
        if (randNum < 2) {
           workerBee.isBlinking = true; 
        }
    }
}


function switchBeeAnimation(thisAnim) {

    switch(thisAnim) {

        // wings animations

        case "resting" :
            bee_wings_front_sprite.currFrameList = bee_wings_front_sprite.frameListResting;
            bee_wings_front_sprite.currFrameLen = bee_wings_front_sprite.frameListRestingLen;
            bee_wings_back_sprite.currFrameList = bee_wings_back_sprite.frameListResting;
            bee_wings_back_sprite.currFrameLen = bee_wings_back_sprite.frameListRestingLen;
            bee_wings_front_sprite.frameNum = 0;
            bee_wings_back_sprite.frameNum = 0;
            break;

        case "gliding" :
            bee_wings_front_sprite.currFrameList = bee_wings_front_sprite.frameListGliding;
            bee_wings_front_sprite.currFrameLen = bee_wings_front_sprite.frameListGlidingLen;
            bee_wings_back_sprite.currFrameList = bee_wings_back_sprite.frameListGliding;
            bee_wings_back_sprite.currFrameLen = bee_wings_back_sprite.frameListGlidingLen;
            bee_wings_front_sprite.frameNum = 0;
            bee_wings_back_sprite.frameNum = 0;
            break;

        case "hovering" :
            bee_wings_front_sprite.currFrameList = bee_wings_front_sprite.frameList;
            bee_wings_front_sprite.currFrameLen = bee_wings_front_sprite.frameLen;
            bee_wings_back_sprite.currFrameList = bee_wings_back_sprite.frameList;
            bee_wings_back_sprite.currFrameLen = bee_wings_back_sprite.frameLen;
            break;

        case "climbing" :
            bee_wings_front_sprite.currFrameList = bee_wings_front_sprite.frameList2;
            bee_wings_front_sprite.currFrameLen = bee_wings_front_sprite.frameLen2;
            bee_wings_back_sprite.currFrameList = bee_wings_back_sprite.frameList2;
            bee_wings_back_sprite.currFrameLen = bee_wings_back_sprite.frameLen2;
            break;

    }

}



function runBeeAnimation(thisSprite, isLooped) {

    if (isLooped) {

        if (thisSprite.frameNum >= thisSprite.currFrameLen) {
            thisSprite.frameNum = 0;
        } else {
            thisSprite.frameNum++;
        }

    } else {
        thisSprite.frameNum = 0;
    }

}



function renderBee(){

    randomBlink();

    // compute local position
    var localTurbulenceOffsetY = localTurbulenceStrength*Math.sin(localTurbulenceCounterComputation);

    // workerBee.localY = localTurbulenceOffsetY * localTurbulenceOffsetFactor;

    // compute world position
    var computedX = workerBee.worldX + workerBee.localX;
    var computedY = workerBee.worldY + workerBee.localY;

    // compute sprite offsets to object world origin and direction of travel. Body remains at local position of 0,0
        
    // Y offset positions dont change
    var backWingPosY = computedY + workerBee.backWingOffsetY;
    var frontWingPosY = computedY + workerBee.frontWingOffsetY;
    var eyesPosY = computedY + workerBee.eyesOffsetY;
    var eyeLidsPosY = computedY + workerBee.eyeLidsOffsetY;

    if (workerBee.isFacingLeft) {
        var beeBodySpriteRow = 0;
        var backWingPosX = computedX + workerBee.backWingOffsetX;
        var backWingSpriteRow = 0;
        var frontWingPosX = computedX + workerBee.frontWingOffsetX;
        var frontWingSpriteRow = 0;
        var eyesPosX = computedX + workerBee.eyesOffsetX;
        var eyeSpriteRow = 0;
        var eyeLidsPosX = computedX + workerBee.eyeLidsOffsetX;
        var eyeLidsSpriteRow = 0;
    } else {
        var beeBodySpriteRow = bee_body_sprite.frameH + 1;
        var backWingPosX = computedX + bee_body_sprite.frameW - workerBee.backWingOffsetX - bee_wings_back_sprite.frameW;
        var backWingSpriteRow = bee_wings_back_sprite.frameH + 1;
        var frontWingPosX = computedX + bee_body_sprite.frameW - workerBee.frontWingOffsetX - bee_wings_front_sprite.frameW;
        var frontWingSpriteRow = bee_wings_front_sprite.frameH + 1;
        var eyesPosX = computedX + bee_body_sprite.frameW - workerBee.eyesOffsetX - bee_eyes.frameW;
        var eyeSpriteRow = bee_eyes.frameH + 1;
        var eyeLidsPosX = computedX + bee_body_sprite.frameW - workerBee.eyeLidsOffsetX - bee_eyeLids.frameW;
        var eyeLidsSpriteRow = bee_eyeLids.frameH + 1;
    }
    
    // layer bee images - Canvas renders back to front :
    // 1. back wings
    // 2. body
    // 3. eyes
    // 4. eye lids
    // 5. front wings

    // 1.back wings
    c.drawImage(bee_wings_back_sprite, bee_wings_back_sprite.currFrameList[bee_wings_back_sprite.frameNum], backWingSpriteRow, bee_wings_back_sprite.frameW, bee_wings_back_sprite.frameH, backWingPosX, backWingPosY, bee_wings_back_sprite.frameW, bee_wings_back_sprite.frameH);

    // 2. body
    c.drawImage(bee_body_sprite, bee_body_sprite.frameList[bee_body_sprite.frameNum], beeBodySpriteRow, bee_body_sprite.frameW, bee_body_sprite.frameH, computedX, computedY, bee_body_sprite.frameW, bee_body_sprite.frameH);

    // 3. eyes
    c.drawImage(bee_eyes, bee_eyes.frameList[bee_eyes.frameNum], eyeSpriteRow, bee_eyes.frameW, bee_eyes.frameH, eyesPosX, eyesPosY, bee_eyes.frameW, bee_eyes.frameH);

    // 4. eye lids
    c.drawImage(bee_eyeLids, bee_eyeLids.frameList[bee_eyeLids.frameNum], eyeLidsSpriteRow, bee_eyeLids.frameW, bee_eyeLids.frameH, eyeLidsPosX, eyeLidsPosY, bee_eyeLids.frameW, bee_eyeLids.frameH);

    // 5. front wings
    c.drawImage(
        bee_wings_front_sprite,
        bee_wings_front_sprite.currFrameList[bee_wings_front_sprite.frameNum],
        frontWingSpriteRow,
        bee_wings_front_sprite.frameW,
        bee_wings_front_sprite.frameH,
        frontWingPosX,
        frontWingPosY,
        bee_wings_front_sprite.frameW,
        bee_wings_front_sprite.frameH
    );

    if (debugDisplay || debugPlayer) {
        c.strokeStyle = "#f00";
        c.fillStyle = "#f00";
        c.strokeRect(frontWingPosX,frontWingPosY,bee_wings_front_sprite.frameW,bee_wings_front_sprite.frameH);
        c.strokeRect(backWingPosX,backWingPosY,bee_wings_back_sprite.frameW,bee_wings_back_sprite.frameH);
        c.strokeRect(computedX,computedY,bee_body_sprite.frameW,bee_body_sprite.frameH);
        c.strokeRect(eyesPosX,eyesPosY,bee_eyes.frameW,bee_eyes.frameH);
        c.textAlign = "center";
        c.font = "12pt arial";

        // wing position X
        c.fillText("front wing origin X: "+frontWingPosX,frontWingPosX,frontWingPosY-200);
        // wing position Y
        c.fillText("front wing origin Y: "+frontWingPosX,frontWingPosX,frontWingPosY-180);
        // Width of frame from Source
        c.fillText("front wing frameWidth: "+bee_wings_front_sprite.frameW,frontWingPosX,frontWingPosY-160);
        // Height of frame from Source
        c.fillText("front wing frameHeight: "+bee_wings_front_sprite.frameH,frontWingPosX,frontWingPosY-140);
        c.fillText("front wing frameList: "+bee_wings_front_sprite.currFrameList,frontWingPosX,frontWingPosY-120);
        // X Position of frame in source 
        c.fillText("front wing framePosX: "+bee_wings_front_sprite.frameList[bee_wings_front_sprite.frameNum],frontWingPosX,frontWingPosY-100);
        c.fillText("front wing framePosY: 0",frontWingPosX,frontWingPosY-80);
        c.fillText("Y velocity diff: "+workerBee.yVelDiff,frontWingPosX,frontWingPosY-60);
        c.fillText("X velocity diff: "+workerBee.xVelDiff,frontWingPosX,frontWingPosY-40);
    }

    updateLocalTurbulence();
    updatePlayer();

}

function updatePlayer() {


    // update bee position
    workerBee.worldX = workerBee.worldX + workerBee.worldXVel;
    workerBee.worldY = workerBee.worldY + workerBee.worldYVel;

    // STATE changes

    // check movement direction
    if (workerBee.worldXVel > 0) {
        workerBee.isFacingRight = true;
        workerBee.isFacingLeft = false;
    }

    if (workerBee.worldXVel < 0) {
        workerBee.isFacingRight = false;
        workerBee.isFacingLeft = true;
    }


    // check floor collision
    if (workerBee.worldY >= floorY) {
        workerBee.worldY = floorY;
        workerBee.worldYVel = 0;

        if (!workerBee.isLanded) {
            switchBeeAnimation('resting');
        }

        workerBee.isLanded = true;
        workerBee.isFlying = false;
    }

    // check if flying
    if (workerBee.worldY < floorY) {
        workerBee.isLanded = false;
        workerBee.isWalking = false;
        workerBee.isFlying = true;
    }

    // compute frames for animation - flying
    if (workerBee.isFlying) {

        if (workerBee.isImpact) {
            makeSkid(10, true);
            workerBee.isImpact = false;
        }

        if (workerBee.worldYVel > 1.5) {
            workerBee.isClimbing = false;
            workerBee.isHovering = false;
            workerBee.isGliding = true;
            switchBeeAnimation('gliding');
        }

        bee_body_sprite.frameNum = 0;
        // runBeeAnimation(bee_body_sprite, false);

         // front wings
         // runBeeAnimation(bee_wings_front_sprite, true);
        if (bee_wings_front_sprite.frameNum >= bee_wings_front_sprite.currFrameLen) {
            bee_wings_front_sprite.frameNum = 0;
        } else {
            bee_wings_front_sprite.frameNum++;
        }
        // back wings
        // runBeeAnimation(bee_wings_back_sprite, true);
        if (bee_wings_back_sprite.frameNum >= bee_wings_back_sprite.currFrameLen) {
            bee_wings_back_sprite.frameNum = 0;
        } else {
            bee_wings_back_sprite.frameNum++;
        }
             
    }

    if (workerBee.isLanded) {

        if (!workerBee.isImpact) {
            makeSkid(sprayAmount, true,false, workerBee.worldX + 55);
            workerBee.isImpact = true;
        }

        if (!workerBee.isWalking) {
            bee_body_sprite.frameNum = 1;
        }
        if (workerBee.worldXVel < 0 || workerBee.worldXVel > 0) {
            workerBee.isWalking = true;
        }
        if (workerBee.worldXVel == 0) {
            workerBee.isWalking = false;
        }
    }



    // compute frames for animation - walking - left facing
    if (workerBee.isWalking) {
         // legs
         
        var walkingFactor = Math.floor((workerBee.walkingFactor/workerBee.worldXVel)/2); 

        if (bee_body_sprite.frameNum == bee_body_sprite.frameLen) {
            if (counter%walkingFactor == 0) {
                bee_body_sprite.frameNum = 1;
            }
        } else {
            if (counter%walkingFactor == 0) {
                bee_body_sprite.frameNum++;
            } 
        }

        if (workerBee.worldXVel < -4.5 || workerBee.worldXVel > 4.5 ) {
            if (counter%12 == 0) {
                makeSkid(1, false, false, workerBee.worldX + 55);
            }
        }

        // check for skidding
        
        workerBee.xVelDiff = Math.abs(workerBee.worldXVel) - Math.abs(workerBee.oldWorldXVel);

        if (workerBee.xVelDiff > 0) {
            workerBee.isSkidding = true; 
        } else {
            workerBee.isSkidding = false;
        }

        workerBee.oldWorldXVel = workerBee.worldXVel;


    } // close if bee is walking

    if (workerBee.isSkidding) {
            if (counter%6 == 0) {
                makeSkid(1, false, false, workerBee.worldX + 55);
            } 
        }

    if (workerBee.isBlinking) {
        if (bee_eyeLids.frameNum == bee_eyeLids.frameLen) {
            bee_eyeLids.frameNum = 0;
            workerBee.isBlinking = false;
         } else {
            bee_eyeLids.frameNum++;
         }
    }

    altitude = Math.abs(floorY - workerBee.worldY);
    sprayAmount = parseInt(map(altitude, 0, 300, 10, 0, true),10);

    workerBee.downforce = sprayAmount;

    // if (workerBee.yVel > 0) {
    //     workerBee.downforce = workerBee.downforce * (Math.abs(workerBee.yVel)*2);
    // }

    if  (altitude > 0.01 && altitude < 300) {
        if (!workerBee.isGliding) {
            if (counter%6 == 0) {
                makeSkid(sprayAmount, true, workerBee.downforce, workerBee.worldX + 55);
            }
        }
    }

    // calculate velocity differences

    workerBee.xVelDiff = workerBee.worldXVel - workerBee.oldWorldXVel;
    workerBee.yVelDiff = workerBee.oldWorldYVel - workerBee.worldYVel;

} // close updatePlayer()





// create array for characters

// array to store character type arrays
var bees = [];

// arrays for different character types
var queen = [];
var workers = [];
var drone = [];






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


var cloudInitPosY = {
    big : {
        min : 0+(cHeight/3),
        max : cHeight-200
    },
    mid : {
        min : 0+(cHeight/4),
        max : cHeight-(cHeight/4)
    },
    small : {
        min : 0,
        max : 0+(cHeight/2)
    },
    quick : {
        min : 50,
        max : cHeight - 50
    }
}




var bgClouds = [];

function makeClouds(numClouds, init, size, quick) {

    var arrLength = size == 0 ? bigClouds.length - 1 : midClouds.length - 1;

    var initYPosMin;
    var initYPosMax; 


    for(var i=0; i<numClouds; i++){

        if (size == 0) {
            initYPosMin = cloudInitPosY.big.min;
            initYPosMax = cloudInitPosY.big.max;
        }

        if (size == 1) {
            initYPosMin = cloudInitPosY.mid.min;
            initYPosMax = cloudInitPosY.mid.max;
        }

        if (size == 2) {
            initYPosMin = cloudInitPosY.small.min;
            initYPosMax = cloudInitPosY.small.max;
        }


        var cloud = {
            x : init == true ? random(-3000,cWidth) : -3000,
            y : random(initYPosMin,initYPosMax),
            // xVel : random(0.1,0.2),
            xVel : quick == true ? random(5,20) : random(0.05,0.6),
            yVel : 0,
            // colR : 255,
            // colG : 255,
            // colB : 255,
            // colA : 1,
            r : 20,
            arrType : size,
            arrNo : Math.floor(random(0,arrLength))
        }; // close var makeClouds
      // create particles (Clouds options)
      
      bgClouds.push(cloud);

  } // close for loop

} // close function makeStars

function cloudRenderer() {

    var bgCloudsLen = bgClouds.length-1;

    for(var i=bgCloudsLen; i>=0; i--) {

        var cloud = bgClouds[i];

        c.drawImage(cloudArray[cloud.arrType][cloud.arrNo], cloud.x, cloud.y,cloudArray[cloud.arrType][cloud.arrNo].naturalWidth*2,cloudArray[cloud.arrType][cloud.arrNo].naturalHeight*2);

        cloud.x = cloud.x + cloud.xVel;
        
        if (cloud.x >= cWidth + 1000) {
            cloud.x = 0 - cloudArray[cloud.arrType][cloud.arrNo].naturalWidth*2;
            cloud.xVel = random(0.02,0.3);
        }

    }
}

function randomQuickCloud(){
    var randNum = random(0,100);
    if (randNum < 2) {
        makeClouds(1, false, 2, true);
    }
}



(function(){
    makeClouds(3, true, 0, false);
    makeClouds(6, true, 1, false);
    makeClouds(10, true, 2, false);
})();




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

// Baloooooooon
// 
//create skid smoke sprite image
var balloon_sprite = new Image();
balloon_sprite.src = "assetCreation/items/powerUp_balloon_sprite.png";
balloon_sprite.frameW = 100;
balloon_sprite.frameH = 120;
balloon_sprite.frameList = [0,100,200,300,400,500,600,700,800];
balloon_sprite.frameLen = balloon_sprite.frameList.length - 1;
balloon_sprite.frameNum = 0;

var balloonArr = [];


// function updateLocalTurbulence(){
//     localTurbulenceCounter = localTurbulenceCounter - localTurbulenceSpeed;
//     localTurbulenceCounterComputation = localTurbulenceCounter * Math.PI;
// }

// var localTurbulenceStrength = 5; // Apmlitude
// var localTurbulenceSpeed = 0.002; // Speed
// var localTurbulenceCounter = 0;
// var localTurbulenceCounterComputation = 0;
// var localTurbulenceOffsetFactor = 1;

// make skid smoke effect
// takeOffAndLanding (true or false) state refers to floor impacts

// function balloon() {
//     this.thisX = randomInteger(0,cWidth);
//     this.thisY = randomInteger(cHeight / 4,cHeight - cHeight/2);
//     this.thislocalX = 0;
//     this.thisLocalY = 0;
//     this.thisXVel = randomInteger(-2,2);
//     this.thisYVel = 0;
//     this.thisYVelAcc = 0;
//     this.thisFrame = 0;
//     this.thisAlpha = 1;
//     this.baseFrameW = 80;
//     this.baseFrameH = 98;
//     this.scaleFactor = 2;
//     this.fadeFactor = 0.05;
//     this.bounceAmplitude = 1;
//     this.bounceSpeed = 0.005;
//     this.bounceCounter = 0;
//     this.bounceCounterCompute = 0;
//     this.bounceOffsetFactor = 1;
//     this.bounceOffsetY = 0;
// }; // close balloon

// balloon.updateBounce = function() {
//     this.bounceCounter = this.bounceCounter - this.bounceSpeed;
//     this.bounceCounterCompute = this.bounceCounter * Math.PI;
// };

function makeBalloon(numObjects) {

    for(var i = 0; i <= numObjects; i++) {
        var balloon = {
            thisX : randomInteger(0,cWidth),
            thisY : randomInteger(cHeight / 4,cHeight - cHeight/2),
            thislocalX : 0,
            thisLocalY : 0,
            thisXVel : 0, //randomInteger(-2,2),
            thisYVel : 0,
            thisYVelAcc : 0,
            thisFrame : 0,
            baseFrameW : 100,
            baseFrameH : 120,
            currFrame : 0,
            scaleFactor : 2,
            fadeFactor : 0.05,
            bounceAmplitude : random(0.1,0.5),
            bounceSpeed : random(0.001,0.005),
            bounceCounter : 0,
            bounceCounterCompute : 0,
            bounceOffsetFactor : 1,
            bounceOffsetY : 0,

            // states
            isExploding  : false

        }; // close skid_object

        // var balloonObj = new balloon();

        balloonArr.push(balloon);
    } // close for loop
} // close makeSkid


function updateBalloon(){

    var balloonArr_length = balloonArr.length - 1;

    for (var i = balloonArr_length; i >= 0; i--) {

        var s = balloonArr[i];

        s.bounceOffsetY = s.bounceAmplitude*Math.sin(s.bounceCounterCompute);
        s.thisLocalY = s.bounceOffsetY * s.bounceOffsetFactor;
        s.bounceCounter = s.bounceCounter - s.bounceSpeed;
        s.bounceCounterCompute = s.bounceCounter * Math.PI;

        s.thisY = s.thisY + s.thisLocalY;
        s.thisX = s.thisX + s.thisXVel;
        s.thisY = s.thisY - s.thisYVel;

        if (s.thisX  > cWidth) {
            s.thisX = 0 - s.baseFrameW;
        }

        if ((s.thisX < 0 - s.baseFrameW)&&(s.thisXVel < 0)) {
            s.thisX = cWidth;
        }

        // 
        // if (counter%1000 == 0) {
        //     var timeToPop = randomInteger(0,10);

        //     if (timeToPop < 1) {
        //         s.isExploding = true;
        //     }
        // }

        // if (s.y > canvas.height) {
        //   s.y = 0 - s.r;
        // }

        // if ((s.y < 0 - s.r)&&(s.yVel < 0)) {
        //   s.y = canvas.height;
        // }

        // collision animation - exploding
        if (s.isExploding) {

            if (s.currFrame <= balloon_sprite.frameLen) {
                s.currFrame++;
            } else if (s.currFrame >= balloon_sprite.frameLen) {
                balloonArr.splice(i,1);
            }
        } else {
            s.currFrame = 0;
        }

    }
}

function renderBalloon(){
    var balloonArr_length = balloonArr.length - 1;

    if (balloonArr_length >= 0) {
        for (var i = balloonArr_length; i !== 0; i--) {

            var s = balloonArr[i];

            
            c.drawImage(
                balloon_sprite, /* image object*/
                balloon_sprite.frameList[s.currFrame], /* source image start point X */
                0, /* source image start point Y */
                s.baseFrameW, /* source image width */
                s.baseFrameH, /* source image height */
                s.thisX, /* destination point X */
                s.thisY, /* destination point Y */
                s.baseFrameW, /* destination image width */
                s.baseFrameH /* destination image height */
            );
            

            if (debugDisplay || debugBalloon) {
                c.strokeStyle = "#f00";
                c.fillStyle = "#f00";
                c.strokeRect(s.thisX,s.thisY,s.baseFrameW,s.baseFrameH);
                c.textAlign = "center";
                c.font = "12pt arial";
                // wing position X
                c.fillText("X: "+s.thisX,s.thisX,s.thisY-100);
                // wing position Y
                c.fillText("Y: "+s.thisY,s.thisX,s.thisY-80);
                // Width of frame from Source
                c.fillText("local Y: "+s.bounceOffsetY,s.thisX,s.thisY-60);
                // X Position of frame in source 
                c.fillText("bounceCounter: "+s.bounceCounter,s.thisX,s.thisY-40);
                c.fillText("exploding?: "+s.isExploding,s.thisX,s.thisY-20);
                c.fillText("frame?: "+balloon_sprite.frameNum,s.thisX,s.thisY-0);
                c.fillText("frame list?: "+balloon_sprite.frameLen,s.thisX,s.thisY+20);
            }
        }

    }
}

function counterDisplay() {

    var seconds = parseInt(counter/60,10);

    if (debugGeneral || debugCounter) {
        c.strokeStyle = "#666";
        c.fillStyle = "#666";
        c.textAlign = "center";
        c.font = "16pt arial";
        c.fillText("Counter: "+counter,cWidth/2,40);
        c.fillText("Time: "+seconds,cWidth/2,60);
    }
}


makeBalloon(2);



var testPlayer = {
    radius : 30,
    x : cWidth/2,
    y : cHeight/2,
    xVel : 0,
    yVel : 0,
    velMax : 10,
    targetAquired : false,
    targetX : 0,
    targetY : 0,
    targetDistance : 0,
    lastDistanceTravelled : 0,
    incrementalMove : 0,
    lastIncrementalMove : 0,
    targetAngle : 0,
    animationOriginX : 0,
    animationOriginY : 0,
    animationPercent : 0,
    animationTimer : 0,
    animationDuration : 0,

    oldOriginX : 0,
    oldOriginY : 0,
    oldx : cWidth/2,
    oldy : cHeight/2,
    oldxVel : 0,
    oldyVel : 0,
    oldvelMax : 10,
    oldtargetAquired : false,
    oldtargetX : 0,
    oldtargetY : 0,
    oldtargetDistance : 0,
    oldtargetAngle : 0,
    oldanimationPercent : 0,
    oldanimationTimer : 0,
    oldanimationDuration : 0
};

function initTarget() {
    // logging
    testPlayer.oldx = testPlayer.x;
    testPlayer.oldy = testPlayer.y;
    testPlayer.oldxVel = testPlayer.xVel;
    testPlayer.oldyVel = testPlayer.yVel;
    testPlayer.oldvelMax = testPlayer.velMax;
    testPlayer.oldtargetAquired = testPlayer.targetAquired;
    testPlayer.oldtargetX = testPlayer.targetX;
    testPlayer.oldtargetY = testPlayer.targetY;
    testPlayer.oldtargetDistance = testPlayer.targetDistance;
    testPlayer.oldtargetAngle = testPlayer.targetAngle;
    testPlayer.oldanimationPercent = testPlayer.animationPercent;
    testPlayer.oldanimationTimer = testPlayer.animationTimer;
    testPlayer.oldanimationDuration = testPlayer.animationDuration;


    // resets
    testPlayer.xVel = 0;
    testPlayer.yVel = 0;
    testPlayer.targetAquired = false;
    testPlayer.targetDistance = 0;
    testPlayer.targetAngle = 0;
    testPlayer.animationOriginX = 0;
    testPlayer.animationOriginY = 0;
    testPlayer.animationPercent = 0;
    testPlayer.animationTimer = 0;
    testPlayer.animationDuration = 0;
    testPlayer.incrementalMove = 0;
    testPlayer.lastDistanceTravelled = 0;
}


var testTarget = {
    radius : 60,
    x : cWidth/2,
    y : cHeight/2
};

function aquireTarget() {
    if (!testPlayer.targetAquired) {
        testPlayer.targetX = testTarget.x;
        testPlayer.targetY = testTarget.y;
    }
}

function setTargetCalculations() {
    // logging
    testPlayer.animationOriginX = testPlayer.x;
    testPlayer.animationOriginY = testPlayer.y;
    testPlayer.oldOriginX = testPlayer.x;
    testPlayer.oldOriginY = testPlayer.y;

    // get angle and distance of target from origin
    var targetDetails = getAngleAndDistance(testPlayer.x, testPlayer.y, testTarget.x, testTarget.y);

    // set angle and distance of target from origin
    testPlayer.targetDistance = targetDetails.distance;
    testPlayer.targetAngle = targetDetails.angle;

    // calculate rough duration of frames based on distance / testSubject's max speed

    // testPlayer.animationDuration = 30;
    testPlayer.animationDuration = parseInt(testPlayer.targetDistance/testPlayer.velMax, 10);

    // reset animation timer
    testPlayer.animationTimer = 0;

    // flip targetAquired flag to true
    testPlayer.targetAquired = true;
}


function updateTestPlayer() {


    if (testPlayer.targetAquired) {

        // if animation timer has reached calculated duration
        if (testPlayer.animationTimer >= testPlayer.animationDuration) {
            testPlayer.x = testPlayer.x;
            testPlayer.y = testPlayer.y;
            initTarget();
        } 

        // if animation timer is less than calculated duration
        if (testPlayer.animationTimer < testPlayer.animationDuration) {

            // calculate distance moved across absolute vector from easing equation
            var distanceTravelled = easeOutBounce(
                testPlayer.animationTimer, // elapsed time
                0, // animated parameter START value
                testPlayer.targetDistance, // animated parameter END value
                testPlayer.animationDuration // total animation duration
            );
            
            var incrementalMove = distanceTravelled - testPlayer.lastDistanceTravelled;

            var newCoords = findNewPoint(testPlayer.x, testPlayer.y, testPlayer.targetAngle, incrementalMove);
            
            testPlayer.lastDistanceTravelled = distanceTravelled;


            // update positions 
            testPlayer.x = newCoords.x;
            testPlayer.y = newCoords.y;

            // update animation timer and percentage
            testPlayer.animationTimer += 1;

        }

    } else {

        testPlayer.x += testPlayer.xVel;
        testPlayer.y += testPlayer.yVel;

    }

    
}






function renderTarget() {
    c.strokeStyle = "#f00";
    c.lineWidth = 5;
    c.strokeCircle(testTarget.x,testTarget.y,testTarget.radius);
};

function renderTestPlayer() {
    c.fillStyle = "#0f0";
    c.fillCircle(testPlayer.x,testPlayer.y,testPlayer.radius);

    if (debugTest) {
        c.fillStyle = "#666";
        c.textAlign = "center";
        c.font = "12pt arial";
        c.fillText("X: "+testPlayer.x,cWidth/2 - 200,20);
        c.fillText("Y: "+testPlayer.y,cWidth/2 - 200,35);
        c.fillText("xVel: "+testPlayer.xVel,cWidth/2 - 200,50);
        c.fillText("yVel: "+testPlayer.xVel,cWidth/2 - 200,65);
        c.fillText("targetAquired: "+testPlayer.targetAquired,cWidth/2 - 200,80);
        c.fillText("targetX: "+testPlayer.targetX,cWidth/2 - 200,95);
        c.fillText("targetY: "+testPlayer.targetY,cWidth/2 - 200,110);
        c.fillText("targetDistance: "+testPlayer.targetDistance,cWidth/2 - 200,125);
        c.fillText("targetAngle: "+testPlayer.targetAngle,cWidth/2 - 200,140);
        c.fillText("animationDuration: "+testPlayer.animationDuration,cWidth/2 - 200,155);
        c.fillText("animationpercent: "+testPlayer.animationPercent,cWidth/2 - 200,170);

        // old value store
        
        var thisDisplayY = 20;
        c.fillText("old Origin X: "+testPlayer.oldOriginX,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old Origin Y: "+testPlayer.oldOriginY,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old X: "+ (testPlayer.oldOriginX - testPlayer.oldx),cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old Y: "+ (testPlayer.oldOriginY - testPlayer.oldy),cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;

        c.fillText("distance: "+testPlayer.targetDistance,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;

        // c.fillText("distance X: "+testPlayer.oldx,cWidth/2 + 200,thisDisplayY);
        // thisDisplayY += 15;
        // c.fillText("distance Y: "+testPlayer.oldy,cWidth/2 + 200,thisDisplayY);
        // thisDisplayY += 15;


        c.fillText("old xVel: "+testPlayer.oldxVel,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old yVel: "+testPlayer.oldxVel,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old targetAquired: "+testPlayer.oldtargetAquired,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old targetX: "+testPlayer.oldtargetX,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old targetY: "+testPlayer.oldtargetY,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old targetDistance: "+testPlayer.oldtargetDistance,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old targetAngle: "+testPlayer.oldtargetAngle,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old animationDuration: "+testPlayer.oldanimationDuration,cWidth/2 + 200,thisDisplayY);
        thisDisplayY += 15;
        c.fillText("old animationpercent: "+testPlayer.oldanimationPercent,cWidth/2 + 200,thisDisplayY);
    }
}

// create bush BG images
// 
var bushBG_sprite = new Image();
bushBG_sprite.src = "assetCreation/items/bushBg.png";
bushBG_sprite.frameW = 2000;
bushBG_sprite.frameH = 425;



function renderBushBG(){

    // normal bush background
    c.drawImage(
        bushBG_sprite,
        // source x/y/w/h
        0,
        0,
        bushBG_sprite.frameW,
        bushBG_sprite.frameH,
        // destination x/y/w/h
        0,
        floorY - 250,
        cWidth,
        bushBG_sprite.frameH //grass_large_sprite.frameH
    );

}


// create flower images
// 
var flower_head_sprite = new Image();
flower_head_sprite.src = "assetCreation/items/flowerHeads_152x146px.png";
flower_head_sprite.frameW = 146;
flower_head_sprite.frameH = 152;
flower_head_sprite.frameList = [0,146,292,438];
flower_head_sprite.frameLen = flower_head_sprite.frameList.length - 1;
flower_head_sprite.frameNum = 0;


var flowerArr = [];
var randomFlowers = randomInteger(5,10);
// var randomFlowers = 3;

function makeFlower(numObjects) {

    for(var i = 0; i <= numObjects; i++) {
        var flower = {
            thisX : randomInteger(cWidth/2 - 400 ,cWidth/2 + 400),
            thisY : randomInteger(floorY - 400 ,floorY - 100),
            thisRad : 40,
            thislocalX : 0,
            thisLocalY : 0,
            thisXVel : 0, //randomInteger(-2,2),
            thisYVel : 0,
            thisYVelAcc : 0,
            thisFrame : randomInteger(0,flower_head_sprite.frameLen),
            baseFrameW : 100,
            baseFrameH : 100,
            currFrame : 0,
            scaleFactor : 2,
            fadeFactor : 0.05,
            bounceAmplitude : random(0.1,0.5),
            bounceSpeed : random(0.001,0.005),
            bounceCounter : 0,
            bounceCounterCompute : 0,
            bounceOffsetFactor : 1,
            bounceOffsetY : 0,
            isTarget : false,
            // states
            isExploding  : false

        }; // close skid_object

        // var balloonObj = new balloon();

        flowerArr.push(flower);
    } // close for loop
} // close makeFlower


function renderFlower(){
    var flowerArr_length = flowerArr.length - 1;

    if (flowerArr_length >= 0) {
        for (var i = flowerArr_length; i !== 0; i--) {

            var f = flowerArr[i];

            // normal large grass
            c.drawImage(
                flower_head_sprite,
                // source x/y/w/h
                flower_head_sprite.frameList[f.thisFrame],
                0,
                flower_head_sprite.frameW,
                flower_head_sprite.frameH,
                // destination x/y/w/h
                f.thisX - flower_head_sprite.frameW/2,
                f.thisY - flower_head_sprite.frameH/2,
                f.baseFrameW,
                f.baseFrameH //grass_large_sprite.frameH
            );

            // c.fillStyle = "#aaaa00";
            // c.fillCircle(f.thisX,f.thisY,f.thisRad);
            
            // c.fillStyle = "#aa0000";
            // c.textAlign = "center";
            // c.fillText("Is Target: "+f.isTarget,f.thisX, f.thisY - 60);

            // if (debugDisplay || debugBalloon) {
            //     c.strokeStyle = "#f00";
            //     c.fillStyle = "#f00";
            //     c.strokeRect(s.thisX,s.thisY,s.baseFrameW,s.baseFrameH);
            //     c.textAlign = "center";
            //     c.font = "12pt arial";
            //     // wing position X
            //     c.fillText("X: "+s.thisX,s.thisX,s.thisY-100);
            //     // wing position Y
            //     c.fillText("Y: "+s.thisY,s.thisX,s.thisY-80);
            //     // Width of frame from Source
            //     c.fillText("local Y: "+s.bounceOffsetY,s.thisX,s.thisY-60);
            //     // X Position of frame in source 
            //     c.fillText("bounceCounter: "+s.bounceCounter,s.thisX,s.thisY-40);
            //     c.fillText("exploding?: "+s.isExploding,s.thisX,s.thisY-20);
            //     c.fillText("frame?: "+balloon_sprite.frameNum,s.thisX,s.thisY-0);
            //     c.fillText("frame list?: "+balloon_sprite.frameLen,s.thisX,s.thisY+20);
            // }
            // 
        }

    }
}

makeFlower(randomFlowers);


// create bush image

// create flower images
// 
var bush_sprite = new Image();
bush_sprite.src = "assetCreation/items/bush_700x400px.png";
bush_sprite.frameW = 700;
bush_sprite.frameH = 400;

function renderBush() {

    c.drawImage(
        bush_sprite,
        0,
        0,
        bush_sprite.frameW,
        bush_sprite.frameH,
        cWidth/2 - (bush_sprite.frameW*1.5)/2,
        floorY - (bush_sprite.frameH*1.5) + 150,
        bush_sprite.frameW*1.5,
        bush_sprite.frameH*1.5
    );

}

//////////////////////////////////////////////// 
// create drone WAYPOINTS OBJECT and other stored points
////////////////////////////////////////////////

// calculate hive home position
var hiveHomeX = beehive_sprite.destX + ((beehive_sprite.destW/100)*15);
var hiveHomeY = beehive_sprite.destY + beehive_sprite.destH-50;

var hiveDockX = hiveHomeX;
var hiveDockY = beehive_sprite.destY - 50;


var hive_home = {
    depositedStuff : 0,
    maxStuff : 100000
}


var droneWaypoints = {
    home : {
        x : hiveHomeX,
        y : hiveHomeY
    },
    dockPoint : {
        x : hiveDockX,
        y : hiveDockY
    }
}

//////////////////////////////////////////////// 
// create DRONE BEE image library
////////////////////////////////////////////////

var drone_body_sprite = new Image();
drone_body_sprite.src = "assetCreation/bees/drone/drone_body_sprite.png";
drone_body_sprite.frameW = 70;
drone_body_sprite.frameH = 43;
drone_body_sprite.frameList = 0;
// drone_body_sprite.frameLen = drone_body_sprite.frameList.length - 1;
drone_body_sprite.frameNum = 0;

// drone wings - copy of worker bee wings
var drone_wings_front_sprite = new Image();
drone_wings_front_sprite.src = "assetCreation/bees/worker/wing-front-sprites-35x62pxPerFrame-test2.png";
drone_wings_front_sprite.frameW = 35;
drone_wings_front_sprite.frameH = 62;
drone_wings_front_sprite.frameList = [105,140,175,210,245,210,175,140];
drone_wings_front_sprite.frameLen = drone_wings_front_sprite.frameList.length - 1;
drone_wings_front_sprite.frameList2 = [105,175,245,175];
drone_wings_front_sprite.frameLen2 = drone_wings_front_sprite.frameList2.length - 1;
drone_wings_front_sprite.frameListResting = [0];
drone_wings_front_sprite.frameListRestingLen = 0;
drone_wings_front_sprite.frameListGliding = [35];
drone_wings_front_sprite.frameListGlidingLen = 0;
drone_wings_front_sprite.frameNum = 0;

drone_wings_front_sprite.currFrameList = drone_wings_front_sprite.frameList;
drone_wings_front_sprite.currFrameLen = drone_wings_front_sprite.frameLen;

var drone_wings_back_sprite = new Image();
drone_wings_back_sprite.src = "assetCreation/bees/worker/wing-behind-sprites-31x55pxPerFrame-test2.png";
drone_wings_back_sprite.frameW = 31;
drone_wings_back_sprite.frameH = 55;
drone_wings_back_sprite.frameList = [93,124,155,186,217,186,155,124];
drone_wings_back_sprite.frameLen = drone_wings_back_sprite.frameList.length - 1;
drone_wings_back_sprite.frameList2 = [93,155,217,155];
drone_wings_back_sprite.frameLen2 = drone_wings_back_sprite.frameList2.length - 1;
drone_wings_back_sprite.frameListResting = [0];
drone_wings_back_sprite.frameListRestingLen = 0;
drone_wings_back_sprite.frameListGliding = [31];
drone_wings_back_sprite.frameListGlidingLen = 0;
drone_wings_back_sprite.frameNum = 0;

drone_wings_back_sprite.currFrameList = drone_wings_back_sprite.frameList;
drone_wings_back_sprite.currFrameLen = drone_wings_back_sprite.frameLen;

//////////////////////////////////////////////// 
// create drone BEE OBJECT
////////////////////////////////////////////////

// WORLD origin coordinates relate to absolute position of object
// LOCAL origin coordinates are position of object relative to the WORLD origin position

var droneArr = [];

function makeDrone(numObjects) {
    for (var i = numObjects - 1; i >= 0; i--) {

        var droneBee = {

            // Co-ordinate Space Origins
            worldX : droneWaypoints.home.x,
            worldY : droneWaypoints.home.y,
            localX : 0,
            localY : 0,
            computedX : 0,
            computedY : 0,

            // Velocities
            worldXVel : 0,
            worldYVel : 0,
            localXVel : 0,
            localYVel : 0,

            // velocity store
            oldWorldX : 0,
            oldWorldY : 0,
            xVelDiff : 0,
            yVelDiff : 0,

            // Velocity limits
            worldXVelMax : 20,
            worldYVelMax : 20,
            worldVelocityVectorMax : 5,


            // generated forces
            downforce : 0,

            // Movement States
            isAlive : true,
            isFlying : true,
            isHovering : false,
            isClimbing : false,
            isGliding : false,
            isFacingLeft : true,
            isFacingRight : false,
            isFlyingLeft : false,
            isFlyingRight : false,
            isLanded : false,
            isWalking : false,
            isWalkingLeft : false,
            isWalkingRight : false,
            isBlinking : false,
            walkingFactor : 20,
            isSkidding: false,
            isImpact : false,
            isAutopilot : true,

            // autopilot states
            isHome : true,
            isLeavingHome : false,
            isArrivingHome : false,
            isTravellingToTarget : false,
            isTravellingToHiveDock : false,
            isAtTarget : false,
            waitingForTarget : false,

            isCarryingStuff : false,
            isCollectingStuff : false,
            isDepositingStuff : false,

            carryingWeight : 0,
            carryingWeightMax : 1000,
            deliveredWeight : 0,

            // autopilot params
            targetAquired : false,
            targetX : 0,
            targetY : 0,
            targetDistance : 0,
            lastDistanceTravelled : 0,
            incrementalMove : 0,
            lastIncrementalMove : 0,
            targetAngle : 0,
            animationOriginX : 0,
            animationOriginY : 0,
            animationPercent : 0,
            animationTimer : 0,
            animationDuration : 0,
            waypointComplete : true,
            targetNum : 0,

            id : i,

            // sprite positions
            frontWingPosition : 0,
            backWingPosition : 0,

            bodySpriteY : 0,
            frontWingSpriteY : 0,
            backWingSpriteY : 0,

            // sprite offsets
            backWingOffsetX : 20,
            backWingOffsetY : -20,
            frontWingOffsetX : 50,
            frontWingOffsetY : -22,
            eyesOffsetX : 12,
            eyesOffsetY : 35,
            eyeLidsOffsetX : 12,
            eyeLidsOffsetY : 35,

            // per particle (drone) frame pointers
            wingFrame : 0,
            bodyFrame : 0

        } // CLOSE drone bee


        droneArr.push(droneBee);
    } // close for loop
    
} // close makeDrone

function renderDrone() {

    var dronArrLen = droneArr.length;

    if (dronArrLen >= 0) {

        for(var i = 0; i < dronArrLen; i++) {

            var d = droneArr[i];

            // compute world position
            d.computedX = d.worldX + d.localX;
            d.computedY = d.worldY + d.localY;

            // d.computedX = cWidth/2 + (i*200);
            // d.computedY = cHeight/2;

            d.frontWingPosY = d.computedY + d.frontWingOffsetY;
            d.backWingPosY = d.computedY + d.backWingOffsetY;

            // compute sprite offsets to object world origin and direction of travel. Body remains at local position of 0,0
            if (d.isFacingLeft) {
                // Y offset positions dont change
                d.backWingPosition = d.computedX ;
                d.frontWingPosition = d.computedX + d.frontWingOffsetX/1.5;
                d.frontWingSpriteY = 0;
                d.backWingSpriteY = 0;
                d.bodySpriteY = 0;
            } else {
                d.backWingPosition = d.computedX +  d.backWingOffsetX*1.75;
                d.frontWingPosition = d.computedX;

                d.frontWingSpriteY = drone_wings_front_sprite.frameH;
                d.backWingSpriteY = drone_wings_back_sprite.frameH;
                d.bodySpriteY = drone_body_sprite.frameH;
            }

            // } // else {
            //     d.backWingPosition = d.computedX + drone_wings_back_sprite.frameW - d.backWingOffsetX;
            //     d.frontWingPosition = d.computedX + drone_body_sprite.frameW - d.frontWingOffsetX;
            //     d.frontWingSpriteY = drone_wings_front_sprite.frameH;
            //     d.backWingSpriteY = drone_wings_back_sprite.frameH;
            //     d.bodySpriteY = drone_body_sprite.frameH;
            // }


            // var eyesPosY = computedY + d.eyesOffsetY;
            // var eyeLidsPosY = computedY + d.eyeLidsOffsetY; 

            c.drawImage(
                drone_wings_back_sprite,
                drone_wings_back_sprite.currFrameList[d.wingFrame],
                d.backWingSpriteY,
                drone_wings_back_sprite.frameW,
                drone_wings_back_sprite.frameH,
                d.backWingPosition,
                d.backWingPosY,
                drone_wings_back_sprite.frameW,
                drone_wings_back_sprite.frameH
            );

            // 2. body
            c.drawImage(
                drone_body_sprite,
                drone_body_sprite.frameList,
                d.bodySpriteY,
                drone_body_sprite.frameW,
                drone_body_sprite.frameH,
                d.computedX,
                d.computedY,
                drone_body_sprite.frameW,
                drone_body_sprite.frameH
            );

            // c.strokeStyle = "#ff0000";
            // c.strokeRect(d.computedX,d.computedY,drone_body_sprite.frameW,drone_body_sprite.frameH);

            // 3. eyes
            // c.drawImage(bee_eyes, bee_eyes.frameList[bee_eyes.frameNum], eyeSpriteRow, bee_eyes.frameW, bee_eyes.frameH, eyesPosX, eyesPosY, bee_eyes.frameW, bee_eyes.frameH);

            // // 4. eye lids
            // c.drawImage(bee_eyeLids, bee_eyeLids.frameList[bee_eyeLids.frameNum], eyeLidsSpriteRow, bee_eyeLids.frameW, bee_eyeLids.frameH, eyeLidsPosX, eyeLidsPosY, bee_eyeLids.frameW, bee_eyeLids.frameH);

            // 5. front wings
            c.drawImage(
                drone_wings_front_sprite,
                drone_wings_front_sprite.currFrameList[d.wingFrame],
                d.frontWingSpriteY,
                drone_wings_front_sprite.frameW,
                drone_wings_front_sprite.frameH,
                d.frontWingPosition,
                d.frontWingPosY,
                drone_wings_front_sprite.frameW,
                drone_wings_front_sprite.frameH
            );
            // if (i == 0) {
            //     c.fillStyle = "#00aa00"
            // } else {
            //     c.fillStyle = "#ff0000"
            // }
            // c.textAlign = "left";
            // c.fillText(d.id, d.computedX + 45, d.computedY - 30);

            /* Simple circle display for drone position */
            /*
            c.fillStyle = "#f0a388";
            c.fillCircle(d.computedX, d.computedY, 20);
            */
            // var splitText = 20;
            // c.fillStyle = "#ff0000"
            // if (i == 0) {
            //     c.fillText("isHome:"+d.isHome, 30, splitText);
            //     splitText += 20;
            //     c.fillText("isLeavingHome: "+d.isLeavingHome, 30, splitText);
            //     splitText += 20;
            //     c.fillText("isArrivingHome: "+d.isArrivingHome, 30, splitText);
            //     splitText += 20;
            //     c.fillText("isTravellingToHiveDock: "+d.isTravellingToHiveDock, 30, splitText);
            //     splitText += 20;
            //     c.fillText("isTravellingToTarget: "+d.isTravellingToTarget, 30, splitText);
            //     splitText += 20;
            //     c.fillText("Flower is Target: "+flowerArr[d.targetNum].isTarget, 30, splitText);
            //     splitText += 20;
            //     c.fillText("waiting for target: "+d.waitingForTarget, 30, splitText);
            //     splitText += 20;
            //     c.fillText("waypoint complete: "+d.waypointComplete, 30, splitText);
            //     splitText += 20;
            //     c.fillText("target aquired: "+d.targetAquired, 30, splitText);

            // }


        } // close FOR loop

    } // close IF statement

} // close renderDrone

function initDroneTarget(drone) {

    thisDrone = drone;

    if (consoleLogging) {
        console.log('log: 002: inside initialise Drone');
    }

    // resets
    thisDrone.xVel = 0;
    thisDrone.yVel = 0;
    thisDrone.targetAquired = false;
    thisDrone.targetDistance = 0;
    thisDrone.targetAngle = 0;
    thisDrone.animationOriginX = 0;
    thisDrone.animationOriginY = 0;
    thisDrone.animationPercent = 0;
    thisDrone.animationTimer = 0;
    thisDrone.animationDuration = 0;
    thisDrone.incrementalMove = 0;
    thisDrone.lastDistanceTravelled = 0;
}

function aquireDroneTarget(drone, target) {

    var thisDrone = drone;

    if (consoleLogging) {
        console.log('log 005: aquireDroneTarget '+thisDrone.worldX+" "+thisDrone.worldY);
    }

    if (!thisDrone.targetAquired) {


        if (target == "flower") {

            if (consoleLogging) {
                console.log('log 006a: inside target flower');
            }

            var flowerArr_length = flowerArr.length - 1;

            if (flowerArr_length >= 0) {

                if (consoleLogging) {
                    console.log('log 006a1: inside target flower IF flowers.length');
                }

                i = flowerArr_length;
                for (var i = flowerArr_length; i !== 0; i--) {

                    var f = flowerArr[i];

                    if (consoleLogging) {
                        console.log('log 006a2: inside target flower FOR loop available flower check');
                    }
                    
                    if (!f.isTarget) {

                        if (consoleLogging) {
                            console.log('log 006a3: inside target flower FLOWER available');
                        }

                        thisDrone.targetX = f.thisX;
                        thisDrone.targetY = f.thisY;
                        thisDrone.targetNum = i,
                        f.isTarget = true;
                        // flip targetAquired flag to true
                        thisDrone.targetAquired = true;
                        // break out of the loop if an available target is found
                        break;
                    } else {

                        if (i == 0) {
                            thisDrone.targetAquired = false;
                            thisDrone.isTravellingToTarget = false;
                            thisDrone.waitingForTarget = true;
                        }
                    }

                } // close FOR loop

            }  // close IF FlowerArr has members

        } // close IF target == flower

        if (target == "dock") {

            if (consoleLogging) {
                console.log('inside target dock');
            }

            thisDrone.targetX = droneWaypoints.dockPoint.x;
            thisDrone.targetY = droneWaypoints.dockPoint.y;

            if (consoleLogging) {
                console.log('dock target '+thisDrone.targetX+" "+thisDrone.targetY);
            }

            // flip targetAquired flag to true
            thisDrone.targetAquired = true;
      
        } // close IF target == dock

        if (target == "home") {

            if (consoleLogging) {
                console.log('insode target home');
            }

            thisDrone.targetX = droneWaypoints.home.x;
            thisDrone.targetY = droneWaypoints.home.y;
            // flip targetAquired flag to true
            thisDrone.targetAquired = true;
      
        } // close IF target == home



    } // close targetAquired check

} // close FUNCTION aquireTarget


function updateTargetAndCalculations(drone) {

    var thisDrone = drone;

    // logging
    thisDrone.animationOriginX = thisDrone.worldX;
    thisDrone.animationOriginY = thisDrone.worldY;
    thisDrone.oldOriginX = thisDrone.worldX;
    thisDrone.oldOriginY = thisDrone.worldY;

    // get angle and distance of target from origin
    var targetDetails = getAngleAndDistance(thisDrone.worldX, thisDrone.worldY, thisDrone.targetX, thisDrone.targetY);

    // set angle and distance of target from origin
    thisDrone.targetDistance = targetDetails.distance;
    thisDrone.targetAngle = targetDetails.angle;

    if (consoleLogging) {
        console.log("this target "+thisDrone.targetDistance+" "+thisDrone.targetAngle+" "+thisDrone.targetAquired);
    }

    // calculate rough duration of frames based on distance / testSubject's max speed
    thisDrone.animationDuration = parseInt(thisDrone.targetDistance/thisDrone.worldVelocityVectorMax, 10);

    // reset animation timer
    thisDrone.animationTimer = 0;

    if (consoleLogging) {
        console.log("this duration "+thisDrone.animationDuration+" "+thisDrone.animationTimer);
    }         
} // close FUNCTION aquireTargetAndCalculations


/* drone states */
/*


thisDrone.isHome
    
    thisDrone.isCarryingStuff
        thisDrone.isDepositingStuff


thisDrone.isTravellingToHiveDock

    thisDrone.isLeavingHome

    thisDrone.isArrivingHome
        thisDrone.isCarryingStuff

thisDrone.isTravellingToTarget

thisDrone.isAtTarget
    thisDrone.isCollectingStuff

thisDrone.carryingWeight
thisDrone.carryingWeightMax
thisDrone.deliveredWeight
*/

var XXX = 0;
function updateDroneState(drone) {



    var thisDrone = drone;

     /*  if (1) {
            console.log("updateDroneState: ",  thisDrone.id);
       }*/


    if (consoleLogging) {
       console.log('log 003: inside updateDroneState'); 

    }

    // console.log('log 101: waypoint complete');

    if (thisDrone.isHome && thisDrone.waypointComplete) {

        if (consoleLogging) {
            console.log('log 004: inside Home and complete check');
        }

        aquireDroneTarget(thisDrone, "dock");
        updateTargetAndCalculations(thisDrone);
        thisDrone.isHome = false;
        thisDrone.isTravellingToHiveDock = true;
        thisDrone.isLeavingHome = true;
        thisDrone.isArrivingHome = false;
        thisDrone.waypointComplete = false;

    }

    if (thisDrone.isTravellingToHiveDock && thisDrone.waypointComplete) {

        if (thisDrone.isLeavingHome) {

            aquireDroneTarget(thisDrone, "flower");

            if (!thisDrone.targetAquired) {
                console.log('log 201: target not aquired thisDrone: '+thisDrone.id);
                thisDrone.isTravellingToHiveDock = false;
                thisDrone.isTravellingToTarget = false;
                thisDrone.waitingForTarget = true;
                // thisDrone.waypointComplete = true;

            } else {
                
                updateTargetAndCalculations(thisDrone);
                thisDrone.isTravellingToTarget = true;
                thisDrone.isHome = false;
                thisDrone.isTravellingToHiveDock = false;            
                thisDrone.isArrivingHome = false;
                thisDrone.isLeavingHome = false;
                thisDrone.waypointComplete = false;

            }
            
            

        }

        if (thisDrone.isArrivingHome) {

            aquireDroneTarget(thisDrone, "home");
            updateTargetAndCalculations(thisDrone);
            thisDrone.isHome = true;
            thisDrone.isTravellingToHiveDock = false;
            thisDrone.isArrivingHome = false;
            thisDrone.isLeavingHome = false;
            thisDrone.waypointComplete = false;

        }

    }

    if (thisDrone.waitingForTarget && thisDrone.waypointComplete) {

        console.log('log 201(2): inside waiting for target: thisDrone: '+thisDrone.id);

        aquireDroneTarget(thisDrone, "flower");

        if (!thisDrone.targetAquired) {
            flowerArr[thisDrone.targetNum].isTarget = false;
            thisDrone.isHome = false;
            thisDrone.isArrivingHome = false;
            thisDrone.isLeavingHome = false;
            thisDrone.isTravellingToHiveDock = false;
            thisDrone.isTravellingToTarget = false;
            thisDrone.waitingForTarget = true;
            thisDrone.waypointComplete = true;
            console.log('log 202: target not aquired thisDrone: '+thisDrone.id);
        } else {
            console.log('log 203: target aquired');
            updateTargetAndCalculations(thisDrone);
            thisDrone.isHome = false;
            thisDrone.waitingForTarget = false;
            
            thisDrone.isTravellingToTarget = true;
            thisDrone.isArrivingHome = false;
            thisDrone.isLeavingHome = false;
            thisDrone.waypointComplete = false;
        }

    }

    if (thisDrone.isTravellingToTarget && thisDrone.waypointComplete) {

        aquireDroneTarget(thisDrone, "dock");
        updateTargetAndCalculations(thisDrone);
        thisDrone.isAtTarget = false;
        thisDrone.isTravellingToHiveDock = true;
        thisDrone.isTravellingToTarget = false;
        thisDrone.isLeavingHome = false;
        thisDrone.isArrivingHome = true;
        thisDrone.waypointComplete = false;
        flowerArr[thisDrone.targetNum].isTarget = false;

    }

    if (thisDrone.isAtTarget && thisDrone.waypointComplete) {

        aquireDroneTarget(thisDrone, "dock");
        updateTargetAndCalculations(thisDrone);
        thisDrone.isAtTarget = false;
        thisDrone.isTravellingToHiveDock = true;
        thisDrone.isLeavingHome = false;
        thisDrone.isArrivingHome = true;
        thisDrone.waypointComplete = false;

    }

}

function updateDrone() {


    var droneArrLen = droneArr.length - 1;

    if (droneArrLen >= 0) {

        for(var i = 0; i <= droneArrLen; i++) {

            var d = droneArr[i];


            // compute frames for animation - flying
            if (d.isFlying) {

                if (d.isImpact) {
                    // makeSkid(10, true);
                    d.isImpact = false;
                }

                if (d.worldYVel > 1.5) {
                    // droneBee.isClimbing = false;
                    // droneBee.isHovering = false;
                    // droneBee.isGliding = true;
                    // // switchBeeAnimation('gliding');
                }

                d.bodyFrame = 0;
                // rundroneAnimation(drone_body_sprite, false);

                 // front wings
                 // rundroneAnimation(drone_wings_front_sprite, true);
                if (d.wingFrame >= drone_wings_front_sprite.currFrameLen) {
                    d.wingFrame = 0;
                } else {
                    d.wingFrame++;
                }
                // back wings
                // rundroneAnimation(drone_wings_back_sprite, true);
                if (d.wingFrame >= drone_wings_back_sprite.currFrameLen) {
                    d.wingFrame = 0;
                } else {
                    d.wingFrame++;
                }
                     
            } else {

            }

            if (d.isHome && d.waypointComplete) {

                if (consoleLogging) {
                    console.log('log 001: first state check');
                }

                d.worldX = d.worldX;
                d.worldY = d.worldY;
                initDroneTarget(d);
                
                updateDroneState(d);
            }


            if (d.targetAquired) {

                // if animation timer has reached calculated duration
                if ((d.animationTimer >= d.animationDuration) || (d.isHome && d.waypointComplete)) {
                    d.worldX = d.worldX;
                    d.worldY = d.worldY;
                    initDroneTarget(d);
                    d.waypointComplete = true;
                    updateDroneState(d);
                } 

                // if animation timer is less than calculated duration
                if (d.animationTimer < d.animationDuration) {

                    // calculate distance moved across absolute vector from easing equation
                    var distanceTravelled = easeInOutQuad(
                        d.animationTimer, // elapsed time
                        0, // animated parameter START value
                        d.targetDistance, // animated parameter END value
                        d.animationDuration // total animation duration
                    );
                    
                    var incrementalMove = distanceTravelled - d.lastDistanceTravelled;

                    var newCoords = findNewPoint(d.worldX, d.worldY, d.targetAngle, incrementalMove);
                    
                    d.lastDistanceTravelled = distanceTravelled;


                    // update positions 
                    d.worldX = newCoords.x;
                    d.worldY = newCoords.y;

                    // update animation timer and percentage
                    d.animationTimer += 1;

                }

            } else {

                d.worldX += d.worldXVel;
                d.worldY += d.worldYVel;

                if (counter%6 == 0) {
                    updateDroneState(d);
                }
                
            }

            if (d.worldX < d.oldWorldX) {
                d.isFacingLeft = true;
            } else {
                d.isFacingLeft = false;
            }

            d.oldWorldX = d.worldX;

        } // close FOR loop

    } // close IF

}

makeDrone(4);

function makeDroneTimed(timer) {

    var droneNum = droneArr.length;
    var flowerNum = flowerArr.length;

    if (droneNum < flowerNum) {
        if (counter%timer == 0) {
            makeDrone(1);
        }
    }

}



/* Make large grass sprites */

var grass_large_sprite = new Image();
grass_large_sprite.src = "assetCreation/items/grassLarge_450x715px.png";
grass_large_sprite.frameW = 450;
grass_large_sprite.frameH = 715;

var grass_large_sprite_blurred = new Image();
grass_large_sprite_blurred.src = "assetCreation/items/grassLarge_450x715px_blurred.png";
grass_large_sprite_blurred.frameW = 450;
grass_large_sprite_blurred.frameH = 715;

var grass_large_sprite_blurred_less = new Image();
grass_large_sprite_blurred_less.src = "assetCreation/items/grassLarge_450x715px_blurred_less.png";
grass_large_sprite_blurred_less.frameW = 450;
grass_large_sprite_blurred_less.frameH = 715;

function renderLargeGrass() {

    // normal large grass
    c.drawImage(
        grass_large_sprite,
        0,
        0,
        grass_large_sprite.frameW,
        grass_large_sprite.frameH,
        0 - grass_large_sprite.frameW/2.5,
        cHeight - grass_large_sprite.frameH/1.1,
        grass_large_sprite.frameW*1.5,
        grass_large_sprite.frameH*1.5 //grass_large_sprite.frameH
    );

    c.drawImage(
        // image pointer
        grass_large_sprite,
        // source image x/y/w/h
        grass_large_sprite.frameW,
        0,
        grass_large_sprite.frameW,
        grass_large_sprite.frameH,
        // destination image x/y/w/h
        cWidth - grass_large_sprite.frameW/1.1,
        cHeight - grass_large_sprite.frameH/1.1,
        grass_large_sprite.frameW*1.5,
        grass_large_sprite.frameH*1.5
    );

    // blurred grass
    c.drawImage(
        grass_large_sprite_blurred_less,
        0,
        0,
        grass_large_sprite_blurred_less.frameW,
        grass_large_sprite_blurred_less.frameH,
        0 - grass_large_sprite_blurred_less.frameW/0.9,
        0+400, //cHeight - grass_large_sprite_blurred_less.frameH + 100,
        grass_large_sprite_blurred_less.frameW*2,
        cHeight //grass_large_sprite_blurred_less.frameH
    );

    c.drawImage(
        grass_large_sprite_blurred_less,
        grass_large_sprite_blurred_less.frameW,
        0,
        grass_large_sprite_blurred_less.frameW,
        grass_large_sprite_blurred_less.frameH,
        cWidth - grass_large_sprite_blurred_less.frameW + 100,
        0+400,
        grass_large_sprite_blurred_less.frameW*2,
        cHeight
    );

    // very blurred grass
    c.drawImage(
        grass_large_sprite_blurred,
        0,
        0,
        grass_large_sprite_blurred.frameW,
        grass_large_sprite_blurred.frameH,
        0 - grass_large_sprite_blurred.frameW*2,
        0-600, //cHeight - grass_large_sprite_blurred.frameH + 100,
        grass_large_sprite_blurred.frameW*3.2,
        cHeight*1.75 //grass_large_sprite_blurred.frameH
    );

    c.drawImage(
        grass_large_sprite_blurred,
        grass_large_sprite_blurred.frameW,
        0,
        grass_large_sprite_blurred.frameW,
        grass_large_sprite_blurred.frameH,
        cWidth - grass_large_sprite_blurred.frameW*1.5,
        0-600,
        grass_large_sprite_blurred.frameW*4,
        cHeight*1.5
    );


}