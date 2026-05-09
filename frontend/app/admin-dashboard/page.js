import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { AdminDashboard } from "@/components/dashboard/admin-dashboard";

export default function AdminDashboardPage() {
  return (
    <DashboardShell
      role="admin"
      title="Administrative analytics suite"
      subtitle="Monitor operational health, manage records, and keep departments running smoothly through a premium overview."
    >
      <AdminDashboard />
    </DashboardShell>
  );
}
