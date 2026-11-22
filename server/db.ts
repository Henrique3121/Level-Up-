import { and, desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, UserProfile, dailyLogs, missions, userProfiles, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try { _db = drizzle(process.env.DATABASE_URL); } catch (error) { console.warn("[Database] Failed to connect:", error); _db = null; }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) throw new Error("Database is not available");
  const values: InsertUser = { openId: user.openId };
  const updateSet: Record<string, unknown> = {};
  (['name', 'email', 'loginMethod'] as const).forEach((field) => { if (user[field] !== undefined) { values[field] = user[field] ?? null; updateSet[field] = user[field] ?? null; } });
  if (user.lastSignedIn !== undefined) { values.lastSignedIn = user.lastSignedIn; updateSet.lastSignedIn = user.lastSignedIn; }
  if (user.role !== undefined) { values.role = user.role; updateSet.role = user.role; } else if (user.openId === ENV.ownerOpenId) { values.role = 'admin'; updateSet.role = 'admin'; }
  if (!values.lastSignedIn) values.lastSignedIn = new Date();
  if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
  await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
}

export async function getUserByOpenId(openId: string) { const db = await getDb(); if (!db) return undefined; const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1); return result[0]; }

export async function ensureProfile(userId: number) {
  const db = await getDb(); if (!db) throw new Error("Database is not available");
  const existing = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  if (existing[0]) return existing[0];
  await db.insert(userProfiles).values({ userId });
  const created = await db.select().from(userProfiles).where(eq(userProfiles.userId, userId)).limit(1);
  return created[0] as UserProfile;
}

const catalog = [
  { title: "Treino de força", category: "physical" as const, difficulty: "medium" as const, xp: 80, requiresProof: 0, hint: "Registre sua sessão após concluir." },
  { title: "Estudo focado", category: "intellectual" as const, difficulty: "medium" as const, xp: 60, requiresProof: 1, hint: "Uma foto das suas anotações pode comprovar a missão." },
  { title: "Refeição equilibrada", category: "nutrition" as const, difficulty: "easy" as const, xp: 40, requiresProof: 0, hint: "Registre o que você realmente comeu." },
  { title: "Hidratação", category: "discipline" as const, difficulty: "easy" as const, xp: 30, requiresProof: 0, hint: "Acompanhe sua água ao longo do dia." },
];

export async function ensureDailyMissions(userId: number, date: string) {
  const db = await getDb(); if (!db) throw new Error("Database is not available");
  await ensureProfile(userId);
  const current = await db.select().from(missions).where(and(eq(missions.userId, userId), eq(missions.missionDate, date))).orderBy(missions.id);
  if (current.length === 0) { await db.insert(missions).values(catalog.map(item => ({ ...item, userId, missionDate: date, source: "daily" }))); }
  const log = await db.select().from(dailyLogs).where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.logDate, date))).limit(1);
  if (!log[0]) await db.insert(dailyLogs).values({ userId, logDate: date });
  return db.select().from(missions).where(and(eq(missions.userId, userId), eq(missions.missionDate, date))).orderBy(missions.id);
}

export async function getProgress(userId: number) {
  const db = await getDb(); if (!db) throw new Error("Database is not available");
  const profile = await ensureProfile(userId);
  const recentLogs = await db.select().from(dailyLogs).where(eq(dailyLogs.userId, userId)).orderBy(desc(dailyLogs.logDate)).limit(30);
  const recentMissions = await db.select().from(missions).where(eq(missions.userId, userId)).orderBy(desc(missions.createdAt)).limit(50);
  const today = new Date().toISOString().slice(0, 10);
  const todayMissions = recentMissions.filter((m) => m.missionDate === today);
  const streak = recentLogs.reduce((count, log, index) => index === count && log.missionsCompleted > 0 ? count + 1 : count, 0);
  return { profile, missions: todayMissions, recentLogs, streak };
}

export async function completeMission(userId: number, missionId: number) {
  const db = await getDb(); if (!db) throw new Error("Database is not available");
  const mission = (await db.select().from(missions).where(and(eq(missions.id, missionId), eq(missions.userId, userId))).limit(1))[0];
  if (!mission) throw new Error("Mission not found");
  if (mission.status === "approved") return mission;
  if (mission.requiresProof) throw new Error("Esta missão exige uma evidência antes da aprovação.");
  await db.update(missions).set({ status: "approved", completedAt: new Date() }).where(eq(missions.id, missionId));
  await db.update(userProfiles).set({ xpTotal: sql`${userProfiles.xpTotal} + ${mission.xp}` }).where(eq(userProfiles.userId, userId));
  await db.update(dailyLogs).set({ xpEarned: sql`${dailyLogs.xpEarned} + ${mission.xp}`, missionsCompleted: sql`${dailyLogs.missionsCompleted} + 1` }).where(and(eq(dailyLogs.userId, userId), eq(dailyLogs.logDate, mission.missionDate)));
  return (await db.select().from(missions).where(eq(missions.id, missionId)).limit(1))[0];
}
