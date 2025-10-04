import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CalendarView } from "@/components/CalendarView";
import { MenuOrderDialog } from "@/components/MenuOrderDialog";
import { getMenuItems, getMenus, getMenuByDate } from "@/lib/api";
import type { MenuItem } from "@shared/schema";

export default function CustomerOrderPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<{ id: string; items: MenuItem[] } | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: allMenuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    queryFn: getMenuItems,
  });

  const { data: menus = [] } = useQuery({
    queryKey: ["/api/menus"],
    queryFn: getMenus,
  });

  const menuDates = menus.map((menu: any) => new Date(menu.date));

  const handleDateSelect = async (date: Date) => {
    setSelectedDate(date);
    
    const menu = await getMenuByDate(date);
    if (menu) {
      const menuItems = allMenuItems.filter((item: MenuItem) => 
        menu.itemIds?.includes(item.id)
      );
      setSelectedMenu({ id: menu.id, items: menuItems });
      setDialogOpen(true);
    } else {
      setSelectedMenu(null);
      setDialogOpen(false);
    }
  };


  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Order Your Meal</h1>
          <p className="text-lg text-muted-foreground">
            Select a date from the calendar to view available menu items and place your order
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <CalendarView
            menuDates={menuDates}
            onDateSelect={handleDateSelect}
          />
        </div>

        <MenuOrderDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          date={selectedDate}
          menuId={selectedMenu?.id || null}
          menuItems={selectedMenu?.items || []}
        />
      </div>
    </div>
  );
}
