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
  custom_service: text("custom_service"), // Custom service description when "outros" is selected
  availability: text("availability").notNull(),
  about_me: text("about_me"), // Free text "Sobre mim"
  profile_url: text("profile_url"),
  facebook_url: text("facebook_url"),
  instagram_url: text("instagram_url"),
  whatsapp_url: text("whatsapp_url"),
  password: text("password"), // For simple auth (hashed in real app)
  role: text("role").default("user"), // "user", "admin", "super_admin"
  status: text("status").default("active"), // "active", "suspended", "inactive"
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

// Admin tables
export const admin_logs = pgTable("admin_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  admin_id: uuid("admin_id").references(() => users.id),
  action: text("action").notNull(), // "create_user", "update_user", "delete_user", "login", etc.
  target_type: text("target_type"), // "user", "review", "system", etc.
  target_id: text("target_id"),
  details: text("details"), // JSON string with additional details
  ip_address: text("ip_address"),
  user_agent: text("user_agent"),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const site_settings = pgTable("site_settings", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type").default("text"), // "text", "number", "boolean", "json"
  description: text("description"),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
  updated_by: uuid("updated_by").references(() => users.id),
});

export const site_analytics = pgTable("site_analytics", {
  id: uuid("id").primaryKey().defaultRandom(),
  date: timestamp("date").notNull(),
  page_views: integer("page_views").default(0),
  unique_visitors: integer("unique_visitors").default(0),
  new_users: integer("new_users").default(0),
  active_users: integer("active_users").default(0),
  searches: integer("searches").default(0),
  contacts: integer("contacts").default(0),
  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const feedback = pgTable("feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  category: text("category").notNull(),
  message: text("message").notNull(),
  sender_name: text("sender_name"),
  sender_email: text("sender_email"),
  sender_id: text("sender_id"),
  is_authenticated: boolean("is_authenticated").default(false),
  is_read: boolean("is_read").default(false),
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
  whatsapp_url: z.string().url("URL do WhatsApp inválida").optional().or(z.literal("")),
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

// Admin schemas
export const insertAdminLogSchema = createInsertSchema(admin_logs).omit({
  id: true,
  created_at: true,
});

export const insertSiteSettingSchema = createInsertSchema(site_settings).omit({
  id: true,
  updated_at: true,
});

export const updateSiteSettingSchema = createInsertSchema(site_settings).omit({
  id: true,
  updated_at: true,
}).partial();

export const insertAnalyticsSchema = createInsertSchema(site_analytics).omit({
  id: true,
  created_at: true,
});

export const insertFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  created_at: true,
  updated_at: true,
});

export const updateFeedbackSchema = createInsertSchema(feedback).omit({
  id: true,
  created_at: true,
  updated_at: true,
}).partial();

export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>;
export type InsertReview = z.infer<typeof insertReviewSchema>;
export type UpdateReview = z.infer<typeof updateReviewSchema>;
export type InsertAdminLog = z.infer<typeof insertAdminLogSchema>;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type UpdateSiteSetting = z.infer<typeof updateSiteSettingSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type InsertFeedback = z.infer<typeof insertFeedbackSchema>;
export type UpdateFeedback = z.infer<typeof updateFeedbackSchema>;

export type User = typeof users.$inferSelect & {
  // Add computed fields for compatibility
  name: string;
  age: number;
};
export type Review = typeof reviews.$inferSelect;
export type AdminLog = typeof admin_logs.$inferSelect;
export type SiteSetting = typeof site_settings.$inferSelect;
export type SiteAnalytics = typeof site_analytics.$inferSelect;
export type Feedback = typeof feedback.$inferSelect;
