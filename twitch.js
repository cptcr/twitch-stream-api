require('dotenv').config();
const axios = require('axios');
const chalk = require("chalk");

const id = `${process.env.TWITCHID}`;
const secret = `${process.env.TWITCHSECRET}`;

const y = {
  username: "cptcrr",
  pingedRole: "1274521772821053510"
}

const twitchAPI = axios.create({
  baseURL: 'https://api.twitch.tv/helix/',
  headers: {
    'Client-ID': id,
    'Authorization': secret
  }
});

async function getAccessToken() {
  const response = await axios.post(`https://id.twitch.tv/oauth2/token?client_id=${id}&client_secret=${secret}&grant_type=client_credentials`);
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
      urls: `https://www.twitch.tv/${username}`,
      image: stream.thumbnail_url.replace('{width}', '640').replace('{height}', '360'), 
      description: stream.title,
      theme: stream.game_name
    };
  } else {
    return 'User is offline';
  }
}


  console.log(chalk.cyan(`Logged in as ${client.user.tag}!`));
  const rolId = y.pingedRole;

  const webhookURL = `${process.env.WEBH}`; 

setInterval(async () => {
  let data = await isUserLive(`${y.username}`);

  if (data === "User is offline") {
    console.log(chalk.red(data));
    return;
  } else {
    console.log(chalk.green(data));

    const embed = {
      title: data.theme || "Stream Live!",  
      url: `https://twitch.tv/${y.username}`,
      description: `${data.description || ''}\nWatch stream: [Click here](https://twitch.tv/${y.username})`, 
      image: {
        url: data.image || ''
      }
    };

    const payload = {
      content: `<@&${rolId}>`,
      embeds: [embed]
    };

    try {
      const response = await fetch(webhookURL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('Message sent successfully');
      } else {
        const responseBody = await response.text();
        console.error(`Failed to send message. Status: ${response.status}, Response: ${responseBody}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
}, 2500);
