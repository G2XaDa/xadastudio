import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Process from "@/components/Process";
import SkillsShowcase from "@/components/SkillsShowcase";
import Testimonials from "@/components/Testimonials";
import WorkShowcase from "@/components/WorkShowcase";
export default function Home() {
  return (
    <>
      <main className="relative w-full">
        <Hero />
        <SkillsShowcase />
        <Process />
        <WorkShowcase />
        <Testimonials />
        <Footer />
      </main>
    </>
  );
}
