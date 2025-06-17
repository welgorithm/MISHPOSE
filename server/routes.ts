import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMusicFileSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Music file processing routes
  app.post("/api/music-files", async (req, res) => {
    try {
      const validatedData = insertMusicFileSchema.parse(req.body);
      const musicFile = await storage.createMusicFile(validatedData);
      res.json(musicFile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ message: "Invalid data", errors: error.errors });
      } else {
        res.status(500).json({ message: "Failed to save music file" });
      }
    }
  });

  app.get("/api/music-files/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const musicFiles = await storage.getMusicFilesByUser(userId);
      res.json(musicFiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch music files" });
    }
  });

  app.get("/api/music-files/file/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid file ID" });
      }
      
      const musicFile = await storage.getMusicFile(id);
      if (!musicFile) {
        return res.status(404).json({ message: "Music file not found" });
      }
      
      res.json(musicFile);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch music file" });
    }
  });

  // User routes
  app.post("/api/users", async (req, res) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: "Username and password required" });
      }
      
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already exists" });
      }
      
      const user = await storage.createUser({ username, password });
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ id: user.id, username: user.username });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
