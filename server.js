var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var board = {
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

io.on('connection', function(socket){
    genPlayer(socket.id);
    
    socket.on('move', function(coords){
        console.log("got move" + JSON.stringify(coords));
        move(coords.from, coords.to, socket.id);
    });

    socket.on('disconnect', function(){
       remPlayer(socket.id); 
    });
});

//coord format {"x":"a", "col":"3"}
function move(from, to, id){
    if(board[from.x] != undefined && board[from.x][from.y] != undefined
      && board[to.x] != undefined && board[to.x][to.y] != undefined
      && board[to.x][to.y] === ""){
        var current = board[from.x][from.y];
        var dest = board[to.x][to.y];        
        var team = getTeam(id);
        
        console.log("current: " + current.charAt(0) + " team: " + team);
        
        if(current.charAt(0)==="r" && team==="red"){
            if(current.charAt(1)==="k"){
                if(
                    dest === ""
                    && (to.x === nextLetter(from.x) || to.x === lastLetter(from.x)) //Move to empty up or down
                    && (to.y === (parseInt(from.y)+1).toString() || (parseInt(from.y)-1).toString())   //Move left or right
                  ){
                        board[to.x][to.y] = current;
                        board[from.x][from.y] = "";
                    }
                else if ( //cap upper-left
                    dest === ""
                    && (to.x === lastLetter(lastLetter(from.x)))
                    && (to.y === (parseInt(from.y)-2).toString() || to.y === from.y)
                    && (board[lastLetter(from.x)][(parseInt(from.y)-1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.x)][(parseInt(from.y)-1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
                else if ( //cap upper-right
                    dest === ""
                    && (to.x === lastLetter(lastLetter(from.x)))
                    && (to.y === (parseInt(from.y)+2).toString() || to.y === from.y)
                    && (board[lastLetter(from.x)][(parseInt(from.y)+1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.x)][(parseInt(from.y)+1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
            else if ( //cap lower-left
                    dest === ""
                    && (to.x === nextLetter(nextLetter(from.x)))
                    && (to.y === (parseInt(from.y)-2).toString() || to.y === from.y)
                    && (board[nextLetter(from.x)][(parseInt(from.y)-1).toString()]).charAt(0) === "b"
                ){
                        board[nextLetter(from.x)][(parseInt(from.y)-1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
            else if ( //cap lower-right
                    dest === ""
                    && (to.x === nextLetter(nextLetter(from.x)))
                    && (to.y === (parseInt(from.y)+2).toString() || to.y === from.y)
                    && (board[lastLetter(from.x)][(parseInt(from.y)+1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.x)][(parseInt(from.y)+1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
        }
        else{
            if(
                    dest === ""
                    && (to.x === lastLetter(from.x)) //Move to empty up
                    && (to.y === (parseInt(from.y)+1).toString() || (parseInt(from.y)-1).toString())   //Move left or right
                  ){
                        board[to.x][to.y] = current;
                        board[from.x][from.y] = "";
                    }
                else if ( //cap upper-left
                    dest === ""
                    && (to.x === lastLetter(lastLetter(from.x)))
                    && (to.y === (parseInt(from.y)-2).toString() || to.y === from.y)
                    && (board[lastLetter(from.x)][(parseInt(from.y)-1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.x)][(parseInt(from.y)-1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
                else if ( //cap upper-right
                    dest === ""
                    && (to.x === lastLetter(lastLetter(from.x)))
                    && (to.y === (parseInt(from.y)+2).toString() || to.y === from.y)
                    && (board[lastLetter(from.x)][(parseInt(from.y)+1).toString()]).charAt(0) === "b"
                ){
                        board[lastLetter(from.x)][(parseInt(from.y)+1).toString()] = ""; //cap enemy piece
                        board.blackCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
            }
        }
        else if(current.charAt(0)==="b" && team==="black"){
            if(current.charAt(1)==="k"){
                if(
                    dest === ""
                    && (to.x === nextLetter(from.x) || to.x === lastLetter(from.x)) //Move to empty up or down
                    && (to.y === (parseInt(from.y)+1).toString() || (parseInt(from.y)-1).toString())   //Move left or right
                  ){
                        board[to.x][to.y] = current;
                        board[from.x][from.y] = "";
                    }
                else if ( //cap upper-left
                    dest === ""
                    && (to.x === lastLetter(lastLetter(from.x)))
                    && (to.y === (parseInt(from.y)-2).toString() || to.y === from.y)
                    && (board[lastLetter(from.x)][(parseInt(from.y)-1).toString()]).charAt(0) === "r"
                ){
                        board[lastLetter(from.x)][(parseInt(from.y)-1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
                else if ( //cap upper-right
                    dest === ""
                    && (to.x === lastLetter(lastLetter(from.x)))
                    && (to.y === (parseInt(from.y)+2).toString() || to.y === from.y)
                    && (board[lastLetter(from.x)][(parseInt(from.y)+1).toString()]).charAt(0) === "r"
                ){
                        board[lastLetter(from.x)][(parseInt(from.y)+1).toString()] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
                else if ( //cap lower-left
                        dest === ""
                        && (to.x === nextLetter(nextLetter(from.x)))
                        && (to.y === (parseInt(from.y)-2).toString() || to.y === from.y)
                        && (board[nextLetter(from.x)][(parseInt(from.y)-1).toString()]).charAt(0) === "r"
                    ){
                            board[nextLetter(from.x)][(parseInt(from.y)-1).toString()] = ""; //cap enemy piece
                            board.redCount--;

                            board[to.x][to.y] = current; //move player piece
                            board[from.x][from.y] = "";
                        }
                else if ( //cap lower-right
                        dest === ""
                        && (to.x === nextLetter(nextLetter(from.x)))
                        && (to.y === (parseInt(from.y)+2).toString() || to.y === from.y)
                        && (board[lastLetter(from.x)][(parseInt(from.y)+1).toString()]).charAt(0) === "r"
                    ){
                            board[lastLetter(from.x)][(parseInt(from.y)+1).toString()] = ""; //cap enemy piece
                            board.redCount--;

                            board[to.x][to.y] = current; //move player piece
                            board[from.x][from.y] = "";
                        }
        }
        else{
            if(
                    dest === ""
                    && to.y === nextNum(from.y)
                    && (to.x === nextLetter(from.x)
                        || to.x === lastLetter(from.x))
                  ){
                        console.log("passed");
                        board[to.x][to.y] = current;
                        board[from.x][from.y] = "";
                    }
                else if ( //cap lower-left
                    dest === ""
                    && to.y === nextNum(nextNum(from.y))
                    && (to.x === lastLetter(lastLetter(from.x))
                        || to.y === from.y)
                    && board[lastLetter(from.x)][nextNum(from.y)].charAt(0) === "r"
                ){
                        board[lastLetter(from.x)][nextNum(from.y)] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
                    }
                else if ( //cap lower-right
                    dest === ""
                    && to.y === nextNum(nextNum(from.y))
                    && (to.x === nextLetter(nextLetter(from.x))
                        || to.y === from.y)
                    && board[nextLetter(from.x)][nextNum(from.y)].charAt(0) === "r"
                ){
                        board[nextLetter(from.x)][nextNum(from.y)] = ""; //cap enemy piece
                        board.redCount--;

                        board[to.x][to.y] = current; //move player piece
                        board[from.x][from.y] = "";
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
    updateBoard();
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

function getTeam(id){
    var team = "unknown team"
    for(var x = 0; x < players.list.length; x++){
        if(id === players.list[x].id){
            team = players.list[x].team;
            break;
        }
    }
    return team;
}

function gameOver(){
    if(board.blackCount <= 0){
        console.log("Red wins");
        resetBoard();
    }
    else if(board.redCount <= 0){
        console.log("Black wins");
        resetBoard();
    }
}

function resetBoard(){
    board = reset;
    updateBoard();
}

function updateBoard(){
    gameOver();
    //console.log("Updating");
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