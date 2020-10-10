CREATE PROCEDURE "assign_room_questions"(r_id INT, cat_id INT)
BEGIN

DROP TABLE IF EXISTS `questions_for_room`;

CREATE TEMPORARY TABLE `questions_for_room` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
`room_id` INT NOT NULL,
`question_id` INT NOT NULL);

ALTER TABLE `questions_for_room` AUTO_INCREMENT=1;

INSERT INTO `questions_for_room` (`room_id`,`question_id`)
SELECT r_id as `room_id`, `id` FROM `question`
WHERE `category_id` = cat_id ORDER BY RAND() LIMIT 10;

INSERT INTO `room_questions` (`room_id`, `question_id`, `order_idx`)
SELECT `room_id`, `question_id`, `id` FROM `questions_for_room`
ORDER BY `id`;

DROP TABLE `questions_for_room`;
END
