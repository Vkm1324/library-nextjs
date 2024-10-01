ALTER TABLE `Professor` DROP FOREIGN KEY `Professor_deptId_Users_id_fk`;
--> statement-breakpoint
ALTER TABLE `department` MODIFY COLUMN `deptId` serial AUTO_INCREMENT NOT NULL;--> statement-breakpoint
ALTER TABLE `Professor` MODIFY COLUMN `deptId` int;--> statement-breakpoint
ALTER TABLE `Professor` ADD `userId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Users` ADD `credits` bigint unsigned;--> statement-breakpoint
ALTER TABLE `Professor` ADD CONSTRAINT `Professor_userId_Users_id_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE no action ON UPDATE no action;