import DashboardLayout from "@/layouts/DashboardLayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="w-full h-full bg-green-100 p-6 rounded-lg">
        <h1 className="text-2xl font-bold mb-4">Page Details</h1>
        <p>This content now fits perfectly next to the sidebar and scrolls properly if needed.</p>
      </div>
    </DashboardLayout>
  );
}
