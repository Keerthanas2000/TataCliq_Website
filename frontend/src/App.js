import "../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ThemeProvider } from "@mui/material/styles";

import "react-toastify/dist/ReactToastify.css"; // Add this for styling
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./store";
import Login from "./pages/login";
import AdminLandingPage from "./admin/adminlandingpage";
import Categorypage from "./pages/Categorypage";
import Home from "./pages/Home";
import Homepagecontent from "./pages/Homepagecontent";
import CartDetails from "./pages/cartedItems";
import Viewprofile from "./pages/Viewprofile";
import Success from "./Success";
import CliqCashWallet from "../src/CliqCashWallet";
import GiftCardPage from "./GiftCardPage";
import theme from "./utils/Theme";
import ResetPassword from "./login/ResetPassword";
import ClickCare from "./pages/ClicKCare";
import ProductDetails from "./ProuductDetails";
import Wishlist from "./Wishlist";

function Layout() {
  return (
    <>
      <Home />
      <Outlet />
    </>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <BrowserRouter>
            <Routes>
           <Route element={<Layout />}>
              <Route path="/adminlandingpage" element={<AdminLandingPage />} />
              <Route path="/success" element={<Success />} />
              <Route path="/category/*" element={<Categorypage />} />
              <Route path="/" element={<Homepagecontent />} />
              <Route path="/cart" element={<CartDetails />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/viewprofile" element={<Viewprofile />} />
              <Route path="/details" element={<ProductDetails />} />
              <Route path="/cliqcashwallet" element={<CliqCashWallet />} />
              <Route path="/giftcard" element={<GiftCardPage />} />{" "}
              <Route path="/ClickCare" element={<ClickCare />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </BrowserRouter>
        </>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
