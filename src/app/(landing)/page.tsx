import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import HowItWorks from "./components/HowItWorks";
import Pricing from "./components/Pricing";
import FinalCTA from "./components/FinalCTA";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}