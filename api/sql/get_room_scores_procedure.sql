CREATE PROCEDURE `get_room_scores` (r_id INT)
BEGIN
	SELECT u.`id`, u.`name`, u.`score` FROM `user` AS u 
    LEFT JOIN `room_users` AS ru ON u.`id` = ru.`user_id`
    WHERE ru.`room_id` = r_id;
END
