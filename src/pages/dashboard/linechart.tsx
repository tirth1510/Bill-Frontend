"use client";

import { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Label } from "recharts";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const COLORS = [
  "#f59e0b", // Orange
  "#10b981", // Green
  "#ef4444", // Red
  "#3b82f6", // Blue (extra if more payment methods)
  "#8b5cf6", // Purple
];

export default function SalesChart() {
  const [stats, setStats] = useState<{ name: string; value: number }[]>([]);
  const [period, setPeriod] = useState("all"); // default filter

  // calculate total sales
  const totalSales = useMemo(() => {
    return stats.reduce((acc, curr) => acc + curr.value, 0);
  }, [stats]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch(
          `https://bill-backend-j5en.onrender.com/bill/stats/payment-method?period=${period}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setStats(
          data.stats.map((s: any) => ({
            name: s._id,
            value: s.totalAmount,
          }))
        );
      } catch (err) {
        console.error("Error fetching sales stats:", err);
      }
    };
    fetchStats();
  }, [period]);

  return (
    <Card className="shadow-lg border mt-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Sales by Payment Method</CardTitle>
        {/* Dropdown filter */}
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select Period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
            <SelectItem value="all">All Time</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="h-80 flex flex-col items-center justify-between">
        {stats.length === 0 ? (
          <p className="text-gray-500">No sales data yet</p>
        ) : (
          <>
            {/* Chart */}
            <div className="h-60 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}

                    {/* Center Label */}
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor="middle"
                              dominantBaseline="middle"
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className="fill-foreground text-xl font-bold"
                              >
                                ₹{totalSales.toLocaleString()}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 20}
                                className="fill-muted-foreground text-sm"
                              >
                                Total
                              </tspan>
                            </text>
                          );
                        }
                      }}
                    />
                  </Pie>
                  <Tooltip formatter={(val: number) => `₹${val}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend at bottom */}
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {stats.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm text-gray-700 font-medium">
                    {entry.name}: ₹{entry.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
