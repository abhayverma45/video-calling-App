import React, { useState } from "react";

import { VideoRoom } from "./components/videoroom";

const AgoraMeeting = () => {
  const [joined, setJoined] = useState(false);
  return (
    <div style={{ backgroundColor: "white", height: "1000px" }}>
      <h1>video-calling-app</h1>

      {!joined && (
        <button
          type="button"
          className="zefy_CTA_01_small_bg_black px-5"
          onClick={() => setJoined(true)}
        >
          Join Room
        </button>
      )}

      {joined && <VideoRoom setJoined={setJoined} />}
    </div>
  );
};

export default AgoraMeeting;
