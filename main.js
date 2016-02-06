// drawing thanks to http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

var storedSymbols = [];
var paint = false;
var storedSymbols = [];

$(document).ready(function() {
    $("#clear-button").on("click",function(){
        $("#selectWord").empty();
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
    });
    
    $("#record-button").on("click",function(){
        var symbol = { xs:clickX, ys:clickY, drags:clickDrag, value:null };
        storedSymbols.push(symbol);
        
        // now clear the canvas
        $("#selectWord").empty();
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
    });


});

function makeMiniCanvas(id,symbol) {
	var canvasDiv = document.getElementById('selectWord');
	c = document.createElement("canvas");
	c.setAttribute('width', miniCanvasWidth);
	c.setAttribute('height', miniCanvasHeight);
	c.setAttribute('id', id);
	canvasDiv.appendChild(c);
	$("#"+id).addClass("wordOption");
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
}

function searchForMatchingSymbols() {
    $("#selectWord").empty(); // remove old matches
    var currentSymbol = { xs:clickX, ys:clickY, drags:clickDrag, value:""}
    for (index = 0; index < storedSymbols.length; ++index) {
        if (compareSignatures(storedSymbols[index], currentSymbol)) {
            makeMiniCanvas("option"+index,storedSymbols[index]);
        }
    }
}

function calculateSignature(symbol) {
    return undefined;
}

function compareSignatures(symbol1,symbol2) {
    return true;
}

function appendMatches(symbols) {
    symbols.foreach(function(symbol) {

    });
}