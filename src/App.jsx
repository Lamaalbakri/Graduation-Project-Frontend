import { useState } from "react";
import { Layout, theme } from "antd";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AppHeader from "./components/AppHeader";
import PreviousRequests from "./components/RequestsTable/PreviousRequests";
import CurrentRequests from "./components/RequestsTable/CurrentRequests";
import HomeUser from "./components/HomeUser/HomeUser";
import Search from "./components/Search/Search";
import AssignTransporter from "./components/AssignTransporter/AssignTransporter";
import SCMShomePage from "./components/HomePage/SCMShomePage";

const { Content } = Layout;

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/websiteHomePage" element={<HomePageLayout />} />
        <Route path="*" element={<MainLayout />} />
      </Routes>
    </Router>
  );
}

function MainLayout() {
  const [userType, setUserType] = useState("supplier");
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const toggleTheme = () => setDarkTheme(!darkTheme);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/websiteHomePage");
  };

  return (
    <Layout>
      <Sidebar
        collapsed={collapsed}
        darkTheme={darkTheme}
        toggleTheme={toggleTheme}
        userType={userType}
      />
      <Layout>
        <AppHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          handleLogout={handleLogout}
          colorBgContainer={colorBgContainer}
        />
        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <Routes>
            <Route path="/home" element={<HomeUser />} />
            <Route path="/assignTransporter" element={<AssignTransporter />} />
            {/*<Route path="/addRawMaterial" element={<AddRawMaterial />} />
              <Route path="/viewRawMaterial" element={<ViewRawMaterial />} />
              <Route path="/updateRawMaterial" element={<UpdateRawMaterial />} />
              <Route path="/deleteRawMaterial" element={<DeleteRawMaterial />} /> */}
            <Route path="/currentRequests" element={<CurrentRequests />} />
            <Route path="/previousRequests" element={<PreviousRequests />} />
            <Route path="/searchRequest" element={<Search />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function HomePageLayout() {
  return <SCMShomePage />;
}

export default App;
