let express = require("express");
let sql = require('mysql');
const bodyParser = require('body-parser');
let session = require('express-session');
let path = require('path');
let app = express();

app.use(express.static('frontend'));
app.use(session({secret: 'zdsvadushvbadsv'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sess;
var body;

// Constructor for a user
function User(username, password) {
    this.username = username;
    this.password = password;
}

// config and connection for your database
let connection = sql.createConnection({
    host: 'localhost',
    user: 'app',
    password: 'genericPass',
    database: 'notes_tool'
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Connect to Database
connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ...");
    } else {
        console.log("Error connecting database ...");
    }
});

app.get("/", (req, res) => {
    console.log("got request");
    res.redirect('/index.html');
});

// Post request to create a user
app.post("/register", (req, res) => {
    sess = body.session;
    console.log(req.body);
    let username = req.body['username'];
    let password = req.body['password'];
    // ToDo: implement server side check if first password is same as scndPassword


    // query the db to insert a new user
    connection.query('INSERT INTO notes_tool.User (username, password) VALUES (' + connection.escape(username) + ', ' + connection.escape(password) + ')', function (err, rows) {
        if (!err) {
          sess.authenticated = true;
          sess.username = username;
          // query again for the id
          connection.query('SELECT id FROM notes_tool.User WHERE username = ' + connection.escape(username), function (err, rows) {
              if (!err) {
                if (rows.length > 0) {
                  let user = rows[0];
                  sess.db_id = user.id;
                } else {
                  res.json({ok: false, message: "User not found in db"});
                  sess.authenticated = false;
                  return;
                }
              } else {
                res.json({ok: false, message: "User not found in db"});
                sess.authenticated = false;
                return;
              }
          });

          res.json({ok: true, message: "User Created"});
        } else {
            res.json({ok: false, message: "Username already taken."});
        }
    });
});

// Login to get a session
app.post('/login', (req, res) => {
    sess = req.session;
    body = req.body;
    if (!sess.authenticated) {
        console.log(body.username);
        connection.query('SELECT password, id FROM notes_tool.User WHERE username = ' + connection.escape(body.username), function (err, rows, fields) {
            if (!err) {
                console.log('The solution is: ', rows[0].password);
                if (rows.length !== 0) {
                    let user = rows[0];
                    if (user !== undefined && user.password === body.password) {
                        sess.authenticated = true;
                        sess.username = body.username;
                        sess.db_id = user.id;
                        res.json({ok: true, message: "logged in"});
                        return;
                    }
                }

                res.json({ok: false, message: "Log in failed"});
            } else {
                res.json({ok: false, message: "Error while performing query"});
            }
        });
    } else {
        res.json({ ok: false, message: "already logged in" });
    }
});

// Get request, that returns all the Notes that belong to the User that is logged in
app.get("/get_notes", (req, res) => {
    sess = req.session;
    if (sess.authenticated) {
        const queryString = "SELECT N.id, N.title, N.date_created, N.date_modified, N.content FROM Note AS N " +
            "INNER JOIN Contributor as C on N.id = C.fk_note INNER JOIN User as U on U.id = C.fk_user " +
            "WHERE U.id = " + connection.escape(sess.db_id);
        console.log(queryString);
        connection.query(queryString, (err, rows) => {
            res.json({ ok: true, notes: rows });
        })
    } else {
        res.json({ ok: false, message: "Not logged in" })
    }
});

// Post request to create a note
app.post("/create_note", (req, res) => {
    if (req.session.authenticated) {
        body = req.body;
        let createDate = new Date();
        let dd = createDate.getDate();
        let mm = createDate.getMonth() + 1;
        let yyyy = createDate.getFullYear();

        const queryString = "INSERT INTO `Note` (`title`, `date_created`, `date_modified`, `content`) " +
            "VALUES" + "(`New note`, `" + yyyy +"-"+ mm +"-"+ dd + "`,`" + yyyy +"-"+ mm +"-"+ dd + "`," + "``" + ");"
        connection.query(queryString, (err, results) => {
            if (!err) {



                res.json({ok: true, message: "created entry"});
            } else {
                res.json({ok: false, message: "entry not created"});
            }
        })

    } else {
        res.json({ok: false, message: "not logged in"});
    }
});

// Check if you are authenticated over a post request
app.get("/authenticated", (req, res) => {
    if (req.session.authenticated)
        res.json({authenticated: req.session.authenticated, username: req.session.username})
    else
        res.json({authenticated: false, username: undefined})
});

app.post('/invite_user', (req, res) => {
  // Check if logged in
  // Check if contributor to note
  // Check if other user exists
  // Check if other user is Contributor to note
  // And then invite this user -- Create Contributor Entry in DB
});
app.post('/uninvite_user', (req, res) => {
  // Check if logged in
  // Check if contributor to note
  // Check if other user exists
  // Check if other user is Contributor to note
  // Remove other User -- Delete Contributor Entry in DB
});

// Delete a note with an ID
app.post("/delete_note", (req, res) => {
    if (req.session.authenticated) {
      // todo: if last contributor, delete note as well

        const queryString = "DELETE FROM Contributor WHERE Contributor.`fk_note` = " + req.body.note_id + "AND Contributor.`fk_user` = " + req.session.db_id;
        connection.query(queryString, (err, rows) => {
            if (!err)
                res.json({ok: true, message: "deleted entry"})
            else
                res.json({ok: false, message: "couldn't delete entry"})
        })
    } else {
        res.json({ok: false, message: "not logged in"})
    }
});

// Post request to change a notes properties
app.post('change_note', (req, res) => {
    body = req.body;
    let note_id = body.note_id;
    let title = body.title;
    let content = body.content;

    let createDate = new Date();
    let dd = createDate.getDate();
    let mm = createDate.getMonth() + 1;
    let yyyy = createDate.getFullYear();

    let modified = "" + yyyy + mm + dd;

    // Check if authenticated, if yes, change the properties of the note and save it to the db
    if (sess.authenticated) {
        const queryString = "UPDATE Note SET title=" + title + ", content=" + content + ", date_modified=" + modified + " WHERE id = " + note_id + ";";
        connection.query(queryString, (err, rows) => {
            if (!err)
                res.json({ok: true, message: "Note succesfully changed"});
            else {
                res.json({ok: false, message: "Note was not changed"});
            }
        })
    } else {
        res.json({ok: false, message: "not logged in"});
    }
});

// Hosts the nodejs server on port 3000
app.listen(3000, function (req, res) {
    console.log("app listening on 3000");
});
