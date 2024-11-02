import React, { useEffect, useState } from "react";
import logo from "./images/User.png"; // استيراد الشعار
import { fetchUserData } from "../api/userAPI";
import { useUserContext } from "../contexts/UserContext";

const UserProfile = ({ userType }) => {
  const { userData, setUserData } = useUserContext();

  useEffect(() => {
    const getUserData = async () => {
      try {
        const data = await fetchUserData(); // جلب بيانات المستخدم باستخدام التوكن
        console.log("User data fetched:", data);
        setUserData(data); // حفظ بيانات المستخدم في الحالة
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };
    getUserData();
  }, []);
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
          style={{
            fontWeight: "bold",
            fontSize: "15px",
            color: "#1c2229",
            marginRight: "10px",
            whiteSpace: "nowrap",
          }}
        >
          {/* عرض اسم المستخدم إذا كان متوفرًا، وإلا عرض نوع المستخدم */}
          {userData ? userData.full_name : getUserRole(userType)}
        </span>
      </div>
      <div className="UserIcon" style={{ marginRight: "20px" }}>
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
