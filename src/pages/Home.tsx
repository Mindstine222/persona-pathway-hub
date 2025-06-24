
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import ServicesOverview from "@/components/ServicesOverview";
import Testimonials from "@/components/Testimonials";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ServicesOverview />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;
