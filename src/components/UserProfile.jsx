import React from "react";
import logo from "./images/User.png"; // استيراد الشعار

const UserProfile = ({ userType }) => {
  const getUserRole = (userType) => {
    switch (userType) {
      case "supplier":
        return "Supplier";
      case "transporter":
        return "Transporter";
      case "manufacturer":
        return "Manufacturer";
      case "distributor":
        return "Distributor";
      case "retailer":
        return "Retailer";
      default:
        return "User";
    }
  };
  return (
    <div className="UserProfile">
      <div className="UserInfo">
        <span
          style={{ fontWeight: "bold", color: "#1c2229", marginRight: "10px" }}
        >
          {getUserRole(userType)}
        </span>
      </div>
      <div className="UserIcon" style={{ marginRight: "10px" }}>
        <img
          src={logo}
          alt="User Logo"
          style={{ width: "70px", height: "50px" }}
        />
      </div>
    </div>
  );
};

export default UserProfile;
