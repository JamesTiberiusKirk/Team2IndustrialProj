CREATE DEFINER="doadmin"@"%" PROCEDURE "destroy_room_key"(r_key VARCHAR(6))
BEGIN
UPDATE `room` SET `key` = NULL, `ended` = true WHERE `key` = r_key;
END