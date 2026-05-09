import { AuthShell } from "@/components/auth/auth-shell";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <AuthShell
      mode="Signup"
      title="Create your MediBook account"
      description="Register as a patient, doctor, or admin with a refined onboarding form built for real healthcare teams."
      sideTitle="A cleaner way to start the care journey"
      sideCopy="Use the same premium interface to onboard patients, create doctor access, and support administrators with role-aware workflows."
    >
      <SignupForm />
    </AuthShell>
  );
}
