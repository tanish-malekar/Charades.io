import React, {useContext, useEffect} from "react";
import { useHistory, useParams } from "react-router-dom";
import { SocketContext } from '../SocketContext';

function StartGameBtn(props){
    const { setRoundOver, isTeamLeader, getMyTeam, socket, setGameInfo} = useContext(SocketContext);
    const { roomid } = useParams();
    var history = useHistory();
    useEffect(() => {
        socket.on("newround", (roomid, updatedGameInfo)=>{
            setRoundOver(false);
            setGameInfo(updatedGameInfo);
            console.log("in clinet", getMyTeam(), updatedGameInfo.guessingTeam);
            if(getMyTeam() == updatedGameInfo.guessingTeam){
                history.push(`/${roomid}/choose-actor`);
            }else{
                history.push(`/${roomid}/choose-movie`);
            }
        });
    }, []);


    if(isTeamLeader()){
    return (<div className="center">
        <button onClick={()=>{socket.emit("startnewround", roomid);}} class="start-game-btn custom-btn" id="start-btn">{props.text}</button>
    </div>);
    }
    else{
        return(<div><p style={{color: "#63666A"}}>Only a team leader can start the{props.text=="Start Game"?" game":" new round"}</p></div>)
    }
}

export default StartGameBtn;