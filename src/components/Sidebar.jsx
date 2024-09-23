import React from "react";
import { Layout } from "antd";
import UserLogo from "./UserLogo";
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";

const { Sider } = Layout;

const Sidebar = ({ collapsed, darkTheme, toggleTheme, userType }) => {
  return (
    <Sider
      width={266}
      collapsed={collapsed}
      className={collapsed ? "sidebar-closed" : ""}
      collapsible
      trigger={null}
      theme={darkTheme ? "dark" : "light"}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "25px",
        }}
      >
        <UserLogo />
        <span className="span">Supplier</span>
      </div>
      <MenuList darkTheme={darkTheme} userType={userType} />
      <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
    </Sider>
  );
};

export default Sidebar;
