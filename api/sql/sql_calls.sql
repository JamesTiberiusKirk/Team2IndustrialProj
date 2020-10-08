/* New user registration */

INSERT into `user` (`name`) values (/*nickname*/);

/* Check answer to question */
/* returns NULL if answer ID doesnt match question, returns 1 if correct, returns 0 if incorrect */

select check_answer(/*question id*/,/*answer id*/);

/* New room registration */
/* generates a random room key which is unique and returns it. Also adds this to a new row in room table */

select quiz.new_room();

/* Destroy room*/ 
/* sets the "ended" flag for soft delete and frees the room key */

call destroy_room_key(/* key of room to destroy*/);

/* or */

call destroy_room_id(/* ID of room to destroy*/);