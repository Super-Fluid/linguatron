// drawing thanks to http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

var storedSymbols = [];
var currentSymbol = undefined;
var paint = false;

$(document).ready(function() {
    $("#clear-button").on("click",function(){
        $("#selectWord").empty();
    });
    
    $("#record-button").on("click",function(){
        
    });
    
    addCanvasEvents();
});

function addCanvasEvents() {
    var canvasDiv = document.getElementById('drawingboardDiv');
    canvas = document.createElement('canvas');
    canvas.setAttribute('id', 'drawingboard');
    canvasDiv.appendChild(canvas);
    
    if(typeof G_vmlCanvasManager != 'undefined') {
	    canvas = G_vmlCanvasManager.initElement(canvas);
    }
    context = canvas.getContext("2d");
    
    $('#drawingboard').mousedown(function(e){
        var mouseX = e.pageX - this.offsetLeft;
        var mouseY = e.pageY - this.offsetTop;
		
        paint = true;
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
        redraw();
    });
    $('#drawingboard').mousemove(function(e){
        if(paint){
        addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        redraw();
        }
    });
    $('#drawingboard').mouseup(function(e){
        paint = false;
    });
    $('#drawingboard').mouseleave(function(e){
        paint = false;
    });
    function redraw(){
        context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
  
        context.strokeStyle = "#000";
        context.lineJoin = "round";
        context.lineWidth = 5;
			
        for(var i=0; i < clickX.length; i++) {		
            context.beginPath();
            if(clickDrag[i] && i){
                context.moveTo(clickX[i-1], clickY[i-1]);
            }else{
                context.moveTo(clickX[i]-1, clickY[i]);
            }
                context.lineTo(clickX[i], clickY[i]);
                context.closePath();
                context.stroke();
        }
    }
}

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var paint;

function addClick(x, y, dragging)
{
  clickX.push(x);
  clickY.push(y);
  clickDrag.push(dragging);
}

function calculateSignature(symbol) {

}

function compareSignatures(symbol,symbol) {

}

function appendMatches(symbols) {
    symbols.foreach(function(symbol) {

    });
}