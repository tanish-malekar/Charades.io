import React, { useState } from "react";

function Team(props){
    const Team = props.teamMembers;
    return <div className="team">
        <p className="team-heading"><b>Team{props.teamNumber}</b></p>
        {Team.map((member) => <p className="name">{member.name}{member.id==props.teamLeaders[props.teamNumber-1]?"(Team Leader)":null}</p>)}
    </div>
}

export default Team;