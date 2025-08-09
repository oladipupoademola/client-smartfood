import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./features/auth/Login";
import Register from "./features/auth/Register";
import UserDashboard from "./features/user/UserDashboard";
import VendorDashboard from "./features/vendor/VendorDashboard";
import VendorMenu from "./features/vendor/VendorMenu";
import VendorOrders from "./features/vendor/VendorOrders";
import AdminDashboard from "./features/admin/AdminDashboard";
import UserHome from "./pages/UserHome";
import Checkout from "./pages/Checkout";
import Profile from "./pages/Profile"; // ✅ ADDED
import NotFound from "./pages/NotFound";

// Route guards
import PrivateRoute from "./routes/PrivateRoute";
import AdminRoute from "./routes/AdminRoute";
import VendorRoute from "./routes/VendorRoute";
import UserRoute from "./routes/UserRoute";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* User Routes */}
        <Route
          path="/user/home"
          element={<UserRoute><UserHome /></UserRoute>}
        />
        <Route
          path="/user/dashboard"
          element={<UserRoute><UserDashboard /></UserRoute>}
        />
        <Route
          path="/user/profile"                 // ✅ ADDED
          element={<UserRoute><Profile /></UserRoute>}
        />
        <Route
          path="/checkout"
          element={<UserRoute><Checkout /></UserRoute>}
        />

        {/* Vendor Routes */}
        <Route
          path="/vendor/dashboard"
          element={<VendorRoute><VendorDashboard /></VendorRoute>}
        />
        <Route
          path="/vendor/menu"
          element={<VendorRoute><VendorMenu /></VendorRoute>}
        />
        <Route
          path="/vendor/orders"
          element={<VendorRoute><VendorOrders /></VendorRoute>}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={<AdminRoute><AdminDashboard /></AdminRoute>}
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;
