# STARTER BACKEND

`yarn install` or `npm install`.
`npm start`

## Configuration ##

Most of the app's configuration is held within the `server/config/index.js`
file.

Some of these values can be specified via environment variables (or via a `.env` file since
we use the `dotenv` package). Below is a list of those variables:

- Node Server
  - `PORT` : The port for the node application server, defaults to `3000` in all environments.
  - `AUTH_SECRET` : The secret key used when signing JSON Web Tokens.
