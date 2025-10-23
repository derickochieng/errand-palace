import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { LogOut, Package, Phone, MapPin, FileText } from "lucide-react";

type Order = {
  id: string;
  customer_name: string;
  phone_number: string;
  delivery_address: string;
  product_details: string;
  category: string;
  status: string;
  notes: string | null;
  created_at: string;
};

const AdminDashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
    fetchOrders();
    
    // Subscribe to realtime updates
    const channel = supabase
      .channel('orders-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        () => {
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate("/auth");
    }
  };

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error("Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
    toast.success("Logged out successfully");
  };

  const updateOrderStatus = async (orderId: string, newStatus: 'pending' | 'confirmed' | 'in_progress' | 'delivered' | 'cancelled') => {
    try {
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("id", orderId);

      if (error) throw error;
      toast.success("Order status updated");
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order status");
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      confirmed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      in_progress: "bg-purple-500/10 text-purple-500 border-purple-500/20",
      delivered: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
    };
    return colors[status] || "";
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      gas_cylinder: "Gas Cylinders",
      groceries: "Groceries",
      pharmacy: "Pharmacy",
      electronics: "Electronics",
      food_delivery: "Food Delivery",
      other: "Other",
    };
    return labels[category] || category;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 p-4 sm:p-8">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your delivery orders</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Total Orders</CardDescription>
              <CardTitle className="text-3xl">{orders.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Pending</CardDescription>
              <CardTitle className="text-3xl text-yellow-500">
                {orders.filter(o => o.status === 'pending').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>In Progress</CardDescription>
              <CardTitle className="text-3xl text-purple-500">
                {orders.filter(o => o.status === 'in_progress').length}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>Delivered</CardDescription>
              <CardTitle className="text-3xl text-green-500">
                {orders.filter(o => o.status === 'delivered').length}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No orders yet. Share your order form to start receiving orders!
              </CardContent>
            </Card>
          ) : (
            orders.map((order) => (
              <Card key={order.id} className="hover:shadow-[var(--shadow-soft)] transition-shadow">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-xl">{order.customer_name}</CardTitle>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status.replace('_', ' ')}
                        </Badge>
                        <Badge variant="outline">{getCategoryLabel(order.category)}</Badge>
                      </div>
                      <CardDescription>
                        Ordered on {new Date(order.created_at).toLocaleString()}
                      </CardDescription>
                    </div>
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-full sm:w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>{order.phone_number}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span>{order.delivery_address}</span>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <Package className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <span className="font-medium">Items:</span>
                    <span>{order.product_details}</span>
                  </div>
                  {order.notes && (
                    <div className="flex items-start gap-2 text-sm">
                      <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                      <span className="font-medium">Notes:</span>
                      <span className="text-muted-foreground">{order.notes}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;