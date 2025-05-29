import {
  users,
  promptTemplates,
  userPrompts,
  userActivity,
  fileUploads,
  userSettings,
  type User,
  type UpsertUser,
  type PromptTemplate,
  type InsertPromptTemplate,
  type UserPrompt,
  type InsertUserPrompt,
  type UserActivity,
  type InsertUserActivity,
  type FileUpload,
  type InsertFileUpload,
  type UserSettings,
  type InsertUserSettings,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;

  // Prompt template operations
  getPromptTemplates(): Promise<PromptTemplate[]>;
  getPromptTemplate(id: number): Promise<PromptTemplate | undefined>;
  createPromptTemplate(template: InsertPromptTemplate): Promise<PromptTemplate>;
  updatePromptTemplate(id: number, template: Partial<InsertPromptTemplate>): Promise<PromptTemplate>;
  incrementTemplateUsage(id: number): Promise<void>;

  // User prompt operations
  getUserPrompts(userId: string): Promise<UserPrompt[]>;
  getUserPrompt(id: number, userId: string): Promise<UserPrompt | undefined>;
  createUserPrompt(prompt: InsertUserPrompt): Promise<UserPrompt>;
  updateUserPrompt(id: number, prompt: Partial<InsertUserPrompt>): Promise<UserPrompt>;
  deleteUserPrompt(id: number, userId: string): Promise<void>;
  searchUserPrompts(userId: string, query: string): Promise<UserPrompt[]>;

  // User activity operations
  getUserActivity(userId: string, limit?: number): Promise<UserActivity[]>;
  createUserActivity(activity: InsertUserActivity): Promise<UserActivity>;

  // File upload operations
  getUserFiles(userId: string): Promise<FileUpload[]>;
  createFileUpload(file: InsertFileUpload): Promise<FileUpload>;
  deleteFileUpload(id: number, userId: string): Promise<void>;

  // User settings operations
  getUserSettings(userId: string): Promise<UserSettings | undefined>;
  upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings>;

  // Analytics operations
  getUserStats(userId: string): Promise<{
    promptsCreated: number;
    templatesUsed: number;
    averageCompletionTime: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  // User operations (IMPORTANT: mandatory for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Prompt template operations
  async getPromptTemplates(): Promise<PromptTemplate[]> {
    return await db
      .select()
      .from(promptTemplates)
      .where(eq(promptTemplates.isPublic, true))
      .orderBy(desc(promptTemplates.usageCount));
  }

  async getPromptTemplate(id: number): Promise<PromptTemplate | undefined> {
    const [template] = await db
      .select()
      .from(promptTemplates)
      .where(eq(promptTemplates.id, id));
    return template;
  }

  async createPromptTemplate(template: InsertPromptTemplate): Promise<PromptTemplate> {
    const [newTemplate] = await db
      .insert(promptTemplates)
      .values(template)
      .returning();
    return newTemplate;
  }

  async updatePromptTemplate(id: number, template: Partial<InsertPromptTemplate>): Promise<PromptTemplate> {
    const [updatedTemplate] = await db
      .update(promptTemplates)
      .set({ ...template, updatedAt: new Date() })
      .where(eq(promptTemplates.id, id))
      .returning();
    return updatedTemplate;
  }

  async incrementTemplateUsage(id: number): Promise<void> {
    await db
      .update(promptTemplates)
      .set({ usageCount: sql`${promptTemplates.usageCount} + 1` })
      .where(eq(promptTemplates.id, id));
  }

  // User prompt operations
  async getUserPrompts(userId: string): Promise<UserPrompt[]> {
    return await db
      .select()
      .from(userPrompts)
      .where(eq(userPrompts.userId, userId))
      .orderBy(desc(userPrompts.updatedAt));
  }

  async getUserPrompt(id: number, userId: string): Promise<UserPrompt | undefined> {
    const [prompt] = await db
      .select()
      .from(userPrompts)
      .where(and(eq(userPrompts.id, id), eq(userPrompts.userId, userId)));
    return prompt;
  }

  async createUserPrompt(prompt: InsertUserPrompt): Promise<UserPrompt> {
    const [newPrompt] = await db
      .insert(userPrompts)
      .values(prompt)
      .returning();
    return newPrompt;
  }

  async updateUserPrompt(id: number, prompt: Partial<InsertUserPrompt>): Promise<UserPrompt> {
    const [updatedPrompt] = await db
      .update(userPrompts)
      .set({ ...prompt, updatedAt: new Date() })
      .where(eq(userPrompts.id, id))
      .returning();
    return updatedPrompt;
  }

  async deleteUserPrompt(id: number, userId: string): Promise<void> {
    await db
      .delete(userPrompts)
      .where(and(eq(userPrompts.id, id), eq(userPrompts.userId, userId)));
  }

  async searchUserPrompts(userId: string, query: string): Promise<UserPrompt[]> {
    return await db
      .select()
      .from(userPrompts)
      .where(
        and(
          eq(userPrompts.userId, userId),
          sql`${userPrompts.title} ILIKE ${`%${query}%`} OR ${userPrompts.description} ILIKE ${`%${query}%`}`
        )
      )
      .orderBy(desc(userPrompts.updatedAt));
  }

  // User activity operations
  async getUserActivity(userId: string, limit: number = 10): Promise<UserActivity[]> {
    return await db
      .select()
      .from(userActivity)
      .where(eq(userActivity.userId, userId))
      .orderBy(desc(userActivity.createdAt))
      .limit(limit);
  }

  async createUserActivity(activity: InsertUserActivity): Promise<UserActivity> {
    const [newActivity] = await db
      .insert(userActivity)
      .values(activity)
      .returning();
    return newActivity;
  }

  // File upload operations
  async getUserFiles(userId: string): Promise<FileUpload[]> {
    return await db
      .select()
      .from(fileUploads)
      .where(eq(fileUploads.userId, userId))
      .orderBy(desc(fileUploads.createdAt));
  }

  async createFileUpload(file: InsertFileUpload): Promise<FileUpload> {
    const [newFile] = await db
      .insert(fileUploads)
      .values(file)
      .returning();
    return newFile;
  }

  async deleteFileUpload(id: number, userId: string): Promise<void> {
    await db
      .delete(fileUploads)
      .where(and(eq(fileUploads.id, id), eq(fileUploads.userId, userId)));
  }

  // User settings operations
  async getUserSettings(userId: string): Promise<UserSettings | undefined> {
    const [settings] = await db
      .select()
      .from(userSettings)
      .where(eq(userSettings.userId, userId));
    return settings;
  }

  async upsertUserSettings(settings: InsertUserSettings): Promise<UserSettings> {
    const [userSetting] = await db
      .insert(userSettings)
      .values(settings)
      .onConflictDoUpdate({
        target: userSettings.userId,
        set: {
          ...settings,
          updatedAt: new Date(),
        },
      })
      .returning();
    return userSetting;
  }

  // Analytics operations
  async getUserStats(userId: string): Promise<{
    promptsCreated: number;
    templatesUsed: number;
    averageCompletionTime: number;
  }> {
    const [promptsCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userPrompts)
      .where(eq(userPrompts.userId, userId));

    const [templatesCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(userPrompts)
      .where(and(eq(userPrompts.userId, userId), sql`${userPrompts.templateId} IS NOT NULL`));

    return {
      promptsCreated: promptsCount.count || 0,
      templatesUsed: templatesCount.count || 0,
      averageCompletionTime: 8.5, // This would need more complex calculation based on actual completion times
    };
  }
}

export const storage = new DatabaseStorage();
