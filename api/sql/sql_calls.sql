/* New user registration */
/* Returns the user_ID (int) */
select new_user(/*nickname*/);

/* Check answer to question */
/* returns NULL if answer ID doesnt match question, returns 1 if correct, returns 0 if incorrect */
select check_answer(/*question id*/,/*answer id*/);

/* New room registration */
/* generates a random room key which is unique and returns it. Also adds this to a new row in room table */
select new_room();

/* Destroy room*/ 
/* sets the "ended" flag for soft delete and frees the room key */
call destroy_room_key(/* key of room to destroy*/);
call destroy_room_id(/* ID of room to destroy*/);

/* Check user or room exists (return boolean) */
select room_id_exists(/*room id to check*/);
select user_id_exists(/*user id to check*/);

/* Add a user to a room */
select add_user_to_room(/*room ID*/,/*user ID*/);

/* Increment score*/
call increment_score(/*user ID*/, /* integer amount to increment score by*/)