"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

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

  useEffect(() => {
    const fetchItems = async () => {
      try {
        let url = `${process.env.VITE_FRONTEND_LIVE_URL}/bill/stats/items-report?period=${period}`;
        if (period === "custom" && from && to) {
          url += `&from=${from}&to=${to}`;
        }

        const res = await fetch(url, { credentials: "include" });
        const data = await res.json();

        const itemsWithTotalGram = data.items.map((item: any) => ({
          ...item,
          totalGram: item.quantitySold * item.gramPerUnit,
        }));

        setItems(itemsWithTotalGram);
      } catch (err) {
        console.error("Error fetching items report:", err);
      }
    };

    fetchItems();
  }, [period, from, to]);

  return (
    <Card className="shadow-lg border mt-6">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <CardTitle>Items Report</CardTitle>

        <div className="flex gap-2">
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
                className="border rounded p-1"
              />
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="border rounded p-1"
              />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent>
        {items.length === 0 ? (
          <p className="text-gray-500">No sales data yet</p>
        ) : (
          <>
            {/* Optional Bar Chart */}
            <div className="h-64 mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={items}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="itemName" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => value.toLocaleString()} />
                  <Legend />
                  <Bar dataKey="quantitySold" name="Quantity Sold" fill="#3b82f6" />
                  <Bar dataKey="totalGram" name="Total Gram Sold" fill="#10b981" />
                  <Bar dataKey="totalRevenue" name="Total Revenue" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table: Always show all items */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-2 text-left">Item Name</th>
                    <th className="p-2 text-center">Quantity Sold</th>
                    <th className="p-2 text-center">Gram per Item</th>
                    <th className="p-2 text-center">Total Gram Sold</th>
                    <th className="p-2 text-center">Price per Item</th>
                    <th className="p-2 text-right">Total Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-2">{item.itemName}</td>
                      <td className="p-2 text-center">{item.quantitySold}</td>
                      <td className="p-2 text-center">{item.gramPerUnit} g</td>
                      <td className="p-2 text-center">{item.totalGram} g</td>
                      <td className="p-2 text-center">₹{item.price.toLocaleString()}</td>
                      <td className="p-2 text-right">₹{item.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
