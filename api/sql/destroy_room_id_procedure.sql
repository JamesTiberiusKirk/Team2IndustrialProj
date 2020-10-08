CREATE DEFINER="doadmin"@"%" PROCEDURE "destroy_room_id"(r_id INT)
BEGIN
UPDATE `room` SET `key` = NULL, `ended` = true WHERE `id` = r_id;
END