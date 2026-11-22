import { int, json, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const userProfiles = mysqlTable("user_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  goal: varchar("goal", { length: 120 }).default("Evoluir com consistência").notNull(),
  experience: varchar("experience", { length: 32 }).default("iniciante").notNull(),
  trainingStyle: varchar("trainingStyle", { length: 64 }).default("Musculação").notNull(),
  dietaryStyle: varchar("dietaryStyle", { length: 64 }).default("Equilibrada").notNull(),
  restrictions: text("restrictions"),
  studyGoalHours: int("studyGoalHours").default(1).notNull(),
  wakeTime: varchar("wakeTime", { length: 8 }).default("07:00").notNull(),
  waterGoalMl: int("waterGoalMl").default(2500).notNull(),
  xpTotal: int("xpTotal").default(0).notNull(),
  onboardingComplete: int("onboardingComplete").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const missions = mysqlTable("missions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  category: mysqlEnum("category", ["physical", "intellectual", "nutrition", "discipline"]).notNull(),
  difficulty: mysqlEnum("difficulty", ["easy", "medium", "hard"]).default("medium").notNull(),
  xp: int("xp").notNull(),
  missionDate: varchar("missionDate", { length: 10 }).notNull(),
  status: mysqlEnum("status", ["open", "pending", "approved", "rejected"]).default("open").notNull(),
  requiresProof: int("requiresProof").default(0).notNull(),
  proofUri: text("proofUri"),
  aiVerdict: varchar("aiVerdict", { length: 24 }),
  aiReason: text("aiReason"),
  completedAt: timestamp("completedAt"),
  source: varchar("source", { length: 32 }).default("daily").notNull(),
  hint: text("hint"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const dailyLogs = mysqlTable("daily_logs", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  logDate: varchar("logDate", { length: 10 }).notNull(),
  waterMl: int("waterMl").default(0).notNull(),
  xpEarned: int("xpEarned").default(0).notNull(),
  missionsCompleted: int("missionsCompleted").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const chatMessages = mysqlTable("chat_messages", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  role: mysqlEnum("role", ["user", "assistant"]).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const profilePreferences = mysqlTable("profile_preferences", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  restrictions: json("restrictions").$type<string[]>(),
  allergies: json("allergies").$type<string[]>(),
  weeklyDays: int("weeklyDays").default(4).notNull(),
  heightCm: int("heightCm"),
  weightGoalKg: int("weightGoalKg"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type UserProfile = typeof userProfiles.$inferSelect;
export type Mission = typeof missions.$inferSelect;
export type DailyLog = typeof dailyLogs.$inferSelect;
