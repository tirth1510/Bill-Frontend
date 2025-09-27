import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import Bill from "./pages/bill/bill";
import BillPage from "./pages/bill/BillPage";
import Login from "./pages/auth/login";
import Pin from "./pages/pin/createpin";
import ProtectedRoute from "./middleware/ProtectedRoute";
import Loader from "@/layouts/Loading";
import { useState, useEffect } from "react";
import WhatsAppBill from "./pages/bill/whatsapp-bill";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // 1.5s loading screen
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/pin" element={<Pin />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bill"
          element={
            <ProtectedRoute>
              <Bill />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoice"
          element={
            <ProtectedRoute>
              <BillPage />
            </ProtectedRoute>
          }
        />
        {/* WhatsApp Bill page must be inside <Routes> */}
        <Route
          path="/whatsapp-bill"
          element={
            <ProtectedRoute>
              <WhatsAppBill />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
