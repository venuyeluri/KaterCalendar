import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const menuItems = pgTable("menu_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  image: text("image").notNull(),
  dietary: text("dietary").array(),
});

export const menus = pgTable("menus", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  date: timestamp("date").notNull(),
  itemIds: text("item_ids").array().notNull(),
  maxOrders: integer("max_orders").notNull().default(50),
});

export const orders = pgTable("orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  menuId: varchar("menu_id").notNull(),
  customerName: text("customer_name").notNull(),
  items: text("items").notNull(), // JSON string of {itemId, quantity}[]
  total: decimal("total", { precision: 10, scale: 2 }).notNull(),
  date: timestamp("date").notNull(),
  status: text("status").notNull().default("pending"),
});

export const insertMenuItemSchema = createInsertSchema(menuItems).omit({
  id: true,
});

export const insertMenuSchema = createInsertSchema(menus).omit({
  id: true,
}).extend({
  date: z.string().transform((val) => new Date(val)),
});

export const insertOrderSchema = createInsertSchema(orders).omit({
  id: true,
}).extend({
  date: z.string(),
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type MenuItem = typeof menuItems.$inferSelect;

export type InsertMenu = z.infer<typeof insertMenuSchema>;
export type Menu = typeof menus.$inferSelect;

export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof orders.$inferSelect;
