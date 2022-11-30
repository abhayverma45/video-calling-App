import React, { useState } from "react";
// import AgoraRTC from "agora-rtc-sdk-ng";

import { Button } from "@material-ui/core";
import MicIcon from "@material-ui/icons/Mic";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamIcon from "@material-ui/icons/Videocam";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

export default function Controls(props) {
  const { tracks, setJoined, client } = props;
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
    setJoined(false);
  };

  // const screenshare = async () => {
  //   await AgoraRTC.createScreenVideoTrack();
  // };
  return (
    <>
      <div className="row">
        <div className="col">
          {" "}
          <Button
            variant="contained"
            color={trackState.audio ? "primary" : "secondary"}
            onClick={() => mute("audio")}
          >
            {trackState.audio ? <MicIcon /> : <MicOffIcon />}
          </Button>
        </div>
        <div className="col">
          {" "}
          <Button
            variant="contained"
            color={trackState.video ? "primary" : "secondary"}
            onClick={() => mute("video")}
          >
            {trackState.video ? <VideocamIcon /> : <VideocamOffIcon />}
          </Button>
        </div>
        <div className="col">
          {" "}
          <Button
            variant="contained"
            color="default"
            onClick={() => leaveChannel()}
          >
            Leave
            <ExitToAppIcon />
          </Button>
        </div>
        <div className="col">
          {" "}
          {/* <Button
            variant="contained"
            color="default"
            onClick={() => handlesharescreen(!isSharingEnabled)}
          >
            {isSharingEnabled ? "Stop Sharing" : "Share screen"}
          </Button> */}
        </div>
      </div>
    </>
  );
}
