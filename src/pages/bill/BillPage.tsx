"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/layouts/Loading"
interface ItemReport {
  _id: string;
  itemName: string;
  price: number;
  gramPerUnit: number;
  quantitySold: number;
  totalRevenue: number;
  totalGram: number;
}

export default function ItemsReport() {
  const [items, setItems] = useState<ItemReport[]>([]);
  const [period, setPeriod] = useState("all");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [loading, setLoading] = useState(false); // ✅ loader state
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true); // ✅ start loader
        let url = `https://bill-backend-j5en.onrender.com/bill/stats/items-report?period=${period}`;
        if (period === "custom" && from && to) url += `&from=${from}&to=${to}`;

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        const itemsWithTotalGram = data.items.map((item: any) => ({
          ...item,
          totalGram: item.quantitySold * item.gramPerUnit,
        }));

        setItems(itemsWithTotalGram);
      } catch (err) {
        console.error("Error fetching items report:", err);
      } finally {
        setLoading(false); // ✅ stop loader
      }
    };

    fetchItems();
  }, [period, from, to]);

  const totalAmount = items.reduce((acc, item) => acc + item.totalRevenue, 0);

  const handlePrint = () => {
    if (!reportRef.current) return;
    const printContent = reportRef.current.innerHTML;
    const newWindow = window.open("", "_blank", "width=900,height=700");

    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>Items Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; color: #1f2937; }
              h2, h3, p { margin: 2px 0; text-align: center; }
              table { width: 100%; border-collapse: collapse; margin-top: 15px; }
              th, td { border: 1px solid #d1d5db; padding: 10px; }
              th { background-color: #f3f4f6; text-align: center; font-weight: 600; }
              td.text-center { text-align: center; }
              td.text-right { text-align: right; }
              tr:nth-child(even) { background-color: #f9fafb; }
              tr:hover { background-color: #e0f2fe; }
              .total { text-align: right; font-weight: bold; margin-top: 15px; }
              @media print {
                body { -webkit-print-color-adjust: exact; }
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
              }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.print();
    }
  };

  return (
    <DashboardLayout>
      <Card className="shadow-lg border mt-6">
        <CardHeader className="flex flex-col md:flex-row items-center justify-between gap-4">
          <CardTitle>Items Report</CardTitle>
          <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="6month">Last 6 Months</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>

            {period === "custom" && (
              <div className="flex gap-1">
                <input
                  type="date"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border rounded px-2 py-1"
                />
                <input
                  type="date"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
            )}

            <button
              onClick={handlePrint}
              className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700 transition"
            >
              Print / Download
            </button>
          </div>
        </CardHeader>

        <CardContent ref={reportRef}>
          {loading ? (
            <>
            <Loader />
            </>
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No sales data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr>
                    <th colSpan={6} className="text-center p-3 border-b-2 border-gray-300">
                      <h2 className="text-xl font-bold">I MATA</h2>
                    </th>
                  </tr>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-center">Quantity Sold</th>
                    <th className="p-2 text-center">Gram per Item</th>
                    <th className="p-2 text-center">Total Gram Sold</th>
                    <th className="p-2 text-center">Price per Item (₹)</th>
                    <th className="p-2 text-right">Total Revenue (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-blue-50 even:bg-gray-50">
                      <td className="p-2">{item.itemName}</td>
                      <td className="p-2 text-center">{item.quantitySold}</td>
                      <td className="p-2 text-center">{item.gramPerUnit} g</td>
                      <td className="p-2 text-center">{item.totalGram} g</td>
                      <td className="p-2 text-center">
                        ₹{item.price.toLocaleString("en-IN")}
                      </td>
                      <td className="p-2 text-right">
                        ₹{item.totalRevenue.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold border-t bg-gray-100">
                    <td className="p-2 text-left" colSpan={5}>
                      Total Amount
                    </td>
                    <td className="p-2 text-right">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
