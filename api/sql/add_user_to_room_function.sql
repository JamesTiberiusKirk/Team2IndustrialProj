CREATE DEFINER="doadmin"@"%" FUNCTION "add_user_to_room"(r_id INT, u_id INT) RETURNS tinyint(1)
BEGIN

IF room_exists(r_id) AND user_exists(u_id)
THEN
	INSERT INTO `room_users` (`user_id`, `room_id`) VALUES (u_id, r_id);
ELSE
	return 0;
END IF;

RETURN 1;
END