import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { PatientDashboard } from "@/components/dashboard/patient-dashboard";

export default function PatientDashboardPage() {
  return (
    <DashboardShell
      role="patient"
      title="Patient command center"
      subtitle="Track upcoming appointments, review notifications, and follow the booking flow in one polished space."
    >
      <PatientDashboard />
    </DashboardShell>
  );
}
