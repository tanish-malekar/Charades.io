const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require("socket.io")(server, {cors: {origin: "*"}});



var games = {
    roomid: {
        guessingTeam: "team2",
        actor: "id of actor",
        movie: "",
        teamLeaders: ["id1", "id2"],
        score: [0, 0],
        team1: [{id: null, name: null}], 
        team2: [{id: null, name: null}],
        guessingHistory: []
    }
}



var players = {
    socketid: {
        roomid: null
    }
}


io.on('connection', (socket) => {
    players[socket.id] = {roomid: null};

    socket.on('joinroom', (roomid, name)=>{
        players[socket.id].roomid = roomid;
        socket.join(roomid);
        if(games[roomid]){
            if(games[roomid].team1.length<=games[roomid].team2.length){
                games[roomid] = {...games[roomid], team1: [...games[roomid].team1, {id: socket.id, name:name}]}
                if(games[roomid].team1.length==1){
                    games[roomid].teamLeaders[0]=socket.id;
                }
            }else{
                games[roomid] = {...games[roomid], team2: [...games[roomid].team2, {id: socket.id, name:name}]} 
                if(games[roomid].team2.length==1){
                    games[roomid].teamLeaders[1]=socket.id;
                } 
            }
        }
        else{
            games[roomid] = { 
                guessingTeam: "team2",
                actor: "",
                movie: "",
                teamLeaders: [socket.id, ""],
                score: [0, 0],
                team1: [{id: socket.id, name:name}], 
                team2: [],
                guessingHistory: []
            }
        }

        io.in(roomid).emit('gameupdate', games[roomid]);
        console.log("Room joined by ", socket.id);
    });

    socket.on('startnewround', (roomid)=>{
        console.log(games[roomid].guessingTeam);
        if(games[roomid].guessingTeam==="team2"){
            games[roomid].guessingTeam="team1"
        }else{
            games[roomid].guessingTeam="team2"
        }
        console.log(games[roomid].guessingTeam);
        games[roomid].guessingHistory = [];
        io.in(roomid).emit('newround', roomid, games[roomid]);
    });

    socket.on('inputactorname', (roomid, value)=>{
        console.log("signal received by server");
        games[roomid].actor=value;
        io.in(roomid).emit('gameupdate', games[roomid]);
        io.in(roomid).emit('actorchosen', roomid);
    });

    socket.on('inputmoviename', (roomid, value)=>{
        console.log("signal received by server");
        games[roomid].movie=value;
        io.in(roomid).emit('gameupdate', games[roomid]);
        console.log("emiting to all");
        io.in(roomid).emit('moviechosen', roomid);
    });
    

    socket.on('jointeam1', (roomid)=>{
        var name = "";
        for (var i = 0; i < games[roomid].team2.length; i++) {
            if (games[roomid].team2[i].id === socket.id) {
                name = games[roomid].team2[i].name;
                games[roomid].team2.splice(i, 1);
                break;
            }
        }
        var isAlreadyPresent = false;
        for (var i = 0; i < games[roomid].team1.length; i++) {
            if (games[roomid].team1[i].id === socket.id) {
                isAlreadyPresent = true;
                break;
            }
        }
        if(!isAlreadyPresent){
            games[roomid] = {...games[roomid], team1: [...games[roomid].team1, {id:socket.id, name:name}]};
        }

        if(games[roomid].teamLeaders[1]==socket.id && games[roomid].team2.length!=0){
            games[roomid].teamLeaders[1]=games[roomid].team2[0].id;
        }
        if(games[roomid].team1.length==1){
            games[roomid].teamLeaders[0]=socket.id;
        }
        io.in(roomid).emit('gameupdate', games[roomid]);
    });

    socket.on('jointeam2', (roomid)=>{
        var name = "";
        for (var i = 0; i < games[roomid].team1.length; i++) {
            if (games[roomid].team1[i].id === socket.id) {
                name = games[roomid].team1[i].name;
                games[roomid].team1.splice(i, 1);
                break;
            }
        }
        var isAlreadyPresent = false;
        for (var i = 0; i < games[roomid].team2.length; i++) {
            if (games[roomid].team2[i].id === socket.id) {
                isAlreadyPresent = true;
                break;
            }
        }
        if(!isAlreadyPresent){
        games[roomid] = {...games[roomid], team2: [...games[roomid].team2, {id:socket.id, name:name}]};
        }

        if(games[roomid].teamLeaders[0]==socket.id && games[roomid].team1.length!=0){
            games[roomid].teamLeaders[0]=games[roomid].team1[0].id;
        }
        if(games[roomid].team2.length==1){
            games[roomid].teamLeaders[1]=socket.id;
        }
        io.in(roomid).emit('gameupdate', games[roomid]);
    });

    socket.on('changename', (roomid, newName)=>{
        if(newName==""){
            newName = "anonymous"
        }
        for(let i=0; i<games[roomid].team1.length; i++){
            if(games[roomid].team1[i].id==socket.id){
                games[roomid].team1[i].name = newName;
            }
        } 
        for(let i=0; i<games[roomid].team2.length; i++){
            if(games[roomid].team2[i].id==socket.id){
                games[roomid].team2[i].name = newName;
            }
        } 
        io.in(roomid).emit('gameupdate', games[roomid]);
    });

    socket.on('disconnect', function () {
        var roomid = players[socket.id].roomid;
        console.log("before removing player"); 
        console.log("here", games[roomid]);
        delete players[socket.id];
        if(games[roomid]){
            for (var i = 0; i < games[roomid].team1.length; i++) {
                if (games[roomid].team1[i].id === socket.id) {
                    games[roomid].team1.splice(i, 1);
                    if(games[roomid].teamLeaders[0]===socket.id && games[roomid].team1.length!=0){
                        games[roomid].teamLeaders[0]=games[roomid].team1[0].id;
                    }
                    break;
                }
            }
            for (var i = 0; i < games[roomid].team2.length; i++) {
                if (games[roomid].team2[i].id === socket.id) {
                    games[roomid].team2.splice(i, 1);
                    if(games[roomid].teamLeaders[1]===socket.id && games[roomid].team2.length!=0){
                        games[roomid].teamLeaders[1]=games[roomid].team2[0].id;
                    }
                    break;
                }
            }
            if(games[roomid].team1.length==0 && games[roomid].team2.length==0){
                delete games[roomid];
            }
            console.log("after removing player");
            io.in(roomid).emit('gameupdate', games[roomid]);
            console.log(games[roomid]);
        }
    });

    socket.on("addtoGH", (roomid, name, item)=>{
        console.log(name+": "+item);
        games[roomid].guessingHistory.push(name+": "+item);
        if(item===games[roomid].movie){
            games[roomid].guessingHistory.push(item+" is correct!");
            if(games[roomid].guessingTeam==="team1"){
                games[roomid].score[0]++;
            }else{
                games[roomid].score[1]++;
            }
            io.in(roomid).emit('roundover', games[roomid]);
        }
        else{
            games[roomid].guessingHistory.push(item+" is incorrect!");
            io.in(roomid).emit('gameupdate', games[roomid]);
        }
    })
})

server.listen(4000, ()=>{
    console.log("Listenning to port 4000");
  });
  