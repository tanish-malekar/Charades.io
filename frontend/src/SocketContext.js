import React, {createContext, useState, useEffect, useRef} from "react";
import {useHistory} from 'react-router-dom'
import {io} from "socket.io-client";

const SocketContext = createContext();

const socket = io('http://localhost:4000/');

const ContextProvider = ({ children }) => {

    const socketIDRef = useRef();  
    
    const [name, setName] = useState('anonymous');
    const [gameInfo, setGameInfo] = useState({ 
        guessingTeam: "", 
        actor: "",
        movie: "",
        teamLeaders: ["", ""],
        score: [0, 0],
        team1: [],  
        team2: [],
        guessingHistory: [] 
    });
    const [roundOver, setRoundOver] = useState(false);
    

    useEffect(()=>{
        socket.on("connect", ()=>{
            socketIDRef.current = socket.id;
            console.log(socketIDRef);
        });
        socket.on("gameupdate", (updatedGameInfo)=>{
            setGameInfo(updatedGameInfo);
        });
        socket.on("roundover", (updatedGameInfo)=>{
            setGameInfo(updatedGameInfo);
            setRoundOver(true);
        });
       

    }, []);

  

    function getMyTeam(){
        for(let i=0; i<gameInfo.team1.length; i++){
            if(gameInfo.team1[i].id==socketIDRef.current){
                return "team1";
            }
        }

        for(let i=0; i<gameInfo.team2.length; i++){
            if(gameInfo.team2[i].id==socketIDRef.current){
                return "team2";
            }
        }
    }

    function isTeamLeader(){
        if(gameInfo.teamLeaders[0]==socketIDRef.current || gameInfo.teamLeaders[1]==socketIDRef.current){
            return true;
        }else{
            return false;
        }
    }

    
    function addToGH(roomid, name, item){
        socket.emit('addtoGH', roomid, name, item);
    } 

    function joinRoom(roomid){
        socket.emit('joinroom', roomid, name);
    }


    function joinTeam1(roomid){
        socket.emit('jointeam1', roomid);
    }

    function joinTeam2(roomid){
        socket.emit('jointeam2', roomid);
    }

    function changeName(roomid, newName){
        setName(newName);
        socket.emit('changename', roomid, newName);;
        console.log("name changed to", newName);
    }

    function inputActorName(roomid, value){
        console.log("emitting to server");
        socket.emit('inputactorname', roomid,  value);
    }

    function inputMovieName(roomid, value){
        console.log("emitting to server");
        socket.emit('inputmoviename', roomid, value);
    }


    return <SocketContext.Provider value={{roundOver, setRoundOver, addToGH, inputMovieName, inputActorName, isTeamLeader, getMyTeam, socket,  joinTeam1, joinTeam2, changeName, socketIDRef, name, setName, gameInfo, setGameInfo, joinRoom}}>
        {children}
    </SocketContext.Provider>

}

export {SocketContext, ContextProvider}


