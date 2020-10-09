CREATE FUNCTION `new_user`(nickname VARCHAR(45)) RETURNS int
BEGIN

DECLARE u_id INT;

INSERT INTO `user` (`name`) VALUES (nickname);
SELECT SCOPE_IDENTITY() into u_id;

RETURN u_id;
END
