import React,{ useContext, useState} from 'react'
import StartGameBtn from "../components/StartGameBtn";
import VideoCalls from '../components/VideoCalls';
import { SocketContext } from '../SocketContext';
import InputMovieName from '../components/InputMovieName';
import { useParams, useHistory } from 'react-router';

function ChooseMovie() {
    const {gameInfo,  name, socketIDRef, isTeamLeader } = useContext(SocketContext);
    const [inCall, setInCall] = useState(true);
    const { roomid } = useParams();
    return (
        <div className="choose-movie">
            <h1>CHOOSE A MOVIE</h1>
            <div className="row">
                <div className="col-10">
                    <VideoCalls  setinCall={setInCall} channelName={"CM"+roomid} />
                </div>
                <div className="col-2">
                    <InputMovieName />
                </div>
            </div>
        </div>
    )
}

export default ChooseMovie
