/*
Linguatron
Created by Isaac Reilly
at the Hack the Brain 2016 hackathon
with substantial further work for my
Linguistics 229 final project.

Canvas drawing code is from
http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
*/

var storedSymbols = [];
var paint = false; // used by the canvas drawing code

var NMATCHES = 6; // number of matches to display

$(document).ready(function() {
    
    $("#clear-button").on("click",function(){
        $("#selectWord").empty(); // an empty canvas shouldn't match anything
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
    });
   
    $("#record-button").on("click",function(){
        var symbol = { xs:clickX.slice(), ys:clickY.slice(), drags:clickDrag.slice()};
        // clickX, clickY, and clickDrag are variables used by the canvas drawing code.
        storedSymbols.push(preprocessSymbol(symbol,$("#new_word").val()));
        // preprocessSymbol adds a list-of-strokes representation to the
        // symbol and attaches the word. The resulting symbol has
        // both xs/ys/drags and list-of-strokes data, since the former will be
        // used for displaying the symbol.
        
        // now clear the canvas
        $("#selectWord").empty();
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
        
        $("#new_word").val('');
    });
});

// preprocessSymbol adds a list-of-strokes representation to the
// symbol and attaches the word. The resulting symbol has
// both xs/ys/drags and list-of-strokes data, since the former will be
// used for displaying the symbol.
function preprocessSymbol(symbol,symbolWord) {
    var datum = {word:symbolWord}
    datum.strokes = toStrokes(symbol);
    datum.pointsAndDrags = symbol; // store so we can use later
    return datum;
}

function toStrokes(symbol) {
    var strokes = [];
    var stroke = [];
    var len = symbol.xs.length;
    var prev_x = undefined;
    var prev_x = undefined;
    for (var i = 0; i < len; i++) {
        if (symbol.drags[i]) {
            // add to current stroke
            // but only if different enough from the previous point in this stroke
            var x_distinct = Math.abs(prev_x - symbol.xs[i]) > 2;
            var y_distinct = Math.abs(prev_y - symbol.ys[i]) > 2;
            // prev_x, prev_y will never be undefined because this
            // is not the first point in a stroke
            if (x_distinct || y_distinct) {
                stroke.push({x:symbol.xs[i],y:symbol.ys[i]});
                prev_x = symbol.xs[i];
                prev_y = symbol.ys[i];
            }
        } else {
            // start a new stroke
            // always add this point
            strokes.push(stroke.slice());
            stroke = [];
            stroke.push({x:symbol.xs[i],y:symbol.ys[i]});
            prev_x = symbol.xs[i];
            prev_y = symbol.ys[i];
        }
    }
    strokes.push(stroke.slice());
    strokes.splice(0,1);
    return strokes;
}

// create a small canvas showing a symbol and a word
// you can click on it to select that word
// modified from code in the main canvas (which I didn't write)
function makeMiniCanvas(id,fullSymbol) {
    var symbol = fullSymbol.pointsAndDrags;
    var word = fullSymbol.word;
	var canvasDiv = document.getElementById('selectWord');
	c = document.createElement("canvas");
	c.setAttribute('width', miniCanvasWidth);
	c.setAttribute('height', miniCanvasHeight);
	c.setAttribute('id', id);
	canvasDiv.appendChild(c);
	$("#"+id).addClass("wordOption").on("click",function(){
	    var currentOut = $("#outText").val();
	    currentOut += " " + word;
	    trainUnigram(word);
	    $("#outText").val(currentOut);
	    clearCanvas();
	    clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
	});
	if(typeof G_vmlCanvasManager != 'undefined') {
		c = G_vmlCanvasManager.initElement(c);
	}
	con = c.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	var locX;
	var locY;
	
	var localclickX = symbol.xs;
	var localclickY = symbol.ys;
	var localclickDrag = symbol.drags;
		
	var radius;
	var i = 0;
	for(; i < localclickX.length; i++)
	{		

		radius = 2.5;
		context.beginPath();
		if(localclickDrag[i] && i){
			con.moveTo(localclickX[i-1]/2, localclickY[i-1]/2);
		}else{
			con.moveTo(localclickX[i]/2, localclickY[i]/2);
		}
		con.lineTo(localclickX[i]/2, localclickY[i]/2);
		con.closePath();
		

		con.strokeStyle = clickColor[1];
		con.lineJoin = "round";
		con.lineWidth = radius;
		con.stroke();
		
	}
	//context.globalCompositeOperation = "source-over";// To erase instead of draw over with white
	
	
	con.globalAlpha = 1; // No IE support
	
	con.font="20px Georgia";
    con.fillText(word,10,20);
}

