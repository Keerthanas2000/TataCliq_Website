import "../src/App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
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
import ResetPassword from "./ResetPassword";
import Success from "./Success";

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
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Routes WITH navbar */}
          <Route element={<Layout />}>
            <Route path="/adminlandingpage" element={<AdminLandingPage />} />

            <Route path="/success" element={<Success />} />
            <Route path="/category/*" element={<Categorypage />} />
            <Route path="/" element={<Homepagecontent />} />
            <Route path="/cart" element={<CartDetails />} />
            <Route path="/viewprofile" element={<Viewprofile />} />
          </Route>
          {/* Route WITHOUT navbar */}
          <Route path="/login" element={<Login />} />

<Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
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
      </BrowserRouter>
    </Provider>
  );
}

export default App;