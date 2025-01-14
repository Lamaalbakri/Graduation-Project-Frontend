import { useEffect, useState } from "react";
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
import SmartContract from "./components/SmartContract/SmartContractDetails";
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
// Manufacturers imports
import ShoppingBasketList from "./components/Manufacturers/RawMaterialOrder/ShoppingBasket/ShoppingBasketList";
import ShoppingBasketDetail from "./components/Manufacturers/RawMaterialOrder/ShoppingBasket/ShoppingBasketDetail";
import CompleteOrder from "./components/Manufacturers/RawMaterialOrder/ShoppingBasket/CompleteOrder";
import AddSupplier from "./components/Manufacturers/RawMaterialOrder/ManageSupplier/AddSupplier";
import ViewSupplier from "./components/Manufacturers/RawMaterialOrder/ManageSupplier/ViewSuppliers";
import ViewRawMaterials from "./components/Manufacturers/RawMaterialOrder/ViewMaterials/ViewRawMaterials";
import ViewOrder from "./components/Manufacturers/RawMaterialOrder/ManageOrders/ViewOrder";
import ViewOrderList from "./components/Manufacturers/RawMaterialOrder/ManageOrders/ViewOrdersList";
import ManufacturedGoodsCurrentRequests from "./components/Manufacturers/GoodsRequestsForManufacturers/ManufacturedGoodsCurrentRequests";
import ManufacturedGoodsPreviousRequests from "./components/Manufacturers/GoodsRequestsForManufacturers/ManufacturedGoodsPreviousRequests";
import SearchRequestsManufacturedGoods from "./components/Manufacturers/GoodsRequestsForManufacturers/SearchRequestsManufacturedGoods";
import AddManufacturerGoods from "./components/Manufacturers/MangeGoods/AddManufacturerGoods";
import ViewManufacturerGoods from "./components/Manufacturers/MangeGoods/ViewManufacturerGoods";
import UpdateManufacturerGoods from "./components/Manufacturers/MangeGoods/UpdateManufacturerGoods";
import DeleteManufacturerGoods from "./components/Manufacturers/MangeGoods/DeleteManufacturerGoods";
// Distributors imports
import AddDistributorsGoods from "./components/Distributors/MangeDistributorsGoods/AddDistributorsGoods";
import ViewDistributorsGoods from "./components/Distributors/MangeDistributorsGoods/ViewDistributorsGoods";
import UpdateDistributorGoods from "./components/Distributors/MangeDistributorsGoods/UpdateDistributorGoods";
import DeleteDistributorsGoods from "./components/Distributors/MangeDistributorsGoods/DeleteDistributorsGoods";
import DistributedGoodsCurrentRequests from "./components/Distributors/GoodsRequestsForDistributors/DistributedGoodsCurrentRequests";
import DistributedGoodsPreviousRequests from "./components/Distributors/GoodsRequestsForDistributors/DistributedGoodsPreviousRequests";
import SearchRequestsDistributedGoods from "./components/Distributors/GoodsRequestsForDistributors/SearchRequestsDistributedGoods";
import AddManufacturer from "./components/Distributors/GoodsOrder/ManageManufacturer/AddManufacturer";
import ViewManufacturers from "./components/Distributors/GoodsOrder/ManageManufacturer/ViewManufacturers";
import ViewGoods from "./components/Distributors/GoodsOrder/ViewGoods/ViewGoods";
import ShoppingBasketListManufacturer from "./components/Distributors/GoodsOrder/ShoppingBasket/ShoppingBasketList";
import ShoppingBasketDetailManufacturer from "./components/Distributors/GoodsOrder/ShoppingBasket/ShoppingBasketDetail";
import CompleteOrderManufacturer from "./components/Distributors/GoodsOrder/ShoppingBasket/CompleteOrder";
import ViewOrderDistributor from "./components/Distributors/GoodsOrder/ManageOrders/ViewOrder";
import ViewOrderListDistributor from "./components/Distributors/GoodsOrder/ManageOrders/ViewOrdersList";
// Retailers imports
import AddDistributor from "./components/Retailers/ManageOrders/ManageDistributors/AddDistributor";
import ViewDistributors from "./components/Retailers/ManageOrders/ManageDistributors/ViewDistributors";
import ViewDGoods from "./components/Retailers/ManageOrders/ViewGoods/ViewGoods";
import ShoppingBasketListDistributor from "./components/Retailers/ManageOrders/ShoppingBasket/ShoppingBasketList";
import ShoppingBasketDetailDistributor from "./components/Retailers/ManageOrders/ShoppingBasket/ShoppingBasketDetail";
import CompleteOrderDistributor from "./components/Retailers/ManageOrders/ShoppingBasket/CompleteOrder";
import ViewOrderRetailer from "./components/Retailers/ManageOrders/GoodsOrders/ViewOrder";
import ViewOrderListRetailer from "./components/Retailers/ManageOrders/GoodsOrders/ViewOrdersList";
// Contexts
import { AddressProvider } from "./contexts/AddressContext";
import { UserProvider } from "./contexts/UserContext";
// Feedbacks
import Feedbacks from "./components/Suppliers/RequestsTable/Feedbacks";

const { Content } = Layout;

