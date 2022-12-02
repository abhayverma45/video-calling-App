import React, { useState, useEffect } from "react";
import "./App.css";

import { VideoRoom } from "./components/videoroom";
import HashLoader from "react-spinners/ClimbingBoxLoader";

const AgoraMeeting = () => {
  const [joined, setJoined] = useState(false);

  const [loading, setloading] = useState(false);
  useEffect(() => {
    setloading(true);
    setTimeout(() => {
      setloading(false);
    }, 3000);
  }, []);
  return (
    <div>
      {loading ? (
        <div className="preloader">
          <HashLoader
            color={"#0e0601"}
            loading={loading}
            size={25}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </div>
      ) : (
        <div style={{ backgroundColor: "white", height: "1000px" }}>
          <div className="main_page">
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
          </div>

          {joined && <VideoRoom setJoined={setJoined} />}
        </div>
      )}
    </div>
  );
};

export default AgoraMeeting;
