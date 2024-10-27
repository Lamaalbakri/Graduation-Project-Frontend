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
import EditAccount from "./components/EditAccount/EditAccount";
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
//Manufacturers imports
import ShoppingCartList from "./components/Manufacturers/RawMaterialOrder/ShoppingCart/ShoppingCartList";
import ShoppingCartDetail from "./components/Manufacturers/RawMaterialOrder/ShoppingCart/ShoppingCartDetail";
import CompleteOrder from "./components/Manufacturers/RawMaterialOrder/ShoppingCart/CompleteOrder";

import AddSupplier from "./components/Manufacturers/RawMaterialOrder/ManageSupplier/AddSupplier";
import ViewSupplier from "./components/Manufacturers/RawMaterialOrder/ManageSupplier/ViewSuppliers";
import ViewRawMaterials from "./components/Manufacturers/RawMaterialOrder/ViewMaterials/ViewRawMaterials";

const { Content } = Layout;

function App() {
  const [userType, setUserType] = useState(null);
  const [userId, setUserId] = useState(null);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePageLayout />} />
        <Route path="/register" element={<RegisterPageLayout />} />
        <Route
          path="/login"
          element={
            <LoginPageLayout setUserType={setUserType} setUserId={setUserId} />
          }
        />
        <Route
          path="*"
          element={<MainLayout userType={userType} userId={userId} />}
        />
      </Routes>
    </Router>
  );
}

function MainLayout({ userType, userId }) {
  console.log("Main Layout - User ID:", userId, "User Type:", userType);
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
          userId={userId}
        />
      )}
      <Layout>
        <AppHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          handleLogout={handleLogout}
          colorBgContainer={colorBgContainer}
          userType={userType}
          userId={userId}
        />
        <Content style={{ padding: "0 24px", minHeight: 280 }}>
          <Routes>
            {userType === "supplier" && (
              <>
                <Route
                  path="/supplier-home/:userId"
                  element={<HomeUser userType="supplier" userId={userId} />}
                />
                <Route
                  path="/assignTransporter/:userId"
                  element={<AssignTransporter userId={userId} />}
                />
                <Route
                  path="/addRawMaterial/:userId"
                  element={<AddRawMaterial userId={userId} />}
                />
                <Route
                  path="/viewRawMaterial/:userId"
                  element={<ViewRawMaterial userId={userId} />}
                />
                <Route
                  path="/updateRawMaterial/:userId"
                  element={<UpdateRawMaterial userId={userId} />}
                />
                <Route
                  path="/deleteRawMaterial/:userId"
                  element={<DeleteRawMaterial userId={userId} />}
                />
                <Route
                  path="/currentRequests/:userId"
                  element={<CurrentRequests userId={userId} />}
                />
                <Route
                  path="/previousRequests/:userId"
                  element={<PreviousRequests />}
                />
                <Route
                  path="/searchRequests/:userId"
                  element={<SearchRequests userId={userId} />}
                />
              </>
            )}

            {userType === "transporter" && (
              <>
                <Route
                  path="/transporter-home/:userId"
                  element={<HomeUser userType="transporter" userId={userId} />}
                />
                <Route
                  path="/currentTransportRequests/:userId"
                  element={<CurrentTransportRequests userId={userId} />}
                />
                <Route
                  path="/previousTransportRequests/:userId"
                  element={<PreviousTransportRequests userId={userId} />}
                />
                <Route
                  path="/searchTransportRequests/:userId"
                  element={<SearchTransportRequests userId={userId} />}
                />
              </>
            )}

            {userType === "manufacturer" && (
              <>
                <Route
                  path="/manufacturer-home/:userId"
                  element={<HomeUser userType="manufacturer" userId={userId} />}
                />

                <Route
                  path="/addSuppliers/:userId"
                  element={<AddSupplier userId={userId} />}
                />
                <Route
                  path="/viewSuppliers/:userId"
                  element={<ViewSupplier userId={userId} />}
                />
                <Route
                  path="/viewRawMaterials/:userId"
                  element={<ViewRawMaterials userId={userId} />}
                />
                <Route
                  path="/shoppingCarts/:userId"
                  element={<ShoppingCartList userId={userId} />}
                />
                <Route
                  path="/shoppingCarts/:userId/:id"
                  element={<ShoppingCartDetail userId={userId} />}
                />
                <Route
                  path="/shoppingCarts/:userId/:id/complete"
                  element={<CompleteOrder userId={userId} />}
                />
                {/* <Route path="/viewOrders" element={} /> */}
              </>
            )}

            {userType === "distributor" && (
              <>
                <Route
                  path="/distributor-home/:userId"
                  element={<HomeUser userType="distributor" userId={userId} />}
                />
                {/* يمكنك إضافة المسارات الخاصة بالمستخدم الموزع هنا */}
              </>
            )}

            {userType === "retailer" && (
              <>
                <Route
                  path="/retailer-home/:userId"
                  element={<HomeUser userType="retailer" userId={userId} />}
                />
                {/* يمكنك إضافة المسارات الخاصة بالمستخدم البائع بالتجزئة هنا */}
              </>
            )}

            {userType === "admin" && (
              <>
                <Route
                  path="/admin-home/:userId"
                  element={<HomeUser userType="admin" userId={userId} />}
                />
                {/* يمكنك إضافة المسارات الخاصة بالمستخدم الإداري هنا */}
              </>
            )}

            <Route
              path="/edit-account/:userId"
              element={<EditAccountLayout userId={userId} />}
            />
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

function LoginPageLayout({ setUserType, setUserId }) {
  return <LoginPage setUserType={setUserType} setUserId={setUserId} />;
}
function EditAccountLayout() {
  return <EditAccount />;
}

export default App;
