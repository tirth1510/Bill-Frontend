import DashboardLayout from "@/layouts/DashboardLayout";
("use client");


import { ProductTable } from "@/pages/products/table";
export default function ProductPage() {
  return (
    <DashboardLayout>
        <ProductTable />
    </DashboardLayout>
  );
}
