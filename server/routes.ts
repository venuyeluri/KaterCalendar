import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMenuItemSchema, insertMenuSchema, insertOrderSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Menu Items
  app.get("/api/menu-items", async (_req, res) => {
    try {
      const items = await storage.getAllMenuItems();
      res.json(items);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu-items/:id", async (req, res) => {
    try {
      const item = await storage.getMenuItem(req.params.id);
      if (!item) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.json(item);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu item" });
    }
  });

  app.post("/api/menu-items", async (req, res) => {
    try {
      const validated = insertMenuItemSchema.parse(req.body);
      const item = await storage.createMenuItem(validated);
      res.status(201).json(item);
    } catch (error) {
      res.status(400).json({ error: "Invalid menu item data" });
    }
  });

  app.delete("/api/menu-items/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMenuItem(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu item not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu item" });
    }
  });

  // Menus
  app.get("/api/menus", async (_req, res) => {
    try {
      const menus = await storage.getAllMenus();
      res.json(menus);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menus" });
    }
  });

  app.get("/api/menus/:id", async (req, res) => {
    try {
      const menu = await storage.getMenu(req.params.id);
      if (!menu) {
        return res.status(404).json({ error: "Menu not found" });
      }
      res.json(menu);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu" });
    }
  });

  app.get("/api/menus/by-date/:date", async (req, res) => {
    try {
      const date = new Date(req.params.date);
      const menu = await storage.getMenuByDate(date);
      if (!menu) {
        return res.status(404).json({ error: "No menu found for this date" });
      }
      res.json(menu);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch menu by date" });
    }
  });

  app.post("/api/menus", async (req, res) => {
    try {
      const validated = insertMenuSchema.parse(req.body);
      const menu = await storage.createMenu(validated);
      res.status(201).json(menu);
    } catch (error) {
      res.status(400).json({ error: "Invalid menu data" });
    }
  });

  app.delete("/api/menus/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMenu(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Menu not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete menu" });
    }
  });

  // Orders
  app.get("/api/orders", async (_req, res) => {
    try {
      const orders = await storage.getAllOrders();
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const order = await storage.getOrder(req.params.id);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch order" });
    }
  });

  app.get("/api/orders/menu/:menuId", async (req, res) => {
    try {
      const orders = await storage.getOrdersByMenuId(req.params.menuId);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch orders" });
    }
  });

  app.post("/api/orders", async (req, res) => {
    try {
      const validated = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validated);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ error: "Invalid order data" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ error: "Status is required" });
      }
      const order = await storage.updateOrderStatus(req.params.id, status);
      if (!order) {
        return res.status(404).json({ error: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ error: "Failed to update order status" });
    }
  });

  app.get("/api/env-info", async (_req, res) => {
    try {
      const envInfo = {
        replSlug: process.env.REPL_SLUG || 'unknown',
        replOwner: process.env.REPL_OWNER || 'unknown',
        gitBranch: process.env.VITE_BRANCH_NAME || 'main',
        databaseUrl: process.env.DATABASE_URL ? 
          process.env.DATABASE_URL.split('@')[1] || 'configured' : 
          'not configured',
      };
      res.json(envInfo);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch environment info" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
