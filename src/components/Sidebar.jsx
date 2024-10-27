import React from "react";
import { Layout } from "antd";
import Logo from "./Logo";
import MenuList from "./MenuList";
import ToggleThemeButton from "./ToggleThemeButton";

const { Sider } = Layout;

const Sidebar = ({ collapsed, darkTheme, toggleTheme, userType, userId }) => {
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
        <Logo />
      </div>
      <MenuList darkTheme={darkTheme} userType={userType} userId={userId} />
      <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
    </Sider>
  );
};

export default Sidebar;
