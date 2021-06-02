/**
 *  The purpose of this command is to update a user's config and save to the database.
 */

let request = require('../utility/request');
let global = require('../utility/global_variables');                                            

module.exports = {
    name: 'config',
    description: "This command updates a user's settings.",
    aliases: ['cf'],
    execute(client, message, args, Discord) {

        evalUserInput(args);                                                                        //read user input

        /* FUNCTION TO EVALUATE USER INPUT */
        function evalUserInput(arguments) {
            var notification_type = arguments[0];
            var interval_length = arguments[1];
        
            if (!arguments[0]) {
                //if no arguments are passed, print user's current config
                printUserConfig();
            } else if (notification_type === 'standard' || notification_type === global.CONFIG_SUB_ALIASES[0]) {
                //set user config to standard mode
                request.updateUserConfig(message.author.id, global.CONFIG_TYPE_STANDARD, global.STANDARD_CONFIG_INTERVAL);
                message.author.send("Notification type has been set to: " + notification_type + ".");
            } else if (notification_type === 'interval' || notification_type ===  global.CONFIG_SUB_ALIASES[1]) {
                //set user config to interval mode
                if (!isNaN(interval_length) && interval_length <= global.MAX_CONFIG_INTERVAL && interval_length >= global.MIN_CONFIG_INTERVAL) {
                    //valid interval
                    request.updateUserConfig(message.author.id, global.CONFIG_TYPE_INTERVAL, interval_length);
                    message.author.send("Notification type has been set to: " + notification_type + ".\n" +
                    "Notification interval has been set to: " + interval_length + " minutes.");
                } else {
                    //invalid interval
                    message.author.send("Invalid notification interval. The value must be a number between 1 and 60 (minutes).");
                }
            } else {
                //invalid configuration
                message.author.send("Incorrect config command. Please type !help for more information on this command.");
            }
        }

        /* FUNCTION TO PRINT USER'S CURRENT CONFIG */
        async function printUserConfig() {
            let { 
                notification_type, 
                interval_length 
            } = await request.getUserConfig(message.author.id);                                     //fetch current settings from database

            message.author.send("Your current settings are:");
            if (notification_type === global.CONFIG_TYPE_STANDARD) {
                //standard config
                message.author.send("Notification type is set to: standard.");
            } else if (notification_type === global.CONFIG_TYPE_INTERVAL) {
                //interval config
                message.author.send("Notification type is set to: interval.\n" + 
                "Notification interval is set to: " + interval_length + " minutes.");
            } else {
                //corrupt config from database
                message.author.send("Incorrect configuration was fetched from database.\n" + 
                "Your config will be reset to standard mode.");
                request.updateUserConfig(message.author.id, global.CONFIG_TYPE_STANDARD, global.STANDARD_CONFIG_INTERVAL);
            }
        }

    }
}