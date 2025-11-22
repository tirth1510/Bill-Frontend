import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/dashboard/Dashboard";
import ProductsPage from "./pages/ProductsPage";
import Bill from "./pages/bill/bill";
import BillPage from "./pages/bill/BillPage";
import Login from "./pages/auth/login";
import Pin from "./pages/pin/createpin";
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
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/bill" element={<Bill />} />
        <Route path="/invoice" element={<BillPage />} />
        {/* WhatsApp Bill page must be inside <Routes> */}
        <Route path="/whatsapp-bill" element={<WhatsAppBill />} />
      </Routes>
    </Router>
  );
}

export default App;
