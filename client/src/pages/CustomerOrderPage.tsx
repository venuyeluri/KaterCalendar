import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { CalendarView } from "@/components/CalendarView";
import { MenuCard } from "@/components/MenuCard";
import { OrderSummary } from "@/components/OrderSummary";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { getMenuItems, getMenus, getMenuByDate, createOrder } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import type { MenuItem } from "@shared/schema";

export default function CustomerOrderPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<{ id: string; items: MenuItem[] } | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [customerName, setCustomerName] = useState("");
  const { toast } = useToast();

  const { data: allMenuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    queryFn: getMenuItems,
  });

  const { data: menus = [] } = useQuery({
    queryKey: ["/api/menus"],
    queryFn: getMenus,
  });

  const createOrderMutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/orders"] });
      toast({
        title: "Order placed successfully!",
        description: `Your order for ${selectedDate?.toLocaleDateString()} has been received.`,
      });
      setQuantities({});
      setCustomerName("");
    },
    onError: () => {
      toast({
        title: "Order failed",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      });
    },
  });

  const menuDates = menus.map((menu: any) => new Date(menu.date));

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    setQuantities({});
    
    const menu = await getMenuByDate(date);
    if (menu) {
      const menuItems = allMenuItems.filter((item: MenuItem) => 
        menu.itemIds?.includes(item.id)
      );
      setSelectedMenu({ id: menu.id, items: menuItems });
    } else {
      setSelectedMenu(null);
    }
  };

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleSubmitOrder = () => {
    if (!selectedMenu || !selectedDate) {
      toast({
        title: "No menu selected",
        description: "Please select a date with an available menu.",
        variant: "destructive",
      });
      return;
    }

    if (!customerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to place an order.",
        variant: "destructive",
      });
      return;
    }

    const orderItems = selectedMenu.items
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        itemId: item.id,
        name: item.name,
        quantity: quantities[item.id],
        price: parseFloat(item.price),
      }));

    if (orderItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add items to your order before submitting.",
        variant: "destructive",
      });
      return;
    }

    const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    createOrderMutation.mutate({
      menuId: selectedMenu.id,
      customerName: customerName.trim(),
      items: orderItems,
      total,
      date: selectedDate.toISOString(),
    });
  };

  const orderItems = selectedMenu?.items
    .filter((item) => quantities[item.id] > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      quantity: quantities[item.id],
      price: parseFloat(item.price),
    })) || [];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Your Meal</h1>
          <p className="text-lg text-muted-foreground">
            Select a date and choose from our available menu items
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <CalendarView
              menuDates={menuDates}
              onDateSelect={handleDateSelect}
            />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-card-border rounded-xl p-6">
              <Label htmlFor="customer-name" className="text-sm font-medium mb-2 block">
                Your Name
              </Label>
              <Input
                id="customer-name"
                type="text"
                placeholder="Enter your name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                data-testid="input-customer-name"
              />
            </div>
            <OrderSummary items={orderItems} onSubmit={handleSubmitOrder} />
          </div>
        </div>

        {selectedDate && selectedMenu && selectedMenu.items.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Menu for {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedMenu.items.map((item) => (
                <MenuCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  description={item.description}
                  price={parseFloat(item.price)}
                  image={item.image}
                  dietary={item.dietary || []}
                  quantity={quantities[item.id] || 0}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          </div>
        )}

        {selectedDate && (!selectedMenu || selectedMenu.items.length === 0) && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              No menu available for this date
            </p>
          </div>
        )}

        {!selectedDate && (
          <div className="text-center py-16">
            <p className="text-lg text-muted-foreground">
              Select a date from the calendar to view available menu items
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
