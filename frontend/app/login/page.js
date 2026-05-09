import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <AuthShell
      mode="Login"
      title="Welcome back to MediBook"
      description="Sign in to manage appointments, schedules, and notifications across the platform."
      sideTitle="Professional access to patient care workflows"
      sideCopy="Doctors, patients, and admins all step into the same elegant digital experience, with each dashboard shaped to the work ahead."
    >
      <LoginForm />
    </AuthShell>
  );
}
