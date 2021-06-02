/**
 *  The purpose of this file is to locate and run the command a user specifies.
 */

const fs = require('fs');                                                                           //in order to access other javascript files

module.exports = (client, Discord) => {
    const command_files = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));       //access the files which holds the bot's comnands

    for (const file of command_files) {                                                             //loop through command-folder to find the correct command
        const command = require(`../commands/${file}`);                                                  
 
        if (command.name) {                                                                         //run if command is found
            client.commands.set(command.name, command);
        } else {
            continue;
        }
        
    }
}