function score(symbol1,symbol2) {
    var sum = 0.0;
    var len = features.length;
    for (var index = 0; index < len; ++index) {
        sum += features[index][0](symbol1,symbol2) * features[index][1];
        // feature's score * feature's weight
    }
    return sum;
    
}

// call this function to display the best matches
function searchForMatchingSymbols() {
    $("#selectWord").empty(); // remove old matches
    var scored = [];
    var currentSymbol = preprocessSymbol({ xs:clickX, ys:clickY, drags:clickDrag});
    for (index = 0; index < storedSymbols.length; ++index) {
        scored.push([storedSymbols[index],score(storedSymbols[index],currentSymbol)]);
    }
    scored.sort(function (a,b) { return (a[1] - b[1]); });
    var nBest = scored.slice(0,NMATCHES);
    nBest.reverse();
    for (index = 0; index < nBest.length; ++index) {
        makeMiniCanvas("option"+index,nBest[index][0]);
    }
}

// differenceBy :: (Symbol -> Double) -> Double -> (Symbol -> Symbol -> Double)
// the 'scale' should be the distance between the max and min
function differenceBy(f,scale) {
    return ( function(s1,s2){
        try {
            var loose = 1-Math.abs(f(s1) - f(s2))/scale;
            // negative because difference is bad
            if (loose > 1) {
                return 1.0;
            } else if (loose < 0) {
                return 0.0;
            } else {
                return loose;
            }
        } catch(err) {
            return 0;
        }
    });
}

// same, but expects each function to give an array of numbers
function arrayDifferenceBy(f,scale) {
    return ( function(ns1,ns2){
        try {
            var avgError = 0;
            var len = Math.min(ns1.length,ns2.length);
            for (var i = 0; i < len; i++) {
                avgError += Math.abs(ns1[i] - ns2[i]);
            }
            var loose = 1-(avgError/len/scale);
            // negative because difference is bad
            if (loose > 1) {
                return 1.0;
            } else if (loose < 0) {
                return 0.0;
            } else {
                return loose;
            }
        } catch(err) {
            return 0;
        }
    });
}

// In following functions, adding 0.01 prevents a div by 0 error.
// Errors are caught, but NaNs are infectious.

// LANGUAGE MODEL

// unigrams has type [{word,count}]
var unigrams = []

function unigramScore(w) {
    var totalCount = 0.01;
    var thisCount = 0;
    for (var i = 0; i < unigrams.length; i++) {
        totalCount += unigrams[i].count;
        if (unigrams[i].word == w) {
            thisCount = unigrams[i].count;
        }
    }
    return (thisCount/totalCount);
}

function trainUnigram(w) {
    var foundP = false;
    for (var i = 0; i < unigrams.length; i++) {
        if (unigrams[i].word == w) {
            unigrams[i].count++;
            foundP = true;
        }
    }
    if (!foundP) {
        unigrams.push({word:w,count:1});
    }
}

function resetUnigram() {
    unigrams = [];
}

function languageModelAsFeature(s1,s2) {
    // score is called as
    // score(storedSymbols[index],currentSymbol)
    // We want to evaluate the stored symbol's word
    return(unigramScore(s1.word));
}

// FEATURES
var numStrokesF = differenceBy(function(s){return(s.strokes.length);},10);

var startingXF = differenceBy(function(s){return s.strokes[0][0].x;},400);
var startingYF = differenceBy(function(s){return s.strokes[0][0].y;},400);
var endingXF = differenceBy(function(s){return s.strokes[-1][-1].x;},400);
var endingYF = differenceBy(function(s){return s.strokes[-1][-1].x;},400);
var firstStrokeEndingXF = differenceBy(function(s){return s.strokes[0][-1].x;},400);
var firstStrokeEndingYF = differenceBy(function(s){return s.strokes[0][-1].x;},400);

var avgLengthOfStrokesF = differenceBy(function(s){
    var sum = 0;
    for (var i = 0; i < s.strokes.length; i++) {
        sum += s.strokes[i].length;
    }
    return (sum/(s.strokes.length+0.01));
},40);

