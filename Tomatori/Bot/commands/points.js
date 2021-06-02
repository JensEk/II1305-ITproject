/**
 *  The purpose of this command is to display a user's score to the user.
 */

let request = require('../utility/request');  

module.exports = {
    name: 'points',
    description: "This command displays a user's accumulated pomodoro points.",
    aliases: ['p'],
    async execute(client, message, args, Discord) {

        var pomodoro_points = await request.getUserPomodoros(message.author.id);                    //fetch score from database
        message.author.send("You currently have :tomato:x" + pomodoro_points + "!");                         
    
    }
}