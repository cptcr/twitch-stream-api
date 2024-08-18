# twitch-stream-api
## This code fetches the Live Stream status of a twitch user and send a ping to a discord webhook.

# Get Token and Client ID = https://dev.twitch.tv/console/apps
## (Honestly idk how to get the token, just search on google or ask AI idk, i think i got it after registering idk)

## Required packages:
```ts
chalk: "^4.1.0" //IT MUST BE THIS VERSION!
dotenv: "" //use latest
```

## Command:
```bash
npm install chalk@4.1.0 dotenv
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
