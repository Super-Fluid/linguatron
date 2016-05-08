/*
Linguatron
Created by Isaac Reilly
at the Hack the Brain 2016 hackathon
with substantial further work for my
Linguistics 229 final project.

Canvas drawing code thanks to
http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/
*/

var storedSymbols = [];
var paint = false; // used by the canvas drawing code

var NMATCHES = 6; // number of matches to display

$(document).ready(function() {
    $("#search-button").on("click",function(){
        $("#selectWord").empty();
        searchForMatchingSymbols();
    });
        
    
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
    for (var i = 0; i < len; i++) {
        if (symbol.drags[i]) {
        // add to current stroke
            stroke.push({x:symbol.xs[i],y:symbol.ys[i]});
        } else {
        // start a new stroke
            strokes.push(stroke.slice());
            stroke = [];
            stroke.push({x:symbol.xs[i],y:symbol.ys[i]});
        }
    }
    strokes.push(stroke.slice());
    strokes.splice(0,1);
    return strokes;
}

// create a small canvas showing a symbol and a word
// you can click on it to select that word
// modified from code in the main canvas
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

// language model stuff
var recentWords = [];

// features: list of [function from two symbols to a real number, weight]
var features = [[compareSignatures,1.0]];
function score(symbol1,symbol2) {
    var sum = 0;
    for (index = 0; index < features.length; ++index) {
        sum += features[index][0](symbol1,symbol2) * features[index][1];
        // feature's score * feature's weight
    }
    return sum;
}

// call this function to display the best matches
function searchForMatchingSymbols() {
console.log("go");
    $("#selectWord").empty(); // remove old matches
    var scored = [];
    var currentSymbol = preprocessSymbol({ xs:clickX, ys:clickY, drags:clickDrag});
    for (index = 0; index < storedSymbols.length; ++index) {
        scored.push([storedSymbols[index],score(storedSymbols[index],currentSymbol)]);
    }
    scored.sort(function (a,b) { b[1] - a[1] });
    var nBest = scored.slice(0,NMATCHES+1);
    for (index = 0; index < nBest.length; ++index) {
        makeMiniCanvas("option"+index,nBest[index][0]);
    }
console.log("stop");
}

function calculateSignature(fullSymbol) {
    var symbol = fullSymbol.pointsAndDrags;
    var xs = symbol.xs.slice(0,1);
    var ys = symbol.ys.slice(0,1);
    var prev_x = xs[0];
    var prev_y = ys[0];
    
    // remove points which are near to previous points
    // starting with the second point
    for (i = 1; i < symbol.xs.length; ++i) {
        var x_distinct = Math.abs(prev_x - symbol.xs[i]) > 1;
        var y_distinct = Math.abs(prev_y - symbol.ys[i]) > 1;
        if (x_distinct && y_distinct) {
            xs.push(symbol.xs[i]);
            ys.push(symbol.ys[i]);
            prev_x = symbol.xs[i];
            prev_y = symbol.ys[i];
        }
    }
    
    
    // make histogram
    var hist = [[0,0,0,0],[0,0,0,0],[0,0,0,0],[0,0,0,0]]
    for (i = 0; i < xs.length; ++i) {
        var x = Math.floor(xs[i]/100);
        if (x > 3) {
            x = 3;
        } else if (x < 0) {
            x = 0;
        }
        var y = Math.floor(ys[i]/100);
        if (y > 3) {
            y = 3;
        } else if (y < 0) {
            y = 0;
        }
        
        hist[x][y]++;
    }
    return hist;
}

function compareSignatures(symbol1,symbol2) {
    var hist1 = calculateSignature(symbol1);
    var hist2 = calculateSignature(symbol2);
    var error = 0;
    for (i = 0; i < 4; ++i) {
        for (j = 0; j < 4; ++j) {
            var diff = Math.abs(hist1[i][j] - hist2[i][j]);
            if (diff > 1) {
                error+=diff;
            }
        }
    }
    return (1.0 - (error/10));
}
