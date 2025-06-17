import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const musicFiles = pgTable("music_files", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  filename: text("filename").notNull(),
  originalKey: text("original_key").notNull(),
  targetInstrument: text("target_instrument").notNull(),
  transpositionSemitones: integer("transposition_semitones").notNull(),
  musicXml: text("music_xml"),
  processedAt: timestamp("processed_at").defaultNow().notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  musicFiles: many(musicFiles),
}));

export const musicFilesRelations = relations(musicFiles, ({ one }) => ({
  user: one(users, {
    fields: [musicFiles.userId],
    references: [users.id],
  }),
}));

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMusicFileSchema = createInsertSchema(musicFiles).pick({
  userId: true,
  filename: true,
  originalKey: true,
  targetInstrument: true,
  transpositionSemitones: true,
  musicXml: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMusicFile = z.infer<typeof insertMusicFileSchema>;
export type MusicFile = typeof musicFiles.$inferSelect;
