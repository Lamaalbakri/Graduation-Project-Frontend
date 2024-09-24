import React from "react";
import WelcomeCard from "./WelcomeCard ";
import Actions from "./Actions";
import Dashboard from "./Dashboard";
import "./HomeUser.css";

function HomeUser() {
  return (
    <div className="main-content">
      <WelcomeCard
        welcomeText={"Let's get started to manage your raw materials"}
      />
      <Actions />
      <Dashboard />
    </div>
  );
}

export default HomeUser;
