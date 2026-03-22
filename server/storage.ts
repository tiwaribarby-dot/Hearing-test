import { type User, type InsertUser, type TestResult, type InsertTestResult, users, testResults } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;
  getTestResult(id: string): Promise<TestResult | undefined>;
  getTestResultByEmail(email: string): Promise<TestResult[]>;
  getAllTestResults(): Promise<TestResult[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const [user] = await db.insert(users).values({ ...insertUser, id }).returning();
    return user;
  }

  async createTestResult(result: InsertTestResult): Promise<TestResult> {
    const id = randomUUID();
    const [row] = await db.insert(testResults).values({ ...result, id }).returning();
    return row;
  }

  async getTestResult(id: string): Promise<TestResult | undefined> {
    const [row] = await db.select().from(testResults).where(eq(testResults.id, id));
    return row;
  }

  async getTestResultByEmail(email: string): Promise<TestResult[]> {
    return db.select().from(testResults).where(eq(testResults.email, email));
  }

  async getAllTestResults(): Promise<TestResult[]> {
    return db.select().from(testResults);
  }
}

export const storage = new DatabaseStorage();
