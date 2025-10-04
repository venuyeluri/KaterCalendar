import { useState } from "react";
import { DashboardStats } from "@/components/DashboardStats";
import { OrdersTable } from "@/components/OrdersTable";
import { CalendarView } from "@/components/CalendarView";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const mockOrders = [
  {
    id: "1",
    customerName: "John Smith",
    items: [
      { name: "Grilled Salmon", quantity: 2 },
      { name: "Caesar Salad", quantity: 1 },
    ],
    total: 62.97,
    date: "Oct 10, 2025",
    status: "confirmed" as const,
  },
  {
    id: "2",
    customerName: "Sarah Johnson",
    items: [
      { name: "Pasta Primavera", quantity: 3 },
    ],
    total: 56.97,
    date: "Oct 10, 2025",
    status: "pending" as const,
  },
  {
    id: "3",
    customerName: "Mike Davis",
    items: [
      { name: "Chocolate Lava Cake", quantity: 4 },
      { name: "Grilled Salmon", quantity: 1 },
    ],
    total: 60.95,
    date: "Oct 9, 2025",
    status: "completed" as const,
  },
  {
    id: "4",
    customerName: "Emily Brown",
    items: [
      { name: "Caesar Salad", quantity: 2 },
      { name: "Pasta Primavera", quantity: 2 },
    ],
    total: 63.96,
    date: "Oct 10, 2025",
    status: "confirmed" as const,
  },
];

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const today = new Date();
  const menuDates = [
    new Date(today.getFullYear(), today.getMonth(), 15),
    new Date(today.getFullYear(), today.getMonth(), 18),
    new Date(today.getFullYear(), today.getMonth(), 22),
    new Date(today.getFullYear(), today.getMonth(), 25),
  ];

  const handlePublishMenu = () => {
    console.log("Publish new menu clicked");
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Caterer Dashboard</h1>
            <p className="text-lg text-muted-foreground">
              Manage your menus and track orders
            </p>
          </div>
          <Button onClick={handlePublishMenu} data-testid="button-publish-menu">
            <Plus className="mr-2 h-5 w-5" />
            Publish New Menu
          </Button>
        </div>

        <div className="mb-12">
          <DashboardStats
            totalOrders={48}
            totalRevenue={1247.52}
            totalItems={156}
            upcomingMenus={5}
          />
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
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                data-testid="button-create-menu"
              >
                <Plus className="mr-2 h-5 w-5" />
                Create Menu
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                data-testid="button-view-all-orders"
              >
                View All Orders
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                data-testid="button-manage-items"
              >
                Manage Menu Items
              </Button>
            </div>

            {selectedDate && (
              <div className="mt-6 pt-6 border-t border-border">
                <h4 className="font-semibold mb-2">Selected Date</h4>
                <p className="text-sm text-muted-foreground">
                  {selectedDate.toLocaleDateString("en-US", { 
                    month: "long", 
                    day: "numeric", 
                    year: "numeric" 
                  })}
                </p>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6">Recent Orders</h2>
          <OrdersTable orders={mockOrders} />
        </div>
      </div>
    </div>
  );
}
