import React, {useContext, useEffect, useState} from 'react'
import { SocketContext } from '../SocketContext';
import { useParams } from 'react-router';

import Title from "../components/Title";
import InputName from "../components/InputName";
import Teams from "../components/Teams";
import StartGameBtn from "../components/StartGameBtn";

function TeamDivision() {
    const { joinRoom, gameInfo,  name, socketIDRef, isTeamLeader } = useContext(SocketContext);
    const { roomid } = useParams()

    useEffect(()=>{
        joinRoom(roomid);
    }, []);
    
    const [isNextPressed, setIsNextPressed] = useState(false);
    function nextOnClick(){
        setIsNextPressed(true);
    }

    return (
        <div className="team-division">
            <Title />
            <InputName />
            {isNextPressed?null:<div><br/><button onClick={nextOnClick} class="custom-btn" id="next-btn">Next</button></div>}
            {isNextPressed?<div> <Teams /> <br/><br/> <StartGameBtn text="Start Game" /> </div> : null}
        </div>
    )
}

export default TeamDivision
