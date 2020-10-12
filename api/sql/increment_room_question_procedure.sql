CREATE PROCEDURE `increment_room_question`(r_id INT)
BEGIN
UPDATE `room` SET `current_question` = `current_question` + 1 WHERE `id` = r_id;
END