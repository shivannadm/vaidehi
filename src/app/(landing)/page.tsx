import Header from "./components/Header";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        {/* other sections (features, contact, etc.) go here */}
      </main>
      <Footer />
    </div>
  );
}
