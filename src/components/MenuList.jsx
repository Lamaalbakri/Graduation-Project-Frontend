import { Menu } from 'antd'
import { HomeOutlined, GoldOutlined, SnippetsOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

const MenuList = ( {darkTheme} ) => {
    return (
        <Menu theme={darkTheme ? 'dark' : 'light'} mode="inline" className="menu-bar">

        <Menu.Item key="home" icon={<HomeOutlined />}>
            <Link to="/">Home</Link>
        </Menu.Item>

        <Menu.SubMenu key="manageRawMaterial" icon={<GoldOutlined />}
            title="Manage Raw Material">
            <Menu.Item key="add">
                <Link to="/addRawMaterial">Add Raw Material</Link>
            </Menu.Item>
            <Menu.Item key="view">View Raw Material</Menu.Item>
            <Menu.Item key="search">Search Raw Material</Menu.Item>
            <Menu.Item key="update">Update Raw Material</Menu.Item>
            <Menu.Item key="delete">Delete Raw Material</Menu.Item>
        </Menu.SubMenu>

        <Menu.SubMenu key="manageRequests" icon={<SnippetsOutlined />}
            title="Manage Requests">
            <Menu.Item key="current">
                <Link to="/currentRequests">Current Requests</Link> {/* تغليف العنصر بـ Link */}
            </Menu.Item>
            <Menu.Item key="previous">
                <Link to="/previousRequests">Previous Requests</Link>
            </Menu.Item>
            <Menu.Item key="searchRequest">
                <Link to="/searchRequest">Search for Request</Link>
            </Menu.Item>
        </Menu.SubMenu>

        </Menu>
    );
};

export default MenuList;