import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { getMenuItems, createMenuItem } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { Plus, Trash2 } from "lucide-react";
import type { MenuItem } from "@shared/schema";
import salmonImage from "@assets/generated_images/Grilled_salmon_menu_item_6b384824.png";
import saladImage from "@assets/generated_images/Caesar_salad_menu_item_2ee7317d.png";
import pastaImage from "@assets/generated_images/Pasta_primavera_menu_item_a3ece18f.png";
import dessertImage from "@assets/generated_images/Chocolate_lava_cake_dessert_f601292a.png";

const menuItemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
    message: "Price must be a positive number",
  }),
  image: z.string().min(1, "Image is required"),
  dietary: z.array(z.string()).optional(),
});

type MenuItemFormData = z.infer<typeof menuItemSchema>;

const availableImages = [
  { url: salmonImage, name: "Salmon" },
  { url: saladImage, name: "Salad" },
  { url: pastaImage, name: "Pasta" },
  { url: dessertImage, name: "Dessert" },
];

export default function ManageItemsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: menuItems = [] } = useQuery<MenuItem[]>({
    queryKey: ["/api/menu-items"],
    queryFn: getMenuItems,
  });

  const form = useForm<MenuItemFormData>({
    resolver: zodResolver(menuItemSchema),
    defaultValues: {
      name: "",
      description: "",
      price: "",
      image: salmonImage,
      dietary: [],
    },
  });

  const createItemMutation = useMutation({
    mutationFn: createMenuItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/menu-items"] });
      toast({
        title: "Menu item created!",
        description: "Your menu item has been added successfully.",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        title: "Failed to create item",
        description: "There was an error creating the menu item.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: MenuItemFormData) => {
    createItemMutation.mutate({
      name: data.name,
      description: data.description,
      price: data.price,
      image: data.image,
      dietary: data.dietary || null,
    });
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Menu Items</h1>
            <p className="text-lg text-muted-foreground">
              Create and manage your menu items
            </p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} data-testid="button-add-item">
            <Plus className="mr-2 h-5 w-5" />
            Add Item
          </Button>
        </div>

        {menuItems.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-lg text-muted-foreground mb-4">
              No menu items yet. Create your first item to get started.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} data-testid="button-create-first">
              <Plus className="mr-2 h-5 w-5" />
              Create First Item
            </Button>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <div className="aspect-[4/3] relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.dietary && item.dietary.length > 0 && (
                    <div className="absolute top-3 right-3 flex gap-2">
                      {item.dietary.map((tag) => (
                        <Badge key={tag} variant="secondary" className="backdrop-blur-sm bg-background/80">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                    <span className="text-lg font-bold text-primary">
                      ${parseFloat(item.price).toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      data-testid={`button-delete-${item.id}`}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create Menu Item</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Grilled Salmon" {...field} data-testid="input-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe your menu item..."
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          data-testid="input-price"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <div className="grid grid-cols-4 gap-3">
                          {availableImages.map((img) => (
                            <div
                              key={img.url}
                              className={`cursor-pointer rounded-lg border-2 transition-all ${
                                field.value === img.url ? "border-primary" : "border-border"
                              }`}
                              onClick={() => field.onChange(img.url)}
                            >
                              <img
                                src={img.url}
                                alt={img.name}
                                className="w-full aspect-square object-cover rounded-lg"
                              />
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsDialogOpen(false)}
                    data-testid="button-cancel-create"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createItemMutation.isPending}
                    data-testid="button-submit-create"
                  >
                    {createItemMutation.isPending ? "Creating..." : "Create Item"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
