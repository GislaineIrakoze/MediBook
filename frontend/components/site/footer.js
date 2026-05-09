import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

const social = [FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter];

export function Footer() {
  return (
    <footer className="border-t border-emerald/10 bg-pine py-14 text-white">
      <div className="container-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <p className="font-display text-3xl font-semibold">MediBook</p>
          <p className="mt-4 max-w-sm text-sm leading-7 text-emerald-50/80">
            A premium hospital appointment system for clean scheduling, confident patient
            journeys, and dependable care coordination.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map((Icon, index) => (
              <div
                key={index}
                className="grid h-10 w-10 place-items-center rounded-2xl border border-white/10 bg-white/5"
              >
                <Icon />
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="font-semibold">Quick Links</p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-emerald-50/80">
            <Link href="/">Home</Link>
            <Link href="/login">Login</Link>
            <Link href="/signup">Signup</Link>
            <Link href="/patient-dashboard">Dashboard</Link>
          </div>
        </div>

        <div>
          <p className="font-semibold">Hospital Info</p>
          <div className="mt-4 space-y-3 text-sm text-emerald-50/80">
            <p>24/7 emergency support</p>
            <p>Digital appointment approvals</p>
            <p>Live patient notifications</p>
          </div>
        </div>

        <div>
          <p className="font-semibold">Contact</p>
          <div className="mt-4 space-y-3 text-sm text-emerald-50/80">
            <p>support@medibook.health</p>
            <p>+250 700 000 000</p>
            <p>Kigali, Rwanda</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
