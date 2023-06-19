import React, {useContext, useState} from 'react';
import VideoCalls from '../components/VideoCalls';
import StartGameBtn from "../components/StartGameBtn";
import { SocketContext } from '../SocketContext';
import InputActorName from '../components/InputActorName';
import { useParams, useHistory } from 'react-router';


function ChooseActor() {
    const {gameInfo,  name, socketIDRef, isTeamLeader } = useContext(SocketContext);
    const [inCall, setInCall] = useState(true);
    const { roomid } = useParams();
    
    return (
        <div className="choose-actor">
            <h1>CHOOSE THE ACTOR</h1>
            <div className="row">
                <div className="col-10">
                    <VideoCalls  setinCall={setInCall} channelName={"CA"+roomid} />
                </div>
                <div className="col-2">
                    <InputActorName />
                </div>
            </div>
        </div>
    )
}

export default ChooseActor
