import React, {useState, useContext, useEffect} from 'react';
import { SocketContext } from '../SocketContext';
import { useParams, useHistory } from 'react-router';
import "./GuessingArea.css";

function GuessingArea() {
    const {addToGH, inputActorName, gameInfo, getMyTeam, socket, name, socketIDRef, isTeamLeader } = useContext(SocketContext);
    const { roomid } = useParams();
    
    const [guess, setGuess] = useState("");

    const inputGuessStyle = {
        position: "absolute",
        bottom: "90px",
        left: "50%",
        transform: "translateX(-50%)"
    }

    function onKeyPress(event){
        if(event.key==="Enter"){
            setGuess("");
            console.log("addToGH calld");
            addToGH(roomid,name,guess);
        }
    }

    return (
        <div className="guessing-area">
            {/*There can only be 13 chat elements*/}
            <div className="guess-area">
                {gameInfo.guessingHistory.map((item)=><p>{item}</p>)}
            </div>
            {getMyTeam()===gameInfo.guessingTeam
                ?(gameInfo.actor===socketIDRef.current
                    ?<input value={guess} onKeyPress={onKeyPress} onChange={(event)=>{setGuess(event.target.value)}} style={inputGuessStyle} type="text" placeholder={"The actor cannot guess!"} disabled/>
                    :<input value={guess} onKeyPress={onKeyPress} onChange={(event)=>{setGuess(event.target.value)}} style={inputGuessStyle} type="text" placeholder="Enter your guess" />
                    )
                :<input value={guess} onKeyPress={onKeyPress} onChange={(event)=>{setGuess(event.target.value)}} style={inputGuessStyle} type="text" placeholder={"Only "+gameInfo.guessingTeam+" can guess!"} disabled/>
            }
        </div>
    )
}

export default GuessingArea
