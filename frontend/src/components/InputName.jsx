import React, { useContext, useEffect } from "react";
import {SocketContext} from '../SocketContext'
import { useParams } from 'react-router';


function InputName(){
    const {setName, name, teams, socketID, setTeams, changeName} = useContext(SocketContext);
    const { roomid } = useParams();
    function inputOnChange(e){
        changeName(roomid, e.target.value);
    }

   

    return (<div className="input-name">
        <h4 className="input-name-heading">my name is</h4>
        <input className="input-name-textbox" onChange={inputOnChange} value={name} type="text" id="name" name="name" autocomplete="off"></input>
    </div>);
}

export default InputName;