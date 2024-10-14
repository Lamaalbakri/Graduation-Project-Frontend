import React from "react";
import WelcomeCard from "./WelcomeCard ";
import Actions from "./Actions";
import Dashboard from "./Dashboard";
import "./HomeUser.css";
function HomeUser({ userType }) {
  const getWelcomeMessage = (userType) => {
    switch (userType) {
      case "supplier":
        return "Let's get started to manage your raw materials";
      case "transporter":
        return "Let's get started to manage your transportation requests";
      case "manufacturer":
        return " ";
      case "distributor":
        return " ";
      case "retailer":
        return " ";
      default:
        return "Welcome to the Supply Chain Management System";
    }
  };

  return (
    <div className="main-content">
      <WelcomeCard welcomeText={getWelcomeMessage(userType)} />
      <Actions userType={userType} />
      <Dashboard />
    </div>
  );
}

export default HomeUser;
