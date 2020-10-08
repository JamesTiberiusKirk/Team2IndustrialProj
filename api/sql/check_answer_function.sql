CREATE DEFINER="doadmin"@"%" FUNCTION "check_answer"(q_id INT, a_id INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	
DECLARE question_result BOOLEAN;
SET @question_result = FALSE;
SELECT `correct` INTO question_result 
	FROM `answer`
	WHERE `question_id` = q_id and `id` = a_id;
RETURN question_result;
	
END