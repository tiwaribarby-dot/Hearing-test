import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table (kept for compatibility)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Test Results table
export const testResults = pgTable("test_results", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  age: integer("age").notNull(),
  gender: text("gender"),
  noiseExposure: text("noise_exposure"),
  tinnitus: text("tinnitus"),
  profileAnswers: jsonb("profile_answers"),
  audioResults: jsonb("audio_results"),
  questionnaireAnswers: jsonb("questionnaire_answers"),
  questionnaireScore: integer("questionnaire_score").notNull(),
  category: text("category").notNull(), // "normal", "mild", "moderate", "significant"
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
});
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;
export type TestResult = typeof testResults.$inferSelect;

// Profile answers schema
export const profileAnswersSchema = z.object({
  age: z.number().min(18).max(120),
  gender: z.enum(["male", "female", "other", "prefer_not_to_say"]),
  noiseExposure: z.enum(["never", "occasionally", "regularly", "daily"]),
  tinnitus: z.enum(["never", "occasionally", "often", "always"]),
  hearingAids: z.enum(["yes", "no"]),
  lastHearingTest: z.enum(["never", "over_5_years", "1_5_years", "within_year"]),
});
export type ProfileAnswers = z.infer<typeof profileAnswersSchema>;

// Audio test result schema
export const audioTestResultSchema = z.object({
  frequency: z.number(),
  label: z.string(),
  heard: z.boolean(),
  difficulty: z.enum(["clear", "faint", "couldnt_hear"]),
});
export type AudioTestResult = z.infer<typeof audioTestResultSchema>;

// Questionnaire answer schema
export const questionnaireAnswerSchema = z.object({
  questionId: z.number(),
  answer: z.enum(["yes", "sometimes", "no"]),
  score: z.number(),
});
export type QuestionnaireAnswer = z.infer<typeof questionnaireAnswerSchema>;

