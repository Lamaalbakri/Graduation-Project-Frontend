import React from 'react';
import { useState } from 'react';
import {Button, Layout, theme} from 'antd';
import {MenuUnfoldOutlined, MenuFoldOutlined, LoginOutlined} from '@ant-design/icons'
import Logo from './components/Logo';
import UserLogo from './components/UserLogo';
import MenuList from './components/MenuList';
import ToggleThemeButton from './components/ToggleThemeButton';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PreviousRequests from './components/RequestsTable/PreviousRequests';
import CurrentRequests from './components/RequestsTable/CurrentRequests';
import Home from './components/Home';
import Search from './components/Search/Search';
import AssignTransporter from './components/AssignTransporter/AssignTransporter';

const { Header, Sider} = Layout;
function App() {
  const [userType, setUserType] = useState('supplier'); // يمكنك تغيير قيمة الـ userType حسب المنطق الخاص بتطبيقك
  
  const [darkTheme, setDarkTheme] = useState(true)
  const [collapsed, setCollapsed] = useState(false)
  const toggleTheme = () => setDarkTheme(!darkTheme);
  const {token: {colorBgContainer}, } = theme.useToken();

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logout clicked');
  };

  return (
    <Router>
      <Layout>

        <Sider width={266} collapsed={collapsed} className={collapsed ? 'sidebar-closed' : ''} collapsible
        trigger={null} theme= {darkTheme ? 'dark' : 'light'}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '25px' }}>
          <UserLogo />
          <span className='span'>Supplier</span> {/* يحتاج تعديل مفروض يتغير على حسب الستيكهولدرز */}
        </div>
        <div>
            <MenuList darkTheme={darkTheme} userType={userType} />
        </div>
        {/*<MenuList darkTheme= {darkTheme} />*/}
        <ToggleThemeButton darkTheme={darkTheme} toggleTheme={toggleTheme} />
        </Sider>

        <Layout>
          <Header style={{padding: 0, background: colorBgContainer, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <Button type='text' className="toggle" onClick={() => setCollapsed(!collapsed)}
            icon= {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            />
            <Logo />
            <Button type="text" className="logout-button" icon={<LoginOutlined />} onClick={handleLogout} >
              Logout
            </Button>
          </Header>
          <Layout.Content style={{ padding: '0 24px', minHeight: 280 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/assignTransporter" element={<AssignTransporter />} />
              {/*<Route path="/addRawMaterial" element={<AddRawMaterial />} />
              <Route path="/viewRawMaterial" element={<ViewRawMaterial />} />
              <Route path="/searchRawMaterial" element={<SearchRawMaterial />} />
              <Route path="/updateRawMaterial" element={<UpdateRawMaterial />} />
              <Route path="/deleteRawMaterial" element={<DeleteRawMaterial />} /> */}
              <Route path="/currentRequests" element={<CurrentRequests />} />
              <Route path="/previousRequests" element={<PreviousRequests />} />
              <Route path="/searchRequest" element={<Search/>} />
            </Routes>
          </Layout.Content>
        </Layout>

      </Layout>
    </Router>
  );
};

export default App;