import React, {useContext, useState} from 'react';
import { SocketContext } from '../SocketContext';
import { useTimer } from 'react-timer-hook';

function Timer({hoursMinSecs}){
   
  const { hours = 0, minutes = 0, seconds = 60 } = hoursMinSecs;
  const [[hrs, mins, secs], setTime] = React.useState([hours, minutes, seconds]);
  const [timerStarted, setTimerStarted] = useState(0);
  const {roundOver, setRoundOver} = useContext(SocketContext);


  const tick = () => {
 
      if (hrs === 0 && mins === 0 && secs === 0){
        console.log(timerStarted);
        if(timerStarted===0){
          setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
          setTimerStarted(1);
        }else{
          setRoundOver(true);
        }
      } 
      else if (mins === 0 && secs === 0) {
          setTime([hrs - 1, 59, 59]);
      } else if (secs === 0) {
          setTime([hrs, mins - 1, 59]);
      } else {
          setTime([hrs, mins, secs - 1]);
      }
  };



  
  React.useEffect(() => {
      setTimerStarted(false);
      const timerId = setInterval(() => tick(), 1000);
      return () => clearInterval(timerId);
  });

  
  return (
      <div>
          <p>{`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`}</p> 
      </div>
  );
}

export default Timer
