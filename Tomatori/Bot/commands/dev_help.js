/**
 *  The purpose of this command is to display all supported bot commands.
 */

 let global = require('../utility/global_variables');

 module.exports = {
     name: 'dev_help',
     description: "This command gives a description of every hidden dev command handled by the bot.",
     aliases: ['dev'],
     execute(client, message, args, Discord) {
         const emoji = ':spider_web:';
         const blank = '\u200b';
 
         const dev_help_embed = new Discord.MessageEmbed()
         .setColor(global.MAIN_COLOR)
         .setTitle("Developer Commands")
         .setDescription("Here are all hidden developer commands handled by the bot that can be used for error checking:")
         .addFields(
             {name: blank, value: "> **DEV COMMANDS**"},
             {name: emoji + " ``!status`` or ``!s``", value: `*Display current user status (what game is playing on user's PC etc.).*`},
         )
         .setFooter("Pomodoro Bot", global.LOGO_LINK);
         message.author.send(dev_help_embed);
     }
 }