var logRatioOfShortestAndLongestStrokesF = differenceBy(function(s){
    var shortestLength = s.strokes[0].length;
    var longestLength = s.strokes[0].length;
    for (var i = 0; i < s.strokes.length; i++) {
        if (s.strokes[i].length > longestLength) {
            longestLength = s.strokes[i].length;
        }
        if (s.strokes[i].length < shortestLength) {
            shortestLength = s.strokes[i].length;
        }
    }
    return (Math.log2(longestLength/(shortestLength+0.01))+4);
},8);

// "stretch" is the distance between the start and end point
function stretch(stroke) {
    h_stretch = Math.abs(stroke[0].x - stroke[-1].x);
    v_stretch = Math.abs(stroke[0].y - stroke[-1].y);
    return (Math.sqrt(h_stretch*h_stretch + v_stretch*v_stretch));
}

var avgStretchOfStrokesF = differenceBy(function(s){
// "stretch" is the distance between the start and end point
    var sum = 0;
    for (var i = 0; i < s.strokes.length; i++) {
        sum += stretch(s.strokes[i]);
    }
    return (sum/(s.strokes.length+0.01));
},8);

var logRatioOfMostAndLeastStretchF = differenceBy(function(s){
// "stretch" is the distance between the start and end point
    var shortestStretch = stretch(s.strokes[0]);
    var longestStretch = stretch(s.strokes[0]);
    for (var i = 0; i < s.strokes.length; i++) {
        if (stretch(s.strokes[i]) > longestStretch) {
            longestStretch = stretch(s.strokes[i]);
        }
        if (stretch(s.strokes[i]) < shortestStretch) {
            shortestStretch = stretch(s.strokes[i]);
        }
    }
    return (Math.log2(longestStretch/shortestStretch) + 8);
},16);

var compareAllLengthsOfStrokesF = arrayDifferenceBy(function(s){
    var lengths = [];
    for (var i = 0; i < s.strokes.length; i++) {
        lengths.push(s.strokes[i].length);
    }
    return lengths;
},400);

var compareAllStretchesOfStrokesF = arrayDifferenceBy(function(s){
    var lengths = [];
    for (var i = 0; i < s.strokes.length; i++) {
        lengths.push(stretch(s.strokes[i]));
    }
    return lengths;
},400);

var longestStrokeF = differenceBy(function(s){
    var longestLength = s.strokes[0].length;
    for (var i = 0; i < s.strokes.length; i++) {
        if (s.strokes[i].length > longestLength) {
            longestLength = s.strokes[i].length;
        }
    }
    return longestLength;
},400);

var mostStretchStrokeF = differenceBy(function(s){
    var longestStretch = stretch(s.strokes[0]);
    for (var i = 0; i < s.strokes.length; i++) {
        if (stretch(s.strokes[i]) > longestStretch) {
            longestStretch = stretch(s.strokes[i]);
        }
    }
    return longestStretch;
},400);

var compareAllStartXF = arrayDifferenceBy(function(s){
    var ps = [];
    for (var i = 0; i < s.strokes.length; i++) {
        ps.push(s.strokes[i][0].x);
    }
    return ps;
},400);

var compareAllStartYF = arrayDifferenceBy(function(s){
    var ps = [];
    for (var i = 0; i < s.strokes.length; i++) {
        ps.push(s.strokes[i][0].y);
    }
    return ps;
},400);

var compareAllEndXF = arrayDifferenceBy(function(s){
    var ps = [];
    for (var i = 0; i < s.strokes.length; i++) {
        ps.push(s.strokes[i][-1].x);
    }
    return ps;
},400);

var compareAllEndYF = arrayDifferenceBy(function(s){
    var ps = [];
    for (var i = 0; i < s.strokes.length; i++) {
        ps.push(s.strokes[i][-1].y);
    }
    return ps;
},400);

