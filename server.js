var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var board = {
  "a" : {
      "1" : "",
      "2" : "b",
      "3" : "",
      "4" : "b",
      "5" : "",
      "6" : "b",
      "7" : "",
      "8" : "b"
  },
 "b" : {
      "1" : "b",
      "2" : "",
      "3" : "b",
      "4" : "",
      "5" : "b",
      "6" : "",
      "7" : "b",
      "8" : ""
  },
 "c" : {
      "1" : "",
      "2" : "b",
      "3" : "",
      "4" : "b",
      "5" : "",
      "6" : "b",
      "7" : "",
      "8" : "b"
  },
"d" : {
      "1" : "",
      "2" : "",
      "3" : "",
      "4" : "",
      "5" : "",
      "6" : "",
      "7" : "",
      "8" : ""
  },
"e" : {
      "1" : "",
      "2" : "",
      "3" : "",
      "4" : "",
      "5" : "",
      "6" : "",
      "7" : "",
      "8" : ""
  },
"f" : {
      "1" : "r",
      "2" : "",
      "3" : "r",
      "4" : "",
      "5" : "r",
      "6" : "",
      "7" : "r",
      "8" : ""
  },
"g" : {
      "1" : "",
      "2" : "r",
      "3" : "",
      "4" : "r",
      "5" : "",
      "6" : "r",
      "7" : "",
      "8" : "r"
  },
"h" : {
      "1" : "r",
      "2" : "",
      "3" : "r",
      "4" : "",
      "5" : "r",
      "6" : "",
      "7" : "r",
      "8" : ""
  },
"blackCount" : 12,
"redCount" : 12
};
var reset = board;

var players = {
    "list" : [],
    "blackPlayers" : 0,
    "redPlayers" : 0
};
/* player object in list: {"id":1,"team":"black"}*/

app.use(express.static(__dirname+'/public'));

http.listen(3000, function(){
	console.log('listening on *:3000');
});

io.on('connection', function(socket)){
    genPlayer(socket.id);
    
    socket.on('move', function(from, to){
        move(from, to);
    });

    socket.on('disconnect', function(){
       remPlayer(socket.id); 
    });
});

