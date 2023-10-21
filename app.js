// PROVIDED
const http = require("http"),
  path = require("path"),
  express = require("express"),
  bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const app = express();
app.use(express.static("."));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// PROVIDED
const db = new sqlite3.Database(":memory:");
db.serialize(function () {
  db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
  db.run(
    "INSERT INTO user VALUES ('privilegedUser', 'privilegedUser1', 'Administrator')"
  );
});

// GET
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// POST
app.post("/login", function (req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var query =
    "SELECT title FROM user where username = '" +
    username +
    "' and password = '" +
    password +
    "'";

  console.log(username);
  console.log(password);
  console.log(query);

  db.get(query, function (err, row) {
    if (err) {
      return res.status(500).send("Error");
    } else if (!row) {
      res.redirect("/index.html#unauthorized");
    } else {
      res.send(`Welcome, ${row.title}!`);
    }
  });
});


db.get(query, function (err, row) {
  if (err) {
    console.log("ERROR", err);
    res.redirect("/index.html#error");
  } else if (!row) {
    res.redirect("/index.html#unauthorized");
  } else {
    res.send(
      "Hello <b>" +
        row.title +
        '!</b><br />This file contains all your secret data: <br /><br />SECRETS <br /><br />MORE SECRETS <br /><br /><a href="/index.html">Go back to login</a>'
    );
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
