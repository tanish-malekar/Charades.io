import React from 'react'
import Title from '../components/Title'
import {useHistory} from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid';

function Home() {
    let history = useHistory();
    function startNewGame(){
        history.push(`/${uuidv4()}`)
    }


    return (
        <div className="home">
            <Title />
            <button onClick={startNewGame} class="custom-btn" id="new-game-btn">New Game</button>
        </div>
    )
}

export default Home
