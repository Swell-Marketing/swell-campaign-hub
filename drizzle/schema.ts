import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as the product grows.
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
 * Internal commercial-control states. The board deliberately stores no payment
 * instrument details, card data, bank data, or client confidential material.
 */
export const opportunitySourceChannels = [
  "inbound",
  "referral",
  "organic",
  "linkedin",
  "public_business_channel",
  "partner",
  "other",
] as const;

export const opportunityOfferHypotheses = [
  "undecided",
  "swell_geo_growth",
  "swell_geo_scale",
  "arm_mandate_pro",
] as const;

export const opportunityQualificationStates = [
  "research",
  "qualified",
  "awaiting_reply",
  "fit_review_requested",
  "fit_review_booked",
  "fit_review_completed",
  "nurture",
  "closed_no_fit",
] as const;

export const opportunityScopeStates = [
  "not_started",
  "drafting",
  "sent",
  "accepted",
  "declined",
] as const;

export const opportunityCollectionStates = [
  "not_requested",
  "private_instructions_ready",
  "requested",
  "collected",
  "failed",
] as const;

export const opportunityOnboardingStates = [
  "not_ready",
  "ready",
  "active",
  "blocked",
] as const;

/**
 * Owner-only opportunity record. Keep the content scoped to commercial state,
 * source provenance, and operational handoff — never payment instruments or
 * confidential client materials.
 */
export const opportunities = mysqlTable("opportunities", {
  id: int("id").autoincrement().primaryKey(),
  accountName: varchar("accountName", { length: 200 }).notNull(),
  sourceChannel: mysqlEnum("sourceChannel", opportunitySourceChannels)
    .notNull()
    .default("other"),
  sourceReference: varchar("sourceReference", { length: 2048 }),
  evidenceRoute: varchar("evidenceRoute", { length: 2048 }),
  evidenceSummary: text("evidenceSummary"),
  offerHypothesis: mysqlEnum("offerHypothesis", opportunityOfferHypotheses)
    .notNull()
    .default("undecided"),
  qualificationState: mysqlEnum("qualificationState", opportunityQualificationStates)
    .notNull()
    .default("research"),
  scopeState: mysqlEnum("scopeState", opportunityScopeStates)
    .notNull()
    .default("not_started"),
  collectionState: mysqlEnum("collectionState", opportunityCollectionStates)
    .notNull()
    .default("not_requested"),
  onboardingState: mysqlEnum("onboardingState", opportunityOnboardingStates)
    .notNull()
    .default("not_ready"),
  nextAction: text("nextAction"),
  nextActionAt: timestamp("nextActionAt"),
  createdByUserId: int("createdByUserId")
    .notNull()
    .references(() => users.id, { onDelete: "restrict", onUpdate: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Opportunity = typeof opportunities.$inferSelect;
export type InsertOpportunity = typeof opportunities.$inferInsert;
