import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { getMenuItems, createMenu } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { CalendarIcon } from "lucide-react";
import type { MenuItem } from "@shared/schema";

export default function PublishMenuPage() {
  const [, navigate] = useLocation();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [maxOrders, setMaxOrders] = useState<string>("50");
  const { toast } = useToast();

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    queryFn: getMenuItems,
  });

  const publishMenuMutation = useMutation({
    mutationFn: ({ date, itemIds, maxOrders }: { date: Date; itemIds: string[]; maxOrders: number }) => 
      createMenu(date, itemIds, maxOrders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menus"] });
      toast({
        title: "Menu published successfully!",
        description: `Menu for ${selectedDate?.toLocaleDateString()} is now available.`,
      });
      navigate("/dashboard");
    },
    onError: () => {
      toast({
        title: "Failed to publish menu",
        description: "There was an error publishing your menu. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleItemToggle = (itemId: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId);
    } else {
      newSelected.add(itemId);
    }
    setSelectedItems(newSelected);
  };

  const handlePublish = () => {
    if (!selectedDate) {
      toast({
        title: "No date selected",
        description: "Please select a date for the menu.",
        variant: "destructive",
      });
      return;
    }

    if (selectedItems.size === 0) {
      toast({
        title: "No items selected",
        description: "Please select at least one menu item.",
        variant: "destructive",
      });
      return;
    }

    const maxOrdersNum = parseInt(maxOrders);
    if (isNaN(maxOrdersNum) || maxOrdersNum <= 0) {
      toast({
        title: "Invalid order limit",
        description: "Please enter a valid number of maximum orders.",
        variant: "destructive",
      });
      return;
    }

    publishMenuMutation.mutate({
      date: selectedDate,
      itemIds: Array.from(selectedItems),
      maxOrders: maxOrdersNum,
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Publish Menu</h1>
          <p className="text-lg text-muted-foreground">
            Select a date and menu items to publish
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <CalendarIcon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Select Date</h2>
              </div>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-lg border"
                data-testid="calendar-date-picker"
              />
            </Card>

            <div>
              <h2 className="text-xl font-semibold mb-4">Select Menu Items</h2>
              {menuItems.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No menu items available. Create some items first.
                  </p>
                  <Button onClick={() => navigate("/manage-items")} data-testid="button-create-items">
                    Create Menu Items
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`p-4 cursor-pointer transition-all ${
                        selectedItems.has(item.id) ? "border-primary" : ""
                      }`}
                      onClick={() => handleItemToggle(item.id)}
                      data-testid={`menu-item-${item.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={() => handleItemToggle(item.id)}
                          data-testid={`checkbox-${item.id}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold">{item.name}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {item.description}
                              </p>
                              <p className="text-sm font-bold text-primary mt-1">
                                ${parseFloat(item.price).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h3 className="text-xl font-semibold mb-4">Menu Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <p className="font-medium">
                    {selectedDate?.toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }) || "Not selected"}
                  </p>
                </div>

                <div>
                  <Label className="text-sm text-muted-foreground">Items Selected</Label>
                  <p className="font-medium">{selectedItems.size} items</p>
                </div>

                <div>
                  <Label htmlFor="max-orders" className="text-sm font-medium mb-2 block">
                    Maximum Orders
                  </Label>
                  <Input
                    id="max-orders"
                    type="number"
                    min="1"
                    value={maxOrders}
                    onChange={(e) => setMaxOrders(e.target.value)}
                    placeholder="50"
                    data-testid="input-max-orders"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    How many total orders you can handle for this date
                  </p>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handlePublish}
                disabled={!selectedDate || selectedItems.size === 0 || publishMenuMutation.isPending}
                data-testid="button-publish"
              >
                {publishMenuMutation.isPending ? "Publishing..." : "Publish Menu"}
              </Button>

              <Button
                variant="outline"
                className="w-full mt-3"
                onClick={() => navigate("/dashboard")}
                data-testid="button-cancel"
              >
                Cancel
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
