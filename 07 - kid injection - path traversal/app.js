const Express = require('express');
const jwt = require('jsonwebtoken');
const jwt_latest = require('jsonwebtoken-latest');
const request = require('request');
const st = require('st');
const app = new Express();
app.use(Express.json())

const http = require('http')
const path = require('path')
const mount = st({ path: path.join(__dirname, '/static'), url: '/static' })

http.createServer((req, res) => {
  const stHandled = mount(req, res)
  if (stHandled)
    return
  else
    res.end("File not found")
}).listen(5002)

app.get('/token', async (req, res) => {
  const key = await getKey('key')
  const opt = { compact: true, fields: { typ: 'jwt', kid: "key" } }
  const payload = JSON.stringify({
    exp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
    iat: Math.floor(Date.now() / 1000),
    sub: 'test',
  })
  let token = jwt_latest.sign(payload, key,
    { algorithm: 'HS256', header: { "typ": 'jwt', 'kid': 'key' } })
  token = token.toString('base64')
  res.send({ token })
})

app.get('/admin', validateToken, async (req, res) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  var decoded = JSON.parse(jwt.decode(token));
  if (decoded.sub == 'admin') {
    res.send("Successfully accessed admin endpoint")
  }
  else {
    res.status(403).send("Access Forbidden")
  }
})

async function getKey(path) {
  return new Promise((resolve, reject) => {
    request.get('http://localhost:5002/static/' + path, function (error, response, body) {
      var data = body;
      resolve(data);
    });
  })
}

async function validateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  var decoded = jwt.decode(token);
  const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString())
  let kid = header.kid
  const publicKey = await getKey(kid)
  jwt.verify(token, publicKey, (err, user) => {
    if (err) {
      res.status(403).send("Token invalid")
    }
    else {
      req.user = user
      next()
    }
  })
}

app.listen(5001, () => console.log("Server started http://localhost:5001, HTTP server started http://localhost:5002"))