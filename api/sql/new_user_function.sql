CREATE FUNCTION `new_user`(nickname VARCHAR(45)) RETURNS int
BEGIN

DECLARE u_id INT;

INSERT INTO `user` (`name`) VALUES (nickname);
SELECT LAST_INSERT_ID() into u_id;

RETURN u_id;
END
