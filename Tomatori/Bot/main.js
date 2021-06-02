/**
 *  This is the main file.
 */

const Discord  = require('discord.js');                                                             //require Discord.js
const client = new Discord.Client();                                                                //create client

require('dotenv').config();                                                                         //require dotenv to access environment variables                                      

client.commands = new Discord.Collection();                                                         //create a Discord Collection to store data for commands
client.events = new Discord.Collection();                                                           //create a Discord Collection to store data for the event handler

['command_handler', 'event_handler'].forEach(handler => {
    require(`./handlers/${handler}`)(client, Discord);
});

client.login(process.env.BOT_TOKEN);                                                                //fetch token from environment variable (in order to keep it secret)