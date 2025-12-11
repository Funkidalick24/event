import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertEventSchema, insertRegistrationSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import { register, login, getMe, logout, authenticateToken } from "./auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/register", register);
  app.post("/api/auth/login", login);
  app.get("/api/auth/me", authenticateToken, getMe);
  app.post("/api/auth/logout", logout);

  // User endpoints
  app.get("/api/users/:id", async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/users", async (req, res) => {
    try {
      const validation = insertUserSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: fromZodError(validation.error).message
        });
      }

      const user = await storage.createUser(validation.data);
      res.status(201).json(user);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }

      // Ensure user can only update their own profile
      if (req.user?.id !== userId) {
        return res.status(403).json({ error: "You can only update your own profile" });
      }

      const validation = insertUserSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: fromZodError(validation.error).message
        });
      }

      const user = await storage.updateUser(userId, validation.data);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Event endpoints
  app.get("/api/events", async (req, res) => {
    try {
      console.log("Fetching events, publicOnly:", req.query.publicOnly);
      const publicOnly = req.query.publicOnly !== "false";
      console.log("publicOnly parsed:", publicOnly);
      const events = await storage.getEvents(publicOnly);
      console.log("Events fetched:", events.length);
      res.json(events);
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const event = await storage.getEvent(eventId);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error fetching event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/events/organizer/:organizerId", async (req, res) => {
    try {
      const organizerId = parseInt(req.params.organizerId);
      if (isNaN(organizerId)) {
        return res.status(400).json({ error: "Invalid organizer ID" });
      }
      
      const events = await storage.getEventsByOrganizer(organizerId);
      res.json(events);
    } catch (error) {
      console.error("Error fetching organizer events:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/events", authenticateToken, async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Authentication required" });
      }
      console.log("Received event data:", JSON.stringify(req.body, null, 2));
      const validation = insertEventSchema.safeParse(req.body);
      if (!validation.success) {
        console.log("Validation failed:", validation.error?.message || "Unknown validation error");
        return res.status(400).json({
          error: fromZodError(validation.error).message
        });
      }
      console.log("Validation passed, data:", JSON.stringify(validation.data, null, 2));

      const user = await storage.getUser(validation.data.organizerId);
      if (!user) {
        return res.status(400).json({ error: "Invalid organizer ID" });
      }

      const event = await storage.createEvent(validation.data);
      res.status(201).json(event);
    } catch (error) {
      console.error("Error creating event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.put("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const validation = insertEventSchema.partial().safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({ 
          error: fromZodError(validation.error).message 
        });
      }
      
      const event = await storage.updateEvent(eventId, validation.data);
      if (!event) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.json(event);
    } catch (error) {
      console.error("Error updating event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.delete("/api/events/:id", async (req, res) => {
    try {
      const eventId = parseInt(req.params.id);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const success = await storage.deleteEvent(eventId);
      if (!success) {
        return res.status(404).json({ error: "Event not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Registration endpoints
  app.get("/api/registrations/:id", async (req, res) => {
    try {
      const registrationId = parseInt(req.params.id);
      if (isNaN(registrationId)) {
        return res.status(400).json({ error: "Invalid registration ID" });
      }
      
      const registration = await storage.getRegistration(registrationId);
      if (!registration) {
        return res.status(404).json({ error: "Registration not found" });
      }
      
      res.json(registration);
    } catch (error) {
      console.error("Error fetching registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/registrations/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Invalid user ID" });
      }
      
      const registrations = await storage.getRegistrationsByUser(userId);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching user registrations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/registrations/event/:eventId", async (req, res) => {
    try {
      const eventId = parseInt(req.params.eventId);
      if (isNaN(eventId)) {
        return res.status(400).json({ error: "Invalid event ID" });
      }
      
      const registrations = await storage.getRegistrationsByEvent(eventId);
      res.json(registrations);
    } catch (error) {
      console.error("Error fetching event registrations:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.post("/api/registrations", authenticateToken, async (req, res) => {
    try {
      const validation = insertRegistrationSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          error: fromZodError(validation.error).message
        });
      }

      // Use authenticated user ID instead of hardcoded value
      const registrationData = {
        ...validation.data,
        userId: req.user!.id
      };

      const registration = await storage.createRegistration(registrationData);
      res.status(201).json(registration);
    } catch (error) {
      console.error("Error creating registration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return httpServer;
}