function getCurl(stroke) {
    if (stroke.length < 3) {
        return 0;
    }
    var curl = 0;
    var dx = stroke[1].x - stroke[0].x;
    if (dx == 0) {
        dx = 0.0001;
    }
    var dy = stroke[1].y - stroke[0].y;
    if (dy == 0) {
        dy = 0.0001;
    }
    // we can simplify the following a bit knowing that
    // we're going to take it mod pi
    if (dy/dx > 1) {
        var prev_angle = -(Math.PI/2) - Math.asin(dx/dy);
    } else if (dy/dx < -1) {
        var prev_angle = (Math.PI/2) - Math.asin(dx/dy);
    } else {
        var prev_angle = Math.asin(dy/dx);
    }
    for (var i = 2; i < stroke.length; i++) {
        dx = stroke[i].x - stroke[i-1].x;
        if (dx == 0) {
            dx = 0.0001;
        }
        dy = stroke[i].y - stroke[i-1].y;
        if (dy == 0) {
            dy = 0.0001;
        }
        if (dy/dx > 1) {
            var this_angle = -(Math.PI/2) - Math.asin(dx/dy);
        } else if (dy/dx < -1) {
            var this_angle = (Math.PI/2) - Math.asin(dx/dy);
        } else {
            var this_angle = Math.asin(dy/dx);
        }
        curl += this_angle - prev_angle;
        prev_angle = this_angle;
    }
    // PI, not 2*PI, so that sharp points count as 0
    curl = curl % Math.PI;
    if (curl < 0) {
        curl += Math.PI
    }
    if (isNaN(curl)) {
        curl = 0;
    } // shouldn't happen
    return curl;
}

// just like curl, but we add up the abs of the curve at
// each point, so curvy lines are similar even if they curl
// in opposite directions.
// We do not need to take the modulus of this!
function getAbsoluteCurl(stroke) {
    if (stroke.length < 3) {
        return 0;
    }
    var curl = 0;
    var dx = stroke[1].x - stroke[0].x;
    if (dx == 0) {
        dx = 0.0001;
    }
    var dy = stroke[1].y - stroke[0].y;
    if (dy == 0) {
        dy = 0.0001;
    }
    // here we could take every bad quadrant as a separate case,
    // but here's a better idea: let's calculate the arcsin
    // as in getCurl, but if we notice that the dx or dy has changed,
    // we add an extra pi/2 of absolute curl for each.
    if (dy/dx > 1) {
        var prev_angle = -(Math.PI/2) - Math.asin(dx/dy);
    } else if (dy/dx < -1) {
        var prev_angle = (Math.PI/2) - Math.asin(dx/dy);
    } else {
        var prev_angle = Math.asin(dy/dx);
    }
    var prev_dy = dy;
    var prev_dx = dx;
    var prev_angle = Math.asin(dy/dx);
    
    for (var i = 2; i < stroke.length; i++) {
        dx = stroke[i].x - stroke[i-1].x;
        if (dx == 0) {
            dx = 0.0001;
        }
        dy = stroke[i].y - stroke[i-1].y;
        if (dy == 0) {
            dy = 0.0001;
        }
        if (dy/dx > 1) {
            var this_angle = -(Math.PI/2) - Math.asin(dx/dy);
        } else if (dy/dx < -1) {
            var this_angle = (Math.PI/2) - Math.asin(dx/dy);
        } else {
            var this_angle = Math.asin(dy/dx);
        }
        curl += Math.abs(this_angle - prev_angle); // <- ABS
        
        // now extra absolute curl for points
        if (Math.abs(dx - prev_dx) > 10) {
            curl += Math.PI / 2;
        }
        if (Math.abs(dy - prev_dy) > 10) {
            curl += Math.PI / 2;
        }
        
        prev_angle = this_angle;
        prev_dx = dx;
        prev_dy = dy;
    }
    // no modulus here
    
    if (isNaN(curl)) {
        curl = 0;
    } // shouldn't happen, but sometimes does
    return curl;
}

var curlOflongestStrokeF = differenceBy(function(s){
    var longestLength = s.strokes[0].length;
    var longestStroke = s.strokes[0];
    for (var i = 0; i < s.strokes.length; i++) {
        if (s.strokes[i].length > longestLength) {
            longestLength = s.strokes[i].length;
            longestStroke = s.strokes[i];
        }
    }
    return getCurl(longestStroke) + Math.PI;
},6);

var compareAllCurlF = arrayDifferenceBy(function(s){
    var curls = [];
    for (var i = 0; i < s.strokes.length; i++) {
        curls.push(getCurl(s.strokes[i]));
    }
    return curls + Math.PI;
},6);

var absoluteCurlOflongestStrokeF = differenceBy(function(s){
    var longestLength = s.strokes[0].length;
    var longestStroke = s.strokes[0];
    for (var i = 0; i < s.strokes.length; i++) {
        if (s.strokes[i].length > longestLength) {
            longestLength = s.strokes[i].length;
            longestStroke = s.strokes[i];
        }
    }
    return getAbsoluteCurl(longestStroke);
},200);

