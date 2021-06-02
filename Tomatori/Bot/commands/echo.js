module.exports = {
    name: 'echo',
    description: "This is a echo command that echoes back the contents of the message sent by a user.",
    execute(client, message, args, Discord) {
        message.author.send(args);                                                                  //echo user
    }
}