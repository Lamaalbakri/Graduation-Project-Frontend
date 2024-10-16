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
import HomeUser from "./components/HomeUser/HomeUser";
import AssignTransporter from "./components/AssignTransporter/AssignTransporter";
import RegisterPage from "./components/Register-Login/RegisterPage";
import LoginPage from "./components/Register-Login/LoginPage";
import SCMShomePage from "./components/HomePage/SCMShomePage";
// Suppliers imports
import AddRawMaterial from "./components/Suppliers/ManageRawMaterial/AddRawMaterial";
import DeleteRawMaterial from "./components/Suppliers/ManageRawMaterial/DeleteRawMaterial";
import ViewRawMaterial from "./components/Suppliers/ManageRawMaterial/ViewRawMaterial";
import UpdateRawMaterial from "./components/Suppliers/ManageRawMaterial/UpdateRawMaterial";
import CurrentRequests from "./components/Suppliers/RequestsTable/CurrentRequests";
import PreviousRequests from "./components/Suppliers/RequestsTable/PreviousRequests";
import SearchRequests from "./components/Suppliers/RequestsTable/SearchRequests";
// Transporters imports
import CurrentTransportRequests from "./components/Transporters/TransportRequestsTable/CurrentTransportRequests";
import PreviousTransportRequests from "./components/Transporters/TransportRequestsTable/PreviousTransportRequests";
import SearchTransportRequests from "./components/Transporters/TransportRequestsTable/SearchTransportRequests";

const { Content } = Layout;

function App() {
  const [userType, setUserType] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageLayout />} />
        <Route path="/register" element={<RegisterPageLayout />} />
        {/* <Route path="/login" element={<LoginPageLayout />} /> */}
        <Route
          path="/login"
          element={<LoginPageLayout setUserType={setUserType} />}
        />
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
          userType={userType}
        />
        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <Routes>
            {userType === "supplier" && (
              <>
                <Route
                  path="/supplier-home"
                  element={<HomeUser userType="supplier" />}
                />
                <Route
                  path="/assignTransporter"
                  element={<AssignTransporter />}
                />
                <Route path="/addRawMaterial" element={<AddRawMaterial />} />
                <Route path="/viewRawMaterial" element={<ViewRawMaterial />} />
                <Route
                  path="/updateRawMaterial"
                  element={<UpdateRawMaterial />}
                />
                <Route
                  path="/deleteRawMaterial"
                  element={<DeleteRawMaterial />}
                />
                <Route path="/currentRequests" element={<CurrentRequests />} />
                <Route
                  path="/previousRequests"
                  element={<PreviousRequests />}
                />
                <Route path="/searchRequests" element={<SearchRequests />} />
              </>
            )}

            {userType === "transporter" && (
              <>
                <Route
                  path="/transporter-home"
                  element={<HomeUser userType="transporter" />}
                />
                <Route
                  path="/currentTransportRequests"
                  element={<CurrentTransportRequests />}
                />
                <Route
                  path="/previousTransportRequests"
                  element={<PreviousTransportRequests />}
                />
                <Route
                  path="/searchTransportRequests"
                  element={<SearchTransportRequests />}
                />
              </>
            )}

            {userType === "manufacturer" && (
              <>
                <Route
                  path="/manufacturer-home"
                  element={<HomeUser userType="manufacturer" />}
                />
                {/* يمكنك إضافة المسارات الخاصة بالمستخدم المصنع هنا */}
              </>
            )}

            {userType === "distributor" && (
              <>
                <Route
                  path="/distributor-home"
                  element={<HomeUser userType="distributor" />}
                />
                {/* يمكنك إضافة المسارات الخاصة بالمستخدم الموزع هنا */}
              </>
            )}

            {userType === "retailer" && (
              <>
                <Route
                  path="/retailer-home"
                  element={<HomeUser userType="retailer" />}
                />
                {/* يمكنك إضافة المسارات الخاصة بالمستخدم البائع بالتجزئة هنا */}
              </>
            )}

            {userType === "admin" && (
              <>
                <Route
                  path="/admin-home"
                  element={<HomeUser userType="admin" />}
                />
                {/* يمكنك إضافة المسارات الخاصة بالمستخدم الإداري هنا */}
              </>
            )}

            {/* يمكنك وضع مسار افتراضي أو صفحة غير موجودة */}
            <Route path="*" element={<div>Page not found</div>} />
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

function LoginPageLayout({ setUserType }) {
  return <LoginPage setUserType={setUserType} />;
}

export default App;
