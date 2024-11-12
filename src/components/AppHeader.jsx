import React, { useState, useEffect } from "react";
import { Layout, Button, Dropdown, Menu, Badge, List, Typography } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LoginOutlined,
  SettingOutlined,
  UserOutlined,
  ShoppingCartOutlined,
  BellOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import UserProfile from "./UserProfile";
import { Link, useNavigate } from "react-router-dom";
import { fetchShoppingBasketList } from "../api/shoppingBasket";
import "./AppHeader.css"; // Import the CSS file

const { Header } = Layout;
const { Text } = Typography;

const AppHeader = ({
  collapsed,
  setCollapsed,
  handleLogout,
  colorBgContainer,
  userType,
}) => {
  const navigate = useNavigate();
  const [cartItemCount, setCartItemCount] = useState(0); // Number of items in the shopping cart
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "Order Shipped",
      description: "Shipping order with ID #2378467 is on its way",
      status: "success",
    },
    {
      id: 2,
      type: "Order Processed",
      description: "Your order with ID #1276432 was processed",
      status: "success",
    },
    {
      id: 3,
      type: "Order Canceled",
      description: "The order with ID #5965247 was canceled",
      status: "error",
    },

    {
      id: 4,
      type: "Order Processed",
      description: "Your order with ID #1276432 was processed",
      status: "success",
    },

    {
      id: 5,
      type: "Order Processed",
      description: "Your order with ID #1276432 was processed",
      status: "success",
    },

    {
      id: 6,
      type: "Order Processed",
      description: "Your order with ID #1276432 was processed",
      status: "success",
    },
  ]);

  const menu = (
    <Menu>
      <Menu.Item key="1" icon={<UserOutlined />}>
        <Link to="/edit-account/:userId">Edit Account</Link>
      </Menu.Item>
      <Menu.Item key="2" icon={<LoginOutlined />} onClick={handleLogout}>
        Logout
      </Menu.Item>
    </Menu>
  );

  const showCartButton = ["manufacturer", "distributor", "retailer"].includes(
    userType
  );

  const shownotificationButton = [
    "manufacturer",
    "distributor",
    "retailer",
  ].includes(userType);

  useEffect(() => {
    const fetchCartItemCount = async () => {
      try {
        const data = await fetchShoppingBasketList();
        if (data && !data.error) {
          const totalItems = data.numberOfBasketItems;
          setCartItemCount(totalItems);
        }
      } catch (err) {
        console.error("Failed to fetch cart item count:", err);
      }
    };
    fetchCartItemCount();
  }, [cartItemCount]);

  const handleCartClick = () => {
    navigate(`/shoppingBaskets`);
  };

  const notificationMenu = (
    <div className="notification-menu">
      <BellOutlined style={{ fontSize: "20px" }} />
      <Text strong>Notifications</Text>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={(item) => (
          <List.Item className="notification-item">
            <List.Item.Meta
              avatar={
                <span className={`notification-icon ${item.status}`}>
                  {item.status === "success" ? (
                    <CheckCircleOutlined />
                  ) : (
                    <CloseCircleOutlined />
                  )}
                </span>
              }
              title={<Text strong>{item.type}</Text>}
              description={
                <Text type="secondary" style={{ fontWeight: "500" }}>
                  {item.description}
                </Text>
              }
            />
          </List.Item>
        )}
      />
      {notifications.length === 0 && (
        <Text type="secondary">No new notifications</Text>
      )}
    </div>
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
        {shownotificationButton && (
          <Dropdown
            overlay={notificationMenu}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Button
              type="text"
              style={{ marginRight: 0, position: "relative", padding: 10 }}
              onClick={(e) => e.preventDefault()}
            >
              <Badge
                count={notifications.length}
                overflowCount={50}
                style={{
                  fontSize: "11px",
                  height: "15px",
                  minWidth: "15px",
                  lineHeight: "15px",
                }}
              >
                <BellOutlined style={{ fontSize: "20px" }} />
              </Badge>
            </Button>
          </Dropdown>
        )}

        {showCartButton && (
          <Button
            type="text"
            style={{ marginRight: 0, position: "relative", padding: 10 }}
            onClick={handleCartClick}
          >
            <Badge
              count={cartItemCount}
              overflowCount={99}
              offset={[6, -1]}
              style={{
                fontSize: "11px",
                height: "15px",
                minWidth: "15px",
                lineHeight: "15px",
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
