CREATE TABLE `opportunities` (
	`id` int AUTO_INCREMENT NOT NULL,
	`accountName` varchar(200) NOT NULL,
	`sourceChannel` enum('inbound','referral','organic','linkedin','public_business_channel','partner','other') NOT NULL DEFAULT 'other',
	`sourceReference` varchar(2048),
	`evidenceRoute` varchar(2048),
	`evidenceSummary` text,
	`offerHypothesis` enum('undecided','swell_geo_growth','swell_geo_scale','arm_mandate_pro') NOT NULL DEFAULT 'undecided',
	`qualificationState` enum('research','qualified','awaiting_reply','fit_review_requested','fit_review_booked','fit_review_completed','nurture','closed_no_fit') NOT NULL DEFAULT 'research',
	`scopeState` enum('not_started','drafting','sent','accepted','declined') NOT NULL DEFAULT 'not_started',
	`collectionState` enum('not_requested','private_instructions_ready','requested','collected','failed') NOT NULL DEFAULT 'not_requested',
	`onboardingState` enum('not_ready','ready','active','blocked') NOT NULL DEFAULT 'not_ready',
	`nextAction` text,
	`nextActionAt` timestamp,
	`createdByUserId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `opportunities_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `opportunities` ADD CONSTRAINT `opportunities_createdByUserId_users_id_fk` FOREIGN KEY (`createdByUserId`) REFERENCES `users`(`id`) ON DELETE restrict ON UPDATE cascade;