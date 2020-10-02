-- MySQL Script generated by MySQL Workbench
-- Fri Oct  2 12:43:57 2020
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db_calendar
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema db_calendar
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_calendar` DEFAULT CHARACTER SET utf8 ;
USE `db_calendar` ;

-- -----------------------------------------------------
-- Table `db_calendar`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_calendar`.`users` (
  `username` VARCHAR(30) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `question` VARCHAR(255) NOT NULL,
  `answer` VARCHAR(255) NOT NULL,
  `status` CHAR(1) NOT NULL DEFAULT 'A',
  PRIMARY KEY (`username`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_calendar`.`events`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_calendar`.`events` (
  `iddates` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(150) NOT NULL,
  `description` VARCHAR(500) NOT NULL,
  `address` VARCHAR(250) NOT NULL,
  `date` DATE NOT NULL,
  `start_hour` TIME NOT NULL,
  `end_hour` TIME NOT NULL,
  `type` CHAR(2) NOT NULL,
  `username` VARCHAR(30) NOT NULL,
  PRIMARY KEY (`iddates`),
  INDEX `fk_dates_users_idx` (`username` ASC),
  CONSTRAINT `fk_dates_users`
    FOREIGN KEY (`username`)
    REFERENCES `db_calendar`.`users` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `db_calendar`.`users`
-- -----------------------------------------------------
START TRANSACTION;
USE `db_calendar`;
INSERT INTO `db_calendar`.`users` (`username`, `password`, `question`, `answer`, `status`) VALUES ('admin', '$2y$10$ZuWWi031RgT7EE3/V6Fgw./b.qVAg1aj6b4npkLcxIbj7JU/dERRy', 'Favorite color?', '$2y$10$RXY3MhQVbybCNWHC6VrjEeOL13e80jInkj1dTAO4i.SE9yM4mTEWi', 'A');

COMMIT;