var compareAllAbsoluteCurlF = arrayDifferenceBy(function(s){
    var curls = [];
    for (var i = 0; i < s.strokes.length; i++) {
        curls.push(getAbsoluteCurl(s.strokes[i]));
    }
    return curls;
},200);

var avgXF = differenceBy(function(s){
    var sumX = 0;
    var nX = 0.01;
    for (var i = 0; i < s.strokes.length; i++) {
        for (var j = 0; j < s.strokes[i].length; j++) {
            sumX += s.strokes[i][j].x;
            nX += 1;
        }
    }
    return (sumX/nX);
},400);

var avgYF = differenceBy(function(s){
    var sumY = 0;
    var nY = 0.01;
    for (var i = 0; i < s.strokes.length; i++) {
        for (var j = 0; j < s.strokes[i].length; j++) {
            sumY += s.strokes[i][j].y;
            nY += 1;
        }
    }
    return (sumY/nY);
},400);

// normalized X and Y means that they're measure only within 
// the symbol's bounding box. That gives values between 0 and 1.

var normalizedAvgXF = differenceBy(function(s){
    var sumX = 0;
    var nX = 0.01;
    var highestX = 0;
    var lowestX = s.strokes[0][0].x;
    
    for (var i = 0; i < s.strokes.length; i++) {
        for (var j = 0; j < s.strokes[i].length; j++) {
            sumX += s.strokes[i][j].x;
            nX += 1;
            if (s.strokes[i][j].x > highestX) {
                highestX = s.strokes[i][j].x;
            }
            if (s.strokes[i][j].x < lowestX) {
                lowestX = s.strokes[i][j].x;
            }
        }
    }
    return ((sumX/nX - lowestX)/(highestX - lowestX + 0.01));
},1);

var normalizedAvgYF = differenceBy(function(s){
    var sumY = 0;
    var nY = 0.01;
    var highestY = 0;
    var lowestY = s.strokes[0][0].y;
    
    for (var i = 0; i < s.strokes.length; i++) {
        for (var j = 0; j < s.strokes[i].length; j++) {
            sumY += s.strokes[i][j].y;
            nY += 1;
            if (s.strokes[i][j].y > highestY) {
                highestY = s.strokes[i][j].y;
            }
            if (s.strokes[i][j].y < lowestY) {
                lowestY = s.strokes[i][j].y;
            }
        }
    }
    return ((sumY/nY - lowestY)/(highestY - lowestY + 0.01));
},1);

var logAspectRatioF = differenceBy(function(s){
    var highestX = 0;
    var lowestX = s.strokes[0][0].x;
    var highestY = 0;
    var lowestY = s.strokes[0][0].y;
    
    for (var i = 0; i < s.strokes.length; i++) {
        for (var j = 0; j < s.strokes[i].length; j++) {
            if (s.strokes[i][j].y > highestY) {
                highestY = s.strokes[i][j].y;
            }
            if (s.strokes[i][j].y < lowestY) {
                lowestY = s.strokes[i][j].y;
            }
        }
    }
    return (Math.log2(highestY - lowestY/highestX - lowestX + 0.01) + 8);
},16);

// features: list of [function from two symbols to a real number, weight]
var features = [
    [numStrokesF,1.0]
    ,[startingXF,1.0]
    ,[startingYF,1.0]
    ,[endingXF,1.0]
    ,[endingYF,1.0]
    ,[avgLengthOfStrokesF,1.0]
    ,[logRatioOfShortestAndLongestStrokesF,1.0]
    ,[compareAllLengthsOfStrokesF,1.0]
    ,[compareAllStretchesOfStrokesF,1.0]
    ,[logRatioOfShortestAndLongestStrokesF,1.0]
    ,[longestStrokeF,1.0]
    ,[mostStretchStrokeF,1.0]
    ,[compareAllStartXF,1.0]
    ,[compareAllStartYF,1.0]
    ,[compareAllEndXF,1.0]
    ,[compareAllEndYF,1.0]
    ,[curlOflongestStrokeF,1.0]
    ,[compareAllCurlF,1.0]
    ,[absoluteCurlOflongestStrokeF,1.0]
    ,[compareAllAbsoluteCurlF,1.0]
    ,[avgXF,1.0]
    ,[avgYF,1.0]
    ,[normalizedAvgXF,1.0]
    ,[normalizedAvgYF,1.0]
    ,[logAspectRatioF,1.0]
    ,[languageModelAsFeature,1.0]
    ];