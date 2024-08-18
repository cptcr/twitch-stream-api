const { EmbedBuilder, SlashCommandBuilder, PermissionFlagsBits, ChannelType, WebhookClient, Client } = require("discord.js");
const schema = require("../../Schemas.js/twitch");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("twitch-ping")
        .setDescription("Twitch stream ping")
        .addSubcommand(c => c
            .setName("setup")
            .setDescription("Setup a twitch stream ping.")
            .addStringOption(o => o
                .setName("twitch-username")
                .setDescription("The username of the twitch streamer.")
                .setRequired(true)
            )
            .addStringOption(o => o
                .setName("content")
                .setDescription("The content displayed in the message. Mention roles you want to ping.")
                .setRequired(true)
            )
            .addChannelOption(o => o
                .setName("channel")
                .setDescription("The channel you want to send the message in.")
                .setRequired(true)
                .addChannelTypes(ChannelType.GuildText)
            )
        )
        .addSubcommand(c => c
            .setName("delete")
            .setDescription("Delete a twitch stream setup")
            .addStringOption(o => o
                .setName("twitch-username")
                .setDescription("The username of the twitch streamer.")
                .setRequired(true)
            )
        ),

    /**
     * 
     * @param {Interaction} interaction 
     * @param {Webhook} webhook
     * @param {Client} client
     * @returns 
     */

    async execute(interaction, client) {
        if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
            return await interaction.reply({ content: "You are not an admin.", ephemeral: true });
        }

        const sub = interaction.options.getSubcommand();

        switch (sub) {
            case "setup":
                const usr = interaction.options.getString("twitch-username");
                const content = interaction.options.getString("content");
                const channel = interaction.options.getChannel("channel");
                const twitch = await schema.findOne({ Username: usr, Guild: interaction.guild.id });

                if (twitch) {
                    return await interaction.reply({ content: `You already have a setup within this server for **${usr}**!`, ephemeral: true });
                }

                try {
                    const webhook = await channel.createWebhook({
                        name: `${usr} Twitch Notifications`,
                        avatar: 'https://static.vecteezy.com/system/resources/previews/018/930/493/original/twitch-logo-twitch-icon-transparent-free-png.png', 
                    });

                    await schema.create({
                        Guild: interaction.guild.id,
                        Username: usr,
                        WebhookID: webhook.id,
                        WebhookToken: webhook.token,
                        ChannelID: channel.id,
                        Content: content,
                    });

                    await interaction.reply({ content: `Twitch stream ping setup successfully for **${usr}**!`, ephemeral: true });
                } catch (error) {
                    console.error('Error creating webhook:', error);
                    await interaction.reply({ content: `There was an error setting up the Twitch ping for **${usr}**.`, ephemeral: true });
                }
                break;

            case "delete":
                const usernameD = interaction.options.getString("twitch-username");
                const data = await schema.findOne({ Username: usernameD, Guild: interaction.guild.id });

                if (!data) {
                    return await interaction.reply({ content: `This username (**${usernameD}**) wasn't found in the database.`, ephemeral: true });
                }

                try {
                    const webhookClient = new WebhookClient({ id: data.WebhookID, token: data.WebhookToken });
                    await webhookClient.delete();

                    await schema.deleteOne({ Username: usernameD, Guild: interaction.guild.id });
                    await interaction.reply({ content: `The Twitch stream setup for **${usernameD}** has been deleted successfully!`, ephemeral: true });
                } catch (error) {
                    console.error('Error deleting webhook:', error);
                    await interaction.reply({ content: `There was an error deleting the Twitch setup for **${usernameD}**.`, ephemeral: true });
                }
                break;

            default:
                return await interaction.reply({ content: "Invalid subcommand.", ephemeral: true });
        }
    }
}
