import React, { useState, useEffect } from "react";
import { getLocalStorage, addLocalStorage, deleteLocalStorage } from "../../utils/localstorage";
import { getUid } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import "./Login.scss";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const navigateTo = useNavigate();
  useEffect(() => {
    let userData = getLocalStorage("video-user-data");
    if (!!userData) {
      if (userData?.uid && userData?.type === "coach") {
        navigateTo("/");
      } else {
        deleteLocalStorage("video-user-data");
      }
    }
  }, []);
  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    let userName = formData.username;
    let password = formData.password;
    if (userName == "test" && password == "test") {
      setError(null);
      let userData = {
        uid: getUid(),
        name: "Coach Test",
        type: "coach",
      };
      addLocalStorage("video-user-data", userData);
      navigateTo("/");
    } else {
      setError("Invalid Credentials");
    }
  };
  return (
    <div className="login-page">
      <div className="login-container">
        <h2>Coach Login</h2>
        {error && <div className="error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
