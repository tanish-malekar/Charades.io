import React, {useState, useContext, useEffect} from 'react';
import { SocketContext } from '../SocketContext';
import { useParams, useHistory } from 'react-router';

function InputMovieName() {
    const {inputMovieName, gameInfo, socket, getMyTeam, name, socketIDRef, isTeamLeader } = useContext(SocketContext);
    const { roomid } = useParams();
    const [movieState, setMovieState] = useState("");
    var history = useHistory();

    useEffect(() => {
        socket.on("moviechosen", (roomid)=>{
            console.log("emit recieved by all");
            console.log(getMyTeam());
            console.log(gameInfo.guessingTeam);
            if(getMyTeam() != gameInfo.guessingTeam){
                history.push(`/${roomid}/guess-movie`);
            }
        });
        return ()=>{
            socket.off('moviechosen');
        }
    }, [])
    

    function onChange(e){
        console.log(e.target.value);
        setMovieState(e.target.value);
    }
    function onSubmit(){
        console.log("submit button pressed");
        inputMovieName(roomid, movieState);
    }
    return (
        isTeamLeader()?<div className="InputMovieActorName">
            <input onChange={onChange} value={movieState} type="text" placeholder="Enter the movie name" /><br />
            <button onClick={onSubmit} style={{marginTop:"3vh"}} type="button" class="custom-btn">Submit</button>
        </div>
        :<p style={{color: "#63666A"}} className="InputMovieActorName">Only a team leader can submit the movie name</p>
    )
}

export default InputMovieName
