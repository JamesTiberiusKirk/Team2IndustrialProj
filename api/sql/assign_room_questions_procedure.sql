CREATE PROCEDURE "assign_room_questions"(r_id INT, cat_id INT, num_q)
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

SELECT COUNT(*) INTO num_q_rows FROM `questions_for_room`;
SELECT  num_q_rows;

UPDATE `room` SET `num_questions` = num_q_rows WHERE `id` = r_id;

DROP TABLE `questions_for_room`;
END