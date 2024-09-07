const express = require("express");
const simpleOauthModule = require("simple-oauth2");
const randomstring = require("randomstring");

const app = express();

const oauth2 = simpleOauthModule.create({
  client: {
    id: process.env.OAUTH_CLIENT_ID,
    secret: process.env.OAUTH_CLIENT_SECRET,
  },
  auth: {
    tokenHost: "https://github.com",
    tokenPath: "/login/oauth/access_token",
    authorizePath: "/login/oauth/authorize",
  },
});

app.get("/api/auth", (req, res) => {
  const authorizationUri = oauth2.authorizationCode.authorizeURL({
    redirect_uri: `${process.env.REDIRECT_URL}/api/callback`,
    scope: "repo,user",
    state: randomstring.generate(32),
  });
  res.redirect(authorizationUri);
});

module.exports = app;
