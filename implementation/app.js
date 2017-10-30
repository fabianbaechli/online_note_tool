var express = require("express");
var sql = require('mysql');
const bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var app = express();

app.use(express.static('frontend'));
app.use(session({secret: 'zdsvadushvbadsv'}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Imagine this was the db with the names and pw hased and not just an array of strings:)
var registered = new Array();
var sess;
var body;

function User(username, password) {
    this.username = username;
    this.password = password;
}

// config and connection for your database
var connection = sql.createConnection({
    host: 'localhost',
    user: 'app',
    password: 'genericPass',
    database: 'notes_tool'
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

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



app.post("/create_user", (req, res) => {
    console.log(req.body);
    let username = req.body['username'];
    let password = req.body['password'];
    // connect to database
    connection.query('INSERT INTO notes_tool.User (username, password) VALUES (' + connection.escape(username) + ', ' + connection.escape(password) + ')', function (err, rows, fields) {
        if (!err)
            console.log('The solution is: ', rows);
        else
            console.log('Error while performing Query.');
    });

    res.redirect('/index.html');
});



app.post('/login', (req, res) => {
    sess = req.session;
    body = req.body;
    if(!sess.authenticated) {
        console.log(body.username);
        connection.query('SELECT password, id FROM notes_tool.User WHERE username = '+ connection.escape(body.username), function (err, rows, fields) {
            if (!err){
                console.log('The solution is: ', rows[0].password);
                if (rows.length !== 0) {
                    let user = rows[0];
                    if (user !== undefined && user.password === body.password) {
                        sess.authenticated = true;
                        sess.username = body.username;
                        req.session.db_id = user.id;
                        res.redirect('/index.html');
                        return;
                    }
                }

                console.log('log in failed');
                res.redirect('/index.html');
            }
            else {

                console.log('Error while performing Query.');
                res.redirect('/index.html');
            }
        });
    } else {
        res.redirect('/index.html');
    }
});

app.post('/create_note', (req,res) => {

});

app.get("/get_notes", (req, res) => {
    sess = req.session;

    if (sess.authenticated) {
        const queryString = "SELECT N.id, N.title, N.date_created, N.date_modified, N.content FROM Note AS N " +
            "INNER JOIN Contributor as C on N.id = C.fk_note INNER JOIN User as U on U.id = C.fk_user " +
            "WHERE U.id = " + connection.escape(sess.db_id);
        console.log(queryString);
        connection.query(queryString, (err, rows) => {
            res.send(rows);
        })
    } else {
        res.json({authenticated: false})
    }
})


app.listen(3000, function (req, res) {
    console.log("app listening on 3000");
});
