import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import SkillsShowcase from "@/components/SkillsShowcase";
import WorkShowcase from "@/components/WorkShowcase";
export default function Home() {
  return (
    <>
      <main className="relative w-full">
        <Hero />
        <SkillsShowcase />
        <WorkShowcase />
        <Footer />
      </main>
    </>
  );
}
