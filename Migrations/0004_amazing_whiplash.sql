ALTER TABLE `Professor` DROP FOREIGN KEY `Professor_userId_Users_id_fk`;
--> statement-breakpoint
ALTER TABLE `department` MODIFY COLUMN `deptId` int NOT NULL;--> statement-breakpoint
ALTER TABLE `Professor` DROP COLUMN `userId`;