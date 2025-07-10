import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").unique(), // Made optional for users without email
  phone: text("phone").notNull(),
  date_of_birth: timestamp("date_of_birth").notNull(), // For age validation ≥18
  province: text("province").notNull(),
  municipality: text("municipality").notNull(),
  neighborhood: text("neighborhood").notNull(),
  address_complement: text("address_complement"), // Address complement (number, block, reference)
  contract_type: text("contract_type").notNull(), // "diarista" | "mensal" | "verbal" | "escrito"
  services: text("services").array().notNull(), // ["limpeza", "jardinagem", ...]
  availability: text("availability").notNull(),
  about_me: text("about_me"), // Free text "Sobre mim"
  profile_url: text("profile_url"),
  facebook_url: text("facebook_url"),
  instagram_url: text("instagram_url"),
  tiktok_url: text("tiktok_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  auth_user_id: uuid("auth_user_id").unique(), // For Supabase auth integration
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  auth_user_id: true,
}).extend({
  // Add client-side validation for age ≥18
  date_of_birth: z.string().refine(
    (date) => {
      const birthDate = new Date(date);
      const age = new Date().getFullYear() - birthDate.getFullYear();
      return age >= 18;
    },
    { message: "Deve ter pelo menos 18 anos" }
  ),
  email: z.string().email("Email inválido").optional(),
  phone: z.string().min(1, "Telefone é obrigatório"),
  facebook_url: z.string().url("URL do Facebook inválida").optional().or(z.literal("")),
  instagram_url: z.string().url("URL do Instagram inválida").optional().or(z.literal("")),
  tiktok_url: z.string().url("URL do TikTok inválida").optional().or(z.literal("")),
});

export const updateUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  auth_user_id: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type User = typeof users.$inferSelect & {
  // Add computed fields for compatibility
  name: string;
  age: number;
};
