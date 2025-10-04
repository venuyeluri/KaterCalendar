import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/components/DashboardStats";
import { OrdersTable } from "@/components/OrdersTable";
import { CalendarView } from "@/components/CalendarView";
import { PublishMenuDialog } from "@/components/PublishMenuDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getOrders, getMenus } from "@/lib/api";
import { Link } from "wouter";
import type { Order as OrderType } from "@shared/schema";

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: orders = [] } = useQuery<OrderType[]>({
    queryKey: ["/api/orders"],
    queryFn: getOrders,
  });

  const { data: menus = [] } = useQuery({
    queryKey: ["/api/menus"],
    queryFn: getMenus,
  });

  const menuDates = menus.map((menu: any) => new Date(menu.date));

  const formattedOrders = orders.map((order) => {
    const items = JSON.parse(order.items);
    return {
      id: order.id,
      customerName: order.customerName,
      items: items.map((item: any) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      total: parseFloat(order.total),
      date: new Date(order.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      status: order.status as "pending" | "confirmed" | "completed",
    };
  });

  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.total), 0);
  const totalItems = orders.reduce((sum, order) => {
    const items = JSON.parse(order.items);
    return sum + items.reduce((itemSum: number, item: any) => itemSum + item.quantity, 0);
  }, 0);
  const upcomingMenus = menus.filter((menu: any) => new Date(menu.date) >= new Date()).length;

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
          <Link href="/publish-menu">
            <Button data-testid="button-publish-menu">
              <Plus className="mr-2 h-5 w-5" />
              Publish New Menu
            </Button>
          </Link>
        </div>

        <div className="mb-12">
          <DashboardStats
            totalOrders={totalOrders}
            totalRevenue={totalRevenue}
            totalItems={totalItems}
            upcomingMenus={upcomingMenus}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            <CalendarView
              menuDates={menuDates}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setDialogOpen(true);
              }}
            />
          </div>
          <div className="bg-card border border-card-border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link href="/publish-menu">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-create-menu"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Menu
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                data-testid="button-view-all-orders"
              >
                View All Orders
              </Button>
              <Link href="/manage-items">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  data-testid="button-manage-items"
                >
                  Manage Menu Items
                </Button>
              </Link>
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
          <OrdersTable orders={formattedOrders} />
        </div>

        <PublishMenuDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          date={selectedDate}
        />
      </div>
    </div>
  );
}
