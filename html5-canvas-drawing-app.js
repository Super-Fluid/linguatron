
// Copyright 2010 William Malone (www.williammalone.com)
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.






// Modified by me for Linguatron 

var canvas;
var context;
var canvasWidth = 400;
var canvasHeight = 400;
var miniCanvasWidth = 200;
var miniCanvasHeight = 200;
var padding = 25;
var lineWidth = 8;
var colorPurple = "#000000";
var colorGreen = "#659b41";
var colorYellow = "#ffcf33";
var colorBrown = "#986928";
var outlineImage = new Image();
var crayonImage = new Image();
var markerImage = new Image();
var eraserImage = new Image();
var crayonBackgroundImage = new Image();
var markerBackgroundImage = new Image();
var eraserBackgroundImage = new Image();
var crayonTextureImage = new Image();
var clickX = new Array();
var clickY = new Array();
var clickColor = new Array();
var clickTool = new Array();
var clickSize = new Array();
var clickDrag = new Array();
var paint = false;
var curColor = colorPurple;
var curTool = "crayon";
var curSize = "normal";
var mediumStartX = 18;
var mediumStartY = 19;
var mediumImageWidth = 93;
var mediumImageHeight = 46;
var drawingAreaX = 111;
var drawingAreaY = 11;
var drawingAreaWidth = 267;
var drawingAreaHeight = 200;
var toolHotspotStartY = 23;
var toolHotspotHeight = 38;
var sizeHotspotStartY = 157;
var sizeHotspotHeight = 36;
var sizeHotspotWidthObject = new Object();
sizeHotspotWidthObject.huge = 39;
sizeHotspotWidthObject.large = 25;
sizeHotspotWidthObject.normal = 18;
sizeHotspotWidthObject.small = 16;
var totalLoadResources = 8;
var curLoadResNum = 0;
/**
* Calls the redraw function after all neccessary resources are loaded.
*/
function resourceLoaded()
{
	if(++curLoadResNum >= totalLoadResources){
		redraw();
	}
}

/**
* Creates a canvas element, loads images, adds events, and draws the canvas for the first time.
*/
function prepareCanvas()
{
	// Create the canvas (Neccessary for IE because it doesn't know what a canvas element is)
	var canvasDiv = document.getElementById('canvasDiv');
	canvas = document.createElement('canvas');
	canvas.setAttribute('width', canvasWidth);
	canvas.setAttribute('height', canvasHeight);
	canvas.setAttribute('id', 'canvas');
	canvasDiv.appendChild(canvas);
	if(typeof G_vmlCanvasManager != 'undefined') {
		canvas = G_vmlCanvasManager.initElement(canvas);
	}
	context = canvas.getContext("2d"); // Grab the 2d canvas context
	// Note: The above code is a workaround for IE 8 and lower. Otherwise we could have used:
	//     context = document.getElementById('canvas').getContext("2d");
	
	// Load images
	// -----------

	crayonImage.onload = function() { resourceLoaded(); 
	};
	crayonImage.src = "images/crayon-outline.png";
	//context.drawImage(crayonImage, 0, 0, 100, 100);
	
	markerImage.onload = function() { resourceLoaded(); 
	};
	markerImage.src = "images/marker-outline.png";
	
	eraserImage.onload = function() { resourceLoaded(); 
	};
	eraserImage.src = "images/eraser-outline.png";	
	
	crayonBackgroundImage.onload = function() { resourceLoaded(); 
	};
	crayonBackgroundImage.src = "images/crayon-background.png";
	
	markerBackgroundImage.onload = function() { resourceLoaded(); 
	};
	markerBackgroundImage.src = "images/marker-background.png";
	
	eraserBackgroundImage.onload = function() { resourceLoaded(); 
	};
	eraserBackgroundImage.src = "images/eraser-background.png";

	crayonTextureImage.onload = function() { resourceLoaded(); 
	};
	crayonTextureImage.src = "images/crayon-texture.png";
	
	outlineImage.onload = function() { resourceLoaded(); 
	};
	outlineImage.src = "images/watermelon-duck-outline.png";

	// Add mouse events
	// ----------------
	$('#canvas').mousedown(function(e)
	{
		// Mouse down location
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;
		
		if(false) // Left of the drawing area
		{
			if(mouseX > mediumStartX)
			{
				if(mouseY > mediumStartY && mouseY < mediumStartY + mediumImageHeight){
					curColor = colorPurple;
				}else if(mouseY > mediumStartY + mediumImageHeight && mouseY < mediumStartY + mediumImageHeight * 2){
					curColor = colorGreen;
				}else if(mouseY > mediumStartY + mediumImageHeight * 2 && mouseY < mediumStartY + mediumImageHeight * 3){
					curColor = colorYellow;
				}else if(mouseY > mediumStartY + mediumImageHeight * 3 && mouseY < mediumStartY + mediumImageHeight * 4){
					curColor = colorBrown;
				}
			}
		}
		else if(false) // Right of the drawing area
		{
			if(mouseY > toolHotspotStartY)
			{
				if(mouseY > sizeHotspotStartY)
				{
					var sizeHotspotStartX = drawingAreaX + drawingAreaWidth;
					if(mouseY < sizeHotspotStartY + sizeHotspotHeight && mouseX > sizeHotspotStartX)
					{
						if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.huge){
							curSize = "huge";
						}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge){
							curSize = "large";
						}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge){
							curSize = "normal";
						}else if(mouseX < sizeHotspotStartX + sizeHotspotWidthObject.small + sizeHotspotWidthObject.normal + sizeHotspotWidthObject.large + sizeHotspotWidthObject.huge){
							curSize = "small";						
						}
					}
				}
				else
				{
					if(mouseY < toolHotspotStartY + toolHotspotHeight){
						curTool = "crayon";
					}else if(mouseY < toolHotspotStartY + toolHotspotHeight * 2){
						curTool = "marker";
					}else if(mouseY < toolHotspotStartY + toolHotspotHeight * 3){
						curTool = "eraser";
					}
				}
			}
		}
		else if(true)
		{
			// Mouse click location on drawing area
		}
		paint = true;
		addClick(mouseX, mouseY, false);
		redraw();
	});
	
	$('#canvas').mousemove(function(e){
		if(paint==true){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			redraw();
		}
	});
	
	$('#canvas').mouseup(function(e){
		paint = false;
	  	redraw();
	});
	
	$('#canvas').mouseleave(function(e){
		paint = false;
	});
}

/**
* Adds a point to the drawing array.
* @param x
* @param y
* @param dragging
*/
function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickTool.push(curTool);
	clickColor.push(curColor);
	clickSize.push(curSize);
	clickDrag.push(dragging);
}

/**
* Clears the canvas.
*/
function clearCanvas()
{
	context.clearRect(0, 0, canvasWidth, canvasHeight);
}

/**
* Redraws the canvas.
*/
function redraw()
{
	// Make sure required resources are loaded before redrawing
	if(curLoadResNum < totalLoadResources){ return; }
	
	clearCanvas();
	
	var locX;
	var locY;
		
	var radius;
	var i = 0;
	for(; i < clickX.length; i++)
	{		

		radius = 5;
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		}else{
			context.moveTo(clickX[i], clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		

		context.strokeStyle = clickColor[1];
		context.lineJoin = "round";
		context.lineWidth = radius;
		context.stroke();
		
	}
	//context.globalCompositeOperation = "source-over";// To erase instead of draw over with white
	
	
	context.globalAlpha = 1; // No IE support
	
	// Draw the outline image
	//context.drawImage(outlineImage, drawingAreaX, drawingAreaY, drawingAreaWidth, drawingAreaHeight);

}


/**/