# API Docs

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