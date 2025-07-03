import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertSystemSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all systems
  app.get("/api/systems", async (req, res) => {
    try {
      const systems = await storage.getSystems();
      res.json(systems);
    } catch (error) {
      console.error("Error fetching systems:", error);
      res.status(500).json({ error: "Failed to fetch systems" });
    }
  });

  // Get system by ID
  app.get("/api/systems/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const system = await storage.getSystem(id);
      
      if (!system) {
        return res.status(404).json({ error: "System not found" });
      }
      
      res.json(system);
    } catch (error) {
      console.error("Error fetching system:", error);
      res.status(500).json({ error: "Failed to fetch system" });
    }
  });

  // Create new system
  app.post("/api/systems", async (req, res) => {
    try {
      const validatedData = insertSystemSchema.parse(req.body);
      const newSystem = await storage.createSystem(validatedData);
      res.status(201).json(newSystem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid data", 
          details: error.errors 
        });
      }
      console.error("Error creating system:", error);
      res.status(500).json({ error: "Failed to create system" });
    }
  });

  // Update system
  app.put("/api/systems/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertSystemSchema.partial().parse(req.body);
      const updatedSystem = await storage.updateSystem(id, validatedData);
      
      if (!updatedSystem) {
        return res.status(404).json({ error: "System not found" });
      }
      
      res.json(updatedSystem);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          error: "Invalid data", 
          details: error.errors 
        });
      }
      console.error("Error updating system:", error);
      res.status(500).json({ error: "Failed to update system" });
    }
  });

  // Delete system
  app.delete("/api/systems/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteSystem(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "System not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting system:", error);
      res.status(500).json({ error: "Failed to delete system" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
