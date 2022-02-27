import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import { checkUserSession } from "./redux/User/user.action";

//components
import AdminToolbar from "./components/AdminToolbar";

//hoc - higher order component
import WithAuth from "./hoc/withAuth"
import WithAdminAuth from "./hoc/withAdminAuth";

//layouts
import MainLayout from "./layouts/MainLayout";
import HomepageLayout from "./layouts/HomepageLayout";
import AdminLayout from "./layouts/AdminLayout";
import DashBoardLayout from "./layouts/DashboardLayout";

// pages
import Homepage from "./pages/Homepage";
import Search from "./pages/Search";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import Recovery from "./pages/Recovery";
import Dashboard from "./pages/Dashboard";
import Admin from "./pages/Admin";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Payment from "./pages/Payment";
import './default.scss';
import OrderDetails from "./pages/OrderDetails";
import OrderCheck from "./pages/OrderCheck";
import Delivered from "./pages/Delivered";
import OrderItemCheckCard from "./components/OrderItemCheckCard";

const initialState = {
  currentUser: null
}

const App = props => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkUserSession())
  }, [])

  return (
    <div className="App">
      <AdminToolbar />
      <Switch>
        {/* ====================HOME PAGE================== */}
        <Route exact path="/" render={() => ( //So basically <HomepageLayout have to have currentUser={currentUser} for update the UI layout like sign in and update the header but with redux you dont need to do that
          <HomepageLayout >
            <Homepage />
          </HomepageLayout>
        )} />

        {/* ====================SEARCH PAGE================ */}
        <Route exact path="/search" render={() => (
          <MainLayout>
            <Search />
          </MainLayout>
        )}/>
        <Route path="/search/:filterType" render={() => (
          <MainLayout>
            <Search />
          </MainLayout>
        )}/>
        {/* same like home page <MainLayout currentUser={currentUser} */}

        {/* ====================PRODUCT DETIALS PAGE =================== */}
        <Route path="/product/:productID" render={() => (
          <MainLayout>
            <ProductDetails />
          </MainLayout>
        )}/>

        {/* ====================CART PAGE =================== */}
        <Route path="/cart" render={() => (
          <WithAuth>
            <MainLayout>
              <Cart />
            </MainLayout>
          </WithAuth>
        )}/>

        {/* ====================PAYMENT PAGE =================== */}
        <Route path="/payment" render={() => (
          <WithAuth>
            <MainLayout>
              <Payment />
            </MainLayout>
          </WithAuth>
        )}/>

        {/* ====================SIGN UP PAGE ================ */}
        <Route path="/registration" render={() => (
          <MainLayout >
            <Registration />
          </MainLayout>
        )} />

        {/* ====================SIGN IN PAGE================== */}
        <Route path="/login"
          render={() => (
            <MainLayout >
              <Login />
            </MainLayout>
          )}
        />

        {/* =====================FORGET PASSWORD PAGE================ */}
        <Route path="/recovery" render={() => (
          <MainLayout>
            <Recovery />
          </MainLayout>
        )} />

        {/* ==================== USER PAGE======================= */}
        <Route path="/dashboard" render={() => (
          <WithAuth>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </WithAuth>
        )} />

        {/* ====================ORDER DETAIL PAGE =================== */}
        <Route path="/order/:paymentID" render={() => (
          <WithAuth>
            <MainLayout>
              <OrderDetails />
            </MainLayout>
          </WithAuth>
        )}/>

        {/* =================== ADMIN PAGE ========================= */}
        <Route path="/admin" render={() => (
          <WithAdminAuth>
            <AdminLayout>
              <Admin />
            </AdminLayout>
          </WithAdminAuth>
        )} />

        <Route path="/orderchecks" render={() => (
          <WithAdminAuth>
            <AdminLayout>
              <OrderCheck />
            </AdminLayout>
          </WithAdminAuth>
        )} />

        <Route path="/ordercheck/:paymentID" render={() => (
          <WithAdminAuth>
            <AdminLayout>
              <OrderItemCheckCard />
            </AdminLayout>
          </WithAdminAuth>
        )} />

        <Route path="/delivered" render={() => (
          <WithAdminAuth>
            <AdminLayout>
              <Delivered />
            </AdminLayout>
          </WithAdminAuth>
        )} />
      </Switch>
    </div>
  );
}

export default App;
