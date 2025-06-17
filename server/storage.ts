import { users, musicFiles, type User, type InsertUser, type MusicFile, type InsertMusicFile } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createMusicFile(musicFile: InsertMusicFile): Promise<MusicFile>;
  getMusicFilesByUser(userId: number): Promise<MusicFile[]>;
  getMusicFile(id: number): Promise<MusicFile | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createMusicFile(insertMusicFile: InsertMusicFile): Promise<MusicFile> {
    const [musicFile] = await db
      .insert(musicFiles)
      .values(insertMusicFile)
      .returning();
    return musicFile;
  }

  async getMusicFilesByUser(userId: number): Promise<MusicFile[]> {
    return await db.select().from(musicFiles).where(eq(musicFiles.userId, userId));
  }

  async getMusicFile(id: number): Promise<MusicFile | undefined> {
    const [musicFile] = await db.select().from(musicFiles).where(eq(musicFiles.id, id));
    return musicFile || undefined;
  }
}

export const storage = new DatabaseStorage();
