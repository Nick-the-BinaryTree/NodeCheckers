var board;
var boxSize;
var boardLength;
var pieceRadius;
var grd1;
var grd2;
var grd3;
var traces;
var mouseDown;

$('document').ready(function(){
    var c = document.getElementById("layer1");
    ctx=c.getContext("2d");
    var c2 = document.getElementById("layer2");
    ctx2=c2.getContext("2d");
    var c3 = document.getElementById("layer3");
    ctx3=c3.getContext("2d");
    
   setVariables(ctx);
   drawBoard(ctx);
   setBoard(ctx2)
    
   //drawPiece(ctx2, "red", 0,0, false);
   //drawPiece(ctx2, "black", 90, 90, false);
    
   document.body.onmousedown = function(){mouseDown=1;}
   document.body.onmouseup = function(){mouseDown=0;}
   
   c3.onmousemove=function(e){click(e, ctx3, c3)}
   setInterval(function(){fadeTrace(ctx3)}, 10);
    
});

function click(event, ctx, c){
    if(mouseDown===1){
        x = event.pageX - c.offsetLeft - pieceRadius;
        y = event.pageY - c.offsetTop - pieceRadius;
        
        traces.push({"x":x,"y":y});
        
        drawPiece(ctx, "trace", x, y, false);
    }
}

