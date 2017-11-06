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

## `POST '/invite_user'`
### req
```json
{
  "note_id": 1,
  "username": "fabianbaechli"
}
```
### res
```json
{
  "ok": true / false,
  "message": "user was invited"
}
```

## `POST '/uninvite_user'`
### req
```json
{
  "note_id": 1,
  "username": "fabianbaechli"
}
```
### res
```json
{
  "ok": true / false,
  "message": "user was uninvited"
}
```

## `POST '/register'`
### req
```json
{
  "username": "fabianbaechli",
  "password": "hello wrold",
  "retype_password": "hello world"
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

## `POST '/delete_note'`
### req
```json
{
  "note_id": 1
}
```
### res
```json
{
  "ok": true / false,
  "message": "user was uninvited"
}
```

## `GET '/get_notes'`
### res
```json
{
"notes": [{
  "id": 1,
  "title": "This is a header",
  "date_created": 25-12-2017,
  "date_modified": 27-12-2017,
  "content": "lorem ipsum",
  "users": [{
    "id": 0,
    "username": "Example"
    }]
}]
}
```

## POST `change_note`
### req
```json
{
  "note_id": 1,
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
