import React from "react";
import { useParams } from "react-router-dom";
import WelcomeCard from "./WelcomeCard ";
import Actions from "./Actions";
import Dashboard from "./Dashboard";
import "./HomeUser.css";
function HomeUser({ userType, userId }) {
  const getWelcomeMessage = (userType) => {
    switch (userType) {
      case "supplier":
        return "Let's get started to manage your raw materials";
      case "transporter":
        return "Let's get started to manage your transportation requests";
      case "manufacturer":
        return "Let's get started to manage your production process and boost efficiency";
      case "distributor":
        return "Let's get started to manage your goods and streamline deliveries";
      case "retailer":
        return "Let's start managing your retail inventory and boosting customer satisfaction";
      default:
        return "Welcome to Our System 'Smart Contract for Supply Chain Management and Optimization' ";
    }
  };

  return (
    <div className="main-content">
      <WelcomeCard welcomeText={getWelcomeMessage(userType)} />
      <Actions userType={userType} userId={userId} />
      <Dashboard />
    </div>
  );
}

export default HomeUser;
