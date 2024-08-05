This application is based on Auth0's repository containing a sample web application with Cross-Site Request Forgery (CSRF) vulnerability (https://github.com/auth0-blog/csrf-sample-app). The article describing the original application: [Prevent Cross-Site Request Forgery (CSRF) Attacks](https://auth0.com/blog/cross-site-request-forgery-csrf/)

This version of the application has been modified to showcase JWT misconfigurations when storing it on the client side. Now the user can choose if the token is stored in Session Storage, Local Storage or in a cookie. Additionally, Cross-Site Scripting vulnerability has been introduced in the comments functionality.
- Session Storage/Local Storage - the attacker can hijack user's session by stealing the token with XSS attack,
- Cookie - the attacker can trick the user into performing CSRF attack.

---

### Running the Application

To run the application:
1. Browse to the *08 - JWT storage - XSS, CSRF* folder
2. Install the dependencies by running the following command:

   ```shell
   npm install
   ```

3. To launch the web application, run the following command:

   ```shell
   npm start
   ```

4. Point your browser to [http://localhost:9000](http://localhost:9000) to access the sample web app

5. To launch the attacker website, run the following command:

   ```shell
   node attacker-server.js
   ```

6. Point your browser to [http://localhost:4000](http://localhost:4000/) to access the attacker website
