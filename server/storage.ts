import { db } from "@db";
import { 
  users, 
  events, 
  registrations,
  type User, 
  type InsertUser, 
  type Event,
  type InsertEvent,
  type Registration,
  type InsertRegistration 
} from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<InsertUser>): Promise<User | undefined>;
  
  // Event operations
  getEvent(id: number): Promise<Event | undefined>;
  getEvents(publicOnly?: boolean): Promise<Event[]>;
  getEventsByOrganizer(organizerId: number): Promise<Event[]>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<InsertEvent>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;
  
  // Registration operations
  getRegistration(id: number): Promise<Registration | undefined>;
  getRegistrationsByUser(userId: number): Promise<Registration[]>;
  getRegistrationsByEvent(eventId: number): Promise<Registration[]>;
  createRegistration(registration: InsertRegistration): Promise<Registration>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

  async updateUser(id: number, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const result = await db.update(users).set(updateData).where(eq(users.id, id)).returning();
    return result[0];
  }

  // Event operations
  async getEvent(id: number): Promise<Event | undefined> {
    const result = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return result[0];
  }

  async getEvents(publicOnly: boolean = false): Promise<Event[]> {
    console.log("getEvents called with publicOnly:", publicOnly);
    try {
      let result;
      if (publicOnly) {
        result = await db.select().from(events).where(eq(events.isPublic, 1)).orderBy(desc(events.date));
      } else {
        result = await db.select().from(events).orderBy(desc(events.date));
      }
      console.log("getEvents result length:", result.length);
      return result;
    } catch (error) {
      console.error("Error in getEvents:", error);
      throw error;
    }
  }

  async getEventsByOrganizer(organizerId: number): Promise<Event[]> {
    return await db.select().from(events).where(eq(events.organizerId, organizerId)).orderBy(desc(events.date));
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const result = await db.insert(events).values(insertEvent).returning();
    return result[0];
  }

  async updateEvent(id: number, updateData: Partial<InsertEvent>): Promise<Event | undefined> {
    const result = await db.update(events).set(updateData).where(eq(events.id, id)).returning();
    return result[0];
  }

  async deleteEvent(id: number): Promise<boolean> {
    const result = await db.delete(events).where(eq(events.id, id)).returning();
    return result.length > 0;
  }

  // Registration operations
  async getRegistration(id: number): Promise<Registration | undefined> {
    const result = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
    return result[0];
  }

  async getRegistrationsByUser(userId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.userId, userId)).orderBy(desc(registrations.registrationDate));
  }

  async getRegistrationsByEvent(eventId: number): Promise<Registration[]> {
    return await db.select().from(registrations).where(eq(registrations.eventId, eventId)).orderBy(desc(registrations.registrationDate));
  }

  async createRegistration(insertRegistration: InsertRegistration): Promise<Registration> {
    const result = await db.insert(registrations).values(insertRegistration).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
