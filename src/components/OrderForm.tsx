import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  customer_name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone_number: z.string().trim().min(10, "Please enter a valid phone number").max(15),
  delivery_address: z.string().trim().min(10, "Please provide a complete address").max(500),
  product_details: z.string().trim().min(5, "Please describe what you need").max(1000),
  category: z.enum(["gas_cylinder", "groceries", "pharmacy", "electronics", "food_delivery", "other"]),
  notes: z.string().max(500).optional(),
});

type FormData = z.infer<typeof formSchema>;

export const OrderForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customer_name: "",
      phone_number: "",
      delivery_address: "",
      product_details: "",
      category: "groceries",
      notes: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    
    try {
      const orderData = {
        customer_name: data.customer_name,
        phone_number: data.phone_number,
        delivery_address: data.delivery_address,
        product_details: data.product_details,
        category: data.category,
        notes: data.notes || null
      };
      
      const { error } = await supabase
        .from("orders")
        .insert([orderData]);

      if (error) throw error;

      toast.success("Order placed successfully!", {
        description: "We'll contact you shortly to confirm your order.",
      });
      
      form.reset();
    } catch (error) {
      console.error("Error submitting order:", error);
      toast.error("Failed to place order", {
        description: "Please try again or contact us directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="order-form" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Card className="shadow-[var(--shadow-strong)]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Place Your Order</CardTitle>
            <CardDescription className="text-base">
              Fill out the form below and we'll handle the rest
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="customer_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone_number"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="+1234567890" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="delivery_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Delivery Address</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Complete address including street, city, and postal code"
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Category</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="gas_cylinder">Gas Cylinders</SelectItem>
                          <SelectItem value="groceries">Groceries</SelectItem>
                          <SelectItem value="pharmacy">Pharmacy</SelectItem>
                          <SelectItem value="electronics">Electronics</SelectItem>
                          <SelectItem value="food_delivery">Food Delivery</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="product_details"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What do you need?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe the items you need delivered (e.g., '2 large gas cylinders' or 'Weekly groceries: milk, bread, eggs...')"
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Any special instructions or preferences?"
                          className="min-h-[60px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Placing Order...
                    </>
                  ) : (
                    "Place Order"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};