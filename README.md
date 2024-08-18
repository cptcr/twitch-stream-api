# twitch-stream-api
## This code fetches the Live Stream status of a twitch user and send a ping to a discord webhook.

# Get Token and Client ID = https://dev.twitch.tv/console/apps
## (Honestly idk how to get the token, just search on google or ask AI idk, i think i got it after registering idk)

[![Run on Replit](https://replit.com/badge/github/cptcr/twitch-stream-api)](https://replit.com/github/cptcr/twitch-stream-api) <br>
[![Deploy to Cloudflare Workers](https://img.shields.io/badge/Deploy%20to-Cloudflare%20Workers-blue)](https://deploy.workers.cloudflare.com/?url=https://github.com/cptcr/twitch-stream-api)

## Required packages:
```ts
chalk: "^4.1.0" //IT MUST BE THIS VERSION!
dotenv: "" //use latest
axios: "" //use lates
```

## Command:
```bash
npm install chalk@4.1.0 dotenv axios
```

## .env Variables:
```
WEBH="" # Your Webhook URL (DISCORD)
TWITCHID="" # Your twitch app id
TWITCHSECRET="" # Your twitch secret
```

## Requires to config:
```js
const y = {
  username: "cptcrr", //twitch username to yours
  pingedRole: "1274521772821053510" //Role id to ping on discord
}
```
