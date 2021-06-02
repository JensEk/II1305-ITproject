module.exports = {
    name: 'status',
    description: "This is a hidden dev-command that lets the user know its current Discord status.",
    aliases: ['s'],
    async execute(client, message, args, Discord) {
        const server = client.guilds.cache.get(message.guild.id);
        const user = await server.members.cache.get(message.author.id);
        message.author.send("Your current status: **Playing " + user.presence.activities[0] + "**");
    }
}