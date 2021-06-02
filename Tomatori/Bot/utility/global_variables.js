/**
 *  This file contains necessary variables needed to run the bot commands.
 */

module.exports = {
    name: 'global_variables',
    description: "Store global variables used in multiple files.",

    //Timer variables
    TIMER_SUB_ALIASES : ['st', 'sp', 'lf'],                                                         //sub-aliases for: start, stop, left
    DEFAULT_TIMER_DURATION: 25,                                                                     //default timer duration
    MAX_TIMER_DURATION : 120,                                                                       //maximum timer duration
    MIN_TIMER_DURATION : 1,                                                                         //minimum timer duration
    REWARD_QUOTES : [                                                                               //reward quotes when a user completes a timer
        "Timer has ended. You have received :tomato:x1!",
        "A wild :tomato: has appeared in your inventory!",
        "Great job! A :tomato: has been added to your inventory!",
        "You managed to stay focused the full session. Here you go, one :tomato: for you!"],
    FAIL_QUOTES : [                                                                                 //quotes when a user decides to stop a running timer
        "You need to stay focused the entire session in order to receive a :tomato:.",
        "Unfortunately no :tomato: was added to your inventory. Try to stay focused next time!",
        "Timer was stopped. You have not received a :tomato:."],
    getRandomInt : function (min, max) {
            return min + Math.floor(Math.random() * (max - min + 1));                               //function to retrieve random int between min and max
        },

    //Config variables
    CONFIG_SUB_ALIASES : ['sta', 'int'],                                                            //sub-aliases for: standard, interval
    CONFIG_TYPE_STANDARD : 0,                                                                       //database value for standard configuration
    CONFIG_TYPE_INTERVAL : 1,                                                                       //database value for interval configuration
    STANDARD_CONFIG_INTERVAL : 0,                                                                   //default interval length
    MAX_CONFIG_INTERVAL : 30,                                                                       //maximum interval length
    MIN_CONFIG_INTERVAL : 1,                                                                        //minimum interval length

    //Role variables
    MEMBER_PERMISSIONS : [                                                                          //member-role permissions                   
        "CREATE_INSTANT_INVITE",
        "ADD_REACTIONS",
        "VIEW_AUDIT_LOG",
        "STREAM",
        "VIEW_CHANNEL",
        "SEND_MESSAGES",
        "MANAGE_MESSAGES",
        "EMBED_LINKS",
        "ATTACH_FILES",
        "READ_MESSAGE_HISTORY",
        "MENTION_EVERYONE",
        "USE_EXTERNAL_EMOJIS",
        "CONNECT",
        "SPEAK",
        "DEAFEN_MEMBERS"],   
    RESTRICTED_PERMISSIONS : [                                                                      //everyone-role permissions
        "SEND_MESSAGES",
        "VIEW_AUDIT_LOG",
        "MANAGE_MESSAGES",
        "VIEW_CHANNEL"],  
    STUDY_CHANNEL_DENIED_PERMISSIONS : [                                                            //restricted permissions for users in studying-channel
        "STREAM",
        "SPEAK",
        "CONNECT"],
        
    //Help embed variables
    MAIN_COLOR : '#801818',                                                                         //main color scheme "faluröd"
    LOGO_LINK : process.env.LOGO                                                                    //link to pomodoro bot logo
}