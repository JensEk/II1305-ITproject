/**
 *  The purpose of this command is to display all supported bot commands.
 */

let global = require('../utility/global_variables');

module.exports = {
    name: 'help',
    description: "This command gives a description of every command handled by the bot.",
    aliases: ['h'],
    execute(client, message, args, Discord) {
        const emoji = ':tomato:';
        const blank = '\u200b';

        const help_embed = new Discord.MessageEmbed()
        .setColor(global.MAIN_COLOR)
        .setTitle("Pomodoro Bot Commands")
        .setDescription("Here are all commands supported by me:")
        .addFields(
            {name: blank, value: "> **TIMER COMMANDS**"},
            {name: emoji + " ``!timer start``", value: `*Starts a default timer for ${global.DEFAULT_TIMER_DURATION} minutes.*`},
            {name: emoji + " ``!timer start #``", value: `*Starts a timer for # minutes (# must be a value between ${global.MIN_TIMER_DURATION} and ${global.MAX_TIMER_DURATION}).*`},
            {name: emoji + " ``!timer stop``", value: "*Stops an ongoing timer.*"},
            {name: emoji + " ``!timer left``", value: "*Displays the time left on the timer.*"},
            {name: blank, value: "> **CONFIG COMMANDS**"},
            {name: emoji + " ``!config``", value: "*Display your current configuration on timer notifications.*"},
            {name: emoji + " ``!config standard``", value: "*Timer will not notify you until the timer has ended.*"},
            {name: emoji + " ``!config interval #``", value: `*Timer will display the time left every # minutes\n(# must be a value between ${global.MIN_CONFIG_INTERVAL} and ${global.MAX_CONFIG_INTERVAL}).*`},
            {name: blank, value: "> **POINTS COMMANDS**"},
            {name: emoji + " ``!points``", value: "*Display the amount of pomodoros you have accumulated!*"},
            {name: blank, value: "> **HELP COMMAND**"},
            {name: emoji + " ``!help``", value: "*Display all commands and how to use them! Oh wait, it's this message!*\n" + blank}
        )
        .setFooter("Pomodoro Bot", global.LOGO_LINK);
        message.author.send(help_embed);
        //const channel = client.channels.cache.find(channel => channel.name === 'bot-command-test');
        //channel.send(help_embed);
    }
}