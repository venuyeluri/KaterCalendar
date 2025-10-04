import { type MenuItem, type InsertMenuItem, type Menu, type InsertMenu, type Order, type InsertOrder } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Menu Items
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  getAllMenuItems(): Promise<MenuItem[]>;
  updateMenuItem(id: string, item: Partial<InsertMenuItem>): Promise<MenuItem | undefined>;
  deleteMenuItem(id: string): Promise<boolean>;

  // Menus
  createMenu(menu: InsertMenu): Promise<Menu>;
  getMenu(id: string): Promise<Menu | undefined>;
  getMenuByDate(date: Date): Promise<Menu | undefined>;
  getAllMenus(): Promise<Menu[]>;
  deleteMenu(id: string): Promise<boolean>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByMenuId(menuId: string): Promise<Order[]>;
  getAllOrders(): Promise<Order[]>;
  updateOrderStatus(id: string, status: string): Promise<Order | undefined>;
}

export class MemStorage implements IStorage {
  private menuItems: Map<string, MenuItem>;
  private menus: Map<string, Menu>;
  private orders: Map<string, Order>;

  constructor() {
    this.menuItems = new Map();
    this.menus = new Map();
    this.orders = new Map();
  }

  // Menu Items
  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = { ...insertItem, id, dietary: insertItem.dietary ?? null };
    this.menuItems.set(id, item);
    return item;
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values());
  }

  async updateMenuItem(id: string, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const item = this.menuItems.get(id);
    if (!item) return undefined;
    
    const updated: MenuItem = { ...item, ...updates };
    this.menuItems.set(id, updated);
    return updated;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    return this.menuItems.delete(id);
  }

  // Menus
  async createMenu(insertMenu: InsertMenu): Promise<Menu> {
    const id = randomUUID();
    const menu: Menu = { ...insertMenu, id };
    this.menus.set(id, menu);
    return menu;
  }

  async getMenu(id: string): Promise<Menu | undefined> {
    return this.menus.get(id);
  }

  async getMenuByDate(date: Date): Promise<Menu | undefined> {
    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);
    
    return Array.from(this.menus.values()).find((menu) => {
      const menuDate = new Date(menu.date);
      menuDate.setHours(0, 0, 0, 0);
      return menuDate.getTime() === targetDate.getTime();
    });
  }

  async getAllMenus(): Promise<Menu[]> {
    return Array.from(this.menus.values());
  }

  async deleteMenu(id: string): Promise<boolean> {
    return this.menus.delete(id);
  }

  // Orders
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const order: Order = { 
      ...insertOrder, 
      id,
      date: new Date(insertOrder.date),
      status: insertOrder.status ?? "pending"
    };
    this.orders.set(id, order);
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByMenuId(menuId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter((order) => order.menuId === menuId);
  }

  async getAllOrders(): Promise<Order[]> {
    return Array.from(this.orders.values());
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(id);
    if (!order) return undefined;
    
    const updated: Order = { ...order, status };
    this.orders.set(id, updated);
    return updated;
  }
}

export const storage = new MemStorage();
