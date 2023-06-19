import React, { useContext, useEffect, useState } from "react";

import { SocketContext } from '../SocketContext';

import {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from "agora-rtc-react";

const config = { 
  mode: "rtc", codec: "vp8",
};

// const appId = "67635c23f8f64cacaa81556a069b9167";
// const token = "00667635c23f8f64cacaa81556a069b9167IADnfhPuJgjxyKYnwGpPKt5XCdULUNMGGmc1OWABEQpo4hQz4JIAAAAAEACLgpZhZ8koYQEAAQCWyShh";

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const VideoCalls = (props) => {
    const { setInCall, channelName } = props;
    const [users, setUsers] = useState([]);
    const [start, setStart] = useState(false);
    const client = useClient();
    const { ready, tracks } = useMicrophoneAndCameraTracks();
    const { gameInfo, socketIDRef } = useContext(SocketContext);
    useEffect(() => {
      //temp code
      var appId = "29fef50d049e4c9ab92eb8c716146437";
      // var token ="";
      // if(channelName==="CM"){
      //   appId = "67635c23f8f64cacaa81556a069b9167";
      //   token = "00667635c23f8f64cacaa81556a069b9167IAB0sPzH/0EBPAn4SWYW0432Khu943Gzahzl7v6L1uFPrRQz4JIAAAAAEADn8NlKRjUrYQEAAQB3NSth";
      // }else if(channelName==="CA"){
      //   appId ="67635c23f8f64cacaa81556a069b9167"
      //   token = "00667635c23f8f64cacaa81556a069b9167IADeut/z+AzJQnRGPCmATFrSM76YL3Jw3DxIahszFW7VIj9/VpsAAAAAEADn8NlKkDUrYQEAAQDANSth"
      // }else if(channelName==="GM"){
      //   appId = "67635c23f8f64cacaa81556a069b9167"
      //   token = "00667635c23f8f64cacaa81556a069b9167IABV6u+sJ0TzHx/iDzubImpChPoleNE98CCqnw3CnCLNgRD2jPYAAAAAEADn8NlKpDUrYQEAAQDUNSth"
      // }
      
      // function to initialise the SDK
      let init = async (name) => {
        await client.leave();
        client.removeAllListeners();
        
        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          console.log("subscribe success");
          if (mediaType === "video") {
            setUsers((prevUsers) => {
              return [...prevUsers, user];
            });
          }
          if (mediaType === "audio") {
            user.audioTrack?.play();
          }
        });
  
        client.on("user-unpublished", (user, type) => {
          console.log("unpublished", user, type);
          if (type === "audio") {
            user.audioTrack?.stop();
          }
          if (type === "video") {
            setUsers((prevUsers) => {
              return prevUsers.filter((User) => User.uid !== user.uid);
            });
          }
        });
  
        client.on("user-left", (user) => {
          console.log("leaving", user);
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        });
  
        await client.join(appId, name, null, null);
        // if(gameInfo.actor===socketIDRef.current){
        //   if (tracks) await tracks[0].setEnabled(false);
        // }
        if (tracks) await client.publish([tracks[0], tracks[1]]);
        setStart(true);
  
      };
  
      if (ready && tracks) {
        console.log("init ready");
        init(channelName);
      }
  
    }, [channelName, client, ready, tracks]);
  
    return (
      <div className="App">
        {start && tracks && <Videos users={users} tracks={tracks} />}
        {ready && tracks && (
          <Controls tracks={tracks} setStart={setStart} setInCall={setInCall} />
        )}
      </div>
    );
  };
  
  const Videos = (props) => {
    const { users, tracks } = props;
  
    return (
      <div>
        <div id="videos">
          <AgoraVideoPlayer className='vid' videoTrack={tracks[1]} />
          {users.length > 0 &&
            users.map((user) => {
              if (user.videoTrack) {
                return (
                  <AgoraVideoPlayer className='vid' videoTrack={user.videoTrack} key={user.uid} />
                );
              } else return null;
            })}
        </div>
      </div>
    );
  };
  
  export const Controls = (props) => {
    const { gameInfo, socketIDRef } = useContext(SocketContext);
    const client = useClient();
    const { tracks, setStart, setInCall } = props;
    const [trackState, setTrackState] = useState({ video: true, audio: true });

    
    
    const mute = async (type) => {
      if (type === "audio") {
        await tracks[0].setEnabled(!trackState.audio);
        setTrackState((ps) => {
          return { ...ps, audio: !ps.audio };
        });
      } else if (type === "video") {
        await tracks[1].setEnabled(!trackState.video);
        setTrackState((ps) => {
          return { ...ps, video: !ps.video };
        });
      }
    };
    
    const leaveChannel = async () => {
      await client.leave();
      client.removeAllListeners();
      tracks[0].close();
      tracks[1].close();
      setStart(false);
      setInCall(false);
    };


  
    return (
      <div className="controls">
      {gameInfo.actor!=socketIDRef.current
      ?<button className={trackState.audio ? "on control-btn" : "control-btn"}
          onClick={() => mute("audio")}>
          {trackState.audio ? "Mute Audio" : "Unmute Audio"}
        </button>
        :<button className={trackState.audio ? "on control-btn" : "control-btn"}>
          {"Cannot Unmute"}
        </button>}
        
        <button className={trackState.video ? "on control-btn" : "control-btn"}
          onClick={() => mute("video")}>
          {trackState.video ? "Mute Video" : "Unmute Video"}
        </button>
      </div>
    );
  };
  
  const ChannelForm = (props) => {
    const { setInCall, setChannelName } = props;
  
    return (
      <form className="join">
        <input type="text"
          placeholder="Enter Channel Name"
          onChange={(e) => setChannelName(e.target.value)}
        />
        <button onClick={(e) => {
          e.preventDefault();
          setInCall(true);
        }}>
          Join
        </button>
      </form>
    );
  };
  

export default VideoCalls
