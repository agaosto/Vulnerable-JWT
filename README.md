# Vulnerable-JWT

### Overview
Collection of vulnerable APIs/apps to test following JWT attacks:
- Lack of signature verification - the attacker can modify token's header and payload as the signature is not properly verified,
- None algorithm - the attacker can use the *Unsecured JWT*,
- Algorithm confusion - the attacker can use a public key used for verification to sign the token and trick the server to treat it as a token signed using symmetric algorithm,
- jku injection - the attacker can use their own JWK Set URL to provide a public key for verification,
- jwk injection - the attacker can embed their own public key in token's header,
- kid injection - SQL injection - the attacker can provide their own key for verification using SQL injection,
- kid injection - path traversal - the attacker can point an arbitrary system file to be used for verification,
- JWT storage - the attacker can steal the user's token using XSS if it is stored in Local/Session Storage or perform CSRF attack if it is stored in a cookie. 

[Node.js](https://nodejs.org/) is used in the project with various vulnerable versions of npm packages.

### How to run?
1. Clone the repository,
2. Browse to the specific folder (e.g., *01 - Lack of signature verification*),
3. Use `npm install` to install dependencies listed in *package.json*,
4. Run using `node app.js` command.
