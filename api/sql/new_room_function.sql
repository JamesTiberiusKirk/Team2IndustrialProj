CREATE FUNCTION `new_room` ()
RETURNS VARCHAR(6)
NOT deterministic
BEGIN
DECLARE genrated BOOLEAN;
DECLARE room_key VARCHAR(6);

SET genrated = 0;
SET room_key = 000000;

WHILE genrated = 0
DO
  IF NOT EXISTS (SELECT 1 FROM `room` WHERE `key` = room_key)
  THEN
    INSERT `room`(`key`) SELECT room_key;
    SET genrated = 1; 
  ELSE
	  SET room_key = LPAD((SELECT CONVERT(((RAND() * 1000000)+ 1), CHAR(6))),6,0);
      SET genrated = 0;
  END IF;
END WHILE;
RETURN room_key;
END
