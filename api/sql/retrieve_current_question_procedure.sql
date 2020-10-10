CREATE PROCEDURE `retrieve_current_question` (r_id INT)
BEGIN

SELECT `q`.`id`, `q`.`text` FROM `question` AS `q` 
    RIGHT JOIN `room_questions` AS `rq` ON `q`.`id`=`rq`.`question_id`
    RIGHT JOIN `room` AS `r` ON `rq`.`order_idx`=`r`.`current_question` AND `rq`.`room_id`=`r`.`id`
    WHERE `r`.`id` = r_id;
    
END
