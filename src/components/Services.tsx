import { Flame, ShoppingCart, Pill, Smartphone, UtensilsCrossed, Package } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const services = [
  {
    icon: Flame,
    title: "Gas Cylinders",
    description: "Quick delivery of gas cylinders to your doorstep",
    color: "text-accent"
  },
  {
    icon: ShoppingCart,
    title: "Groceries",
    description: "Fresh groceries delivered from your favorite stores",
    color: "text-primary"
  },
  {
    icon: Pill,
    title: "Pharmacy",
    description: "Medicines and health essentials delivered safely",
    color: "text-destructive"
  },
  {
    icon: Smartphone,
    title: "Electronics",
    description: "Tech gadgets and accessories picked up and delivered",
    color: "text-secondary"
  },
  {
    icon: UtensilsCrossed,
    title: "Food Delivery",
    description: "Your favorite meals from local restaurants",
    color: "text-accent"
  },
  {
    icon: Package,
    title: "Custom Errands",
    description: "Any other item you need - just ask!",
    color: "text-primary"
  }
];

export const Services = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            What Can We <span className="text-primary">Deliver</span>?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From everyday essentials to special requests, we handle all your delivery needs
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index}
                className="group hover:shadow-[var(--shadow-strong)] transition-all duration-300 border-2 hover:border-primary/50"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg bg-muted ${service.color} group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{service.title}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};