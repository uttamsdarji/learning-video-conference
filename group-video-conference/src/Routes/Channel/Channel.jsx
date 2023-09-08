import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createClient, createMicrophoneAndCameraTracks } from "agora-rtc-react";
import JoinCall from "./components/JoinCall";
import CoachScreen from "./components/CoachScreen";
import { getLocalStorage } from "../../utils/localstorage";
import { APP_ID, BACKEND_URL } from "../../utils/constants";
import { ToastContainer } from "react-toastify";
import { io } from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import "./Channel.scss";

const config = { mode: "rtc", codec: "vp9" };
const useClient = createClient(config);

const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const Channel = () => {
  const agoraEngine = useClient();
  const [username, setUsername] = useState("");
  const [skills, setSkills] = useState("");
  const [loading, setLoading] = useState(false);
  const [callJoined, setCallJoined] = useState(false);
  const [videoOn, setVideoOn] = useState(true);
  const [micOn, setMicOn] = useState(true);
  const [appToken, setAppToken] = useState("");
  const [users, setUsers] = useState({});
  const [usersMetaData, setUsersMetaData] = useState({});
  const [prompts, setPrompts] = useState([]);
  const localTrackReady = useMicrophoneAndCameraTracks().ready;
  const localTracks = useMicrophoneAndCameraTracks().tracks;
  const routerParams = useParams();
  const navigateTo = useNavigate();
  const channelName = routerParams?.channelName || "";
  let socket = null;
  useEffect(() => {
    socket = io(BACKEND_URL);
    socket.on("userDataUpdate", function (data) {
      setUsersMetaData(data?.[channelName]);
    });
    socket.on("promptForCoach", function (prompt) {
      setPrompts(prompts => {
        return [...prompts, prompt];
      });
    });
  }, []);
  useEffect(() => {
    if (!channelName) {
      navigateTo("/");
    }
  }, []);
  useEffect(() => {
    if (localTrackReady && localTracks?.length > 0) {
      localTracks[1].setEnabled(!!videoOn);
    }
  }, [videoOn]);
  useEffect(() => {
    if (localTrackReady && localTracks?.length > 0) {
      localTracks[0].setEnabled(!!micOn);
    }
  }, [micOn]);
  useEffect(() => {
    if (appToken) {
      joinCall();
    }
  }, [appToken]);
  const userData = getLocalStorage("video-user-data") || {};
  const userType = userData?.type || "";
  const userId = userData?.uid || "";
  const joinCall = async () => {
    agoraEngine.on("user-joined", async user => {
      setUsers(prevUsers => {
        return {
          ...prevUsers,
          [user.uid]: user,
        };
      });
    });
    agoraEngine.on("user-published", async (user, mediaType) => {
      await agoraEngine.subscribe(user, mediaType);
      console.log("subscribe success");
      setUsers(prevUsers => {
        return {
          ...prevUsers,
          [user.uid]: user,
        };
      });
      if (mediaType === "audio") {
        user.audioTrack?.play();
      }
    });

    agoraEngine.on("user-unpublished", (user, type) => {
      console.log("unpublished", user, type);
      if (type === "audio") {
        user.audioTrack?.stop();
      }
      setUsers(prevUsers => {
        return {
          ...prevUsers,
          [user.uid]: user,
        };
      });
    });

    agoraEngine.on("user-left", user => {
      console.log("leaving", user);
      setUsers(prevUsers => {
        let newUsers = { ...prevUsers };
        if (newUsers[user.uid]) {
          delete newUsers[user.uid];
        }
        return newUsers;
      });
    });
    await agoraEngine.join(APP_ID, channelName, appToken, userId);
    await agoraEngine.publish([localTracks[0], localTracks[1]]);
    if (userType == "coach") {
      fetch(`${BACKEND_URL}/intiate-prompts`);
    }
    setCallJoined(true);
    setLoading(false);
  };
  const leaveCall = async () => {
    localTracks?.[0]?.close();
    localTracks?.[1]?.close();
    await agoraEngine.leave();
    window.location.reload();
  };
  return (
    <div className="channel-page">
      {!callJoined && (
        <JoinCall
          ready={localTrackReady}
          tracks={localTracks}
          channelName={channelName}
          userType={userType}
          username={username}
          setUsername={setUsername}
          skills={skills}
          setSkills={setSkills}
          videoOn={videoOn}
          setVideoOn={setVideoOn}
          micOn={micOn}
          setMicOn={setMicOn}
          setAppToken={setAppToken}
          loading={loading}
          setLoading={setLoading}
        />
      )}
      {!!callJoined && (
        <CoachScreen
          channelName={channelName}
          localTracks={localTracks}
          videoOn={videoOn}
          setVideoOn={setVideoOn}
          micOn={micOn}
          setMicOn={setMicOn}
          leaveCall={leaveCall}
          localUserName={username}
          userType={userType}
          userId={userId}
          remoteUsers={Object.values(users)}
          usersMetaData={usersMetaData}
          prompts={prompts}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default Channel;
