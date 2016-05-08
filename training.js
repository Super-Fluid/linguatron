// drawing thanks to http://www.williammalone.com/articles/create-html5-canvas-javascript-drawing-app/

var storedSymbols = [];
var paint = false;
var storedSymbols = [];

var symbolMode = "create";
var symbolWord = "ball";
var instructions = [
     ["Create a symbol for a tree.","tree","create"]
    ,["Create a symbol for water.","water","create"]
    ,["Create a symbol for a cat.","cat","create"]
    ,["Create a symbol for a book.","book","create"]
    ,["Draw your symbol for a ball.","ball","reproduce"]
    ,["Draw your symbol for water.","water","reproduce"]
    ,["Draw your symbol for a tree.","tree","reproduce"]
    ,["Draw your symbol for a book.","book","reproduce"]
    ,["Draw your symbol for a cat.","cat","reproduce"]
    ,["Draw your symbol for a ball.","ball","reproduce"]
    ,["Draw your symbol for a tree.","tree","reproduce"]
    ,["Draw your symbol for a book.","book","reproduce"]
    ,["Draw your symbol for a cat.","cat","reproduce"]
    ,["Draw your symbol for water.","water","reproduce"]
    ,["Draw your symbol for a ball.","ball","reproduce"]
    ,["Draw your symbol for a cat.","cat","reproduce"]
    ,["Draw your symbol for water.","water","reproduce"]
    ,["Draw your symbol for a tree.","tree","reproduce"]
    ,["Draw your symbol for a ball.","ball","reproduce"]
    ,["Draw your symbol for a book.","book","reproduce"]
    ,["Draw your symbol for a tree.","tree","reproduce"]
    ,["Draw your symbol for water.","water","reproduce"]
    ,["Draw your symbol for a book.","book","reproduce"]
    ,["Draw your symbol for a cat.","cat","reproduce"]
    ].reverse();

var trainingData = [];

function sendMail(subject,message) {
// sendmail thanks to Doug S on stackoverflow
    document.location.href = "mailto:isaac.reilly@yale.edu?subject="
                + encodeURIComponent(subject)
                + "&body=" + encodeURIComponent(message);
}

$(document).ready(function() {
    $("#dataBox").hide();
    
    $("#clear-button").on("click",function(){
        $("#selectWord").empty();
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
    });
    
    $("#ok-button").on("click",function(){
        var symbol = { xs:clickX.slice(), ys:clickY.slice(), drags:clickDrag.slice(), value:($("#new_word").val()) };
        var strokeSymbol = toTrainingDatum(symbol);
        trainingData.push(strokeSymbol);
        
        // now clear the canvas
        clearCanvas();
        clickX.length = 0;
        clickY.length = 0;
        clickDrag.length = 0;
        
        // go to the next instruction
        if (instructions.length > 0) {
            var x = instructions.pop();
            $("#directions-text").text(x[0]);
            symbolWord = x[1];
            symbolMode = x[2];
            
        } else {
            $("#directions-text").text("Finished! Now please copy the data in the box and send it to me at isaac.reilly@yale.edu. Thank you!");
            var s = stringifyTrainingData(trainingData);
            $("#canvasDiv").hide();
            $("#dataBox").show();
            $("#dataBox").val(s);
            $(".top-menu-item").hide();
            //sendMail("Linguatron Data",s);
        }
    });
    
});

function toTrainingDatum(symbol) {
    var datum = {mode:symbolMode, word:symbolWord}
    datum.strokes = toStrokes(symbol);
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

// in order to email the data to me, it has to convert
// it into a string. It does this in such that I can paste
// the string into JS code to get the value.
// .. I should have just used JSON.stringify but I didn't
// realize this until later
function stringifyTrainingData(trainingData) {
    if (trainingData.length == 0) {
        return "[]";
    }
    var s = "[";
    var len = trainingData.length;
    for (var i = 0; i < len; i++) {
        s += stringifyDatum(trainingData[i]);
        s += ",";
    }
    s = s.slice(0,-1) // remove extra comma
    s += "]"
    return s;
}

function stringifyDatum(datum) {
    var s = "{mode:\"";
    s += datum.mode;
    s += "\", word: \"";
    s += datum.word;
    s += "\", strokes: ";
    s += stringifySymbol(datum.strokes);
    s += "}";
    return s;
}

function stringifySymbol(symbol) {
    if (symbol.length == 0) {
        return "[]";
    }
    var s = "[";
    var len = symbol.length;
    for (var i = 0; i < len; i++) {
        s += stringifyStroke(symbol[i]);
        s += ",";
    }
    s = s.slice(0,-1) // remove extra comma
    s += "]"
    return s;
}

function stringifyStroke(stroke) {
    if (stroke.length == 0) {
        return "[]";
    }
    var s = "[";
    var len = stroke.length;
    for (var i = 0; i < len; i++) {
        s += stringifyPoint(stroke[i]);
        s += ",";
    }
    s = s.slice(0,-1) // remove extra comma
    s += "]"
    return s;
}

function stringifyPoint(point) {
    var s = "{x:";
    s += point.x.toString();
    s += ",y:";
    s += point.y.toString();
    s += "}";
    return s;
}