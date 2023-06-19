import React,{useState, useContext} from 'react'
import VideoCalls from '../components/VideoCalls'
import { useParams, useHistory } from 'react-router';
import { SocketContext } from '../SocketContext';
import GuessingArea from '../components/GuessingArea';
import StartGameBtn from '../components/StartGameBtn';
import Timer from '../components/Timer';
import Scorecard from '../components/Scorecard';
import { useTimer } from 'react-timer-hook';

function GuessMovie() {
    const {roundOver, setRoundOver, gameInfo,  getMyTeam, name, socketIDRef, isTeamLeader } = useContext(SocketContext);
    const { roomid } = useParams();
    const [inCall, setInCall] = useState(true);
    console.log(getMyTeam());
    console.log(gameInfo.guessingTeam);
    return (
        <div className="guess-movie">
            <div className="row">
                <div className="col-10">
                {roundOver
                    ?<Scorecard />
                    :<h1>{gameInfo.guessingTeam.toUpperCase()} GUESSES THE MOVIE !</h1>
                }
                <br />
                </div>
                <div className="col-2">
                    <br/>
                    {roundOver
                    ?<StartGameBtn text="New Round"/>
                    :<Timer hoursMinSecs={{hours:0, minutes: 3, seconds: 0}}/>
                    }
                </div>
            </div>
            <div className="row">
                <div className="col-10">
                    <VideoCalls setinCall={setInCall} channelName={"GM"+roomid}/>
                </div>
                <div className="col-2">
                    <GuessingArea />
                </div>
            </div>
            
        </div>
    )
}

export default GuessMovie
