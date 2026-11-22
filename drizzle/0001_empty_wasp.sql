CREATE TABLE IF NOT EXISTS `chat_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','assistant') NOT NULL,
	`content` text NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `chat_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `daily_logs` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`logDate` varchar(10) NOT NULL,
	`waterMl` int NOT NULL DEFAULT 0,
	`xpEarned` int NOT NULL DEFAULT 0,
	`missionsCompleted` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `daily_logs_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `missions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` varchar(160) NOT NULL,
	`category` enum('physical','intellectual','nutrition','discipline') NOT NULL,
	`difficulty` enum('easy','medium','hard') NOT NULL DEFAULT 'medium',
	`xp` int NOT NULL,
	`missionDate` varchar(10) NOT NULL,
	`status` enum('open','pending','approved','rejected') NOT NULL DEFAULT 'open',
	`requiresProof` int NOT NULL DEFAULT 0,
	`proofUri` text,
	`aiVerdict` varchar(24),
	`aiReason` text,
	`completedAt` timestamp,
	`source` varchar(32) NOT NULL DEFAULT 'daily',
	`hint` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `missions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `profile_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`restrictions` json,
	`allergies` json,
	`weeklyDays` int NOT NULL DEFAULT 4,
	`heightCm` int,
	`weightGoalKg` int,
	CONSTRAINT `profile_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `profile_preferences_userId_unique` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `user_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`goal` varchar(120) NOT NULL DEFAULT 'Evoluir com consistência',
	`experience` varchar(32) NOT NULL DEFAULT 'iniciante',
	`trainingStyle` varchar(64) NOT NULL DEFAULT 'Musculação',
	`dietaryStyle` varchar(64) NOT NULL DEFAULT 'Equilibrada',
	`restrictions` text,
	`studyGoalHours` int NOT NULL DEFAULT 1,
	`wakeTime` varchar(8) NOT NULL DEFAULT '07:00',
	`waterGoalMl` int NOT NULL DEFAULT 2500,
	`xpTotal` int NOT NULL DEFAULT 0,
	`onboardingComplete` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_profiles_userId_unique` UNIQUE(`userId`)
);
