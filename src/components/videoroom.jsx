import AgoraRTC from "agora-rtc-sdk-ng";
import React, { useEffect,useState } from "react";
import { Videoplayer } from "./videoplayer";



const APP_ID = "18e4bd7f0eb7493396e3165db8da195f";
const Token ="007eJxTYGgTcQ/oOHTp0N8mrXMBVznvnBEoknnnHqvnwnOk5fc336sKDIYWqSZJKeZpBqlJ5iaWxsaWZqnGhmamKUkWKYmGlqZpu04kJzcEMjI0T5zNzMgAgSA+F0NZZkpqvm5yYk4OAwMAaT0jAw==";

const Channel = "video-call";
const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const Videoroom = () => {
  const [users, setUsers] = useState([]);

  const[localTracks,setLocalTracks]=useState([]);

  const handleUserJoined=async (user,mediaType)=>{
    await client.subscribe(user,mediaType)
  };
  if(mediaType==="video"){
    setUsers((previousUsers)=>[...previousUsers,user])
  }
  if(mediaType==="audio"){
    // user.audioTrack.play()
  }

  const handleUserLeft=(user)=>{
    setUsers((previousUsers)=>
    previousUsers.filter((u)=>u.uid !==user.uid)

     ) };

  useEffect(() => {
    client.on("user-published",handleUserJoined);
    client.on("user-left",handleUserLeft);
    client
      .join(APP_ID, Channel, Token, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack,videoTrack] = tracks;
        setLocalTracks(tracks);

        setUsers((previousUsers) => [
          ...previousUsers,
          {
            uid,
            videoTrack,
            audioTrack,
          },
        ]);

        client.publish(tracks);
      });
      return ()=>{
        for (let localTracks of localTracks){
          localTracks.stop();
          localTracks.close();
        }
        client.off("user-published",handleUserJoined);
        client.off("user-left",handleUserLeft);
        client.off()
        client.unpublish(tracks).then(()=>client.leave());

      }
  }, []);

  return (
    <div style={{display:"flex",justifyContent:"center"}}>
      <div style={{display:"grid",gridTemplateColumns: "repeat(2.200px)"}}></div>


{users.map((user) => (

<Videoplayer key={user.uid} user= {user}/>
      ))}
    </div>
  );
};
export default Videoroom;
