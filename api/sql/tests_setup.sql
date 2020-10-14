DROP DATABASE IF EXISTS "testdb"
CREATE DATABASE "testdb" 
USE `testdb`;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE `category` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=latin1 COMMENT='Stores the question categories';

INSERT INTO `category` VALUES (1,'general');

--
-- Table structure for table `question`
--

DROP TABLE IF EXISTS `question`;
CREATE TABLE `question` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(256) NOT NULL,
  `category_id` int unsigned DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id_idx` (`category_id`),
  CONSTRAINT `question_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=latin1;

INSERT INTO `question` VALUES (1,'What is the longest that an elephant has ever lived?',1),(2,'How many rings are on the Olympic flag?',1),(3,'What is a tarsier?',1),(4,'How did Spider-Man get his powers?',1),(5,'In darts, what\'s the most points you can score with a single throw?',1),(6,'Which of these animals does NOT appear in the Chinese zodiac?',1),(7,'How many holes are on a standard bowling ball?',1),(8,'What are the main colors on the flag of Spain?',1),(9,'In the nursery rhyme, how many blackbirds were baked in a pie?',1),(10,'Who killed Greedo?',1);

--
-- Table structure for table `answer`
--

DROP TABLE IF EXISTS `answer`;
CREATE TABLE `answer` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `text` varchar(128) NOT NULL,
  `correct` tinyint NOT NULL,
  `question_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `question_id_idx` (`question_id`),
  CONSTRAINT `question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=latin1 COMMENT='Stores the answers to the questions, whether it is a correct answer and what questions it is an answer to';

INSERT INTO `answer` VALUES (40,'17 Years',0,1),(41,'49 Years',0,1),(42,'86 Years',1,1),(43,'142 Years',0,1),(44,'None',0,2),(45,'4',0,2),(46,'5',1,2),(47,'7',0,2),(48,'A primate',1,3),(49,'A lizard',0,3),(50,'A bird',0,3),(51,'A fish',0,3),(52,'Military experiment gone awry',0,4),(53,'Born with them',0,4),(54,'Woke up with them after a strange dream',0,4),(55,'Bitten by a radioactive spider',1,4),(56,'20',0,5),(57,'50',0,5),(58,'60',1,5),(59,'100',0,5),(60,'Bear',1,6),(61,'Rabbit',0,6),(62,'Dragon',0,6),(63,'Dog',0,6),(64,'2',0,7),(65,'3',1,7),(66,'5',0,7),(67,'10',0,7),(68,'Black and yellow',0,8),(69,'Green and white',0,8),(70,'Blue and white',0,8),(71,'Red and yellow',1,8),(72,'4',0,9),(73,'11',0,9),(74,'24',1,9),(75,'99',0,9),(76,'Hannibal Lecter',0,10),(77,'Han Solo',1,10),(78,'Hermione Granger',0,10),(79,'Hercules',0,10);

--
-- Table structure for table `room`
--

DROP TABLE IF EXISTS `room`;
CREATE TABLE `room` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `key` varchar(6) DEFAULT NULL,
  `private` tinyint DEFAULT NULL,
  `ended` tinyint DEFAULT '0',
  `current_question` int DEFAULT '0',
  `category_id` int unsigned DEFAULT NULL,
  `num_questions` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `key_UNIQUE` (`key`),
  KEY `room_category_id` (`category_id`),
  CONSTRAINT `room_category_id` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=latin1;

--
-- Table structure for table `room_questions`
--

DROP TABLE IF EXISTS `room_questions`;
CREATE TABLE `room_questions` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `question_id` int unsigned NOT NULL,
  `room_id` int unsigned NOT NULL,
  `order_idx` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `room_questions_question_id_idx` (`question_id`),
  KEY `room_questions_room_id_idx` (`room_id`),
  CONSTRAINT `room_questions_question_id` FOREIGN KEY (`question_id`) REFERENCES `question` (`id`),
  CONSTRAINT `room_questions_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=latin1;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `score` int DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=latin1;

--
-- Table structure for table `room_users`
--

DROP TABLE IF EXISTS `room_users`;
CREATE TABLE `room_users` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `room_id` int unsigned NOT NULL,
  PRIMARY KEY (`id`),
  KEY `room_users_user_id_idx` (`user_id`),
  KEY `room_users_room_id_idx` (`room_id`),
  CONSTRAINT `room_users_room_id` FOREIGN KEY (`room_id`) REFERENCES `room` (`id`),
  CONSTRAINT `room_users_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=latin1;


--
-- Dumping routines for database 'testdb'
--
DELIMITER ;;
CREATE FUNCTION "add_user_to_room"(r_id INT UNSIGNED, u_id INT UNSIGNED) RETURNS tinyint(1)
BEGIN

IF room_id_exists(r_id) AND user_id_exists(u_id)
THEN
	INSERT INTO `room_users` (`user_id`, `room_id`) VALUES (u_id, r_id);
ELSE
	return 0;
END IF;

