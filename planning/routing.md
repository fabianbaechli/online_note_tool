# Routes
## `POST '/login'`
### req
```json
{
  "username": "fabianbaechli",
  "password": "hellow rold"
}
```
### res
```json
{
  "ok": true / false,
  "message": "logged in"
}
```

## `POST '/create_user'`
### reg
```json
{
  "username": "fabianbaechli",
  "password": "hellow rold",
  "retype_password": "hellow rold"
}
```

### res
```json
{
  "ok": true / false,
  "message": "User created"
}
```

## `POST '/create_note'`
### req
```json
{
  "header": "This is a header",
  "content": "lorem ipsum"
}
```

### res
```json
{
  "ok": true / false,
  "message"
}
```

## `GET '/get_notes'`
### res
```json
{
  "id": 1,
  "title": "This is a header",
  "date_created": 25-12-2017,
  "date_modified": 27-12-2017,
  "content": "lorem ipsum"
}
```

## POST `change_note`
### req
```json
{
  "enty_id": 1,
  "title": "This is a new header",
  "content": "mata sanctus est Lorem"
}
```

### res
```json
{
  "ok": true / false,
  "message": "changed note"
}
```

## GET `/authenticated`
### res
```json
{
  "authenticated": true / false,
  "username": "req.session.username"
}
```
