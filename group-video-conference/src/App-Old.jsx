import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

import AgoraRTC from "agora-rtc-sdk-ng";
const APP_ID = "07d64092f3d24c3aa528ba0fc23d3b2b";
const CHANNEL_NAME = "coaching-session";
const TEMP_TOKEN = "007eJxTYNi7027Codtq3SzC9y91CwZs35/3uWL+T6EL5xuz117/dOihAoOBeYqZiYGlUZpxipFJsnFioqmRRVKiQVqykXGKcZJRknz5z5SGQEaGKb9kmRkZIBDEF2BIzk9MzsjMS9ctTi0uzszPY2AAABBTJ8I=";

let options = {
  // Pass your App ID here.
  appId: APP_ID,
  // Set the channel name.
  channel: CHANNEL_NAME,
  // Pass your temp token here.
  token: TEMP_TOKEN,
  // Set the user ID.
  // uid: 1,
};

let channelParameters = {
  // A variable to hold a local audio track.
  localAudioTrack: null,
  // A variable to hold a local video track.
  localVideoTrack: null,
  // A variable to hold a remote audio track.
  remoteAudioTrack: null,
  // A variable to hold a remote video track.
  remoteVideoTrack: null,
  // A variable to hold the remote user id.s
  remoteUid: null,
};

// Create an instance of the Agora Engine
const agoraEngine = AgoraRTC.createClient({ mode: "rtc", codec: "vp9" });
// Dynamically create a container in the form of a DIV element to play the remote video track.
const remotePlayerContainer = document.createElement("div");
// Dynamically create a container in the form of a DIV element to play the local video track.
const localPlayerContainer = document.createElement("div");

function App() {
  useEffect(() => {
    startBasicCall();
  }, []);
  const startBasicCall = async () => {
    // Specify the ID of the DIV container. You can use the uid of the local user.
    // localPlayerContainer.id = options.uid;
    // Set the textContent property of the local video container to the local user id.
    localPlayerContainer.textContent = "Local user " + options.uid || "";
    // Set the local video container size.
    localPlayerContainer.style.width = "640px";
    localPlayerContainer.style.height = "480px";
    localPlayerContainer.style.padding = "15px 5px 5px 5px";
    // Set the remote video container size.
    remotePlayerContainer.style.width = "640px";
    remotePlayerContainer.style.height = "480px";
    remotePlayerContainer.style.padding = "15px 5px 5px 5px";
    // Listen for the "user-published" event to retrieve a AgoraRTCRemoteUser object.
    agoraEngine.on("user-published", async (user, mediaType) => {
      // Subscribe to the remote user when the SDK triggers the "user-published" event.
      await agoraEngine.subscribe(user, mediaType);
      console.log("subscribe success");
      // Subscribe and play the remote video in the container If the remote user publishes a video track.
      if (mediaType == "video") {
        // Retrieve the remote video track.
        channelParameters.remoteVideoTrack = user.videoTrack;
        // Retrieve the remote audio track.
        channelParameters.remoteAudioTrack = user.audioTrack;
        // Save the remote user id for reuse.
        channelParameters.remoteUid = user.uid.toString();
        // Specify the ID of the DIV container. You can use the uid of the remote user.
        remotePlayerContainer.id = user.uid.toString();
        channelParameters.remoteUid = user.uid.toString();
        remotePlayerContainer.textContent = "Remote user " + user.uid.toString();
        // Append the remote container to the page body.
        document.body.append(remotePlayerContainer);
        // Play the remote video track.
        channelParameters.remoteVideoTrack.play(remotePlayerContainer);
      }
      // Subscribe and play the remote audio track If the remote user publishes the audio track only.
      if (mediaType == "audio") {
        // Get the RemoteAudioTrack object in the AgoraRTCRemoteUser object.
        channelParameters.remoteAudioTrack = user.audioTrack;
        // Play the remote audio track. No need to pass any DOM element.
        channelParameters.remoteAudioTrack.play();
      }
      // Listen for the "user-unpublished" event.
      agoraEngine.on("user-unpublished", user => {
        console.log(user.uid + "has left the channel");
      });
    });
  };
  const joinCall = async () => {
    // Join a channel.
    await agoraEngine.join(options.appId, options.channel, options.token, options.uid);
    // Create a local audio track from the audio sampled by a microphone.
    channelParameters.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    // Create a local video track from the video captured by a camera.
    channelParameters.localVideoTrack = await AgoraRTC.createCameraVideoTrack();
    // Append the local video container to the page body.
    document.body.append(localPlayerContainer);
    // Publish the local audio and video tracks in the channel.
    await agoraEngine.publish([channelParameters.localAudioTrack, channelParameters.localVideoTrack]);
    // Play the local video track.
    channelParameters.localVideoTrack.play(localPlayerContainer);
    console.log("publish success!");
  };
  const leaveCall = async () => {
    // Destroy the local audio and video tracks.
    channelParameters.localAudioTrack.close();
    channelParameters.localVideoTrack.close();
    // Remove the containers you created for the local video and remote video.
    removeVideoDiv(remotePlayerContainer.id);
    removeVideoDiv(localPlayerContainer.id);
    // Leave the channel
    await agoraEngine.leave();
    console.log("You left the channel");
    // Refresh the page for reuse
    window.location.reload();
  };
  const removeVideoDiv = elementId => {
    console.log("Removing " + elementId + "Div");
    let Div = document.getElementById(elementId);
    if (Div) {
      Div.remove();
    }
  };
  return (
    <>
      <h2 className="left-align">Get started with video calling</h2>
      <div className="row">
        <div>
          <button
            type="button"
            id="join"
            onClick={joinCall}
          >
            Join
          </button>
          <button
            type="button"
            id="leave"
            onClick={leaveCall}
          >
            Leave
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
