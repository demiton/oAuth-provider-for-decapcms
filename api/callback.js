const express = require("express");
const simpleOauthModule = require("simple-oauth2");

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

app.get("/api/callback", async (req, res) => {
  const { code } = req.query;
  const options = {
    code,
    redirect_uri: `${process.env.REDIRECT_URL}/api/callback`,
  };

  try {
    const result = await oauth2.authorizationCode.getToken(options);
    const token = oauth2.accessToken.create(result);
    res.status(200).json(token);
  } catch (error) {
    console.error("Access Token Error", error.message);
    res.status(500).json("Authentication failed");
  }
});

module.exports = app;
