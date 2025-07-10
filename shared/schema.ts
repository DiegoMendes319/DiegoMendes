import { pgTable, text, serial, integer, boolean, timestamp, uuid, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  first_name: text("first_name").notNull(),
  last_name: text("last_name").notNull(),
  email: text("email").unique(), // Made optional for users without email
  phone: text("phone").notNull(),
  date_of_birth: timestamp("date_of_birth"), // For age validation ≥18
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
  password: text("password"), // For simple auth (hashed in real app)
  created_at: timestamp("created_at").defaultNow().notNull(),
  auth_user_id: uuid("auth_user_id").unique(), // For Supabase auth integration
  // Rating fields
  average_rating: real("average_rating").default(0),
  total_reviews: integer("total_reviews").default(0),
});

export const reviews = pgTable("reviews", {
  id: uuid("id").primaryKey().defaultRandom(),
  reviewer_id: text("reviewer_id").notNull(), // Allow flexible IDs (UUID or temp IDs)
  reviewee_id: uuid("reviewee_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment"),
  service_type: text("service_type").notNull(),
  work_quality: integer("work_quality").notNull(), // 1-5
  punctuality: integer("punctuality").notNull(), // 1-5
  communication: integer("communication").notNull(), // 1-5
  value_for_money: integer("value_for_money").notNull(), // 1-5
  would_recommend: boolean("would_recommend").notNull(),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  created_at: true,
  auth_user_id: true,
}).extend({
  // Add client-side validation for age ≥18
  date_of_birth: z.string().optional().refine(
    (date) => {
      if (!date) return true; // Allow empty dates
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

export const insertReviewSchema = z.object({
  reviewer_id: z.string().min(1, "Reviewer ID is required"), // Allow any string ID
  reviewee_id: z.string().min(1, "Reviewee ID is required"), // Allow any string ID
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(500, "Comentário muito longo").optional().nullable(),
  service_type: z.string().min(1, "Service type is required"),
  work_quality: z.number().int().min(1).max(5),
  punctuality: z.number().int().min(1).max(5),
  communication: z.number().int().min(1).max(5),
  value_for_money: z.number().int().min(1).max(5),
  would_recommend: z.boolean(),
});

export const updateReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  created_at: true,
  updated_at: true,
  reviewer_id: true,
  reviewee_id: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
export type User = typeof users.$inferSelect & {
  // Add computed fields for compatibility
  name: string;
  age: number;
};
export type Review = typeof reviews.$inferSelect;