function App() {
  const [userType, setUserType] = useState(sessionStorage.getItem("userType"));
  const [userId, setUserId] = useState(sessionStorage.getItem("userId"));

  useEffect(() => {
    sessionStorage.setItem("userType", userType);
    sessionStorage.setItem("userId", userId);
  }, [userType, userId]);

  const clearUserData = () => {
    setUserType(null);
    setUserId(null);
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userId");
  };

  return (
    <UserProvider>
      <Router>
        <AddressProvider>
          <Routes>
            <Route path="/" element={<HomePageLayout />} />
            <Route path="/register" element={<RegisterPageLayout />} />
            <Route
              path="/login"
              element={
                <LoginPageLayout
                  setUserType={setUserType}
                  setUserId={setUserId}
                />
              }
            />
            <Route
              path="*"
              element={
                <MainLayout
                  userType={userType}
                  userId={userId}
                  clearUserData={clearUserData}
                />
              }
            />
            <Route path="/SmartContract/:id" element={<SmartContract />} />
          </Routes>
        </AddressProvider>
      </Router>
    </UserProvider>
  );
}

function MainLayout({ userType, userId, clearUserData }) {
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
    clearUserData();
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
                  path="/shoppingBaskets"
                  element={<ShoppingBasketList userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets/:basketId/:basketIndex"
                  element={<ShoppingBasketDetail userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets/:basketId/:basketIndex/complete"
                  element={<CompleteOrder userId={userId} />}
                />
                <Route
                  path="/ViewOrderList"
                  element={<ViewOrderList userId={userId} />}
                />
                <Route
                  path="/ViewOrders"
                  element={<ViewOrder userId={userId} />}
                />
                <Route
                  path="/currentManufacturerRequests/:userId"
                  element={<ManufacturedGoodsCurrentRequests userId={userId} />}
                />
                <Route
                  path="/previousManufacturerRequests/:userId"
                  element={
                    <ManufacturedGoodsPreviousRequests userId={userId} />
                  }
                />
                <Route
                  path="/searchManufacturerRequests/:userId"
                  element={<SearchRequestsManufacturedGoods userId={userId} />}
                />
                <Route
                  path="/addManufacturerGoods/:userId"
                  element={<AddManufacturerGoods userId={userId} />}
                />
                <Route
                  path="/viewManufacturerGoods/:userId"
                  element={<ViewManufacturerGoods userId={userId} />}
                />
                <Route
                  path="/updateManufacturerGoods/:userId"
                  element={<UpdateManufacturerGoods userId={userId} />}
                />
                <Route
                  path="/deleteManufacturerGoods/:userId"
                  element={<DeleteManufacturerGoods userId={userId} />}
                />
              </>
            )}

            {userType === "distributor" && (
              <>
                <Route
                  path="/distributor-home/:userId"
                  element={<HomeUser userType="distributor" userId={userId} />}
                />

                <Route
                  path="/addDistributorsGoods/:userId"
                  element={<AddDistributorsGoods userId={userId} />}
                />
                <Route
                  path="/viewDistributorsGoods/:userId"
                  element={<ViewDistributorsGoods userId={userId} />}
                />
                <Route
                  path="/updateDistributorsGoods/:userId"
                  element={<UpdateDistributorGoods userId={userId} />}
                />
                <Route
                  path="/deleteDistributorsGoods/:userId"
                  element={<DeleteDistributorsGoods userId={userId} />}
                />
                <Route
                  path="/currentDistributorRequests/:userId"
                  element={<DistributedGoodsCurrentRequests userId={userId} />}
                />
                <Route
                  path="/previousDistributorRequests/:userId"
                  element={<DistributedGoodsPreviousRequests userId={userId} />}
                />
                <Route
                  path="/searchDistributorRequests/:userId"
                  element={<SearchRequestsDistributedGoods userId={userId} />}
                />
                <Route
                  path="/addManufacturers/:userId"
                  element={<AddManufacturer userId={userId} />}
                />
                <Route
                  path="/viewManufacturers/:userId"
                  element={<ViewManufacturers userId={userId} />}
                />
                <Route
                  path="/ViewManufacturersGoods/:userId"
                  element={<ViewGoods userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets"
                  element={<ShoppingBasketListManufacturer userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets/:basketId/:basketIndex"
                  element={<ShoppingBasketDetailManufacturer userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets/:basketId/:basketIndex/complete"
                  element={<CompleteOrderManufacturer userId={userId} />}
                />
                <Route
                  path="/ViewOrderList"
                  element={<ViewOrderListDistributor userId={userId} />}
                />
                <Route
                  path="/ViewOrders"
                  element={<ViewOrderDistributor userId={userId} />}
                />
              </>
            )}

            {userType === "retailer" && (
              <>
                <Route
                  path="/retailer-home/:userId"
                  element={<HomeUser userType="retailer" userId={userId} />}
                />

                <Route
                  path="/addDistributors/:userId"
                  element={<AddDistributor userId={userId} />}
                />
                <Route
                  path="/viewDistributors/:userId"
                  element={<ViewDistributors userId={userId} />}
                />
                <Route
                  path="/ViewDistributorsGoods/:userId"
                  element={<ViewDGoods userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets"
                  element={<ShoppingBasketListDistributor userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets/:basketId/:basketIndex"
                  element={<ShoppingBasketDetailDistributor userId={userId} />}
                />
                <Route
                  path="/shoppingBaskets/:basketId/:basketIndex/complete"
                  element={<CompleteOrderDistributor userId={userId} />}
                />
                <Route
                  path="/ViewOrderList"
                  element={<ViewOrderListRetailer userId={userId} />}
                />
                <Route
                  path="/ViewOrders"
                  element={<ViewOrderRetailer userId={userId} />}
                />
              </>
            )}

            <Route
              path="/feedbacks/:userId"
              element={<Feedbacks userId={userId} />}
            />

            <Route
              path="/edit-account/:userId"
              element={<EditAccountLayout userId={userId} />}
            />

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
