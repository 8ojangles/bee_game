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

    c.lineWidth = 10;
    c.strokeStyle = rgba(colR,colG,colB,colA);
    c.strokeCircle(ex.x,ex.y,ex.r);

    colG-=10;
    colB-=10;
    colA-=0.05;
    ex.r+=50;

  }
}