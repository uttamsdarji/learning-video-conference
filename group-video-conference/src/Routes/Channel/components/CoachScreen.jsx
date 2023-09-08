import React, { useEffect, useRef } from "react";
import { toast } from "react-toastify";
import "./CoachScreen.scss";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { FRONTEND_URL } from "../../../utils/constants";
import VideoTile from "./VideoTile";
import { OverlayTrigger } from "react-bootstrap";

const CoachScreen = props => {
  const promptRef = useRef();
  useEffect(() => {
    if (promptRef.current) {
      promptRef.current.scrollTop = -promptRef.current.scrollHeight;
    }
  }, [props.prompts]);
  let remoteUsers = [...props.remoteUsers];
  if (props.userType != "coach") {
    remoteUsers = [
      {
        uid: props.userId,
        videoTrack: props.localTracks?.[1] || null,
        audioTrack: props.localTracks?.[0] || null,
        hasVideo: props.videoOn,
        hasAudio: props.micOn,
      },
      ...remoteUsers,
    ];
  }
  const copyLink = async () => {
    let text = `${FRONTEND_URL}/channel/${window.encodeURIComponent(props.channelName)}`;
    await navigator.clipboard.writeText(text);
    toast.success("Link Copied");
  };
  return (
    <div className="coach-screen">
      <div className={`coach-screen-grid ${props.userType != "coach" ? "member" : ""}`}>
        {remoteUsers?.length == 0 && (
          <div className="copy-link-wrapper">
            <div className="copy-link-container">
              <div className="copy-link-label">Share Meeting Link</div>
              <div className="copy-link-box">
                <div className="copy-link">
                  {FRONTEND_URL}/channel/{window.encodeURIComponent(props.channelName)}
                </div>
                <OverlayTrigger
                  placement="right"
                  trigger={["hover", "focus"]}
                  overlay={<div className="tooltip-overlay meta-data-cotnainer">Copy Link</div>}
                >
                  <div
                    className="copy-icon-container"
                    onClick={copyLink}
                  >
                    <span></span>
                  </div>
                </OverlayTrigger>
              </div>
            </div>
          </div>
        )}
        {remoteUsers?.length > 0 && (
          <div className="remote-users-grid">
            {remoteUsers.map(user => {
              let metaData = props.usersMetaData?.[user.uid];
              return (
                <VideoTile
                  key={user.uid}
                  data={user}
                  metaData={metaData}
                  showMetaData={props.userType == "coach"}
                />
              );
            })}
          </div>
        )}
        {props.userType == "coach" && (
          <div className="coach-container">
            <div className="coach-video-container">
              {props?.localTracks?.[1] && (
                <AgoraVideoPlayer
                  videoTrack={props?.localTracks?.[1]}
                  style={{ height: "200px", width: "100%" }}
                />
              )}
              {!props.videoOn && props.localUserName && <div className="video-off-name">{props.localUserName.trim()[0]}</div>}
              {props.localUserName && <div className="video-username">{props.localUserName} (Coach)</div>}
              {!props.micOn && <div className="mic-off"></div>}
            </div>
            <div className="prompts-container">
              <div className="prompts-title">Tips</div>
              <div
                className="prompts-list"
                ref={promptRef}
              >
                {props.prompts?.length > 0 &&
                  props.prompts.map((prompt, index) => {
                    return (
                      <div
                        className="prompt prompt-flash"
                        key={index}
                      >
                        {prompt}
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="video-controls-container">
        <div className="channel-name">{props.channelName}</div>
        <div
          className={`${props.micOn ? "on" : "off"} mic video-control`}
          onClick={() => props.setMicOn(!props.micOn)}
        >
          <span className="control-icon"></span>
        </div>
        <div
          className={`${props.videoOn ? "on" : "off"} video video-control`}
          onClick={() => props.setVideoOn(!props.videoOn)}
        >
          <span className="control-icon"></span>
        </div>
        <div
          className={`off end-call video-control`}
          onClick={() => props.leaveCall()}
        >
          <span className="control-icon"></span>
        </div>
      </div>
    </div>
  );
};

export default CoachScreen;
