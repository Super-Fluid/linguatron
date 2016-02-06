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
        var symbol = { xs:clickX.slice(), ys:clickY.slice(), drags:clickDrag.slice(), value:($("#new_word").val()) };
        storedSymbols.push(symbol);
        
        // now clear the canvas
        $("#selectWord").empty();
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
        
        $("#new_word").val('');
    });
    
    var road = {"xs":[21,23,27,36,51,70,93,119,149,166,186,208,218,232,242,253,263,273,284,292,299,305,311,316,323,329,338,348,355,360,364,365,366,366,367,368,369,36,37,50,69,94,121,151,178,198,217,232,242,253,263,272,282,289,297,303,309,317,321,329,336,343,350,355,361,367,370,372,373,373],"ys":[131,131,131,131,131,131,131,131,131,131,131,132,134,137,140,141,142,142,142,142,142,142,142,142,141,139,137,136,134,134,134,134,134,133,133,132,132,254,254,254,254,254,254,254,254,256,259,262,263,265,265,265,265,265,264,263,263,262,261,261,260,259,258,257,256,255,255,254,254,253],"drags":[false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"value":"road"};
    var ball = {"xs":[207,206,202,191,181,172,164,157,155,153,151,149,148,145,144,144,144,144,145,149,154,160,169,178,184,193,199,204,208,213,217,221,225,229,233,236,238,240,243,243,244,244,244,244,243,241,237,235,232,229,227,226,224,223,222,220,217,215,214,214,213,212,212,211,210,209,208,207,205,203,203,202,202,201],"ys":[253,253,253,253,253,254,257,262,264,269,273,280,288,299,308,318,325,331,336,342,346,351,355,358,360,361,361,361,361,361,359,356,353,349,343,338,331,323,317,310,307,304,302,299,295,290,286,283,279,276,273,272,271,270,269,268,266,265,264,264,263,263,262,262,262,260,259,258,256,256,255,255,254,254],"drags":[false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"value":"ball"};
    var cup = {"xs":[130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,130,131,132,138,148,164,181,195,204,211,216,218,220,222,224,225,227,229,230,231,232,233,233,233,235,239,246,250,254,256,256,256,256,256,256,255,255,255,254,253,252],"ys":[118,119,120,124,133,158,199,236,267,297,319,329,336,340,344,346,346,347,348,349,351,352,353,353,353,352,352,351,351,351,351,351,351,351,351,351,351,351,351,351,351,351,351,351,349,345,322,290,242,210,189,165,155,144,138,131,127,124,122,121,121,121,121],"drags":[false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"value":"cup"};
    var happy = {"xs":[154,154,154,154,154,153,152,151,264,264,264,264,264,264,264,264,264,264,264,264,264,264,263,263,262,262,262,262,262,262,262,261,261,261,260,61,61,65,71,82,95,110,119,131,140,147,156,165,175,187,196,208,219,235,246,260,271,277,284,287,289,291,293,298,302,307,309,311,312,313,313,313,314,315,317,318,318,319,319,320,322,324,325,326,327,328,328],"ys":[141,141,138,132,125,121,115,113,142,141,139,136,133,131,130,129,128,127,125,125,124,123,122,121,120,119,119,118,117,115,114,113,112,111,111,265,266,271,278,289,301,314,321,330,334,337,339,340,340,340,341,341,341,341,340,336,329,326,323,321,320,318,315,307,300,291,284,280,277,277,276,275,271,268,265,263,261,261,260,258,257,254,253,252,251,251,250],"drags":[false,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"value":"happy"};
    var roof = {"xs":[57,59,72,107,150,184,225,251,269,280,292,298,303,311,319,323,327,331,334,338,342,346,349,353,356,358,360,362,363,364,364,364,364,364,358,353,344,338,335,333,333,333,333,333,333,333,333,333,333,333,333,333,333,332,332,332,332,332,332,332,331,330,329,329,329,329,329,329,329,329],"ys":[64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,64,65,65,66,67,67,67,67,67,67,67,67,67,67,68,69,70,72,81,96,121,147,165,184,202,219,230,241,248,255,258,262,265,267,269,272,277,287,296,301,306,308,311,315,317,319,324,327,328,330,331,332,333,333],"drags":[false,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true,true],"value":"roof"};
    storedSymbols = [happy,cup,roof,ball,road];
    
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
	
	con.font="20px Georgia";
    con.fillText(symbol.value,10,20);
}

function searchForMatchingSymbols() {
    $("#selectWord").empty(); // remove old matches
    var currentSymbol = { xs:clickX, ys:clickY, drags:clickDrag, value:""}
    //console.log(JSON.stringify(currentSymbol));
    for (index = 0; index < storedSymbols.length; ++index) {
        if (compareSignatures(storedSymbols[index], currentSymbol)) {
            makeMiniCanvas("option"+index,storedSymbols[index]);
        }
    }
}


function calculateSignature(symbol) {
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
    return(error<10);
}
