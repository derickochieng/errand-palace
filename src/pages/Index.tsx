import { useRef } from "react";
import { Hero } from "@/components/Hero";
import { Services } from "@/components/Services";
import { HowItWorks } from "@/components/HowItWorks";
import { OrderForm } from "@/components/OrderForm";
import { Footer } from "@/components/Footer";

const Index = () => {
  const orderFormRef = useRef<HTMLDivElement>(null);

  const scrollToOrderForm = () => {
    orderFormRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <Hero onOrderClick={scrollToOrderForm} />
      <Services />
      <HowItWorks />
      <div ref={orderFormRef}>
        <OrderForm />
      </div>
      <Footer />
    </div>
  );
};

export default Index;