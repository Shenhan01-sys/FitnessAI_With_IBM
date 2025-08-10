import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserProfileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Create or update user profile
  app.post("/api/profile", async (req, res) => {
    try {
      // For now, we'll use a hardcoded user ID since we don't have authentication
      const userId = "demo-user";
      
      const validatedData = insertUserProfileSchema.parse(req.body);
      
      // Check if profile already exists
      const existingProfile = await storage.getUserProfile(userId);
      
      let profile;
      if (existingProfile) {
        profile = await storage.updateUserProfile(userId, validatedData);
      } else {
        profile = await storage.createUserProfile(userId, validatedData);
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Profile creation/update error:", error);
      res.status(400).json({ message: "Invalid profile data" });
    }
  });

  // Get user profile
  app.get("/api/profile", async (req, res) => {
    try {
      const userId = "demo-user";
      const profile = await storage.getUserProfile(userId);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Profile fetch error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update completion status
  app.patch("/api/profile/completion", async (req, res) => {
    try {
      const userId = "demo-user";
      const { completed } = req.body;
      
      if (!completed || typeof completed !== 'object') {
        return res.status(400).json({ message: "Invalid completion data" });
      }
      
      const profile = await storage.updateUserProfile(userId, { completed });
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      console.error("Completion update error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
