
var express = require("express");
var app = express();

app.use(express.static('public'));
app.get("/*", function(req, res) {
    res.sendfile("public/hello-world.html");
});



app.listen(3000, function (req, res) {
    console.log("app listening on 3000")
});
