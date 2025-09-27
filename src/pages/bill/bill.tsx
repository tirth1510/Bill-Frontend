"use client";

import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScannerTab from "@/lib/scannerTab";
import { Camera, CameraOff, MinusCircle, Package } from "lucide-react";
import Searchitem from "./serchitem";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

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

  // Dialog & Customer details
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [whNumber, setWhNumber] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [billPreview, setBillPreview] = useState<CartItem[]>([]);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [apiResponseMsg, setApiResponseMsg] = useState("");

  // Add item to cart
  const handleAddItem = (item: {
    name: string;
    price: number;
    gram?: number;
    barcode?: string;
  }) => {
    const barcodeVal = item.barcode ?? "";
    const index = cart.findIndex(
      (i) =>
        i.name === item.name &&
        (i.gram ?? 0) === (item.gram ?? 0) &&
        i.barcode === barcodeVal &&
        i.price === item.price
    );
    if (index > -1) {
      const newCart = [...cart];
      newCart[index].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity: 1, barcode: barcodeVal }]);
    }
  };

  // Fetch product by barcode
  const fetchProduct = async (
    code: string,
    type: "barcode" | "barCodenumber"
  ) => {
    try {
      const res = await fetch(
        `https://bill-backend-j5en.onrender.com/products/bar-code?${type}=${code}`,
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

  const handleAddByCode = async () => {
    if (!barcode) return;
    const product = await fetchProduct(barcode, "barCodenumber");
    if (!product) return;
    handleAddItem({
      name: product.itemName,
      price: product.price,
      gram: product.gram,
      barcode: product.barcode,
    });
    setBarcode("");
  };

  const handleScanAdd = async (code: string) => {
    const product = await fetchProduct(code, "barcode");
    if (!product) return;
    handleAddItem({
      name: product.itemName,
      price: product.price,
      gram: product.gram,
      barcode: product.barcode,
    });
  };

  // Open customer details dialog
  const handleOpenDialog = () => {
    setBillPreview(cart);
    setDialogOpen(true);
  };

  // Create bill API call
  const handleCreateBill = async () => {
    if (!customerName || !mobileNumber || !paymentMethod) {
      alert("Please fill all required fields");
      return;
    }
    setIsCreating(true);
    try {
      const payload = {
        customerName,
        mobileNumber,
        paymentMethod,
        items: billPreview.map((i) => ({
          barcode: i.barcode ?? "",
          itemName: i.name,
          gram: i.gram ?? 0,
          price: i.price,
          quantity: i.quantity,
        })),
      };

      const res = await fetch(
        "https://bill-backend-j5en.onrender.com/bill/create-bill",
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create bill");

      setDownloadUrl(data.bill.downloadUrl);
      setApiResponseMsg("Bill created successfully!");
      setCart([]);
    } catch (err: any) {
      setApiResponseMsg(err.message || "Server error");
    } finally {
      setIsCreating(false);
    }
  };

  // Send WhatsApp
  const handleSendWhatsApp = () => {
    if (!downloadUrl || !whNumber)
      return alert("Missing WhatsApp number or URL");
    const formattedNumber = whNumber.replace(/\D/g, "");
    const message = `Hello! Your bill is ready.\nDownload here: ${downloadUrl}\n\nThank you for shopping with us!`;
    window.open(
      `https://web.whatsapp.com/send?phone=${formattedNumber}&text=${encodeURIComponent(
        message
      )}`,
      "_blank"
    );
  };

  // Decrease item
  const handleDecreaseItem = (index: number) => {
    const newCart = [...cart];
    if (newCart[index].quantity > 1) {
      newCart[index].quantity -= 1;
    } else {
      newCart.splice(index, 1);
    }
    setCart(newCart);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <DashboardLayout>
      <div className="w-full h-full p-6">
        <h2 className="flex items-center text-2xl font-semibold ml-7 mt-7 bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent mb-5">
          <Package className="w-6 h-6 mr-2 text-blue-600" /> Billing
        </h2>

        <div className="flex gap-6">
          {/* Left Card */}
          <Card className="flex-1 shadow-lg border p-4">
            <CardHeader className="flex justify-between items-center">
              <CardTitle>Add Products</CardTitle>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowScanner(!showScanner)}
              >
                {showScanner ? (
                  <CameraOff className="w-5 h-5" />
                ) : (
                  <Camera className="w-5 h-5" />
                )}
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
                <Button
                  className="bg-blue-500 hover:bg-blue-700 font-semibold p-4"
                  onClick={handleAddByCode}
                >
                  + Add
                </Button>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Cart</h3>
                {cart.length === 0 ? (
                  <p className="text-gray-500">No products added yet.</p>
                ) : (
                  <ul className="space-y-1 text-sm">
                    {cart.map((item, idx) => (
                      <li key={idx} className="flex justify-between">
                        <span>
                          {item.name} x {item.quantity}
                        </span>
                        <span>₹{item.price * item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                )}

                <Button
                  className="mt-4 w-full bg-blue-500 hover:bg-blue-700"
                  onClick={handleOpenDialog}
                  disabled={cart.length === 0}
                >
                  Generate Bill
                </Button>

                <div className="flex justify-end mt-4">
                  <Button
                    variant="destructive"
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                    onClick={() => setCart([])}
                  >
                    Clear Bill
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Right Card - Bill Preview */}
          <Card className="flex-1 shadow-lg border p-4">
            <CardHeader className="text-center">
              <img
                src="./image.png"
                alt="I Mata"
                className="mx-auto h-40 w-auto"
              />
              <h2 className="text-xl font-bold mt-1">I Mata Mall</h2>
              <p className="text-sm text-gray-600">
                Phone: 123-456-7890 | Email: info@mallname.com
              </p>
              <div className="border-b border-dashed my-2"></div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-center">Cart is empty</p>
              ) : (
                <div className="space-y-4">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="border px-2 py-1 text-left">Item</th>
                        <th className="border px-2 py-1 text-center">Qty</th>
                        <th className="border px-2 py-1 text-right">Price</th>
                        <th className="border px-2 py-1 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.map((i, idx) => (
                        <tr key={idx}>
                          <td className="border px-2 py-1">{i.name}</td>
                          <td className="border px-2 py-1 text-center">
                            {i.quantity}
                          </td>
                          <td className="border px-2 py-1 text-right">
                            {i.price * i.quantity}
                          </td>
                          <td className="border px-2 py-1 text-center">
                            <Button
                              size="icon"
                              variant="destructive"
                              onClick={() => handleDecreaseItem(idx)}
                            >
                              <MinusCircle className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="text-right font-semibold text-lg">
                    Total: ₹{total}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="p-9">
          {" "}
          <Searchitem onAddItem={handleAddItem} />{" "}
        </div>
        {/* Dialog for customer details */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Customer Details & Preview</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <input
                type="text"
                placeholder="Customer Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="border w-full p-2 rounded-md"
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="border w-full p-2 rounded-md"
              />
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="border w-full p-2 rounded-md"
              >
                <option value="Cash">Cash</option>
                <option value="Card">Card</option>
                <option value="UPI">UPI</option>
              </select>
              <input
                type="text"
                placeholder="WhatsApp Number (optional)"
                value={whNumber}
                onChange={(e) => setWhNumber(e.target.value)}
                className="border w-full p-2 rounded-md"
              />

              {/* Bill Preview */}
              <div className="border p-2 rounded-md max-h-64 overflow-y-auto">
                {billPreview.map((i, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>
                      {i.name} x {i.quantity}
                    </span>
                    <span>₹{i.price * i.quantity}</span>
                  </div>
                ))}
                <div className="text-right font-semibold mt-2">
                  Total: ₹
                  {billPreview.reduce((a, b) => a + b.price * b.quantity, 0)}
                </div>
              </div>

              {apiResponseMsg && (
                <p className="text-green-600">{apiResponseMsg}</p>
              )}

              <Button
                className="w-full bg-blue-500 text-white mt-2"
                onClick={handleCreateBill}
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Bill"}
              </Button>

              {downloadUrl && (
                <Button
                  className="w-full bg-green-500 text-white mt-2"
                  onClick={handleSendWhatsApp}
                >
                  Send via WhatsApp
                </Button>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
