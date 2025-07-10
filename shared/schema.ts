import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull(),
  age: integer("age").notNull(),
  province: text("province").notNull(),
  municipality: text("municipality").notNull(),
  neighborhood: text("neighborhood").notNull(),
  contract_type: text("contract_type").notNull(), // "diarista" | "mensal" | "verbal" | "escrito"
  services: text("services").array().notNull(), // ["limpeza", "jardinagem", ...]
  availability: text("availability").notNull(),
  profile_url: text("profile_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  auth_user_id: uuid("auth_user_id").unique(), // For Supabase auth integration
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  auth_user_id: true,
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  auth_user_id: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect;
