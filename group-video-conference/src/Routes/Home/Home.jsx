import React, { useState, useEffect } from "react";
import { getLocalStorage } from "../../utils/localstorage";
import { useNavigate } from "react-router-dom";
import "./Home.scss";

const Home = props => {
  const [channelName, setChannelName] = useState("");
  const navigateTo = useNavigate();
  useEffect(() => {
    let userData = getLocalStorage("video-user-data");
    if (!!userData) {
      if (!userData.uid || userData.type !== "coach") {
        navigateTo("/login");
      }
    } else {
      navigateTo("/login");
    }
  }, []);
  const handleInputChange = e => {
    setChannelName(e.target.value);
  };
  const handleSubmit = e => {
    e.preventDefault();
    navigateTo(`/channel/${window.encodeURIComponent(channelName)}`);
  };
  return (
    <div className="home-page">
      <div className="create-channel">
        <h2>Create a New Channel</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="channelName">Channel Name:</label>
            <input
              type="text"
              id="channelName"
              name="channelName"
              value={channelName}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
