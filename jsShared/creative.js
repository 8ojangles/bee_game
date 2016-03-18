// canvas augmentation!

var p = CanvasRenderingContext2D.prototype;
p.circle = function(x, y, radius) { 
	this.beginPath(); 
	this.arc(x, y, radius, 0, Math.PI*2, true); 
};
p.fillCircle = function(x, y, radius) { 
	this.circle(x, y, radius); 
	this.fill(); 
	this.beginPath();
};
p.strokeCircle = function(x, y, radius) { 	
	this.circle(x, y, radius); 
	this.stroke(); 
	this.beginPath();
};
p.ellipse = function(x, y, width, height) { 
	this.beginPath(); 
	for(var i=0;i<Math.PI*2;i+=Math.PI/16) { 

		this.lineTo(x+(Math.cos(i)*width/2), y+(Math.sin(i)*height/2));
		
	}
	this.closePath(); 
};
p.fillEllipse = function(x, y, width, height) { 
	this.ellipse(x,y,width, height); 
	this.fill(); 
	this.beginPath();
};
p.strokeEllipse = function(x, y, width, height) { 
	this.ellipse(x,y,width, height); 
	this.stroke(); 
	this.beginPath();
};

p.line = function (x1, y1, x2, y2){
	this.beginPath(); 
	this.moveTo(x1,y1); 
	this.lineTo(x2,y2); 
	this.stroke(); 
	this.beginPath();
};

function radians(deg) {return deg*Math.PI/180;}; 
function degrees(rad) {return rad*180/Math.PI;};
function rgb(r, g, b) { return 'rgb('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+')';};
function rgba(r, g, b, a) { return 'rgba('+clamp(Math.round(r),0,255)+', '+clamp(Math.round(g),0,255)+', '+clamp(Math.round(b),0,255)+', '+clamp(a,0,1)+')';};
function hsl(h, s, l) { return 'hsl('+h+', '+clamp(s,0,100)+'%, '+clamp(l,0,100)+'%)';};
function hsla(h, s, l, a) { return 'hsla('+h+', '+clamp(s,0,100)+'%, '+clamp(l,0,100)+'%, '+clamp(a,0,1)+')';};

function randomInteger(min, max) {
	if(max===undefined) {
		max = min; 
		min = 0; 
	}
	return Math.floor(Math.random() * (max+1-min)) +min;
}
function random(min, max) { 
	if(min===undefined) { 
		min = 0; 
		max = 1; 
	} else if(max=== undefined) { 
		max = min; 
		min = 0; 
	}
	return (Math.random() * (max-min)) + min;
};

function map(value, min1, max1, min2, max2, clampResult) { 
	var returnvalue = ((value-min1) / (max1 - min1) * (max2-min2)) + min2; 
	if(clampResult) return clamp(returnvalue, min2, max2); 
	else return returnvalue; 
};

function clamp(value, min, max) { 
	if(max<min) { 
		var temp = min; 
		min = max; 
		max = temp; 
		
	}
	return Math.max(min, Math.min(value, max)); 
};

function dist(x1, y1, x2, y2) { 
	x2-=x1; y2-=y1; 
	return Math.sqrt((x2*x2) + (y2*y2)); 
}

/* Trigonomic functions - added 14.3.2016 */

/*
return useful Trigonomic values from position of 2 objects in x/y space
where x1/y1 is the current poistion and x2/y2 is the target position
*/


function getAngleAndDistance(x1, y1, x2, y2) {

	// set up base values
	var xDist = x2 - x1;
	var yDist = y2 - y1;

	// get the distance between the points
	var dist = Math.sqrt((xDist*xDist) + (yDist*yDist));

	// angle in radians
	// var radians = Math.atan2(yDist, xDist) * 180 / Math.PI;

	// angle in radians
	var radians = Math.atan2(yDist, xDist);

	return {
		distance : dist,
		angle : radians
	}

}

// get new X coordinate from angle and distance
// angle is in radians
function getAdjacentLength(angle, distance) {
	return Math.cos(angle) * distance;
}

// get new Y coordinate from angle and distance
// // angle is in radians
function getOppositeLength(angle, distance) {
	return Math.sin(angle) * distance;
}

function findNewPoint(x, y, angle, distance) {
    var result = {};
    result.x = Math.round(Math.cos(angle) * distance + x);
    result.y = Math.round(Math.sin(angle) * distance + y);
    return result;
}



// function findNewPoint(x, y, angle, distance) {
//     var result = {};
//     result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + x);
//     result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + y);
//     return result;
// }





var mouseX = 0, 
	mouseY = 0, 
	lastMouseX = 0, 
	lastMouseY = 0, 
	frameRate = 60, 
	lastUpdate = Date.now(),
	mouseDown = false;

function cjsloop() {

	var now = Date.now(); 
	var elapsedMils = now - lastUpdate; 
	
	
	if((typeof window.draw == 'function') && (elapsedMils>=(1000/window.frameRate))) {
		window.draw(); 
		
		lastUpdate = now - elapsedMils % (1000/window.frameRate );
		lastMouseX = mouseX; 
		lastMouseY = mouseY; 		
	}
	
	requestAnimationFrame(cjsloop);

};

	


// requestAnimationFrame 
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating

// requestAnimationFrame polyfill by Erik MÃ¶ller
// fixes from Paul Irish and Tino Zijdel

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); }, 
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());


window.addEventListener('load',init);

