import { useState } from "react";
import { CalendarView } from "@/components/CalendarView";
import { MenuCard } from "@/components/MenuCard";
import { OrderSummary } from "@/components/OrderSummary";
import { useToast } from "@/hooks/use-toast";
import salmonImage from "@assets/generated_images/Grilled_salmon_menu_item_6b384824.png";
import saladImage from "@assets/generated_images/Caesar_salad_menu_item_2ee7317d.png";
import pastaImage from "@assets/generated_images/Pasta_primavera_menu_item_a3ece18f.png";
import dessertImage from "@assets/generated_images/Chocolate_lava_cake_dessert_f601292a.png";

const mockMenuItems = [
  {
    id: "salmon-1",
    name: "Grilled Salmon",
    description: "Fresh Atlantic salmon with roasted vegetables and lemon butter sauce",
    price: 24.99,
    image: salmonImage,
    dietary: ["Gluten-free"],
  },
  {
    id: "salad-1",
    name: "Caesar Salad",
    description: "Classic Caesar with crispy croutons, parmesan, and homemade dressing",
    price: 12.99,
    image: saladImage,
    dietary: ["Vegetarian"],
  },
  {
    id: "pasta-1",
    name: "Pasta Primavera",
    description: "Fresh vegetables tossed with pasta in a light olive oil sauce",
    price: 18.99,
    image: pastaImage,
    dietary: ["Vegetarian", "Vegan"],
  },
  {
    id: "dessert-1",
    name: "Chocolate Lava Cake",
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    price: 8.99,
    image: dessertImage,
    dietary: ["Vegetarian"],
  },
];

export default function CustomerOrderPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const today = new Date();
  const menuDates = [
    new Date(today.getFullYear(), today.getMonth(), 15),
    new Date(today.getFullYear(), today.getMonth(), 18),
    new Date(today.getFullYear(), today.getMonth(), 22),
    new Date(today.getFullYear(), today.getMonth(), 25),
  ];

  const handleQuantityChange = (id: string, quantity: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: quantity,
    }));
  };

  const handleSubmitOrder = () => {
    const orderItems = mockMenuItems
      .filter((item) => quantities[item.id] > 0)
      .map((item) => ({
        ...item,
        quantity: quantities[item.id],
      }));

    if (orderItems.length === 0) {
      toast({
        title: "No items selected",
        description: "Please add items to your order before submitting.",
        variant: "destructive",
      });
      return;
    }

    console.log("Order submitted:", orderItems);
    toast({
      title: "Order placed successfully!",
      description: `Your order for ${selectedDate?.toLocaleDateString()} has been received.`,
    });
    
    setQuantities({});
  };

  const orderItems = mockMenuItems
    .filter((item) => quantities[item.id] > 0)
    .map((item) => ({
      id: item.id,
      name: item.name,
      quantity: quantities[item.id],
      price: item.price,
    }));

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
              onDateSelect={(date) => {
                setSelectedDate(date);
                console.log("Selected date:", date);
              }}
            />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary items={orderItems} onSubmit={handleSubmitOrder} />
          </div>
        </div>

        {selectedDate && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Menu for {selectedDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockMenuItems.map((item) => (
                <MenuCard
                  key={item.id}
                  {...item}
                  quantity={quantities[item.id] || 0}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
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
