import { ClipboardList, ShoppingBag, Truck, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Place Your Order",
    description: "Fill out a simple form with your delivery details and what you need"
  },
  {
    icon: ShoppingBag,
    title: "We Confirm & Purchase",
    description: "We confirm your order and head to the store to get your items"
  },
  {
    icon: Truck,
    title: "Fast Delivery",
    description: "Your order is delivered directly to your address quickly and safely"
  },
  {
    icon: CheckCircle,
    title: "Mission Complete",
    description: "Receive your items and enjoy the convenience!"
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            How It <span className="text-primary">Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, fast, and hassle-free delivery in 4 easy steps
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative text-center group">
                {/* Step number */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-[var(--shadow-soft)]">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Icon className="w-10 h-10 text-primary" />
                </div>
                
                {/* Content */}
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
                
                {/* Connector line (except for last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};