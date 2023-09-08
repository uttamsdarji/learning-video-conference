import React from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { OverlayTrigger } from "react-bootstrap";
import "./VideoTile.scss";

const VideoTile = props => {
  const data = props.data;
  let videoOn = !!data?.hasVideo;
  let micOn = !!data?.hasAudio;
  let metaData = props.metaData;
  let username = metaData?.username || "";
  let skills = metaData?.skills || "";
  let userType = metaData?.userType || "";
  return (
    <div className={`video-tile-wrapper ${userType == "coach" ? "coach" : ""}`}>
      {data?.videoTrack && (
        <AgoraVideoPlayer
          videoTrack={data.videoTrack}
          style={{ height: "100%", width: "100%" }}
        />
      )}
      {!videoOn && username && <div className="video-off-name">{username.trim()[0]}</div>}
      {username && (
        <div className="video-username">
          {username}
          {userType == "coach" ? " (Coach)" : ""}
        </div>
      )}
      {!micOn && <div className="mic-off"></div>}
      {userType == "member" && !!props.showMetaData && (
        <OverlayTrigger
          placement="right"
          trigger={["click"]}
          overlay={
            <div className="tooltip-overlay meta-data-cotnainer">
              <div>
                <span className="data-label">Name: </span>
                <span className="data-value">{username}</span>
              </div>
              <div>
                <span className="data-label">Skills: </span>
                <span className="data-value">{skills}</span>
              </div>
            </div>
          }
        >
          <div className="info-icon"></div>
        </OverlayTrigger>
      )}
    </div>
  );
};

export default VideoTile;
