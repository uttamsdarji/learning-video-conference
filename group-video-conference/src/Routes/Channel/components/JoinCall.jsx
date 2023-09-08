import React, { useEffect, useState } from "react";
import { AgoraVideoPlayer } from "agora-rtc-react";
import { getLocalStorage, addLocalStorage } from "../../../utils/localstorage";
import { getUid, BACKEND_URL } from "../../../utils/constants";
import Loader from "../../../components/Loader";
import "./JoinCall.scss";

const JoinCall = props => {
  const handleInputChange = e => {
    let name = e.target.name;
    let value = e.target.value;
    if (name == "skills") {
      props.setSkills(value);
    } else if (name == "username") {
      props.setUsername(value);
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    generateRtcToken();
  };
  const getUserData = () => {
    let userData = getLocalStorage("video-user-data") || null;
    userData = {
      uid: getUid(),
      name: props.username,
      type: props.userType || "member",
      skills: props.skills,
    };
    addLocalStorage("video-user-data", userData);
    return userData;
  };
  const generateRtcToken = () => {
    const channelName = props.channelName;
    let userData = getUserData();
    const uid = userData?.uid || 0;
    const userType = userData?.type || "member";
    const username = props.username;
    const skills = props.skills;
    props.setLoading(true);
    fetch(`${BACKEND_URL}/fetch-token?uid=${uid}&channelName=${window.encodeURIComponent(channelName)}&userType=${userType}&username=${window.encodeURIComponent(username)}&skills=${window.encodeURIComponent(skills)}`)
      .then(res => {
        return res.json();
      })
      .then(res => {
        props.setAppToken(res.token);
      })
      .catch(() => {
        props.setLoading(false);
      });
  };

  return (
    <div className="join-call-container">
      <h2 className="channel-name">{props.channelName}</h2>
      <div className="local-video-wrapper">
        <div className="local-video-container">
          {props.ready && props.tracks?.[1] && (
            <AgoraVideoPlayer
              videoTrack={props.tracks[1]}
              style={{ height: "100%", width: "100%" }}
            />
          )}
          {props.ready && false && (
            <div className="video-controls-container">
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
            </div>
          )}
        </div>
        <div className="user-data-container">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="channelName">Display Name:</label>
              <input
                type="text"
                id="username"
                name="username"
                value={props.username}
                onChange={handleInputChange}
                required
              />
            </div>
            {(!props.userType || props.userType == "member") && (
              <div className="form-group">
                <label htmlFor="channelName">Enter skills you want to learn:</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={props.skills}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}
            <button type="submit">Join</button>
          </form>
        </div>
      </div>
      {props.loading && (
        <div className="join-call-loader">
          <Loader loading={props.loading} />
        </div>
      )}
    </div>
  );
};

export default JoinCall;
