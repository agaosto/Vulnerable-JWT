const Express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const jose = require('node-jose');
const jwktopem = require('jwk-to-pem')
const axios = require('axios')
const app = new Express();
var sqlite3 = require('sqlite3').verbose();

app.use(Express.json())

let db1 = new sqlite3.Database('vuln_api.db');

app.get('/jwks.json', async (req, res) => {
  const ks = fs.readFileSync('keys.json')
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  res.send(keyStore.toJSON())
})

app.get('/token', async (req, res) => {
  const ks = fs.readFileSync('keys.json')
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  const [key] = keyStore.all({ use: 'sig' })

  const opt = { compact: true, jwk: key, fields: { typ: 'jwt', kid: "3" } }
  const payload = JSON.stringify({
    exp: Math.floor((Date.now() + 24 * 60 * 60 * 1000) / 1000),
    iat: Math.floor(Date.now() / 1000),
    sub: 'test'
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
  var decoded = JSON.parse(jwt.decode(token));
  if (decoded.sub == 'admin') {
    res.send("Successfully accessed admin endpoint")
  }
  else {
    res.status(403).send("Access Forbidden")
  }
})

async function validateToken(req, res, next) {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader.split(" ")[1];
    const decoded = jwt.decode(token);
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString());
    const kid = header.kid;
    let pem;
    try {
      pem = await getPemById(db1, kid);
    } catch (err) {
        return res.status(400).send(err.message);
    }

    jwt.verify(token, pem, (err, user) => {
      if (err) {
        return res.status(403).send("Token invalid");
      } else {
        req.user = user;
        next();
      }
    });
  } catch (err) {
    res.status(500).send("Internal Server Error");
  }
}

async function getPemById(db, kid) {
  return new Promise((resolve, reject) => {
    if (!kid) {
      reject(new Error('No "kid" value'));
      return;
    }

    db.get(`SELECT pem FROM keys where id = ${kid}`, (err, row) => {
      if (err || !row) {
        reject(new Error('Database query failed'));
        return;
      }
      resolve(row.pem);
    });
  });
}

app.listen(5001, () => console.log("Server started http://localhost:5001"))