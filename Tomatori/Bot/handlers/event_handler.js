/**
 *  The purpose of this file is to handle Discord events such as messages in text channels.
 */

const fs = require('fs');                                                                           //in order to access other javascript files

module.exports = (client, Discord) => {
    const load_dir = (dirs) => {
        const event_files = fs.readdirSync(`./events/${dirs}`).filter(file => file.endsWith('.js'));//access the files which holds the bot's events
    
        for (const file of event_files) {
            const event = require(`../events/${dirs}/${file}`);
            const event_name = file.split('.')[0];
            client.on(event_name, event.bind(null, Discord, client));
        }
    }

    ['client', 'guild'].forEach(e => load_dir(e));                                                  //fill with files in events-folder
}