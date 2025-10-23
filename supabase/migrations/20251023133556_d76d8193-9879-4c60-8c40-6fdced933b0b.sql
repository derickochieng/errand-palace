-- Create enum for order categories
CREATE TYPE public.order_category AS ENUM (
  'gas_cylinder',
  'groceries',
  'pharmacy',
  'electronics',
  'food_delivery',
  'other'
);

-- Create enum for order status
CREATE TYPE public.order_status AS ENUM (
  'pending',
  'confirmed',
  'in_progress',
  'delivered',
  'cancelled'
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  product_details TEXT NOT NULL,
  category order_category NOT NULL,
  status order_status NOT NULL DEFAULT 'pending',
  service_fee DECIMAL(10,2),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert orders (public order submission)
CREATE POLICY "Anyone can create orders"
  ON public.orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Authenticated users (admin) can view all orders
CREATE POLICY "Authenticated users can view all orders"
  ON public.orders
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users (admin) can update orders
CREATE POLICY "Authenticated users can update orders"
  ON public.orders
  FOR UPDATE
  TO authenticated
  USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();