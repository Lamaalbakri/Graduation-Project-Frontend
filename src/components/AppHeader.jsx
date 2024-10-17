import React, { useState } from "react";
import { Layout, Button, Dropdown, Menu, Badge } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoginOutlined,
  SettingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import UserProfile from "./UserProfile";
import { Link, useNavigate } from "react-router-dom";
const { Header } = Layout;

const AppHeader = ({
  collapsed,
  setCollapsed,
  handleLogout,
  colorBgContainer,
  userType,
}) => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0); //  Number of items in the shopping cart
  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/edit-account">Edit Account</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<LoginOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );
  // Show shopping Cart icon only for users who purchase
  const showCartButton = ["manufacturer", "distributor", "retailer"].includes(
    userType
  );

  // Function to update an item number in the cart
  const updateCart = () => {
    setCartItemCount(cartItemCount + 1);
  };

  // Function to handle navigation to the cart page
  const handleCartClick = () => {
    navigate("/shoppingCarts"); //
  };

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
        {showCartButton && (
          <Button
            type="text"
            style={{ marginRight: 5, position: "relative", padding: 10 }}
            onClick={handleCartClick}
          >
            <Badge
              count={cartItemCount}
              overflowCount={99}
              offset={[6, -1]}
              style={{
                fontSize: "10px",
                height: "14px",
                minWidth: "14px",
                lineHeight: "14px",
              }}
            >
              <ShoppingCartOutlined style={{ fontSize: "20px" }} />
            </Badge>
          </Button>
        )}

        <Dropdown overlay={menu} trigger={["click"]}>
          <Button
            type="text"
            icon={<SettingOutlined style={{ fontSize: "20px" }} />}
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
