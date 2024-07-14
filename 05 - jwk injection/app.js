const Express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const jose = require('node-jose');
const app = new Express();

app.use(Express.json())

app.get('/token', async (req, res) => {
  const ks = fs.readFileSync('keys.json')
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  const [key] = keyStore.all({ use: 'sig' })
  const opt = { compact: true, jwk: key, fields: { typ: 'jwt'} }
  const payload = JSON.stringify({
    exp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
    iat: Math.floor(Date.now() / 1000),
    sub: 'test',
  })
  let token = await jose.JWS.createSign(opt, key)
    .update(payload)
    .final()
  token = token.toString('base64')
  res.send({ token })
})

app.get('/admin', validateToken, async (req, res) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  var decoded = jwt.decode(token);
  if (decoded.sub== 'admin') {
    res.send("Successfully accessed admin endpoint")
  }
  else {
    res.status(403).send("Access Forbidden")
  }
})

async function validateToken(req, res, next) {
  const authHeader = req.headers["authorization"]
  const token = authHeader.split(" ")[1]
  const ks = fs.readFileSync('keys.json')
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  if (token == null) res.sendStatus(400).send("Token not present")
  const decoded = await jose.JWS.createVerify(keyStore).verify(token)
  if (decoded.header!='') {
    next()
  }
  else {
    res.status(403).send("Token invalid")
  }
}

app.listen(5001, () => console.log("Server started http://localhost:5001"))