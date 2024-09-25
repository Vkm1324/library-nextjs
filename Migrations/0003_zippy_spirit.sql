CREATE TABLE `department` (
	`deptId` serial AUTO_INCREMENT NOT NULL,
	`deptName` varchar(255),
	CONSTRAINT `department_deptId` PRIMARY KEY(`deptId`)
);
--> statement-breakpoint
CREATE TABLE `Professor` (
	`pfid` serial AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`bio` varchar(255),
	`link` varchar(255),
	`deptId` int NOT NULL,
	CONSTRAINT `Professor_pfid` PRIMARY KEY(`pfid`)
);
--> statement-breakpoint
DROP TABLE `Log`;--> statement-breakpoint
ALTER TABLE `Professor` ADD CONSTRAINT `Professor_userId_Users_id_fk` FOREIGN KEY (`userId`) REFERENCES `Users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Professor` ADD CONSTRAINT `Professor_deptId_Users_id_fk` FOREIGN KEY (`deptId`) REFERENCES `Users`(`id`) ON DELETE no action ON UPDATE no action;