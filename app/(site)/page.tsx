import About from "@/components/home/about";
import Contact from "@/components/home/contact";
import Experience from "@/components/home/experience";
import Hero from "@/components/home/hero";
import Metrics from "@/components/home/metrics";
import Work from "@/components/home/work";

export default function Home() {
  return (
    <>
      <Hero />
      <Metrics />
      <Work />
      <Experience />
      <About />
      <Contact />
    </>
  );
}
