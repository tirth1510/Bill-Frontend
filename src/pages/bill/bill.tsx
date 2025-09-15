"use client";

import { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ScannerTab from "@/lib/scannerTab";
import { Camera, CameraOff, Package } from "lucide-react";
import Searchitem from "./serchitem";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import jsPDF from "jspdf";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [whNumber, setWhNumber] = useState("");
  const [generatedBill, setGeneratedBill] = useState<any>(null); // store bill data for PDF download

  // Add item to cart
  const handleAddItem = (item: {
    name: string;
    gram?: number;
    price: number;
    barcode?: string;
  }) => {
    const barcode = item.barcode ?? "";
    const index = cart.findIndex(
      (i) =>
        i.name === item.name &&
        (i.gram ?? 0) === (item.gram ?? 0) &&
        i.barcode === barcode
    );

    if (index > -1) {
      const newCart = [...cart];
      newCart[index].quantity += 1;
      setCart(newCart);
    } else {
      setCart([...cart, { ...item, quantity: 1, barcode }]);
    }
  };

  // Fetch product
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

  // Generate bill
  const handleGenerateBill = async () => {
    if (cart.length === 0) return;

    try {
      const itemsPayload = cart.map((item) => ({
        barcode: item.barcode ?? "",
        barcodenumber: item.barcode ?? "",
        quantity: item.quantity,
        itemName: item.name,
        gram: item.gram ?? 0,
        price: item.price,
      }));

      const payload = {
        customerName: "John Doe",
        paymentMethod: "Card",
        items: itemsPayload,
        subtotal: cart.reduce((sum, i) => sum + i.price * i.quantity, 0),
      };

      const res = await fetch(
        `https://bill-backend-j5en.onrender.com/bill/create-bill`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to create bill!");
        return;
      }

      setGeneratedBill(data); // store bill data
      setDialogOpen(true); // open dialog
      setCart([]); // clear cart
    } catch (error) {
      console.error("Error generating bill:", error);
      alert("Server error while creating bill");
    }
  };

  // Send email
  const handleSendEmail = async () => {
    if (!email) return alert("Enter email");
    if (!generatedBill) return alert("Bill not generated yet");

    // send email API
    const res = await fetch("/api/send-bill-email", {
      method: "POST",
      body: JSON.stringify({ email, bill: generatedBill }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) alert("Bill sent via Email!");
  };

  // Send WhatsApp
  const handleSendWhatsApp = async () => {
    if (!whNumber) return alert("Enter WhatsApp number");
    if (!generatedBill) return alert("Bill not generated yet");

    const res = await fetch("/api/send-bill-whatsapp", {
      method: "POST",
      body: JSON.stringify({ whNumber, bill: generatedBill }),
      headers: { "Content-Type": "application/json" },
    });
    if (res.ok) alert("Bill sent via WhatsApp!");
  };

  const handleDownloadPDF = () => {
    if (!generatedBill) return alert("No bill to download!");

    const doc = new jsPDF();
    let y = 10;

    // Header
    doc.setFontSize(16);
    doc.text("MALL NAME", 105, y, { align: "center" });
    y += 6;
    doc.setFontSize(10);
    doc.text("Address Line 1, Address Line 2", 105, y, { align: "center" });
    y += 5;
    doc.text("Phone: 123-456-7890 | Email: info@mallname.com", 105, y, {
      align: "center",
    });
    y += 6;
    doc.setLineWidth(0.2);
    doc.line(10, y, 200, y); // border
    y += 6;

    // Customer info
    doc.setFontSize(12);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, y);
    y += 6;
    doc.text(`Customer Name: ${generatedBill.customerName}`, 10, y);
    y += 6;
    doc.text(`Bill No: ${generatedBill.billNo}`, 10, y);
    y += 8;

    // Table header
    doc.setFontSize(10);
    doc.text("Item", 10, y);
    doc.text("Qty", 80, y, { align: "center" });
    doc.text("Gram", 100, y, { align: "center" });
    doc.text("Price", 140, y, { align: "right" });
    doc.text("Total", 180, y, { align: "right" });
    y += 6;

    // Table rows
    generatedBill.items.forEach((item: any) => {
      doc.text(item.itemName, 10, y);
      doc.text(item.quantity.toString(), 80, y, { align: "center" });
      doc.text(item.gram?.toString() || "-", 100, y, { align: "center" });
      doc.text(`₹${item.price}`, 140, y, { align: "right" });
      doc.text(`₹${item.price * item.quantity}`, 180, y, { align: "right" });
      y += 6;
    });

    y += 4;
    const total = generatedBill.subtotal;
    doc.setFontSize(12);
    doc.text(`Subtotal: ₹${total}`, 140, y, { align: "right" });
    y += 6;
    doc.setLineWidth(0.2);
    doc.line(140, y, 200, y);
    y += 6;
    doc.text(`Total Amount: ₹${total}`, 140, y, { align: "right" });

    // Footer
    y += 12;
    doc.setFontSize(10);
    doc.text("Thank you for shopping with us!", 105, y, { align: "center" });
    y += 5;
    doc.text("Visit again!", 105, y, { align: "center" });

    doc.save(`Bill_${generatedBill.billNo}.pdf`);
  };

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <DashboardLayout>
      <div className="w-full h-full p-6">
        <h2 className="flex items-center text-2xl font-semibold ml-7 mt-7 bg-gradient-to-r from-blue-400 to-blue-700 bg-clip-text text-transparent  mb-5">
          <Package className="w-6 h-6 mr-2 text-blue-600" />
          Billing
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
                onClick={handleAddByCode}>
                  + Add</Button>
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
                  className="mt-4 w-full  bg-blue-500 hover:bg-blue-700 "
                  onClick={handleGenerateBill}
                  disabled={cart.length === 0}
                >
                  Generate Bill
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Right Card: Bill Display */}
          <Card className="flex-1 shadow-lg border p-4">
            <CardHeader>
              <CardTitle className="text-center text-xl font-bold">
                MALL NAME
              </CardTitle>
              <p className="text-center text-sm text-gray-600">
                Address Line 1, Address Line 2
              </p>
              <p className="text-center text-sm text-gray-600">
                Phone: 123-456-7890 | Email: info@mallname.com
              </p>
              <div className="border-b border-dashed my-2"></div>
            </CardHeader>
            <CardContent>
              {cart.length === 0 ? (
                <p className="text-gray-500">Cart is empty</p>
              ) : (
                <div className="space-y-4">
                  <div className="text-sm">
                    <p>
                      <strong>Date:</strong> {new Date().toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Customer Name:</strong> John Doe
                    </p>
                    <p>
                      <strong>Customer ID:</strong> CUST001
                    </p>
                  </div>

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
                          <td className="p-2 text-center">
                            {item.gram || "—"}
                          </td>
                          <td className="p-2 text-right">₹{item.price}</td>
                          <td className="p-2 text-right">
                            ₹{item.price * item.quantity}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="text-right font-semibold space-y-1">
                    <p>Subtotal: ₹{total}</p>
                    <p className="text-lg border-t border-gray-400 pt-2">
                      Total Amount: ₹{total}
                    </p>
                  </div>

                  <div className="text-center border-t border-dashed pt-3">
                    <p className="text-gray-700 font-medium">
                      Thank you for shopping with us!
                    </p>
                    <p className="text-gray-500 text-sm">Visit again!</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="p-9">
          <Searchitem onAddItem={handleAddItem} />
        </div>

        {/* Dialog for Email / WhatsApp / Download */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Send / Download Bill</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="email" className="space-y-4">
              <TabsList>
                <TabsTrigger value="email">Email</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
              </TabsList>

              <TabsContent value="email">
                <input
                  type="email"
                  placeholder="Enter email"
                  className="border w-full p-2 rounded-md"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Button className="mt-2 w-full" onClick={handleSendEmail}>
                  Send Email
                </Button>
              </TabsContent>

              <TabsContent value="whatsapp">
                <input
                  type="text"
                  placeholder="Enter WhatsApp number"
                  className="border w-full p-2 rounded-md"
                  value={whNumber}
                  onChange={(e) => setWhNumber(e.target.value)}
                />
                <Button className="mt-2 w-full" onClick={handleSendWhatsApp}>
                  Send WhatsApp
                </Button>
              </TabsContent>
            </Tabs>

            <div className="mt-4 text-center">
              <Button onClick={handleDownloadPDF}>Download PDF</Button>
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
