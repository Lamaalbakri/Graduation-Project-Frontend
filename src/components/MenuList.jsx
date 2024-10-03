import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  GoldOutlined,
  SnippetsOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const MenuList = ({ darkTheme, userType }) => {
  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menu-bar"
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to="/home">Home</Link>
      </Menu.Item>

      {userType === "supplier" && (
        <React.Fragment>
          <Menu.SubMenu
            key="manageRawMaterial"
            icon={<GoldOutlined />}
            title="Manage Raw Material"
          >
            <Menu.Item key="addRawMaterial">
              <Link to="/addRawMaterial">Add Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="viewRawMaterial">
              <Link to="/viewRawMaterial">View Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="updateRawMaterial">
              <Link to="/updateRawMaterial">Update Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="deleteRawMaterial">
              <Link to="/deleteRawMaterial">Delete Raw Material</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="manageMaterialRequests"
            icon={<SnippetsOutlined />}
            title="Manage Requests"
          >
            <Menu.Item key="sCurrent">
              <Link to="/currentRequests">Current Requests</Link>
            </Menu.Item>
            <Menu.Item key="sPrevious">
              <Link to="/previousRequests">Previous Requests</Link>
            </Menu.Item>
            <Menu.Item key="sSearchRequests">
              <Link to="/searchRequests">Search for Request</Link>
            </Menu.Item>
          </Menu.SubMenu>
        </React.Fragment>
      )}

      {userType === "transporter" && (
        <React.Fragment>
          <Menu.SubMenu
            key="manageTransportRequests"
            icon={<SnippetsOutlined />}
            title="Manage Requests"
          >
            <Menu.Item key="tCurrent">Current Requests</Menu.Item>
            <Menu.Item key="tPrevious">Previous Requests</Menu.Item>
            <Menu.Item key="tSearchRequest">Search for Request</Menu.Item>
          </Menu.SubMenu>
        </React.Fragment>
      )}

      {userType === "manufacturer" && (
        <React.Fragment>
          {/* قائمة العناصر التي تخص الـ "manufacturer" */}
        </React.Fragment>
      )}

      {userType === "distributor" && (
        <React.Fragment>
          {/* قائمة العناصر التي تخص الـ "distributor" */}
        </React.Fragment>
      )}

      {userType === "retailer" && (
        <React.Fragment>
          {/* قائمة العناصر التي تخص الـ "retailer" */}
        </React.Fragment>
      )}
    </Menu>
  );
};

export default MenuList;
