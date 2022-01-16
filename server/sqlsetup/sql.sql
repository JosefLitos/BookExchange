CREATE TABLE `book_exchange`.`user` (
	`id` VARCHAR(32) NOT NULL ,
	`name` VARCHAR(32) CHARACTER SET utf8 COLLATE utf8_czech_ci NOT NULL ,
	`email` VARCHAR(32) NOT NULL ,
	`icon` VARCHAR(128) NOT NULL ,
	`last_visited` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	PRIMARY KEY (`id`),
	UNIQUE (`email`)
) ENGINE = InnoDB;

CREATE TABLE `book_exchange`.`book` (
	`id` INT(11) NOT NULL AUTO_INCREMENT ,
	`owner_id` VARCHAR(32) NOT NULL ,
	`cost` INT(4) NOT NULL ,
	`name` VARCHAR(64) CHARACTER SET utf8 COLLATE utf8_czech_ci NOT NULL ,
	`author` VARCHAR(128) CHARACTER SET utf8 COLLATE utf8_czech_ci NOT NULL ,
	`year` INT(4) NOT NULL ,
	`description` VARCHAR(512) CHARACTER SET utf8 COLLATE utf8_czech_ci NULL DEFAULT NULL ,
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_book_user`
	  FOREIGN KEY (owner_id) REFERENCES user (id)
    ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE `book_exchange`.`request` (
	`id` INT(11) NOT NULL AUTO_INCREMENT ,
	`book_id` INT(11) NOT NULL ,
	`customer_id` VARCHAR(32) NOT NULL ,
	`created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ,
	`accepted` BOOLEAN NOT NULL DEFAULT FALSE ,
	PRIMARY KEY (`id`),
	CONSTRAINT `fk_book`
	  FOREIGN KEY (book_id) REFERENCES book (id)
	  ON DELETE CASCADE,
	CONSTRAINT `fk_customer`
	  FOREIGN KEY (customer_id) REFERENCES user (id)
	  ON DELETE CASCADE
) ENGINE = InnoDB;
