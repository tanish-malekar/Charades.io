import React, {useState, useContext, useEffect} from 'react';
import { SocketContext } from '../SocketContext';
import { useParams, useHistory } from 'react-router';

function InputActorName() {
    const {inputActorName, gameInfo, getMyTeam, socket, name, socketIDRef, isTeamLeader } = useContext(SocketContext);
    const actors = gameInfo[gameInfo.guessingTeam];
    const { roomid } = useParams();
    const [actorState, setActorState] = useState(gameInfo[gameInfo.guessingTeam][0].id);
    var history = useHistory();

    useEffect(() => {
        console.log("actor effect hook");
        socket.on("actorchosen", (roomid)=>{
            console.log("emit received by all");
            console.log(gameInfo);
            console.log(getMyTeam());
            console.log(gameInfo.guessingTeam);
            if(getMyTeam() === gameInfo.guessingTeam){
                history.push(`/${roomid}/guess-movie`);
            }
        });
        return ()=>{
            socket.off('actorchosen');
        }
    }, [])

    function onChange(e){
        console.log(e.target.value);
        setActorState(e.target.value);
    }
    function onSubmit(){
        console.log("submit button pressed");
        console.log(actorState);
        inputActorName(roomid, actorState);
    }
    return (
        isTeamLeader()?<div className="InputMovieActorName">
            <p style={{fontSize:"3.5vh"}}>Choose the actor:</p>
            <select onChange={onChange} value={actorState} name="actor" id="actors">
                {actors.map((actor)=><option value={actor.id}>{actor.name}</option>)}
            </select>
            <button onClick={onSubmit} style={{marginTop:"3vh"}} type="button" class="submit-btn custom-btn">Submit</button>
        </div>
        :<p style={{color: "#63666A"}} className="InputMovieActorName">Only a team leader can submit the actor name</p>
    )
}

export default InputActorName
