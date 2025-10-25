import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User profiles with verification levels and reputation
 */
export const userProfiles = mysqlTable("userProfiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  avatar: text("avatar"),
  bio: text("bio"),
  location: varchar("location", { length: 255 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  verificationLevel: mysqlEnum("verificationLevel", ["L0", "L1", "L2", "L3"]).default("L0").notNull(),
  reputationScore: int("reputationScore").default(100).notNull(),
  completionRate: int("completionRate").default(0).notNull(),
  onTimeRate: int("onTimeRate").default(0).notNull(),
  totalTasksCompleted: int("totalTasksCompleted").default(0).notNull(),
  totalTasksPublished: int("totalTasksPublished").default(0).notNull(),
  badges: text("badges"),
  skills: text("skills"),
  interests: text("interests"),
  availableTime: text("availableTime"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type UserProfile = typeof userProfiles.$inferSelect;
export type InsertUserProfile = typeof userProfiles.$inferInsert;

/**
 * Tasks with bounty and matching criteria
 */
export const tasks = mysqlTable("tasks", {
  id: int("id").autoincrement().primaryKey(),
  publisherId: int("publisherId").notNull().references(() => users.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["study", "fitness", "travel", "food", "life", "skill", "other"]).notNull(),
  taskType: mysqlEnum("taskType", ["oneTime", "recurring", "group"]).default("oneTime").notNull(),
  bountyAmount: int("bountyAmount").notNull(),
  participantCount: int("participantCount").default(1).notNull(),
  currentParticipants: int("currentParticipants").default(0).notNull(),
  location: varchar("location", { length: 255 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  isOnline: int("isOnline").default(0).notNull(),
  radius: int("radius").default(5).notNull(),
  startTime: timestamp("startTime"),
  endTime: timestamp("endTime"),
  tags: text("tags"),
  requiredSkills: text("requiredSkills"),
  status: mysqlEnum("status", ["open", "matched", "inProgress", "completed", "cancelled", "disputed"]).default("open").notNull(),
  verificationMethod: mysqlEnum("verificationMethod", ["photo", "checkin", "mutual", "gps"]).default("mutual").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;

/**
 * Task applications and matches
 */
export const taskApplications = mysqlTable("taskApplications", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull().references(() => tasks.id),
  applicantId: int("applicantId").notNull().references(() => users.id),
  status: mysqlEnum("status", ["pending", "accepted", "rejected", "cancelled"]).default("pending").notNull(),
  message: text("message"),
  matchScore: int("matchScore").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type TaskApplication = typeof taskApplications.$inferSelect;
export type InsertTaskApplication = typeof taskApplications.$inferInsert;

/**
 * Escrow transactions for bounty management
 */
export const escrows = mysqlTable("escrows", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull().references(() => tasks.id),
  amount: int("amount").notNull(),
  platformFee: int("platformFee").default(0).notNull(),
  status: mysqlEnum("status", ["pending", "held", "released", "refunded", "disputed"]).default("pending").notNull(),
  paymentMethod: varchar("paymentMethod", { length: 50 }),
  transactionId: varchar("transactionId", { length: 255 }),
  releasedAt: timestamp("releasedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Escrow = typeof escrows.$inferSelect;
export type InsertEscrow = typeof escrows.$inferInsert;

/**
 * Task reviews and ratings
 */
export const reviews = mysqlTable("reviews", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull().references(() => tasks.id),
  reviewerId: int("reviewerId").notNull().references(() => users.id),
  revieweeId: int("revieweeId").notNull().references(() => users.id),
  rating: int("rating").notNull(),
  comment: text("comment"),
  tags: text("tags"),
  isOnTime: int("isOnTime").default(1).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Review = typeof reviews.$inferSelect;
export type InsertReview = typeof reviews.$inferInsert;

/**
 * Messages between users
 */
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").references(() => tasks.id),
  senderId: int("senderId").notNull().references(() => users.id),
  receiverId: int("receiverId").notNull().references(() => users.id),
  content: text("content").notNull(),
  messageType: mysqlEnum("messageType", ["text", "image", "location", "confirmation"]).default("text").notNull(),
  isRead: int("isRead").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

/**
 * Disputes and appeals
 */
export const disputes = mysqlTable("disputes", {
  id: int("id").autoincrement().primaryKey(),
  taskId: int("taskId").notNull().references(() => tasks.id),
  initiatorId: int("initiatorId").notNull().references(() => users.id),
  reason: text("reason").notNull(),
  evidence: text("evidence"),
  status: mysqlEnum("status", ["open", "reviewing", "resolved", "closed"]).default("open").notNull(),
  resolution: text("resolution"),
  resolvedBy: int("resolvedBy"),
  resolvedAt: timestamp("resolvedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;