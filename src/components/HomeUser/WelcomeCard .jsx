import React from "react";
import p1 from "../images/homePageImg1.png";

const WelcomeCard = ({ welcomeText }) => {
  return (
    <div className="wrapper">
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome ..</h1>
        <p className="welcome-text">{welcomeText}</p>
      </div>
      <div className="P1">
        <img src={p1} alt="P1 Image" />
      </div>
    </div>
  );
};

export default WelcomeCard;
