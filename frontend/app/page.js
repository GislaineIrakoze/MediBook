import { Navbar } from "@/components/site/navbar";
import { Hero } from "@/components/site/hero";
import { StatsSection } from "@/components/site/stats";
import { DepartmentsSection } from "@/components/site/departments";
import { TopDoctorsSection } from "@/components/site/top-doctors";
import { ProcessSection } from "@/components/site/process";
import { TestimonialsSection } from "@/components/site/testimonials";
import { Footer } from "@/components/site/footer";

export default function HomePage() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsSection />
      <DepartmentsSection />
      <TopDoctorsSection />
      <ProcessSection />
      <TestimonialsSection />
      <Footer />
    </main>
  );
}
