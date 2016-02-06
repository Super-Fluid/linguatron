// drawing thanks to http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

var storedSymbols = [];
var currentSymbol = undefined;
var paint = false;

$(document).ready(function() {
    $("#clear-button").on("click",function(){
        $("#selectWord").empty();
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
    });
    
    $("#record-button").on("click",function(){
        
    });


});

function miniCanvas(id) {
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement(id);
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', id);
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
}

function calculateSignature(symbol) {

}

function compareSignatures(symbol,symbol) {

}

function appendMatches(symbols) {
    symbols.foreach(function(symbol) {

    });
}