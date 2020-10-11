# API Docs

## Questions Request
- `GET /questions/next_question`
- This endpoint is responsible or retuning the next question on the list
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