function drawPiece(ctx, team, x, y, king){
    var centerX = x+boxSize/2;
    var centerY = y+boxSize/2;
    
    ctx.beginPath();
    
    if(team==="red"){
        ctx.arc(centerX, centerY, pieceRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle=grd2;
        if(king){
           ctx.strokeStyle="rgb(255, 226, 0)";
           ctx.stroke();
        }
    }
    else if(team==="black"){
        ctx.arc(centerX, centerY, pieceRadius, 0, 2 * Math.PI, false);
        ctx.fillStyle=grd3;
        if(king){
           ctx.strokeStyle="rgb(255, 226, 0)";
           ctx.stroke();
        }
    }
    else{
        ctx.arc(centerX, centerY, pieceRadius/3, 0, 2 * Math.PI, false);
        ctx.strokeStyle="rgba(0, 0, 0, .2)";
        ctx.stroke();
        ctx.fillStyle="rgba(201, 201, 201, 0.005)";
    }
    
    ctx.fill();
}

function drawBoard(ctx){
    ctx.fillStyle="#e5b487";
    ctx.fillRect(0,0,boardLength,boardLength);
    
    ctx.fillStyle=grd1;
    
    for(row=0; row<8; row+=2){
        for(col=1; col<8; col+=2){
            ctx.fillRect(row*boxSize,col*boxSize,boxSize,boxSize);
            //debugger
        }
    }
    
    for(row=1; row<8; row+=2){
        for(col=0; col<8; col+=2){
            ctx.fillRect(row*boxSize,col*boxSize,boxSize,boxSize);
        }
    }
}

function fadeTrace(ctx){
    if(traces.length > 0){
        ctx.clearRect(traces[0].x, traces[0].y, pieceRadius*1.5, pieceRadius*1.5);
        traces.shift();
    }
}

function setBoard(ctx){
    var letter = "a";
    var num;
    debugger
    for(x=0; x < 8; x++, letter=nextLetter(letter)){
        num="1";
        for(y=0; y < 8; y++, num=nextNum(num)){
           var coord = toXY({"x":letter,"y":num})
           if(board[letter][num]==="r"){
                drawPiece(ctx, "red", coord.x, coord.y, false);
           }
           else if(board[letter][num]==="rk"){
                drawPiece(ctx, "red", coord.x, coord.y, true);
           }
           else if(board[letter][num]==="b"){
                drawPiece(ctx, "black", coord.x, coord.y, false);
           }
           else if(board[letter][num]==="bk"){
                drawPiece(ctx, "black", coord.x, coord.y, true);
           }
        }
    }
}

function toXY(coord){
    var letter = coord.x;
    var x, y;
    if(letter==="a")
        x = 0;
    else if(letter==="b")
        x = boxSize;
    else if(letter==="c")
        x = boxSize*2;
    else if(letter==="d")
        x = boxSize*3;
    else if(letter==="e")
        x = boxSize*4;
    else if(letter==="f")
        x = boxSize*5;
    else if(letter==="g")
        x = boxSize*6;
    else if(letter==="h")
        x = boxSize*7;
    else
        x = -boxSize;
    
    y = (parseInt(coord.y)-1)*boxSize;
    
    return {"x":x,"y":y};
}
    
function toBCoord(coord){
    var quo = coord.x/boxSize;
    var x, y;
    
    if(quo < 1)
        x = "1";
    else if(quo < 2)
        x = "2";
    else if(quo < 3)
        x = "3";
    else if(quo < 4)
        x = "4";
    else if(quo < 5)
        x = "5";
    else if(quo < 6)
        x = "6";
    else if(quo < 7)
        x = "7";
    else
        x = "8";
    
    quo = coord.y/boxSize;
    
    if(quo < 1)
        x = "a";
    else if(quo < 2)
        x = "b";
    else if(quo < 3)
        x = "c";
    else if(quo < 4)
        x = "d";
    else if(quo < 5)
        x = "e";
    else if(quo < 6)
        x = "f";
    else if(quo < 7)
        x = "g";
    else
        x = "h";
    
    return {"x":x, "y":y};
}

function nextLetter(letter){
    return letter.substring(0,letter.length-1)+String.fromCharCode(letter.charCodeAt(letter.length-1)+1);
}
    
function lastLetter(letter){
    return letter.substring(0,letter.length-1)+String.fromCharCode(letter.charCodeAt(letter.length-1)-1);
}

function nextNum(num){
    return (parseInt(num)+1).toString();
}

function lastNum(num){
    return (parseInt(num)-1).toString();
}

function setVariables(ctx){
    mouseDown = 0;
    boxSize = 90;
    boardLength = 720;
    pieceRadius = 40;
    grd1 = ctx.createLinearGradient(0.000, 150.000, 300.000, 150.000);   
    grd1.addColorStop(0.000, 'rgba(147, 88, 32, 1.000)');
    grd1.addColorStop(1.000, 'rgba(196, 135, 78, 1.000)');
    grd2 = ctx.createRadialGradient(150.000, 150.000, 0.000, 150.000, 150.000, 150.000);
    grd2.addColorStop(0.195, 'rgba(255, 63, 63, 1.000)');
    grd2.addColorStop(1.000, 'rgba(255, 109, 109, 1.000)');
    grd3 = ctx.createRadialGradient(150.000, 150.000, 0.000, 150.000, 150.000, 150.000);
    grd3.addColorStop(0.195, 'rgba(73, 73, 73, 1.000)');
    grd3.addColorStop(1.000, 'rgba(119, 119, 119, 1.000)');
    traces = [];
    board = {
      "a" : {
          "1" : "",
          "2" : "b",
          "3" : "",
          "4" : "",
          "5" : "",
          "6" : "r",
          "7" : "",
          "8" : "r"
      },
     "b" : {
          "1" : "b",
          "2" : "",
          "3" : "b",
          "4" : "",
          "5" : "",
          "6" : "",
          "7" : "r",
          "8" : ""
      },
     "c" : {
          "1" : "",
          "2" : "b",
          "3" : "",
          "4" : "",
          "5" : "",
          "6" : "r",
          "7" : "",
          "8" : "r"
      },
    "d" : {
          "1" : "b",
          "2" : "",
          "3" : "b",
          "4" : "",
          "5" : "",
          "6" : "",
          "7" : "r",
          "8" : ""
      },
    "e" : {
          "1" : "",
          "2" : "b",
          "3" : "",
          "4" : "",
          "5" : "",
          "6" : "r",
          "7" : "",
          "8" : "r"
      },
    "f" : {
          "1" : "b",
          "2" : "",
          "3" : "b",
          "4" : "",
          "5" : "",
          "6" : "",
          "7" : "r",
          "8" : ""
      },
    "g" : {
          "1" : "",
          "2" : "b",
          "3" : "",
          "4" : "",
          "5" : "",
          "6" : "r",
          "7" : "",
          "8" : "r"
      },
    "h" : {
          "1" : "b",
          "2" : "",
          "3" : "b",
          "4" : "",
          "5" : "",
          "6" : "",
          "7" : "r",
          "8" : ""
      },
    "blackCount" : 12,
    "redCount" : 12
    };
}