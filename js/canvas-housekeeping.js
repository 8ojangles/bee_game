/* ****************  housekeeping ********************* */

// define the canvas as a variable. define the canvas context as 2d
var canvas = document.getElementById('myCanvas'),
    c = canvas.getContext('2d');

// Set Canvas full screen

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

/* ****************  close housekeeping ********************* */

/* Debug button */

$('.debug').click(function(){

	var thisID = $(this).attr('id');

	if (thisID == "master") {
		if (!debugDisplay) {
			debugDisplay = true;
			debugGeneral = true;
			debugBGGrass = true;
			debugPlayer = true;
			$('.debug').removeClass('on').addClass('on');
		} else {
			debugDisplay = false;
			debugGeneral = false;
			debugBGGrass = false;
			debugPlayer = false;
			$('.debug').removeClass('on');
		}
	}

	if (thisID == "general") {
		if (!debugGeneral) {
			debugGeneral = true;
			$(this).removeClass('on').addClass('on');
		} else {
			debugGeneral = false;
			$(this).removeClass('on');
		}
	}

	if (thisID == "background-grass") {
		if (!debugBGGrass) {
			debugBGGrass = true;
			$(this).removeClass('on').addClass('on');
		} else {
			debugBGGrass = false;
			$(this).removeClass('on');
		}
	}

	if (thisID == "player") {
		if (!debugPlayer) {
			debugPlayer = true;
			$(this).removeClass('on').addClass('on');
		} else {
			debugPlayer = false;
			$(this).removeClass('on');
		}
	}

	if (thisID == "balloon") {
		if (!debugBalloon) {
			debugBalloon = true;
			$(this).removeClass('on').addClass('on');
		} else {
			debugBalloon = false;
			$(this).removeClass('on');
		}
	}

	if (thisID == "counter") {
		if (!debugCounter) {
			debugCounter = true;
			$(this).removeClass('on').addClass('on');
		} else {
			debugCounter = false;
			$(this).removeClass('on');
		}
	}

	if (thisID == "test") {
		if (!debugTest) {
			debugTest = true;
			$(this).removeClass('on').addClass('on');
		} else {
			debugTest = false;
			$(this).removeClass('on');
		}
	}


});