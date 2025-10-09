"use client";

import { useEffect, useState, useRef } from "react";
import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Loader from "@/layouts/Loading";

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
  const [loading, setLoading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
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
        setLoading(false);
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
              body {
                font-family: Arial, sans-serif;
                margin: 30px;
                color: #000;
                background: #fff;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                background: #fff;
              }
              th, td {
                border: 1px solid black;
                padding: 8px;
                font-size: 13px;
              }
              th {
                text-align: center;
                font-weight: bold;
                background: #fff;
              }
              td.text-center { text-align: center; }
              td.text-right { text-align: right; }
              tfoot td { font-weight: bold; }

              img {
                display: block;
                margin: 0 auto;
              }

              @media print {
                body {
                  -webkit-print-color-adjust: exact;
                }
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
          {/* Filters + Print */}
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

        {/* Table */}
        <CardContent ref={reportRef}>
          {loading ? (
            <Loader />
          ) : items.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No sales data yet</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-black border-collapse bg-white">
                <thead>
  {/* Header Row */}
  <tr>
    <th colSpan={6} className="border border-black p-2">
      <div className="flex items-center justify-between">
        {/* Left: Logo (smaller & fixed size) */}
        <img
          src="/image.png"
          alt="Shop Logo"
          className="h-12 w-12 object-contain"
        />

        {/* Center: Title */}
        <div className="flex-1 text-center">
          <h2 className="text-base font-bold">I MATA</h2>
        </div>

        {/* Right: Phone */}
        <div className="text-right">
          <p className="text-xs font-medium">Phone: +91-9876543210</p>
        </div>
      </div>
    </th>
  </tr>

  {/* Column Headers */}
  <tr>
    <th className="border border-black p-2 text-left w-[30%]">Item Name</th>
    <th className="border border-black p-2 text-center w-[10%]">Quantity</th>
    <th className="border border-black p-2 text-center text-xs w-[15%]">Gram / Item</th>
    <th className="border border-black p-2 text-center text-xs w-[15%]">Total Gram</th>
    <th className="border border-black p-2 text-center text-xs w-[15%]">Price (₹)</th>
    <th className="border border-black p-2 text-right text-xs w-[15%]">Revenue (₹)</th>
  </tr>
</thead>


                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border border-black p-2">
                        {item.itemName}
                      </td>
                      <td className="border border-black p-2 text-center">
                        {item.quantitySold}
                      </td>
                      <td className="border border-black p-2 text-center text-xs">
                        {item.gramPerUnit} g
                      </td>
                      <td className="border border-black p-2 text-center text-xs">
                        {item.totalGram} g
                      </td>
                      <td className="border border-black p-2 text-center text-xs">
                        ₹{item.price.toLocaleString("en-IN")}
                      </td>
                      <td className="border border-black p-2 text-right text-xs">
                        ₹{item.totalRevenue.toLocaleString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>

                {/* Footer */}
                <tfoot>
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-black p-2 text-right font-semibold"
                    >
                      Subtotal
                    </td>
                    <td className="border border-black p-2 text-right font-semibold">
                      ₹{totalAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan={5}
                      className="border border-black p-2 text-right font-bold"
                    >
                      Total
                    </td>
                    <td className="border border-black p-2 text-right font-bold">
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
