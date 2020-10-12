# API Docs

## Username Register Request
- `POST /register/new_user`
- This endpoint is for registering new temporary users into the database with their selected nickname.
    - The user's nickname is sent back in case it had to be changed by the server (however, currently all nicknames are allowed)
### Request:

Body:
```json
{
    "nick":"user's nickname" 
}
```
### Response:
Status code: 
- 200 SUCCESSFUL
- 500 Could not save the user in the database

Body:
```json
{
    "user_id":"1234",
    "nick":"user's nickname"
}
```

## Room Creation Request
- `POST /register/new_room`
- This endpoint is for creating a new room and having questions assigned to it.
    - The user sending the request does not automatically join; see /register/join_room below

### Request:

Headers:
```
{
user-id:    12345
}
```
### Response:
Status code: 
- 200 SUCCESSFUL
- 400 The requested user or room could not be found in the database
- 500 something went wrong

Body:
```json
{
    "room_id":"1234",
    "room_key":"123456",
    "question_count":"10"
}
```

## Room Join Request
- `POST /register/join_room`
- This endpoint is for the user to join an existing room using its key

### Request:

Headers:
```
{
user-id:    12345
}
```

Body:
```json
{
    "room_key":"123456",
}
```

### Response:
Status code: 
- 200 SUCCESSFUL

## Questions Request
- `GET /questions/next_question`
- This endpoint is responsible for returning the next question in the list
    - If there are no more questions, the room will be destroyed
### Request:

Headers:
```
user-id:    12345
room-id:    1332 
```
### Response:
Status code: 
- 200 SUCCESSFUL
- 400 user error
    - user_id or room_id headers might be missing
- 401 user not in room
- 204 No Content
    - Meaning no more questions
    - The quiz is finished

Body:
```json
{
    "question":{
        "id": 123,
        "text":"What is this question?",
    }
    "answer_options":[
        {"id":431, "text":"answer1"},
        {"id":432, "text":"answer2"},
        {"id":433, "text":"answer3"},
        {"id":434, "text":"answer4"}
    ]
}
```

<!-- 
## Mock Route Template
- `POST /route/someroute?userid=1234`
    - userid param is for etc
- This is a mock template for api docs, use this section as a descrioption

### Request:
Body:
```json
{
    "room_id":"1234",
    "answer_id":"3456" 
}
```

Headers:
```
user_id:    12345
header:     headervalue
```
### Response:
Status code: 
- 200 SUCCESSFUL
- 400 user error

Body:
```json
{
    "solution":2
}
```

Headers:
```
SomeHeaders:    SomeHeaderValues
``` -->