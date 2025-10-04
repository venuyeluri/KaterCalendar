import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getMenuItems, createMenu } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { CalendarIcon } from "lucide-react";
import type { MenuItem } from "@shared/schema";

interface PublishMenuDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date | null;
}

export function PublishMenuDialog({
  open,
  onOpenChange,
  date,
}: PublishMenuDialogProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());
  const [maxOrders, setMaxOrders] = useState<string>("50");
  const { toast } = useToast();

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    queryFn: getMenuItems,
  });

  useEffect(() => {
    if (!open) {
      setSelectedItems(new Set());
      setMaxOrders("50");
    }
  }, [open]);

  const publishMenuMutation = useMutation({
    mutationFn: ({ date, itemIds, maxOrders }: { date: Date; itemIds: string[]; maxOrders: number }) => 
      createMenu(date, itemIds, maxOrders),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menus"] });
      toast({
        title: "Menu published successfully!",
        description: `Menu for ${date?.toLocaleDateString()} is now available.`,
      });
      onOpenChange(false);
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
    if (!date) {
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
      date,
      itemIds: Array.from(selectedItems),
      maxOrders: maxOrdersNum,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col" data-testid="dialog-publish-menu">
        <DialogHeader>
          <DialogTitle>
            Publish Menu for {date?.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </DialogTitle>
          <DialogDescription>
            Select menu items and set the maximum number of orders for this date
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-lg font-semibold mb-4">Select Menu Items</h3>
              {menuItems.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-muted-foreground mb-4">
                    No menu items available. Create some items first.
                  </p>
                  <Button onClick={() => onOpenChange(false)} data-testid="button-close-no-items">
                    Close
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {menuItems.map((item) => (
                    <Card
                      key={item.id}
                      className={`p-4 cursor-pointer transition-all hover-elevate ${
                        selectedItems.has(item.id) ? "border-primary border-2" : ""
                      }`}
                      onClick={() => handleItemToggle(item.id)}
                      data-testid={`menu-item-card-${item.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <Checkbox
                          checked={selectedItems.has(item.id)}
                          onCheckedChange={(checked) => {
                            handleItemToggle(item.id);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          data-testid={`checkbox-item-${item.id}`}
                        />
                        <div className="flex-1">
                          <div className="flex items-start gap-3">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded-lg"
                            />
                            <div className="flex-1">
                              <h4 className="font-semibold">{item.name}</h4>
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

            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="h-5 w-5 text-primary" />
                  <h3 className="text-xl font-semibold">Menu Summary</h3>
                </div>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <Label className="text-sm text-muted-foreground">Date</Label>
                    <p className="font-medium">
                      {date?.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      }) || "Not selected"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm text-muted-foreground">Items Selected</Label>
                    <p className="font-medium" data-testid="text-items-selected">
                      {selectedItems.size} items
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="max-orders-modal" className="text-sm font-medium mb-2 block">
                      Maximum Orders
                    </Label>
                    <Input
                      id="max-orders-modal"
                      type="number"
                      min="1"
                      value={maxOrders}
                      onChange={(e) => setMaxOrders(e.target.value)}
                      placeholder="50"
                      data-testid="input-max-orders-modal"
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
                  disabled={!date || selectedItems.size === 0 || publishMenuMutation.isPending}
                  data-testid="button-publish-menu-modal"
                >
                  {publishMenuMutation.isPending ? "Publishing..." : "Publish Menu"}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