RETURN 1;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE FUNCTION "check_answer"(q_id INT, a_id INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	
DECLARE question_result BOOLEAN;
SET @question_result = FALSE;
SELECT `correct` INTO question_result 
	FROM `answer`
	WHERE `question_id` = q_id and `id` = a_id;
RETURN question_result;
	
END ;;
DELIMITER ;

DELIMITER ;;
CREATE FUNCTION "check_user_in_room"(r_id INT, u_id INT) RETURNS tinyint(1)
BEGIN

RETURN EXISTS(SELECT * FROM `room_users` WHERE `room_id` = r_id and `user_id` = u_id);

END ;;
DELIMITER ;

DELIMITER ;;
CREATE FUNCTION "new_room"() RETURNS varchar(6) CHARSET latin1
BEGIN
DECLARE genrated BOOLEAN;
DECLARE room_key VARCHAR(6);

SET genrated = 0;
SET room_key = 000000;

WHILE genrated = 0
DO
  IF NOT EXISTS (SELECT 1 FROM `room` WHERE `key` = room_key)
  THEN
    INSERT `room`(`key`) SELECT room_key;
    SET genrated = 1; 
  ELSE
	  SET room_key = LPAD((SELECT CONVERT( FLOOR(RAND() * 1000000 ), CHAR(6))),6,0);
      SET genrated = 0;
  END IF;
END WHILE;
RETURN room_key;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE FUNCTION "new_user"(nickname VARCHAR(45)) RETURNS int
BEGIN

DECLARE u_id INT;

INSERT INTO `user` (`name`) VALUES (nickname);
SELECT LAST_INSERT_ID() into u_id;

RETURN u_id;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE FUNCTION "room_id_exists"(r_id INT) RETURNS tinyint(1)
BEGIN
DECLARE has_ended BOOLEAN;

IF EXISTS(SELECT * FROM `room` WHERE `id` = r_id)
THEN
	SELECT `ended` into has_ended FROM `room` WHERE `id` = r_id;
	IF has_ended
    THEN
		RETURN 0;
	END IF;
	RETURN 1;
ELSE
	RETURN 0;
END IF;

END ;;
DELIMITER ;

DELIMITER ;;
CREATE FUNCTION "room_id_from_key"(r_key VARCHAR(6)) RETURNS int
BEGIN
DECLARE r_id INT;

SELECT `id` into r_id FROM `room` WHERE `key` = r_key;

RETURN r_id;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE FUNCTION "user_id_exists"(u_id INT) RETURNS tinyint(1)
BEGIN

IF EXISTS(SELECT * FROM `user` WHERE `id` = u_id)
THEN
	RETURN 1;
ELSE
	RETURN 0;
END IF;

END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE "assign_room_questions"(r_id INT, cat_id INT, num_q INT)
BEGIN
DECLARE num_q_rows INT;

DROP TABLE IF EXISTS `questions_for_room`;

CREATE TEMPORARY TABLE `questions_for_room` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
`room_id` INT NOT NULL,
`question_id` INT NOT NULL);

ALTER TABLE `questions_for_room` AUTO_INCREMENT=1; 
    
INSERT INTO `questions_for_room` (`room_id`,`question_id`) 
SELECT r_id as `room_id`, `id` FROM `question` 
WHERE `category_id` = cat_id ORDER BY RAND() LIMIT num_q;

DELETE FROM `room_questions` WHERE `room_id` = r_id; 

INSERT INTO `room_questions` (`room_id`, `question_id`, `order_idx`) 
SELECT `room_id`, `question_id`, `id` FROM `questions_for_room`
ORDER BY `id`;

SELECT COUNT(*) AS num_q_rows FROM `questions_for_room`;

UPDATE `room` SET `num_questions` = num_q_rows WHERE `id` = r_id;

DROP TABLE `questions_for_room`;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE "destroy_room_id"(r_id INT)
BEGIN
UPDATE `room` SET `key` = NULL, `ended` = true WHERE `id` = r_id;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE "destroy_room_key"(r_key VARCHAR(6))
BEGIN
UPDATE `room` SET `key` = NULL, `ended` = true WHERE `key` = r_key;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE "get_room_scores"(r_id INT)
BEGIN
	SELECT u.`id`, u.`name`, u.`score` FROM `user` AS u 
    LEFT JOIN `room_users` AS ru ON u.`id` = ru.`user_id`
    WHERE ru.`room_id` = r_id;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE "increment_room_question"(r_id INT)
BEGIN
UPDATE `room` SET `current_question` = `current_question` + 1 WHERE `id` = r_id;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE "increment_score"(u_id INT, inc INT)
BEGIN
UPDATE `user` SET `score` = `score` + inc WHERE `id` = u_id;
END ;;
DELIMITER ;

DELIMITER ;;
CREATE PROCEDURE "retrieve_current_question"(r_id INT)
BEGIN

SELECT `q`.`id`, `q`.`text` FROM `question` AS `q` 
    RIGHT JOIN `room_questions` AS `rq` ON `q`.`id`=`rq`.`question_id`
    RIGHT JOIN `room` AS `r` ON `rq`.`order_idx`=`r`.`current_question` AND `rq`.`room_id`=`r`.`id`
    WHERE `r`.`id` = r_id;
    
END ;;
DELIMITER ;





