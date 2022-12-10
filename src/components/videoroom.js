import React, { useEffect, useState, useRef } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./videoplayer";
import Controls from "./Controls";

const APP_ID = "18e4bd7f0eb7493396e3165db8da195f";
const TOKEN =
  "007eJxTYDh/9JPQyw03L13ffyAmi4f5gqqBwJSw03Z/b+itDbgV+EZNgcHQItUkKcU8zSA1ydzE0tjY0izV2NDMNCXJIiXR0NI07TjH5OSGQEaGWEMBRkYGCATxWRhyEzPzGBgA4H8gMw==";
const CHANNEL = "main";

export const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

export const VideoRoom = ({ setJoined }) => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  };

  const handleUserLeft = async (user) => {
    await client.unpublish(screensharetracks);

    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  useEffect(() => {
    client.on("user-published", handleUserJoined);
    client.on("user-left", handleUserLeft);

    client
      .join(APP_ID, CHANNEL, TOKEN, null)
      .then((uid) =>
        Promise.all([AgoraRTC.createMicrophoneAndCameraTracks(), uid])
      )
      .then(([tracks, uid]) => {
        const [audioTrack, videoTrack] = tracks;
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

    return () => {
      for (let localTrack of localTracks) {
        localTrack.stop();
        localTrack.close();
      }
      client.off("user-published", handleUserJoined);
      client.off("user-left", handleUserLeft);
      // client.unpublish(localTracks).then(() => client.leave());
    };
  }, []);
  const ref = useRef();
  // const [channelParameters, setchannelParameters] = useState([]);
  const [isSharingEnabled, setisSharingEnabled] = useState(false);
  const [screensharetracks, setscreensharetracks] = useState();
  const handlesharescreen = async (type) => {
    if (type) {
      const videoTrack = await AgoraRTC.createScreenVideoTrack();
      // Create a screen track for screen sharing.
      setscreensharetracks(videoTrack);

      await client.unpublish(localTracks);

      await client.publish(videoTrack);
      videoTrack.play(ref.current);
      setisSharingEnabled(type);
    } else {
      screensharetracks.stop();
      await client.unpublish(screensharetracks);
      await client.publish(localTracks);

      setisSharingEnabled(type);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <div ref={ref} style={{ width: "200px", height: "200px" }}></div>

        <Controls
          tracks={localTracks}
          handlesharescreen={handlesharescreen}
          isSharingEnabled={isSharingEnabled}
          client={client}
          setJoined={setJoined}
        />

        {users.map((user) => (
          <VideoPlayer
            key={user.uid}
            isSharingEnabled={isSharingEnabled}
            user={user}
          />
        ))}
      </div>
    </div>
  );
};
