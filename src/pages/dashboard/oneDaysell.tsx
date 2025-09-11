"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function SalesTrendChart() {
  const [stats, setStats] = useState<{ date: string; totalSales: number }[]>([]);
  const [range, setRange] = useState("month");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `${process.env.VITE_FRONTEND_LIVE_URL}/bill/stats/sales-trend?range=${range}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setStats(data.stats);
      } catch (err) {
        console.error("Error fetching sales trend:", err);
      }
    };
    fetchStats();
  }, [range]);

  return (
    <Card className="shadow-lg border mt-6">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Sales Trend (Revenue)</CardTitle>
        <Select onValueChange={setRange} defaultValue={range}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="day">Today</SelectItem>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-80">
        {stats.length === 0 ? (
          <p className="text-gray-500">No sales data yet</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(val: number) => `₹${val}`} />
              <Line type="monotone" dataKey="totalSales" stroke="#3b82f6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
