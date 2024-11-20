import React from "react";
import { Menu } from "antd";
import {
  HomeOutlined,
  GoldOutlined,
  SnippetsOutlined,
  ProductOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const MenuList = ({ darkTheme, userType, userId }) => {
  const homeLink = () => {
    switch (userType) {
      case "supplier":
        return `/supplier-home/${userId}`;
      case "transporter":
        return `/transporter-home/${userId}`;
      case "manufacturer":
        return `/manufacturer-home/${userId}`;
      case "distributor":
        return `/distributor-home/${userId}`;
      case "retailer":
        return `/retailer-home/${userId}`;
      case "admin":
        return `/admin-home/${userId}`;
      default:
        return "/";
    }
  };
  return (
    <Menu
      theme={darkTheme ? "dark" : "light"}
      mode="inline"
      className="menu-bar"
    >
      <Menu.Item key="home" icon={<HomeOutlined />}>
        <Link to={homeLink()}>Home</Link>
      </Menu.Item>

      {userType === "supplier" && (
        <React.Fragment>
          <Menu.SubMenu
            key="manageRawMaterial"
            icon={<GoldOutlined />}
            title="Manage Raw Material"
          >
            <Menu.Item key="addRawMaterial">
              <Link to={`/addRawMaterial/${userId}`}>Add Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="viewRawMaterial">
              <Link to={`/viewRawMaterial/${userId}`}>View Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="updateRawMaterial">
              <Link to={`/updateRawMaterial/${userId}`}>
                Update Raw Material
              </Link>
            </Menu.Item>
            <Menu.Item key="deleteRawMaterial">
              <Link to={`/deleteRawMaterial/${userId}`}>
                Delete Raw Material
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="manageMaterialRequests"
            icon={<SnippetsOutlined />}
            title="Manage Requests"
          >
            <Menu.Item key="sCurrent">
              <Link to={`/currentRequests/${userId}`}>Current Requests</Link>
            </Menu.Item>
            <Menu.Item key="sPrevious">
              <Link to={`/previousRequests/${userId}`}>Previous Requests</Link>
            </Menu.Item>
            <Menu.Item key="sSearchRequests">
              <Link to={`/searchRequests/${userId}`}>Search for Request</Link>
            </Menu.Item>
            <Menu.Item key="sFeedbacks">
              <Link to={`/feedbacks/${userId}`}>Feedbacks</Link>
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
            <Menu.Item key="tCurrent">
              <Link to={`/currentTransportRequests/${userId}`}>
                Current Requests
              </Link>
            </Menu.Item>
            <Menu.Item key="tPrevious">
              <Link to={`/previousTransportRequests/${userId}`}>
                Previous Requests
              </Link>
            </Menu.Item>
            <Menu.Item key="tSearchRequest">
              <Link to={`/searchTransportRequests/${userId}`}>
                Search for Request
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
        </React.Fragment>
      )}

      {userType === "manufacturer" && (
        <React.Fragment>
          <Menu.SubMenu
            key="manageManufacturerGoods"
            icon={<ProductOutlined />}
            title="Manage Goods"
          >
            <Menu.Item key="addMGoods">
              <Link to={`/addManufacturerGoods/${userId}`}>Add Goods</Link>
            </Menu.Item>
            <Menu.Item key="viewMGoods">
              <Link to={`/viewManufacturerGoods/${userId}`}>View Goods</Link>
            </Menu.Item>
            <Menu.Item key="updateMGoods">
              <Link to={`/updateManufacturerGoods/${userId}`}>
                Update Goods
              </Link>
            </Menu.Item>
            <Menu.Item key="deleteMGoods">
              <Link to={`/deleteManufacturerGoods/${userId}`}>
                Delete Goods
              </Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="manageRawMaterialOrders"
            icon={<GoldOutlined />}
            title="Manage Orders"
          >
            <Menu.Item key="addSuppliers">
              <Link to={`/addSuppliers/${userId}`}>Add Suppliers</Link>
            </Menu.Item>
            <Menu.Item key="viewSuppliers">
              <Link to={`/viewSuppliers/${userId}`}>View Suppliers</Link>
            </Menu.Item>
            <Menu.Item key="viewRawMaterials">
              <Link to={`/viewRawMaterials/${userId}`}>View Raw Materials</Link>
            </Menu.Item>
            <Menu.Item key="shoppingBaskets">
              <Link to={`/shoppingBaskets`}>Shopping Baskets</Link>
            </Menu.Item>
            <Menu.Item key="viewOrders">
              <Link to={`/ViewOrders/`}>View Orders</Link>
            </Menu.Item>
          </Menu.SubMenu>
          <Menu.SubMenu
            key="manageManufacturerRequests"
            icon={<SnippetsOutlined />}
            title="Manage Requests"
          >
            <Menu.Item key="mCurrent">
              <Link to={`/currentManufacturerRequests/${userId}`}>
                Current Requests
              </Link>
            </Menu.Item>
            <Menu.Item key="mPrevious">
              <Link to={`/previousManufacturerRequests/${userId}`}>
                Previous Requests
              </Link>
            </Menu.Item>
            <Menu.Item key="mSearchRequest">
              <Link to={`/searchManufacturerRequests/${userId}`}>
                Search for Request
              </Link>
            </Menu.Item>
            <Menu.Item key="mFeedbacks">
              <Link to={`/feedbacks/${userId}`}>Feedbacks</Link>
            </Menu.Item>
          </Menu.SubMenu>
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
