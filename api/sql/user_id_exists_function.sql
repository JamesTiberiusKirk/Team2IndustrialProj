CREATE FUNCTION `user_id_exists` (u_id INT)
RETURNS BOOLEAN
BEGIN

IF EXISTS(SELECT * FROM `user` WHERE `id` = u_id)
THEN
	RETURN 1;
ELSE
	RETURN 0;
END IF;

END