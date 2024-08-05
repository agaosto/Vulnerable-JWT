# Vulnerable-JWT
Collection of vulnerable APIs/apps to test following JWT attacks:
- Lack of signature verification - the attacker can modify token's header and payload as the signature is not properly verified,
- None algorithm - the attacker can use the *Unsecured JWT*,
- Algorithm confusion - the attacker can use a public key used for verification to sign the token and trick the server to treat it as a token signed using symmetric algorithm,
- jku injection - the attacker can use their own JWK Set URL to provide a public key for verification,
- jwk injection - the attacker can embed their own public key in token's header,
- kid injection - SQL injection - the attacker can provide their own key for verification using SQL injection,
- kid injection - path traversal - the attacker can point an arbitrary system file to be used for verification,
- JWT storage - the attacker can steal the user's token using XSS if it is stored in Local/Session Storage or perform CSRF attack if it is stored in a cookie. 

Use `npm install` to install dependencies listed in *package.json*. To run the vulnerable API/app use `node app.js` command.