//coord format {"row":"a", "col":"3"}
function move(from, to){
    if(board[from.row] != undefined && board[from.row][from.col] != undefined
      && board[to.row] != undefined && board[to.row][to.col] != undefined
      && board[to.row][to.col] === ""){
        var current = board[from.row][from.col];
        var dest = board[to.row][to.col];
        
        if(current.charAt(0)==="r"){
            if(current.charAt(1)==="k"){
                if(
                    dest === ""
                    && (to.row === nextLetter(from.row) || to.row === lastLetter(from.row)) //Move to empty up or down
                    && (to.col === (parseInt(from.col)+1).toString() || (parseInt(from.col)-1).toString())   //Move left or right
                  ){
                        board[to.row][to.col] = current;
                        board[from.row][from.col] = "";
                    }
                else if ( //cap upper-left
                    dest === ""
                    && (to.row === lastLetter(lastLetter(from.row)))
                    && (to.col === (parseInt(from.col)-2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)-1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)-1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
                else if ( //cap upper-right
                    dest === ""
                    && (to.row === lastLetter(lastLetter(from.row)))
                    && (to.col === (parseInt(from.col)+2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)+1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)+1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
            else if ( //cap lower-left
                    dest === ""
                    && (to.row === nextLetter(nextLetter(from.row)))
                    && (to.col === (parseInt(from.col)-2).toString() || to.col === from.col)
                    && (board[nextLetter(from.row)][(parseInt(from.col)-1).toString()]).charAt(0) === "b"
                ){
                        board[nextLetter(from.row)][(parseInt(from.col)-1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
            else if ( //cap lower-right
                    dest === ""
                    && (to.row === nextLetter(nextLetter(from.row)))
                    && (to.col === (parseInt(from.col)+2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)+1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)+1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
        }
        else{
            if(
                    dest === ""
                    && (to.row === lastLetter(from.row)) //Move to empty up
                    && (to.col === (parseInt(from.col)+1).toString() || (parseInt(from.col)-1).toString())   //Move left or right
                  ){
                        board[to.row][to.col] = current;
                        board[from.row][from.col] = "";
                    }
                else if ( //cap upper-left
                    dest === ""
                    && (to.row === lastLetter(lastLetter(from.row)))
                    && (to.col === (parseInt(from.col)-2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)-1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)-1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
                else if ( //cap upper-right
                    dest === ""
                    && (to.row === lastLetter(lastLetter(from.row)))
                    && (to.col === (parseInt(from.col)+2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)+1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)+1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
            }
        }
        else{
            if(current.charAt(1)==="k"){
                if(
                    dest === ""
                    && (to.row === nextLetter(from.row) || to.row === lastLetter(from.row)) //Move to empty up or down
                    && (to.col === (parseInt(from.col)+1).toString() || (parseInt(from.col)-1).toString())   //Move left or right
                  ){
                        board[to.row][to.col] = current;
                        board[from.row][from.col] = "";
                    }
                else if ( //cap upper-left
                    dest === ""
                    && (to.row === lastLetter(lastLetter(from.row)))
                    && (to.col === (parseInt(from.col)-2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)-1).toString()]).charAt(0) === "r"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)-1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
                else if ( //cap upper-right
                    dest === ""
                    && (to.row === lastLetter(lastLetter(from.row)))
                    && (to.col === (parseInt(from.col)+2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)+1).toString()]).charAt(0) === "r"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)+1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
            else if ( //cap lower-left
                    dest === ""
                    && (to.row === nextLetter(nextLetter(from.row)))
                    && (to.col === (parseInt(from.col)-2).toString() || to.col === from.col)
                    && (board[nextLetter(from.row)][(parseInt(from.col)-1).toString()]).charAt(0) === "r"
                ){
                        board[nextLetter(from.row)][(parseInt(from.col)-1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
            else if ( //cap lower-right
                    dest === ""
                    && (to.row === nextLetter(nextLetter(from.row)))
                    && (to.col === (parseInt(from.col)+2).toString() || to.col === from.col)
                    && (board[lastLetter(from.row)][(parseInt(from.col)+1).toString()]).charAt(0) === "r"
                ){
                        board[lastLetter(from.row)][(parseInt(from.col)+1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
        }
        else{
            if(
                    dest === ""
                    && (to.row === nextLetter(from.row)) //Move to empty down
                    && (to.col === (parseInt(from.col)+1).toString() || (parseInt(from.col)-1).toString())   //Move left or right
                  ){
                        board[to.row][to.col] = current;
                        board[from.row][from.col] = "";
                    }
                else if ( //cap lower-left
                    dest === ""
                    && (to.row === nextLetter(nextLetter(from.row)))
                    && (to.col === (parseInt(from.col)-2).toString() || to.col === from.col)
                    && (board[nextLetter(from.row)][(parseInt(from.col)-1).toString()]).charAt(0) === "r"
                ){
                        board[nextLetter(from.row)][(parseInt(from.col)-1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
                else if ( //cap lower-right
                    dest === ""
                    && (to.row === nextLetter(nextLetter(from.row)))
                    && (to.col === (parseInt(from.col)+2).toString() || to.col === from.col)
                    && (board[nextLetter(from.row)][(parseInt(from.col)+1).toString()]).charAt(0) === "r"
                ){
                        board[nextLetter(from.row)][(parseInt(from.col)+1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.row][to.col] = current; //move player piece
                        board[from.row][from.col] = "";
                    }
            }
        }
    }
    updateBoard();
}

function genPlayer(id){
    var team;
    if(players.blackCount > players.redCount){
        players.redCount++;
        team = "red";
    }
    else{
        players.blackCount++;
        team = "black";
    }
    players.list.push({"id":id, "team":team});
    console.log("Added " + id + "to " + team);
}

function remPlayer(id){
    for(var x = 0; x < players.list.length; x++){
        if(id === players.list[x].id){
            players.list.splice(x, 1);
            console.log("Removed " + id);
            break;
        }
    }
}

function gameOver?(){
    if(board.blackCount <= 0){
        console.log("Red wins");
    }
    else if(board.redCount <= 0){
        console.log("Black wins");
    }
    resetBoard();
}

function resetBoard(){
    board = reset();
    updateBoard();
}

function updateBoard(){
    io.emit('update', board);
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