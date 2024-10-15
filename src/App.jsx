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
import PreviousRequests from "./components/Suppliers/RequestsTable/PreviousRequests";
import CurrentRequests from "./components/Suppliers/RequestsTable/CurrentRequests";
import HomeUser from "./components/HomeUser/HomeUser";
import SearchRequests from "./components/Suppliers/RequestsTable/SearchRequests";
import AssignTransporter from "./components/AssignTransporter/AssignTransporter";
import RegisterPage from "./components/Register-Login/RegisterPage";
import LoginPage from "./components/Register-Login/LoginPage";
import SCMShomePage from "./components/HomePage/SCMShomePage";
import AddRawMaterial from "./components/Suppliers/ManageRawMaterial/AddRawMaterial";
import DeleteRawMaterial from "./components/Suppliers/ManageRawMaterial/DeleteRawMaterial";
import ViewRawMaterial from "./components/Suppliers/ManageRawMaterial/ViewRawMaterial";
import UpdateRawMaterial from "./components/Suppliers/ManageRawMaterial/UpdateRawMaterial";

const { Content } = Layout;

function App() {
  // const userType = "transporter";
  const userType = "supplier"; // على حسب نوع الستيكهولدرز الذي تريد عرضه

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageLayout />} />
        <Route path="/register" element={<RegisterPageLayout />} />
        <Route path="/login" element={<LoginPageLayout />} />
        <Route path="*" element={<MainLayout userType={userType} />} />
      </Routes>
    </Router>
  );
}

function MainLayout({ userType }) {
  const [darkTheme, setDarkTheme] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const toggleTheme = () => setDarkTheme(!darkTheme);
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/");
  };

  return (
    <Layout>
      {userType && (
        <Sidebar
          collapsed={collapsed}
          darkTheme={darkTheme}
          toggleTheme={toggleTheme}
          userType={userType}
        />
      )}
      <Layout>
        <AppHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          handleLogout={handleLogout}
          colorBgContainer={colorBgContainer}
        />
        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <Routes>
            <Route path="/home" element={<HomeUser userType={userType} />} />
            <Route path="/assignTransporter" element={<AssignTransporter />} />
            <Route path="/addRawMaterial" element={<AddRawMaterial />} />
            <Route path="/viewRawMaterial" element={<ViewRawMaterial />} />
            <Route path="/updateRawMaterial" element={<UpdateRawMaterial />} />
            <Route path="/deleteRawMaterial" element={<DeleteRawMaterial />} />
            <Route path="/currentRequests" element={<CurrentRequests />} />
            <Route path="/previousRequests" element={<PreviousRequests />} />
            <Route path="/searchRequests" element={<SearchRequests />} />
          </Routes>
        </Content>
      </Layout>
    </Layout>
  );
}

function HomePageLayout() {
  return <SCMShomePage />;
}

function RegisterPageLayout() {
  return <RegisterPage />;
}

function LoginPageLayout() {
  return <LoginPage />;
}

export default App;
