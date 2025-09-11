"use client";

import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScannerTab from "@/lib/scannerTab";
import { Camera, CameraOff } from "lucide-react";

interface CartItem {
  name: string;
  price: number;
  barcode: string;
  quantity: number;
  gram?: number;
}

export default function BillPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [barcode, setBarcode] = useState("");
  const [showScanner, setShowScanner] = useState(false);


  // Fetch product from backend
  const fetchProduct = async (code: string, type: "barcode" | "barCodenumber") => {
    try {
      const res = await fetch(
        `${process.env.VITE_FRONTEND_LIVE_URL}/products/bar-code?${type}=${code}`,
        { credentials: "include" }
      );
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Product not found!");
        return null;
      }
      return data.data;
    } catch (error) {
      console.error("Error fetching product:", error);
      alert("Server error");
      return null;
    }
  };

  // Add product manually
  const handleAddByCode = async () => {
    if (!barcode) return;
    const product = await fetchProduct(barcode, "barCodenumber");
    if (!product) return;

    const index = cart.findIndex((i) => i.barcode === product.barcode);
    if (index > -1) {
      const newCart = [...cart];
      newCart[index].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, {
        name: product.itemName,
        price: product.price,
        gram: product.gram,
        barcode: product.barcode,
        quantity: 1,
      }]);
    }
    setBarcode("");
  };

  // Add product via scanner
  const handleScanAdd = async (code: string) => {
    const product = await fetchProduct(code, "barcode");
    if (!product) return;

    const index = cart.findIndex((i) => i.barcode === product.barcode);
    if (index > -1) {
      const newCart = [...cart];
      newCart[index].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, {
        name: product.itemName,
        price: product.price,
        gram: product.gram,
        barcode: product.barcode,
        quantity: 1,
      }]);
    }
  };

  // Generate Bill
  const handleGenerateBill = async () => {
    if (cart.length === 0) return;

    try {
      const payload = {
        customerName: "John Doe", // could be dynamic
        paymentMethod: "Card",
        items: cart.map(item => ({
          barcode: item.barcode,
          barcodenumber: item.barcode,
          quantity: item.quantity
        }))
      };

      const res = await fetch(`${process.env.VITE_FRONTEND_LIVE_URL}/bill/create-bill`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create bill!");
        return;
      }

      setCart([]); // clear cart
    } catch (error) {
      console.error("Error generating bill:", error);
      alert("Server error while creating bill");
    }
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <DashboardLayout>
      <div className="w-full h-full p-6">
        <h1 className="text-2xl font-bold text-blue-700 mb-4">Billing</h1>
        <div className="flex gap-6">
          {/* Left: Add products */}
          <Card className="flex-1 shadow-lg border p-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Add Products</CardTitle>
              <Button variant="outline" size="icon" onClick={() => setShowScanner(!showScanner)}>
                {showScanner ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {showScanner && (
                <div className="border rounded-md p-2 flex items-center justify-center text-gray-500">
                  <ScannerTab onDetected={handleScanAdd} />
                </div>
              )}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter barCodenumber..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="border w-full p-2 rounded-md"
                />
                <Button onClick={handleAddByCode}>Add</Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cart</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500">No products added yet.</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {cart.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>{item.name} x {item.quantity}</span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                )}
                <Button
                  className="mt-4 w-full"
                  onClick={handleGenerateBill}
                  disabled={cart.length === 0}
                >
                  Generate Bill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right: Bill Display */}
          <Card className="flex-1 shadow-lg border p-4">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold">MALL NAME</CardTitle>
              <p className="text-center text-sm text-gray-600">Address Line 1, Address Line 2</p>
              <p className="text-center text-sm text-gray-600">Phone: 123-456-7890 | Email: info@mallname.com</p>
              <div className="border-b border-dashed my-2"></div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {/* Bill Details */}
                  <div className="text-sm">
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                  
                    <p><strong>Customer Name:</strong> John Doe</p>
                    <p><strong>Customer ID:</strong> CUST001</p>
                  </div>

                  {/* Items Table */}
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100 border-b">
                        <th className="p-2 text-left">Item</th>
                        <th className="p-2 text-center">Qty</th>
                        <th className="p-2 text-center">Gram</th>
                        <th className="p-2 text-right">Price</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((item, idx) => (
                        <tr key={idx} className="border-b hover:bg-gray-50">
                          <td className="p-2">{item.name}</td>
                          <td className="p-2 text-center">{item.quantity}</td>
                          <td className="p-2 text-center">{item.gram || "—"}</td>
                          <td className="p-2 text-right">₹{item.price}</td>
                          <td className="p-2 text-right">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  {/* Totals */}
                  <div className="text-right font-semibold space-y-1">
                    <p>Subtotal: ₹{total}</p>
                    <p className="text-lg border-t border-gray-400 pt-2">Total Amount: ₹{total}</p>
                  </div>

                  {/* Footer */}
                  <div className="text-center border-t border-dashed pt-3">
                    <p className="text-gray-700 font-medium">Thank you for shopping with us!</p>
                    <p className="text-gray-500 text-sm">Visit again!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
