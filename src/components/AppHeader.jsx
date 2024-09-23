import React from "react";
import { Layout, Button } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoginOutlined,
} from "@ant-design/icons";
import Logo from "./Logo";

const { Header } = Layout;

const AppHeader = ({
  collapsed,
  setCollapsed,
  handleLogout,
  colorBgContainer,
}) => {
  return (
    <Header
      style={{
        padding: 0,
        background: colorBgContainer,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <Button
        type="text"
        className="toggle"
        onClick={() => setCollapsed(!collapsed)}
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      />
      <Logo />
      <Button
        type="text"
        className="logout-button"
        icon={<LoginOutlined />}
        onClick={handleLogout}
      >
        Logout
      </Button>
    </Header>
  );
};

export default AppHeader;
