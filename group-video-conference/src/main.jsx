import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Routes/Home/Home";
import Channel from "./Routes/Channel/Channel";
import Login from "./Routes/Login/Login";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route
        exact
        path="/"
        element={<Home />}
      />
      <Route
        exact
        path="/login"
        element={<Login />}
      />
      <Route
        exact
        path="/channel/:channelName"
        element={<Channel />}
      />
      <Route
        exact
        path="/channel"
        element={<Channel />}
      />
    </Routes>
  </BrowserRouter>
);
