const fs = require("fs")

const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const jwt = require("jsonwebtoken");

const app = express();

app.set('views', './templates');
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())

const port = 9000;
let reviews = [];


//var privateKEY = fs.readFileSync('./private.ec.key', 'utf8');
//var publicKEY = fs.readFileSync('./public.pem', 'utf8');

//remove session
//dac cookie dopiero jak kliknac w valid session
//dodac falge z sesja okok

app.get('/', function (req, res) {
  res.render('index', {
    reviews
  });
});
//auth token jwt jesli git to wstaw recke
app.post('/reviews', validateToken, function (req, res) {
  data1 = decodeToken(req)
  //console.log(req.body.newReview);
  reviews.push({ username: data1.user, review: req.body.newReview });
  res.send("Added new comment")
  //console.log(reviews);
});

app.get('/session/jwt/cookie', function (req, res) {
  const token = jwt.sign({ user: 'Alice' }, 'secret_key')
  res.cookie('authcookie', token, { maxAge: 900000, httpOnly: true })
  res.redirect('/');
});

app.get('/session/jwt/storage', function (req, res) {
  const token = jwt.sign({ user: 'Alice' }, 'secret_key')
  res.json({ 'token': token })
});
//to do decode,  logowanie (?)
function validateToken(req, res, next) {
  let token = req.cookies.authcookie
  if (token == "empty") {
    const authHeader = req.headers["authorization"]
    token = authHeader.split(" ")[1]
  }
  jwt.verify(token, "secret_key", (err, data) => {
    if (err) {
      res.sendStatus(403)
    }
    else if (data.user) {
      req.user = data.user
      next()
    }
  })
}
function decodeToken(req) {
  let token = req.cookies.authcookie
  if (token == "empty") {
    const authHeader = req.headers["authorization"]
    token = authHeader.split(" ")[1]
  }
  var decoded = jwt.decode(token);
  return decoded
}

app.listen(port, () => console.log(`The server is listening at http://localhost:${port}`));
