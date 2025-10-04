import type { MenuItem, Menu, Order } from "@shared/schema";

export interface OrderItem {
  itemId: string;
  quantity: number;
  price: number;
  name: string;
}

export interface CreateOrderData {
  menuId: string;
  customerName: string;
  items: OrderItem[];
  total: number;
  date: string;
}

export async function getMenuItems(): Promise<MenuItem[]> {
  const response = await fetch("/api/menu-items");
  if (!response.ok) throw new Error("Failed to fetch menu items");
  return response.json();
}

export async function getMenus(): Promise<Menu[]> {
  const response = await fetch("/api/menus");
  if (!response.ok) throw new Error("Failed to fetch menus");
  return response.json();
}

export async function getMenuByDate(date: Date): Promise<Menu | null> {
  const dateStr = date.toISOString().split('T')[0];
  const response = await fetch(`/api/menus/by-date/${dateStr}`);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Failed to fetch menu");
  return response.json();
}

export async function createOrder(orderData: CreateOrderData): Promise<Order> {
  const response = await fetch("/api/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      menuId: orderData.menuId,
      customerName: orderData.customerName,
      items: JSON.stringify(orderData.items),
      total: orderData.total.toString(),
      date: orderData.date,
    }),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
}

export async function getOrders(): Promise<Order[]> {
  const response = await fetch("/api/orders");
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

export async function createMenuItem(item: Omit<MenuItem, "id">): Promise<MenuItem> {
  const response = await fetch("/api/menu-items", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(item),
  });
  if (!response.ok) throw new Error("Failed to create menu item");
  return response.json();
}

export async function createMenu(date: Date, itemIds: string[], maxOrders: number): Promise<Menu> {
  const response = await fetch("/api/menus", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      date: date.toISOString(),
      itemIds,
      maxOrders,
    }),
  });
  if (!response.ok) throw new Error("Failed to create menu");
  return response.json();
}
