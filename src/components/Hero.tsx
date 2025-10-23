import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-delivery.jpg";

export const Hero = ({ onOrderClick }: { onOrderClick: () => void }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[image:var(--gradient-hero)] opacity-10" />
      
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Text content */}
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
              Your Personal
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Errand Runner</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-xl">
              Need gas cylinders, groceries, or anything else delivered? We've got you covered. 
              Fast, reliable delivery service at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="hero" 
                size="lg"
                onClick={onOrderClick}
                className="group"
              >
                Place Your Order
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
              >
                How It Works
              </Button>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border">
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">Fast</div>
                <div className="text-sm text-muted-foreground">Delivery</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">24/7</div>
                <div className="text-sm text-muted-foreground">Available</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-primary">100%</div>
                <div className="text-sm text-muted-foreground">Reliable</div>
              </div>
            </div>
          </div>
          
          {/* Hero image */}
          <div className="relative lg:block hidden">
            <div className="relative rounded-2xl overflow-hidden shadow-[var(--shadow-strong)]">
              <img 
                src={heroImage} 
                alt="Fast and reliable delivery service"
                className="w-full h-auto object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};