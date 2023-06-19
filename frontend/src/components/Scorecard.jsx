import React,{useContext} from 'react'
import { SocketContext } from '../SocketContext';

function Scorecard() {
    const {gameInfo} = useContext(SocketContext);

    return (
        <div>
            <div className="row">
                <div className="col">
                    <span>SCORE</span>
                </div>
                <div className="col">
                    <div className="row">
                        <span>TEAM 1</span>
                    </div>
                    <div className="row">
                        <span>{gameInfo.score[0]}</span>
                    </div>
                </div>
                <div className="col">
                    <div className="row">
                        <span>TEAM 1</span>
                    </div>
                    <div className="row">
                        <span>{gameInfo.score[1]}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Scorecard
