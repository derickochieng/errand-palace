import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type FormData = z.infer<typeof formSchema>;

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/admin");
      }
    };
    checkUser();
  }, [navigate]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/admin`,
          },
        });

        if (error) throw error;

        toast.success("Account created successfully!", {
          description: "You can now log in with your credentials.",
        });
        setIsSignUp(false);
        form.reset();
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: data.email,
          password: data.password,
        });

        if (error) throw error;

        toast.success("Welcome back!");
        navigate("/admin");
      }
    } catch (error: any) {
      toast.error(isSignUp ? "Failed to create account" : "Failed to log in", {
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md shadow-[var(--shadow-strong)]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {isSignUp ? "Create Admin Account" : "Admin Login"}
          </CardTitle>
          <CardDescription>
            {isSignUp
              ? "Create an account to manage orders"
              : "Sign in to access your admin dashboard"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="admin@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </>
                ) : (
                  <>{isSignUp ? "Sign Up" : "Sign In"}</>
                )}
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  form.reset();
                }}
              >
                {isSignUp
                  ? "Already have an account? Sign In"
                  : "Need an account? Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;