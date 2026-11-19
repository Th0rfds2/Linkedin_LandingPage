import {
  boolean,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  pronouns: text("pronouns"),
  headline: text("headline").notNull(),
  location: text("location").notNull(),
  about: text("about").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  coverUrl: text("cover_url"),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  website: text("website"),
  websiteLabel: text("website_label"),
  birthday: text("birthday"),
  connections: integer("connections").notNull().default(0),
  followers: integer("followers").notNull().default(0),
  profileViews: integer("profile_views").notNull().default(0),
  postImpressions: integer("post_impressions").notNull().default(0),
  searchAppearances: integer("search_appearances").notNull().default(0),
  openToWork: boolean("open_to_work").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const experiences = pgTable("experiences", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  company: text("company").notNull(),
  companyInitials: text("company_initials").notNull(),
  companyColor: text("company_color").notNull().default("#0a66c2"),
  employmentType: text("employment_type").notNull().default("Tempo integral"),
  location: text("location"),
  workMode: text("work_mode"),
  startYear: integer("start_year").notNull(),
  startMonth: integer("start_month").notNull(),
  endYear: integer("end_year"),
  endMonth: integer("end_month"),
  isCurrent: boolean("is_current").notNull().default(false),
  description: text("description"),
  skills: jsonb("skills").$type<string[]>().notNull().default([]),
  position: integer("position").notNull().default(0),
});

export const education = pgTable("education", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  school: text("school").notNull(),
  degree: text("degree").notNull(),
  field: text("field"),
  startYear: integer("start_year").notNull(),
  endYear: integer("end_year"),
  description: text("description"),
  monogram: text("monogram").notNull(),
  color: text("color").notNull().default("#0a66c2"),
  position: integer("position").notNull().default(0),
});

export const certifications = pgTable("certifications", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  issuer: text("issuer").notNull(),
  issuedAt: text("issued_at").notNull(),
  credentialId: text("credential_id"),
  monogram: text("monogram").notNull(),
  color: text("color").notNull().default("#0a66c2"),
  position: integer("position").notNull().default(0),
});

export const skills = pgTable("skills", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  endorsements: integer("endorsements").notNull().default(0),
  endorsedByMe: boolean("endorsed_by_me").notNull().default(false),
  position: integer("position").notNull().default(0),
});

export const languages = pgTable("languages", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  level: text("level").notNull(),
  position: integer("position").notNull().default(0),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  profileId: integer("profile_id")
    .notNull()
    .references(() => profiles.id, { onDelete: "cascade" }),
  kind: text("kind").notNull().default("post"),
  body: text("body").notNull(),
  hashtags: jsonb("hashtags").$type<string[]>().notNull().default([]),
  postedAgo: text("posted_ago").notNull(),
  visibility: text("visibility").notNull().default("🌐"),
  likes: integer("likes").notNull().default(0),
  comments: integer("comments").notNull().default(0),
  reposts: integer("reposts").notNull().default(0),
  likedByMe: boolean("liked_by_me").notNull().default(false),
  position: integer("position").notNull().default(0),
});

export const peopleSuggestions = pgTable("people_suggestions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  headline: text("headline").notNull(),
  avatarUrl: text("avatar_url").notNull(),
  mutualConnections: integer("mutual_connections").notNull().default(0),
  connected: boolean("connected").notNull().default(false),
  position: integer("position").notNull().default(0),
});

export type Profile = typeof profiles.$inferSelect;
export type Experience = typeof experiences.$inferSelect;
export type Education = typeof education.$inferSelect;
export type Certification = typeof certifications.$inferSelect;
export type Skill = typeof skills.$inferSelect;
export type Language = typeof languages.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type PersonSuggestion = typeof peopleSuggestions.$inferSelect;
