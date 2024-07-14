const Express = require('express');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const jose = require('node-jose');
const jwktopem = require('jwk-to-pem')
const axios = require('axios')
const app = new Express();

app.use(Express.json())

app.get('/jwks.json', async (req, res) => {
  const ks = fs.readFileSync('attacker_keys.json')
  const keyStore = await jose.JWK.asKeyStore(ks.toString())
  res.send(keyStore.toJSON())
})

app.listen(5002, () => console.log("Server started http://localhost:5002"))