const Express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const jose = require('node-jose');
const jwktopem = require('jwk-to-pem')
const axios = require('axios')
const app = new Express();

app.use(Express.json())

app.get('/jwks.json', async (req, res) => {
  const ks = fs.readFileSync('keys.json')
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  res.send(keyStore.toJSON())
})

app.get('/token', async (req, res) => {
  const ks = fs.readFileSync('keys.json')
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  const [key] = keyStore.all({ use: 'sig' })
  const opt = { compact: true, jwk: key, fields: { typ: 'jwt' } }
  const payload = JSON.stringify({
    exp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
    iat: Math.floor(Date.now() / 1000),
    sub: 'test',
  })
  let token = await jose.JWS.createSign(opt, key)
    .update(payload)
    .final()
  token = token.toString('base64')
  res.send({token})
})

app.get("/admin", validateToken, (req, res) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  var decoded = JSON.parse(jwt.decode(token));
  if (decoded['sub'] == "admin") {
      res.send("Successfully accessed admin endpoint")
  } else {
      res.status(403).send("Access Forbidden")
  }
})

async function validateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  const { data } = await axios.get('http://localhost:5000/jwks.json')
  const [firstKey] = data.keys
  const publicKey = jwktopem(firstKey)
  if (token == null) res.sendStatus(400).send("Token not present")
  jwt.verify(token, publicKey, (err, user) => {
    if (err) {
      res.status(403).send("Token invalid")
    }
    else {
      next()
    }
  })
}

app.listen(5000, () => console.log("Server started http://localhost:5000"))