function init() {
	
	window.addEventListener('mousemove', function(e) {
		mouseX = e.clientX;
		mouseY = e.clientY;
	});

	window.addEventListener('mousedown', function(e){mouseDown =true; if(typeof onMouseDown == 'function') onMouseDown() ;});
	window.addEventListener('mouseup', function(e){mouseDown = false;if(typeof onMouseUp == 'function') onMouseDown()  ;});
	window.addEventListener('keydown', function(e){if(typeof onKeyDown == 'function') onKeyDown(e)  ;});
	
	if(typeof window.setup == 'function') window.setup();
	cjsloop(); 
	
	
	
}


/*
 * This is a near-direct port of Robert Penner's easing equations. Please shower Robert with
 * praise and all of your admiration. His license is provided below.
 *
 * For information on how to use these functions in your animations, check out my following tutorial: 
 * http://bit.ly/18iHHKq
 *
 * -Kirupa
 */




/*
 *
 * TERMS OF USE - EASING EQUATIONS
 * 
 * Open source under the BSD License. 
 * 
 * Copyright © 2001 Robert Penner
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without modification, 
 * are permitted provided that the following conditions are met:
 * 
 * Redistributions of source code must retain the above copyright notice, this list of 
 * conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list 
 * of conditions and the following disclaimer in the documentation and/or other materials 
 * provided with the distribution.
 * 
 * Neither the name of the author nor the names of contributors may be used to endorse 
 * or promote products derived from this software without specific prior written permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY 
 * EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
 * COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
 * EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE
 * GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED 
 * AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 * NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED 
 * OF THE POSSIBILITY OF SUCH DAMAGE. 
 *
 */




function linearEase(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * currentIteration / totalIterations + startValue;
}


function easeInQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (currentIteration /= totalIterations) * currentIteration + startValue;
}


function easeOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (currentIteration /= totalIterations) * (currentIteration - 2) + startValue;
}


function easeInOutQuad(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * currentIteration * currentIteration + startValue;
    }
    return -changeInValue / 2 * ((--currentIteration) * (currentIteration - 2) - 1) + startValue;
}


function easeInCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(currentIteration / totalIterations, 3) + startValue;
}


function easeOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 3) + 1) + startValue;
}


function easeInOutCubic(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * Math.pow(currentIteration, 3) + startValue;
    }
    return changeInValue / 2 * (Math.pow(currentIteration - 2, 3) + 2) + startValue;
}


function easeInQuart(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow (currentIteration / totalIterations, 4) + startValue;
}


function easeOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
    return -changeInValue * (Math.pow(currentIteration / totalIterations - 1, 4) - 1) + startValue;
}


function easeInOutQuart(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * Math.pow(currentIteration, 4) + startValue;
    }
    return -changeInValue / 2 * (Math.pow(currentIteration - 2, 4) - 2) + startValue;
}


function easeInQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow (currentIteration / totalIterations, 5) + startValue;
}


function easeOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (Math.pow(currentIteration / totalIterations - 1, 5) + 1) + startValue;
}


function easeInOutQuint(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * Math.pow(currentIteration, 5) + startValue;
    }
    return changeInValue / 2 * (Math.pow(currentIteration - 2, 5) + 2) + startValue;
}


function easeInSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.cos(currentIteration / totalIterations * (Math.PI / 2))) + startValue;
}


function easeOutSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sin(currentIteration / totalIterations * (Math.PI / 2)) + startValue;
}


function easeInOutSine(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue / 2 * (1 - Math.cos(Math.PI * currentIteration / totalIterations)) + startValue;
}


function easeInExpo(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.pow(2, 10 * (currentIteration / totalIterations - 1)) + startValue;
}


function easeOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (-Math.pow(2, -10 * currentIteration / totalIterations) + 1) + startValue;
}


function easeInOutExpo(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * Math.pow(2, 10 * (currentIteration - 1)) + startValue;
    }
    return changeInValue / 2 * (-Math.pow(2, -10 * --currentIteration) + 2) + startValue;
}


function easeInCirc(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * (1 - Math.sqrt(1 - (currentIteration /= totalIterations) * currentIteration)) + startValue;
}


function easeOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
    return changeInValue * Math.sqrt(1 - (currentIteration = currentIteration / totalIterations - 1) * currentIteration) + startValue;
}


function easeInOutCirc(currentIteration, startValue, changeInValue, totalIterations) {
    if ((currentIteration /= totalIterations / 2) < 1) {
        return changeInValue / 2 * (1 - Math.sqrt(1 - currentIteration * currentIteration)) + startValue;
    }
    return changeInValue / 2 * (Math.sqrt(1 - (currentIteration -= 2) * currentIteration) + 1) + startValue;
}

function easeInElastic(t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}
function easeOutElastic(t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
}

function easeInOutElastic(t, b, c, d) {
    var s=1.70158;var p=0;var a=c;
    if (t==0) return b;  if ((t/=d/2)==2) return b+c;  if (!p) p=d*(.3*1.5);
    if (a < Math.abs(c)) { a=c; var s=p/4; }
    else var s = p/(2*Math.PI) * Math.asin (c/a);
    if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}

function easeInBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*(t/=d)*t*((s+1)*t - s) + b;
}

function easeOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

function easeInOutBack(t, b, c, d, s) {
    if (s == undefined) s = 1.70158;
    if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
    return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}

function easeInBounce(t, b, c, d) {
    return c - easeOutBounce(d-t, 0, c, d) + b;
}

function easeOutBounce(t, b, c, d) {
    if ((t/=d) < (1/2.75)) {
        return c*(7.5625*t*t) + b;
    } else if (t < (2/2.75)) {
        return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
    } else if (t < (2.5/2.75)) {
        return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
    } else {
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    }
}

function easeInOutBounce(t, b, c, d) {
    if (t < d/2) return easeInBounce(t*2, 0, c, d) * .5 + b;
    return easeOutBounce(t*2-d, 0, c, d) * .5 + c*.5 + b;
}
