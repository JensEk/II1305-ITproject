/**
 *  The purpose of this file is to evaluate user input from the Discord application
 *  and pass it to the corresponding command file.
 */

require('dotenv').config(); 
let request = require('../../utility/request');
let global = require('../../utility/global_variables');
var LOCAL_USER_CHECK = {};

module.exports = async (Discord, client, message) => {
    const prefix = process.env.PREFIX;                                                              //command prefix
    var server = client.guilds.cache.get(message.guild.id);                                         //fetch server data
    var member = server.members.cache.get(message.author.id);                                       //define member

    //LOCAL USER CHECK
    if (LOCAL_USER_CHECK[message.author.id] === undefined) {
        //local user check to avoid querying the database on every instance a command is passed
        await newUserCheck();
        await createRole('Member', 'BLUE');                                                         //create member-role
        await setUserRole('Member');                                                                //assign new role to user
        var everyone_role = server.roles.cache.get(message.guild.id);
        var member_role = message.member.guild.roles.cache.find(role => role.name === 'Member');

        await changeRolePermissions(everyone_role, global.RESTRICTED_PERMISSIONS);                  //restrict @everyone-role permissions
        await changeRolePermissions(member_role, global.MEMBER_PERMISSIONS);                        //change member-role permissions   

        LOCAL_USER_CHECK[message.author.id] = "User has been registered locally.";                  //register user locally in table
    }

    //COMMAND AUTHOR CHECK
    if (!message.content.startsWith(prefix) || message.author.bot) {                                //ignore if a command doesn't include the prefix or if the message was sent by the bot itself
        return;
    };   
    const args = message.content.slice(prefix.length).split(/ +/);                                  //splice so that multiple commands can be interpreted
    const cmd = args.shift().toLowerCase();                                                         //convert the command to lower case
    const command = client.commands.get(cmd) || client.commands.find(a => a.aliases && a.aliases.includes(cmd));
    
    //VALID COMMAND CHECK
    if (command) {                                                                        
        command.execute(client, message, args, Discord);                                            //pass to command file
    } else {
        message.author.send("Incorrect command. Please type !help for more information on all supported commands.");
    }

    /* FUNCTION TO CHECK IF USER EXISTS IN THE DATABASE */
    async function newUserCheck() {
        var pomodoro_points = await request.getUserPomodoros(message.author.id);                    //fetch score from database
        if (pomodoro_points != undefined) {
            //user exists in database, do nothing
            console.log("User already exists in database.");                                                     
            return;
        }
        //user does not exist in the database, therefore add new user
        await request.addNewUser(message.author.id);                                                //add new user
        await request.addNewUserConfig(message.author.id);                                          //add new user config 
        console.log("New user added to database!");                                                       
        return;
    }

    /* FUNCTION TO CREATE NEW ROLE ON SERVER */
    function createRole(role_name, color) {
            let role_check = message.guild.roles.cache.find(x => x.name === role_name);             
            if (!role_check) {
                //safe to create role 
                server.roles.create({
                    data: {
                    name: role_name,
                    color: color
                    }})
                    .then(console.log)
                    .catch(console.error);
                console.log("Created " + role_name + " role!");
            } else {
                //cannot create role as it already exists
                console.log("Role already exists.");
            }
        }

    /* FUNCTION TO ASSIGN A ROLE TO USER */
    function setUserRole(role_name) {
        var role = message.member.guild.roles.cache.find(role => role.name === role_name);
        member.roles.add(role);
        console.log("Added user: " + message.author.id + " to " + role_name + "-role!");
    }

    /* FUNCTION TO CHANGE ROLE PERMISSIONS */
    function changeRolePermissions(role_name, permissions) {
        role_name.setPermissions(permissions)                                              
            .then(updated => console.log("Updated permissions to " + updated.permissions.bitfield))
            .catch(console.error);
    }

}