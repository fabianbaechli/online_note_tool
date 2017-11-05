let express = require("express");
let sql = require('mysql');
const bodyParser = require('body-parser');
let session = require('express-session');
let path = require('path');
let app = express();

app.use(express.static('../react-frontend/src'));
app.use(session({
  secret: 'zdsvadushvbadsv'
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

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



// Connect to Database
connection.connect(function(err) {
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
  sess = req.session;
  console.log(req.body);



  let username = req.body['username'];
  let password = req.body['password'];
  let secondPassword = req.body['retype_password'];
  // ToDo: implement server side check if first password is same as scndPassword
  if (password != secondPassword) {
    res.json({
      ok: false,
      message: "password does not match"
    });
    return;
  }

  // query the db to insert a new user
  connection.query('INSERT INTO notes_tool.User (username, password) VALUES (' + connection.escape(username) + ', ' + connection.escape(password) + ')', function(err, rows) {
    if (!err) {
      sess.authenticated = true;
      sess.username = username;
      sess.id = rows.insertId;

      res.json({
        ok: true,
        message: "User Created"
      });
    } else {
      res.json({
        ok: false,
        message: "Username already taken."
      });
    }
  });
});

// Login to get a session
app.post('/login', (req, res) => {
  sess = req.session;
  body = req.body;
  if (!sess.authenticated) {
    console.log(body.username);
    connection.query('SELECT password, id FROM notes_tool.User WHERE username = ' + connection.escape(body.username), function(err, rows, fields) {
      if (!err) {
        console.log('The solution is: ', rows[0].password);
        if (rows.length !== 0) {
          let user = rows[0];
          if (user !== undefined && user.password === body.password) {
            sess.authenticated = true;
            sess.username = body.username;
            sess.db_id = user.id;
            res.json({
              ok: true,
              message: "logged in"
            });
            return;
          }
        }

        res.json({
          ok: false,
          message: "Log in failed"
        });
      } else {
        res.json({
          ok: false,
          message: "Error while performing query"
        });
      }
    });
  } else {
    res.json({
      ok: false,
      message: "already logged in"
    });
  }
});

// Get request, that returns all the Notes that belong to the User that is logged in
app.get("/get_notes", (req, res) => {
  const session = req.session;
  if (!session.authenticated) {
    return res.json({
      ok: false,
      message: "Not logged in"
    })
  }

  let queryString = " SELECT N.id, N.title, N.date_created, N.date_modified, N.content FROM NOTE AS N " +
    "INNER JOIN Contributor as C on N.id = C.fk_note INNER JOIN User as U on U.id = C.fk_user " +
    "WHERE U.id = ?";

  // Fetches the list of notes from the database
  connection.query(queryString, [session.db_id], (err, rows) => {
    if (err) {
      return res.json({
        ok: false,
        message: "Could not load notes from database"
      })
    }

    const notes = rows
    let finished_user_fetches = 0

    if (notes.length == 0) {
      return res.json({
        ok: true,
        notes: []
      })
    }

    notes.map((note, index) => {
      let queryString = "SELECT U.id, U.username FROM User AS U INNER JOIN Contributor AS C on U.id = C.fk_user " +
        "INNER JOIN Note AS N on N.id = C.fk_note WHERE N.id = ?"

      connection.query(queryString, [note.id], (err, rows) => {
        if (err) {
          return res.json({
            ok: false,
            message: "Could not load note contributors from database"
          })
        }

        notes[index].users = rows
        finished_user_fetches++

        if (finished_user_fetches == notes.length) {
          res.json({
            ok: true,
            notes: notes
          })
        }
      })
    })
  })
});

// Post request to create a note
app.post("/create_note", (req, res) => {
  const session = req.session

  if (!session.authenticated) {
    return res.json({
      ok: false,
      message: "Not logged in"
    })
  }

  const createDate = new Date();
  const dd = createDate.getDate();
  const mm = createDate.getMonth() + 1;
  const yyyy = createDate.getFullYear();

  const date_created = "" + yyyy + "-" + mm + "-" + dd;

  const queryString = "INSERT INTO Note (title, date_created, date_modified, content) VALUES (?, ?, ?, ?)"

  connection.query(queryString, ["Untitled", date_created, date_created, ""], (err, rows) => {
    if (err) {
      return res.json({
        ok: false,
        message: "Could not create note"
      })
    }

    const queryString = "INSERT INTO Contributor (fk_user, fk_note) VALUES (?, ?)"
    connection.query(queryString, [session.db_id, rows.insertId], (err, rows) => {
      if (err) {
        return res.json({
          ok: false,
          message: "Could not create contributor"
        })
      }

      res.json({
        ok: true,
        message: "Created note"
      })
    })
  })
});

// Check if you are authenticated over a post request
app.get("/authenticated", (req, res) => {
  if (req.session.authenticated)
    res.json({
      authenticated: req.session.authenticated,
      username: req.session.username
    })
  else
    res.json({
      authenticated: false,
      username: undefined
    })
});

// Helper method to get user Id
function getUser(username, callback) {
  connection.query("SELECT id FROM User WHERE User.`username` = ? ", [username], (err, rows) => {
    if (!err) {
      if (rows.length > 0) {
        callback(rows[0].id);
      } else {
        callback(undefined);
      }
    } else {
      callback(undefined);
    }
  });
}

// Add user to contribution of this note
app.post('/invite_user', (req, res) => {
  sess = req.session;
  body = req.body;


  if (sess.authenticated) {
    var userId;
    getUser(body.username, (id) => {
        if (id !== undefined) {
          userId = id;
        } else {
          res.json({
            ok: false,
            message: "User does not exist"
          });
          return;
        }

        var queryString = "SELECT id, fk_user, fk_note FROM Contributor WHERE Contributor.`fk_user` = " + sess.db_id + " AND Contributor.`fk_note` = " + body.note_id;
        connection.query(queryString, (err, rows) => {
          if (!err) {
            if (rows.length > 0) {
              // User is contributor to this Note, Check if other User Is not a contributor and add him as a contributor
              queryString = "SELECT id, fk_user, fk_note FROM Contributor WHERE Contributor.`fk_user` = " + userId + " AND Contributor.`fk_note` = " + body.note_id;
              connection.query(queryString, (err, rows) => {
                if (!err) {
                  if (rows.length === 0) {
                    // Create Contributor to this note
                    queryString = "INSERT INTO Contributor (fk_user, fk_note) VALUES (" + userId + "," + body.note_id + ")";
                    connection.query(queryString, (err, rows) => {
                      if (!err) {
                        res.json({
                          ok: true,
                          message: "succesfully invited other user to this note"
                        });
                      } else {
                        res.json({
                          ok: false,
                          message: "Could not invite other user to this note"
                        });
                      }
                    })
                  } else {
                    res.json({
                      ok: false,
                      message: "OtherUser is already contributor "
                    });
                  }
                } else {
                  res.json({
                    ok: false,
                    message: "Failed to check if other User is contribotr to this note"
                  });
                }
              });
            } else {
              res.json({
                ok: false,
                message: "User is not Contributor to this note"
              })
            }
          } else {
            res.json({
              ok: false,
              message: "failed to check if user is contributor to this note"
            });
          }
        })
    });
      } else {
        res.json({
          ok: false,
          message: "not logged in"
        });
      }

});

// Removes User from Contribution of this note
app.post('/uninvite_user', (req, res) => {
  sess = req.session;
  body = req.body;


  if (sess.authenticated) {
    var userId;
    getUser(body.username, (id) => {
        if (id !== undefined) {
          userId = id;
        } else {
          res.json({
            ok: false,
            message: "User does not exist"
          });
          return;
        }

        var queryString = "SELECT id, fk_user, fk_note FROM Contributor WHERE Contributor.`fk_user` = " + sess.db_id + " AND Contributor.`fk_note` = " + body.note_id;
        connection.query(queryString, (err, rows) => {
          if (!err) {
            if (rows.length > 0) {
              // User is contributor to this Note, Check if other User Is not a contributor and add him as a contributor
              queryString = "SELECT id, fk_user, fk_note FROM Contributor WHERE Contributor.`fk_user` = " + userId + " AND Contributor.`fk_note` = " + body.note_id;
              connection.query(queryString, (err, rows) => {
                if (!err) {
                  if (rows.length !== 0) {
                    // Create Contributor to this note
                    queryString = "DELETE FROM Contributor WHERE Contributor.`fk_user` = " + userId + " AND Contributor.`fk_note` = " + body.note_id;
                    connection.query(queryString, (err, rows) => {
                      if (!err) {
                        // Check if this was the last Contributor to this not, if yes delete note
                        queryString = "SELECT id FROM Contributor WHERE Contributor.`fk_note` = "+body.note_id;
                        connection.query(queryString, (err, rows) => {
                          if (!err) {
                            if (rows.length === 0) {
                              // Delete Note
                              queryString = "DELETE FROM Note WHERE Note.`id` = "+body.note_id;
                              connection.query(queryString, (err, rows) => {
                                if (!err) {
                                  res.json({ ok: true, message: "Succesfully deleted Note and Contributor"});
                                } else {
                                  res.json({ok: false, message: "Could not delete Note, something went wrong"})
                                }
                              })
                            } else {
                              res.json({ok: false, message = "Note was not deleted there are still contributors left" })
                            }
                          } else {
                            res.json({ok: false, message: "Could not delete the note completely, because not able to check if any Contributors are left"})
                          }
                        })
                      } else {
                        res.json({
                          ok: false,
                          message: "Could not uninvite other user to this note"
                        });
                      }
                    })
                  } else {
                    res.json({
                      ok: false,
                      message: "OtherUser is already not a contributor "
                    });
                  }
                } else {
                  res.json({
                    ok: false,
                    message: "Failed to check if other User is contributor to this note"
                  });
                }
              });
            } else {
              res.json({
                ok: false,
                message: "User is not Contributor to this note"
              })
            }
          } else {
            res.json({
              ok: false,
              message: "failed to check if user is contributor to this note"
            });
          }
        })
    });
      } else {
        res.json({
          ok: false,
          message: "not logged in"
        });
      }

});

// Delete a note with an ID
app.post("/delete_note", (req, res) => {
  if (req.session.authenticated) {
    var queryString = "DELETE FROM Contributor WHERE Contributor.`fk_note` = ?";
    connection.query(queryString, [req.body.note_id], (err, rows) => {
      if (!err) {
        queryString = "DELETE FROM Note WHERE Note.`id` = ?";
        connection.query(queryString, [req.body.note_id], (err, rows) => {
          if (!err) {
            return res.json({
              ok: false,
              message: "Deleted note"
            })
          } else {
            return res.json({
              ok: false,
              message: "Could not delete note"
            })
          }
        });
      } else {
        return res.json({
          ok: false,
          message: "Could not delete contributors"
        })
      }
    });
  } else {
    res.json({
      ok: false,
      message: "not logged in"
    })
  }
});

// Post request to change a notes properties
app.post('/change_note', (req, res) => {
  body = req.body;
  let note_id = body.note_id;
  let title = body.title;
  let content = body.content;

  let createDate = new Date();
  let dd = createDate.getDate();
  let mm = createDate.getMonth() + 1;
  let yyyy = createDate.getFullYear();

  let modified = "" + yyyy + "-" + mm + "-" + dd;

  // Check if authenticated, if yes, change the properties of the note and save it to the db
  if (sess.authenticated) {

    // Check if user is contributor to note
    var queryString = "SELECT * FROM Contributor WHERE Contributor.`fk_user` = " + req.session.db_id + " AND Contributor.`fk_note` = " + note_id;
    connection.query(queryString, (err, rows) => {
      if (!err) {
        if (rows.length === 0) {
          res.json({
            ok: false,
            message: "Not a Contributor to this note"
          });
          return;
        } else {
          queryString = "UPDATE Note SET title=?, content=?, date_modified=? WHERE id = ?";
          connection.query(queryString, [title, content, modified, note_id], (err, rows) => {
            if (!err) {
              res.json({
                ok: true,
                message: "Note succesfully changed"
              });
            } else {
              res.json({
                ok: false,
                message: "Note was not changed"
              });
            }
          })
        }
      } else {
        res.json({
          ok: false,
          message: "Could not look up user if is contributor"
        });
        return;
      }
    })
  } else {
    res.json({
      ok: false,
      message: "not logged in"
    });
  }
});

// Get request to logout, destroys the session
app.get('/logout', (req, res) => {
  req.session.destroy();

  res.json({
    ok: true,
    message: "Session destroyed"
  })
});

// Hosts the nodejs server on port 3000
app.listen(3000, function(req, res) {
  console.log("app listening on 3000");
});
