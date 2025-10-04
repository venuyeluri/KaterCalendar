import { eq, and, gte, lte } from "drizzle-orm";
import { db } from "./db";
import { menuItems, menus, orders } from "@shared/schema";
import type { MenuItem, InsertMenuItem, Menu, InsertMenu, Order, InsertOrder } from "@shared/schema";

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

export class DbStorage implements IStorage {
  // Menu Items
  async createMenuItem(item: InsertMenuItem): Promise<MenuItem> {
    const [created] = await db.insert(menuItems).values(item).returning();
    return created;
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    const [item] = await db.select().from(menuItems).where(eq(menuItems.id, id));
    return item;
  }

  async getAllMenuItems(): Promise<MenuItem[]> {
    return db.select().from(menuItems);
  }

  async updateMenuItem(id: string, updates: Partial<InsertMenuItem>): Promise<MenuItem | undefined> {
    const [updated] = await db
      .update(menuItems)
      .set(updates)
      .where(eq(menuItems.id, id))
      .returning();
    return updated;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const result = await db.delete(menuItems).where(eq(menuItems.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Menus
  async createMenu(menu: InsertMenu): Promise<Menu> {
    const [created] = await db.insert(menus).values(menu).returning();
    return created;
  }

  async getMenu(id: string): Promise<Menu | undefined> {
    const [menu] = await db.select().from(menus).where(eq(menus.id, id));
    return menu;
  }

  async getMenuByDate(date: Date): Promise<Menu | undefined> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const [menu] = await db
      .select()
      .from(menus)
      .where(
        and(
          gte(menus.date, startOfDay),
          lte(menus.date, endOfDay)
        )
      );
    return menu;
  }

  async getAllMenus(): Promise<Menu[]> {
    return db.select().from(menus);
  }

  async deleteMenu(id: string): Promise<boolean> {
    const result = await db.delete(menus).where(eq(menus.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  // Orders
  async createOrder(order: InsertOrder): Promise<Order> {
    const [created] = await db.insert(orders).values({
      ...order,
      date: new Date(order.date),
    }).returning();
    return created;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async getOrdersByMenuId(menuId: string): Promise<Order[]> {
    return db.select().from(orders).where(eq(orders.menuId, menuId));
  }

  async getAllOrders(): Promise<Order[]> {
    return db.select().from(orders);
  }

  async updateOrderStatus(id: string, status: string): Promise<Order | undefined> {
    const [updated] = await db
      .update(orders)
      .set({ status })
      .where(eq(orders.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DbStorage();
