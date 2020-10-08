CREATE DEFINER="doadmin"@"%" PROCEDURE "increment_score"(u_id INT, inc INT)
BEGIN
UPDATE `user` SET `score` = `score` + inc WHERE `id` = u_id;
END