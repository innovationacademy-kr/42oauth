# 42oauth example


## Passport-42 example

This example demonstrates how to use [Express](http://expressjs.com/) 4.x and
[Passport-42](http://www.passportjs.org/packages/passport-42/) to authenticate
users using [42 OAuth 2.0 API](https://api.intra.42.fr/apidoc).
Use this example as a starting point for your own web applications.

## Instructions

To install this example on your computer, clone the repository and install
dependencies.

```bash
$ git clone git@github.com:innovationacademy-kr/42oauth.git
$ cd 42oauth
$ npm install
```

Register [an app](https://profile.intra.42.fr/oauth/applications) on 42 intra
and set the redirect URI to `http://127.0.0.1/login/42/return`.

Start the server.

```bash
$ FORTYTWO_CLIENT_ID="xxxxxx" FORTYTWO_CLIENT_SECRET="xxxxxx" npm run start
```

Open a web browser and navigate to
[http://localhost:3000/](http://127.0.0.1:3000/)
to see the example in action.
