CREATE DEFINER="doadmin"@"%" FUNCTION "room_id_from_key"(r_key VARCHAR(6)) RETURNS int
BEGIN
DECLARE r_id INT;

SELECT `id` into r_id FROM `room` WHERE `key` = r_key;

RETURN r_id;
END