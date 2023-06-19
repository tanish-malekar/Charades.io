import React, { useState, useContext } from "react";
import { useParams } from 'react-router';
import { SocketContext } from "../SocketContext";
import Team from "./Team"

function Teams(){
    const {gameInfo, joinTeam1, joinTeam2} =  useContext(SocketContext);

    const { roomid } = useParams();

    function joinTeam1Click(){
        joinTeam1(roomid);
        //disable other button
    }

    function joinTeam2Click(){
        joinTeam2(roomid);
        //disable other button
    }



    return <div className="teams">
        <div className="row teams-row">
            <div className="col">
                 <Team teamLeaders={gameInfo.teamLeaders} teamMembers={gameInfo.team1} teamNumber={1}/>
                 <button onClick={joinTeam1Click} type="button" class="join-team-btn custom-btn" >Join Team1</button>
             </div>
            <div className="col">
                <Team teamLeaders={gameInfo.teamLeaders} teamMembers={gameInfo.team2} teamNumber={2}/>
                <button onClick={joinTeam2Click} type="button" class="join-team-btn custom-btn" >Join Team2</button>
            </div>
        </div>
    </div>
}

export default Teams;