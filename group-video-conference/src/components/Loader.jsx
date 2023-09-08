import React from "react";
import spinner from "../assets/loader.gif";
import "./Loader.scss";

const Loader = props => {
  return (
    <>
      {props.loading ? (
        <div className="loader">
          <img
            className="indicator"
            src={spinner}
            alt="Loading..."
          />
        </div>
      ) : (
        props.children
      )}
    </>
  );
};

export default Loader;
