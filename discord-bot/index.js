const axios = require('axios');
const twitchSchema = require("./Schemas.js/twitch");

const idT = `${process.env.TWITCHID}`;
const secretT = `${process.env.TWITCHSECRET}`;

const twitchAPI = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  headers: {
    'Client-ID': idT,
  }
});

async function getAccessToken() {
  const response = await axios.post(`https://id.twitch.tv/oauth2/token`, null, {
    params: {
      client_id: idT,
      client_secret: secretT,
      grant_type: 'client_credentials'
    }
  });
  return response.data.access_token;
}

async function isUserLive(username) {
  const accessToken = await getAccessToken();
  twitchAPI.defaults.headers['Authorization'] = `Bearer ${accessToken}`;

  const userResponse = await twitchAPI.get(`users?login=${username}`);
  if (userResponse.data.data.length === 0) return 'User not found';

  const userId = userResponse.data.data[0].id;
  const streamResponse = await twitchAPI.get(`streams?user_id=${userId}`);

  if (streamResponse.data.data.length > 0) {
    const stream = streamResponse.data.data[0];
    return {
      url: `https://www.twitch.tv/${username}`,
      image: stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'),
      description: stream.title,
      theme: stream.game_name
    };
  } else {
    return 'User is offline';
  }
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on("ready", async () => {
  console.log(`Logged in as ${client.user.tag}!`);

  setInterval(async () => {
    const setups = await twitchSchema.find();

    setups.forEach(async (s) => {
      const liveData = await isUserLive(s.Username);

      if (liveData === "User is offline" || liveData === "User not found") {
        console.log(`User ${s.Username} is offline or not found.`);
        return;
      }

      const webhookClient = new WebhookClient({ id: s.WebhookID, token: s.WebhookToken });

      const embed = {
        title: liveData.theme || "Stream Live!",
        url: liveData.url,
        description: `${liveData.description}\nWatch stream: [Click here](${liveData.url})`,
        image: { url: liveData.image },
      };

      await webhookClient.send({
        content: s.Content, 
        embeds: [embed]
      });

      console.log(`Notification sent for ${s.Username}!`);
    });
  }, 300000);
});
