import React from 'react';
import { Menu } from 'antd'
import { HomeOutlined, GoldOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const MenuList = ( {darkTheme , userType} ) => {
    return (
        <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar">

        <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
        </Menu.Item>

        { userType === 'supplier' && (
            <React.Fragment>
                <Menu.SubMenu key="manageRawMaterial" icon={<GoldOutlined />} title="Manage Raw Material">
                    <Menu.Item key="addRawMaterial">
                        <Link to="/addRawMaterial">Add Raw Material</Link>
                    </Menu.Item>
                    <Menu.Item key="viewRawMaterial">View Raw Material</Menu.Item>
                    <Menu.Item key="searchRawMaterial">Search Raw Material</Menu.Item>
                    <Menu.Item key="updateRawMaterial">Update Raw Material</Menu.Item>
                    <Menu.Item key="deleteRawMaterial">Delete Raw Material</Menu.Item>
                </Menu.SubMenu>
                <Menu.SubMenu key="manageMaterialRequests" icon={<SnippetsOutlined />} title="Manage Requests">
                    <Menu.Item key="sCurrent">
                        <Link to="/currentRequests">Current Requests</Link> {/* تغليف العنصر بـ Link */}
                    </Menu.Item>
                    <Menu.Item key="sPrevious">
                        <Link to="/previousRequests">Previous Requests</Link>
                    </Menu.Item>
                    <Menu.Item key="sSearchRequest">
                        <Link to="/searchRequest">Search for Request</Link>
                    </Menu.Item>
                </Menu.SubMenu>
            </React.Fragment>
        )}
        
        {userType === 'transporter' && (
            <React.Fragment>
                <Menu.SubMenu key="manageTransportRequests" icon={<SnippetsOutlined />} title="Manage Requests">
                    <Menu.Item key="tCurrent">Current Requests</Menu.Item>
                    <Menu.Item key="tPrevious">Previous Requests</Menu.Item>
                    <Menu.Item key="tSearchRequest">Search for Request</Menu.Item>
                </Menu.SubMenu>
            </React.Fragment>
        )}

        </Menu>
    );
};

export default MenuList;