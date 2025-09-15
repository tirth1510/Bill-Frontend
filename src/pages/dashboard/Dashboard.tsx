import DashboardLayout from "@/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import ChartLineDefault from "./linechart";
import ChartPieLabel from "./oneDaysell";
import ChartPieDonut from "./oneMonth";
import ChartPieDonutText from "./pie";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 w-full">
        <Card>
          <CardHeader className="flex justify-between items-center">
            <CardTitle>Dashboard Overview</CardTitle>
          </CardHeader>

          {/* 2x2 Chart Grid */}
          <CardContent className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="w-full">
              <ChartLineDefault />
            </div>
            <div className="w-full">
              <ChartPieLabel />
            </div>
            <div className="w-full">
              <ChartPieDonut />
            </div>
            <div className="w-full">
              <ChartPieDonutText />
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
