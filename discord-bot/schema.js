const { model, Schema } = require("discord.js");

const schema = new Schema({
    Guild: String,
    Username: String,
    WebhookID: String,
    WebhookToken: String,
    ChannelID: String,
    Content: String,
});

module.exports = model("twitch", schema);
