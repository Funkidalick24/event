import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = sqliteTable("users", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  avatar: text("avatar"),
  bio: text("bio"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  name: true,
  email: true,
  password: true,
  avatar: true,
  bio: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const events = sqliteTable("events", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  title: text("title").notNull(),
  date: text("date").notNull(),
  location: text("location").notNull(),
  description: text("description").notNull(),
  price: text("price").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  organizerId: integer("organizer_id", { mode: "number" }).notNull().references(() => users.id),
  isPublic: integer("is_public").notNull().default(1),
});

export const insertEventSchema = createInsertSchema(events, {
  isPublic: z.boolean().transform((val) => val ? 1 : 0),
}).pick({
  title: z.string().min(1, "Title is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  price: z.string().min(1, "Price is required"),
  image: z.string().url("Image must be a valid URL"),
  category: z.string().min(1, "Category is required"),
  organizerId: z.number().int().positive("Organizer ID must be a positive integer"),
  isPublic: true,
});

export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

export const registrations = sqliteTable("registrations", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  eventId: integer("event_id", { mode: "number" }).notNull().references(() => events.id),
  userId: integer("user_id", { mode: "number" }).notNull().references(() => users.id),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  ticketType: text("ticket_type").notNull(),
  registrationDate: text("registration_date").notNull().default(sql`(datetime('now'))`),
});

export const insertRegistrationSchema = createInsertSchema(registrations).pick({
  eventId: true,
  userId: true,
  fullName: true,
  email: true,
  ticketType: true,
});

export type InsertRegistration = z.infer<typeof insertRegistrationSchema>;
export type Registration = typeof registrations.$inferSelect;
