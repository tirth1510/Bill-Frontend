import React, { useState } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Download, Plus } from "lucide-react";
import ScannerTab from "@/lib/scannerTab";

// Mock products by barcode
const productDB: Record<string, any> = {
  "123456789012": { name: "Protein Powder", price: 120 },
  "987654321098": { name: "Energy Bar", price: 75 },
};

// Example bills
const initialBills = [
  {
    id: "B001",
    customer: "John Doe",
    amount: "$120.00",
    status: "Paid",
    date: "2025-09-05",
  },
];

export default function BillPage() {
  const [bills, setBills] = useState(initialBills);
  const [open, setOpen] = useState(false);
  const [cart, setCart] = useState<any[]>([]);
  const [barcode, setBarcode] = useState("");

  // Add product by code
  const handleAddByCode = () => {
    if (!barcode) return;
    const product = productDB[barcode];
    if (product) {
      setCart([...cart, { ...product, barcode }]);
      setBarcode("");
    } else {
      alert("Product not found!");
    }
  };

  // Bill preview
  const handlePreviewBill = () => {
    const printWindow = window.open("", "_blank", "width=800,height=600");
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Bill</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1, h2 { text-align: center; margin: 0; }
              .company { text-align: center; margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #333; padding: 8px; text-align: left; }
              th { background: #f0f0f0; }
              .footer { margin-top: 30px; text-align: center; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="company">
              <h1>My Company Pvt Ltd</h1>
              <p>123 Main Street, City</p>
              <p>Email: info@company.com | Phone: 1234567890</p>
            </div>
            <h2>Invoice</h2>
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Product</th>
                  <th>Barcode</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                ${cart
                  .map(
                    (item, i) => `
                  <tr>
                    <td>${i + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.barcode}</td>
                    <td>$${item.price}</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
            <div class="footer">
              <p>Thank you for shopping with us!</p>
            </div>
            <script>window.print();</script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <DashboardLayout>
      <div className="w-full h-full p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-blue-700 ">Billing</h1>
          <Button
          className="bg-blue-800 hover:bg-blue-600"
          onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4 text-white font-semibold" /> Add Bill
          </Button>
        </div>

        {/* Bills Table */}
        <Card className="shadow-lg border">
          <CardHeader>
            <CardTitle className="text-lg">Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>A list of recent bills.</TableCaption>
              <TableHeader className="bg-blue-50">
                <TableRow>
                  <TableHead>Bill ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bills.map((bill) => (
                  <TableRow key={bill.id}>
                    <TableCell className="font-medium">{bill.id}</TableCell>
                    <TableCell>{bill.customer}</TableCell>
                    <TableCell>{bill.amount}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md text-sm font-medium bg-green-100 text-green-700">
                        {bill.status}
                      </span>
                    </TableCell>
                    <TableCell>{bill.date}</TableCell>
                    <TableCell className="flex gap-2 justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-blue-100"
                      >
                        <Eye className="w-5 h-5 text-blue-600" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-green-100"
                      >
                        <Download className="w-5 h-5 text-green-600" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Bill Dialog */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Create Bill</DialogTitle>
            </DialogHeader>

            {/* Tabs for Scanner / Code */}
            <Tabs defaultValue="scanner" className="w-full">
              <TabsList className="grid grid-cols-2 w-full">
                <TabsTrigger value="scanner">Scanner</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>

              {/* Scanner (camera placeholder) */}
              <TabsContent value="scanner" className="mt-4">
                <div className="border rounded-md  flex items-center justify-center text-gray-500">
                  <ScannerTab
                    onDetected={function (code: string): void {
                      throw new Error("Function not implemented.");
                    }}
                  />
                </div>
              </TabsContent>

              {/* Manual Code Entry */}
              <TabsContent value="code" className="p-4 space-y-3">
                <input
                  type="text"
                  placeholder="Enter barcode..."
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="border w-full p-2 rounded-md"
                />
                <Button onClick={handleAddByCode}>Add Product</Button>
              </TabsContent>
            </Tabs>

            {/* Cart Preview */}
            <div className="mt-4 border-t pt-3">
              <h3 className="font-semibold mb-2">Products in Bill</h3>
              {cart.length === 0 ? (
                <p className="text-gray-500 text-sm">No products added yet.</p>
              ) : (
                <ul className="space-y-1 text-sm">
                  {cart.map((item, i) => (
                    <li key={i} className="flex justify-between">
                      <span>{item.name}</span>
                      <span>${item.price}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Preview Bill Button */}
            <div className="flex justify-center mt-4">
              <Button onClick={handlePreviewBill}>Preview Bill</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
