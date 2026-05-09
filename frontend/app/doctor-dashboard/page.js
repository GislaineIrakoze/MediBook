import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { DoctorDashboard } from "@/components/dashboard/doctor-dashboard";

export default function DoctorDashboardPage() {
  return (
    <DashboardShell
      role="doctor"
      title="Doctor operations workspace"
      subtitle="Publish schedules, review patient bookings, and approve appointments with a calm, modern workflow."
    >
      <DoctorDashboard />
    </DashboardShell>
  );
}
