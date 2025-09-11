"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface TopItem {
  _id: string; // Barcode or unique ID
  itemName: string; // Name of the item
  quantitySold: number; // Total quantity sold
  gramPerUnit: number; // Gram per item
  totalRevenue: number; // Total revenue generated from this item
  totalGram?: number; //
  price?:number;    // Computed total gram (quantitySold * gramPerUnit)
}

export default function TopSellingItems() {
  const [topItems, setTopItems] = useState<TopItem[]>([]);
  const [period] = useState<string>("all");

  useEffect(() => {
    const fetchTopItems = async () => {
      try {
        const res = await fetch(
          `${
            process.env.VITE_FRONTEND_LIVE_URL
          }/bill/stats/top-items?period=${period}`,
          { credentials: "include" }
        );
        const data = await res.json();
        // Add totalGram for each item
        const itemsWithTotalGram: TopItem[] = data.items.map(
          (item: TopItem) => ({
            ...item,
            totalGram: item.quantitySold * item.gramPerUnit,
          })
        );
        setTopItems(itemsWithTotalGram);
      } catch (err) {
        console.error("Error fetching top items:", err);
      }
    };
    fetchTopItems();
  }, [period]);

  return (
    <Card className="shadow-lg border mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Top Selling Items</CardTitle>
      </CardHeader>

      <CardContent>
        {topItems.length === 0 ? (
          <p className="text-gray-500">No sales data yet</p>
        ) : (
          <>
            {/* Table */}
            <table className="w-full text-sm border-collapse mb-6">
              <thead>
                <tr className="bg-gray-100 border-b">
                  <th className="p-2 text-left">Item Name</th>
                  <th className="p-2 text-center">Quantity Sold</th>
                  <th className="p-2 text-center">Gram per Item</th>
                  <th className="p-2 text-center">Total Gram Sold</th>
                  <th className="p-2 text-center">Item Price</th>
                  <th className="p-2 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {topItems.map((item, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50">
                    <td className="p-2">{item.itemName}</td>
                    <td className="p-2 text-center">{item.quantitySold}</td>
                    <td className="p-2 text-center">{item.gramPerUnit} g</td>
                    <td className="p-2 text-center">{item.totalGram} g</td>
                    <td className="p-2 text-center">{item.price} /-</td>
                    <td className="p-2 text-right">
                      ₹{item.totalRevenue.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bar Chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={topItems}
                  margin={{ top: 20, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="itemName" />
                  <YAxis />
                  <Tooltip formatter={(value) => value.toLocaleString()} />
                  <Legend />
                  <Bar
                    dataKey="quantitySold"
                    name="Quantity Sold"
                    fill="#3b82f6"
                  />
                  <Bar
                    dataKey="totalGram"
                    name="Total Gram Sold"
                    fill="#10b981"
                  />
                  <Bar
                    dataKey="totalRevenue"
                    name="Total Revenue"
                    fill="#f59e0b"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
