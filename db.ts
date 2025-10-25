import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, 
  users, 
  tasks, 
  InsertTask,
  userProfiles,
  InsertUserProfile,
  taskApplications,
  InsertTaskApplication,
  reviews,
  InsertReview
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Task queries
export async function getTasks(filters?: {
  category?: string;
  status?: string;
  isOnline?: boolean;
  limit?: number;
}) {
  const db = await getDb();
  if (!db) return [];

  if (filters?.category && filters?.status) {
    const result = await db.select().from(tasks)
      .where(eq(tasks.category, filters.category as any))
      .limit(filters?.limit || 50);
    return result;
  } else if (filters?.category) {
    const result = await db.select().from(tasks)
      .where(eq(tasks.category, filters.category as any))
      .limit(filters?.limit || 50);
    return result;
  } else if (filters?.status) {
    const result = await db.select().from(tasks)
      .where(eq(tasks.status, filters.status as any))
      .limit(filters?.limit || 50);
    return result;
  }
  
  const result = await db.select().from(tasks).limit(filters?.limit || 50);
  return result;
}

export async function getTaskById(taskId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(tasks).where(eq(tasks.id, taskId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createTask(task: InsertTask) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(tasks).values(task);
  return result;
}

export async function updateTaskStatus(taskId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(tasks).set({ status: status as any }).where(eq(tasks.id, taskId));
}

// User profile queries
export async function getUserProfile(userId: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function createUserProfile(profile: InsertUserProfile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(userProfiles).values(profile);
  return result;
}

export async function updateUserProfile(userId: number, updates: Partial<InsertUserProfile>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(userProfiles).set(updates).where(eq(userProfiles.userId, userId));
}

// Application queries
export async function createApplication(application: InsertTaskApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(taskApplications).values(application);
  return result;
}

export async function getTaskApplications(taskId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(taskApplications).where(eq(taskApplications.taskId, taskId));
  return result;
}

// Review queries
export async function createReview(review: InsertReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(reviews).values(review);
  return result;
}

export async function getUserReviews(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const result = await db.select().from(reviews).where(eq(reviews.revieweeId, userId));
  return result;
}
