/* **************** Start Draw Function (runtime) ********************* */
function draw() {
/* **************** Start Draw Function (runtime) ********************* */

    // frame rate
    frameRate = 60;
    // Each frame reset color overlay mode
    c.globalCompositeOperation = 'source-over';
    // clear screen
    c.clearRect(0,0,canvas.width,canvas.height);

    /* **************** background render layers ********************* */

    // background cloud layer
    cloudRenderer();
    // background grass layer
    renderGrass('farground');

    /* **************** game action render layers ********************* */

    // makeDroneTimed(1000);

    // render balloon
    renderBalloon();
    // render bee-hive
    renderBeehive();

    /* ****************  TEST output ********************* */
    // renderTestPlayer();
    // renderTarget();
    /* ****************  close TEST output ********************* */

    renderFlower();
    renderDrone();
    // render bee-hive mask
    renderBeehiveMask();

    // bee render layer (contains bee update function)
    renderBee();

    // skid/dust render layer
    renderSkid();

    /* **************** background render layers ********************* */

    // background grass render layer
    renderGrass('background');
    // midground grass render layer
    renderGrass('midground');
    // foreground grass render layer
    renderGrass('foreground');

    /* **************** player controls ********************* */
    playerControls();

    /* **************** game update functions ********************* */
    updateSkid();
    updateGrass();
    updateBalloon();
    updateDrone();

    /* **************** update counter ********************* */
    counter++;
    counterDisplay();
    /* ****************  debug output ********************* */
    debugOutput();

    updateTestPlayer();
/* **************** Close Draw Function ******************** */
};
/* **************** Close Draw Function ******************** */