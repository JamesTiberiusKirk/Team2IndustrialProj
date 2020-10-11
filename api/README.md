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

#

## Mock Route Template
- POST /route/someroute?userid=1234
    - userid param is for etc
- This is a mock template for api docs, use this section as a descrioption

### Request 
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
### Resolve:
Status code: 
- 200 SUCCESFUL
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
```