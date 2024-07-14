This repository contains a sample web application with Cross-Site Request Forgery (CSRF) vulnerabilities and its attacker website.

The application is used to explain how CSRF attacks work and how to fix those vulnerabilities in the article [Prevent Cross-Site Request Forgery (CSRF) Attacks](https://auth0.com/blog/cross-site-request-forgery-csrf/)

---
### Technology

This project uses the following technologies:

-  [Node.js](https://nodejs.org/)

### Running the Application

To run this project, follow these steps:

1. Clone this repository (`git clone https://github.com/auth0-blog/csrf-sample-app.git`)

2. Move to the root folder of the project (`csrf-sample-app`) in your machine and install the dependencies by running the following command:

   ```shell
   npm install
   ```

3. To launch the web application, run the following command:

   ```shell
   npm start
   ```

4. Point your browser to [http://localhost:3000](http://localhost:3000) to access the sample web app.

5. To launch the attacker website, run the following command:

   ```shell
   node attacker-server.js
   ```

6. Point your browser to [http://localhost:4000](http://localhost:4000/) to access the attacker website



Please, read [Prevent Cross-Site Request Forgery (CSRF) Attacks](https://auth0.com/blog/cross-site-request-forgery-csrf/) to learn more about CSRF attacks and how to prevent them.