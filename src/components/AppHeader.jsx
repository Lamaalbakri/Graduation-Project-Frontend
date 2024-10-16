import React from "react";
import { Layout, Button, Dropdown, Menu } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoginOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import UserProfile from "./UserProfile";

const { Header } = Layout;

const AppHeader = ({
  collapsed,
  setCollapsed,
  handleLogout,
  colorBgContainer,
  userType,
}) => {
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        Edit Account
      </Menu.Item>
      <Menu.Item key="2" icon={<LoginOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
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
      <div style={{ display: "flex", alignItems: "center", marginRight: "1%" }}>
        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            type="text"
            icon={<SettingOutlined />}
            style={{ marginLeft: 10 }}
          />
        </Dropdown>
        <span
          style={{
            borderLeft: "2px solid #d3d3d3",
            height: "24px",
            margin: "0 10px",
          }}
        ></span>
        <UserProfile userType={userType} />
      </div>
    </Header>
  );
};

export default AppHeader;
