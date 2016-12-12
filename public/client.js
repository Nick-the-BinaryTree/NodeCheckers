var board;
var boxSize;
var boardLength;
var pieceRadius;
var grd1;
var grd2;
var grd3;
//var traces;
var mouseDown;
var startClick; //{"x":x,"y":y}
var endClick;
var winText;

document.addEventListener("DOMContentLoaded", function(){
    var socket = io();
    
    var c = document.getElementById("layer1");
    var ctx=c.getContext("2d");
    var c2 = document.getElementById("layer2");
    var ctx2=c2.getContext("2d");
    var c3 = document.getElementById("layer3");
    var ctx3=c3.getContext("2d");
    
   setVariables(ctx);
   drawBoard(ctx);
   setBoard(ctx2);
   
   socket.on('yourTeam', function(team){
       document.getElementById('team').innerHTML = team;
   });

   socket.on('update', function(newBoard){
       board = newBoard;
       setBoard(ctx2);
   });
    
   socket.on("win", function(team){win(team)});
    
   document.body.onmousedown = function(e){
       mouseDown=1;
       startClick = getClickCoords(e, c);
   }
   document.body.onmouseup = function(e){
       mouseDown=0;
       ctx3.clearRect(0, 0, boardLength, boardLength);
       endClick = getClickCoords(e, c);
       var coords = {"from":toBCoord(startClick), "to":toBCoord(endClick)};
       //console.log("emitting" + JSON.stringify(coords));
       socket.emit('move', coords);
   }
   
   c3.onmousemove=function(e){click(ctx3, e, c3)}
   //setInterval(function(){fadeTrace(ctx3)}, 30);
    
   document.onkeydown = function(e){
       if(e.keyCode === 82){
            socket.emit("reset");
       }
   }
});

function click(ctx, e, c){
    if(mouseDown===1){
        var coords = getClickCoords(e, c);
        
        coords.x -= pieceRadius;
        coords.y -= pieceRadius;
        
        //traces.push(coords);
        
        drawPiece(ctx, "trace", coords.x, coords.y, false);
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
        ctx.strokeStyle="rgba(0, 0, 0, .1)";
        ctx.stroke();
        ctx.fillStyle="rgba(201, 201, 201, 0.001)";
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
        }
    }
    
    for(row=1; row<8; row+=2){
        for(col=0; col<8; col+=2){
            ctx.fillRect(row*boxSize,col*boxSize,boxSize,boxSize);
        }
    }
}

/*function fadeTrace(ctx){
    if(traces.length > 0){
        ctx.clearRect(traces[0].x, traces[0].y, pieceRadius*1.5, pieceRadius*1.5);
        traces.shift();
    }
}*/

function setBoard(ctx){
    var letter = "a";
    var num;
    ctx.clearRect(0, 0, boardLength, boardLength);
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

function win(text){
    winText.innerHTML = text;
    winText.style.display = "block";
    var win = setTimeout(function(){
            clearTimeout(win);
            winText.style.display = "none";
        }, 1000);
}

function getClickCoords(e, c){
    var x = e.pageX - c.offsetLeft;
    var y = e.pageY - c.offsetTop;
    
    return {"x":x,"y":y};
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
    
    quo = coord.y/boxSize;

    if(quo < 1)
        y = "1";
    else if(quo < 2)
        y = "2";
    else if(quo < 3)
        y = "3";
    else if(quo < 4)
        y = "4";
    else if(quo < 5)
        y = "5";
    else if(quo < 6)
        y = "6";
    else if(quo < 7)
        y = "7";
    else
        y = "8";
    
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
    winText = document.getElementById("winner");
    //traces = [];
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
