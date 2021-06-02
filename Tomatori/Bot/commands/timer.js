/**
 *  The purpose of this command is let a user manage the timer.
 */
     
let request = require('../utility/request');
let global = require('../utility/global_variables');      

var TEMP_STUDY_CHANNEL_ID = -1;                                                                     //variable to store temporary study channel id                                                    
var TIME_LEFT_QUERY = false;                                                                        //if user wants to force a timer prompt
var TIMERS = {};                                                                                    //hash-table to associate timer and user

var WARNINGS = 0;                                                                                   //number of warnings that has been handed out to user for playing a game during study session
const ALLOWED_WARNINGS = 3;                                                                         //number of allowed warnings before bot forces timer to stop
const WARNING_INTERVAL = 15;

module.exports = {
    name: 'timer',
    description: "This command displays a timer. The duration of the timer can be specified by the user.",
    aliases: ['t'],
    execute(client, message, args, Discord) {
        var server = client.guilds.cache.get(message.guild.id);
        var member = server.members.cache.get(message.author.id);
        var member_role = message.guild.roles.cache.find(r => r.name === 'Member');

        evalUserInput(args);

        /* FUNCTION TO EVAULUTE USER INPUT */
        function evalUserInput(arguments) {
            var timer_status = arguments[0];
            var timer_duration = arguments[1];

            if (timer_status === 'start' || timer_status === global.TIMER_SUB_ALIASES[0]) {
                //user wants to start timer
                if (!TIMERS[message.author.id]) {
                    //user can start timer as none are currently running
                    if (timer_duration) {
                        //user wants to specify the timer duration
                        if (!isNaN(timer_duration) && timer_duration <= global.MAX_TIMER_DURATION && timer_duration >= global.MIN_TIMER_DURATION) {
                            //valid duration
                            timer(timer_duration * 60);                                             //timer starts with specified duration
                        } else {
                            //invalid duration
                            message.author.send("Invalid timer duration. The value must be a number between " +
                            global.MIN_TIMER_DURATION + " and " + global.MAX_TIMER_DURATION + " minute(s).");
                        }
                    } else {
                        //user has not specified the timer duration, default duration is therefore assumed
                        timer(global.DEFAULT_TIMER_DURATION * 60);                                  //timer starts with default duration
                    }
                } else {
                    //user cannot start yet another timer as one is already running
                    message.author.send("You can only have one timer running at a time!" +
                    " You have to stop your current timer to start a new one.");
                }
            } else if (timer_status === 'stop' || timer_status === global.TIMER_SUB_ALIASES[1]) {
                //user wants to stop timer
                if (TIMERS[message.author.id]) {
                    //user can stop the running timer
                    stopTimer('user');
                } else {
                    //user cannot stop a timer as none are currently running
                    message.author.send("You have no timer running!");
                }
            } else if (timer_status === 'left' || timer_status === global.TIMER_SUB_ALIASES[2]) {
                //user wants to be prompted time left on timer
                if (TIMERS[message.author.id]) {
                    //user can ask for prompt as a timer is running
                    TIME_LEFT_QUERY = true;
                } else {
                    //user cannot ask for prompt as no timer is running
                    message.author.send("You have no timer running!");
                }
            } else {
                //user typed incorrect timer command, prompt user error
                message.author.send("Incorrect timer command. Type !help for more information on this command.");
            }
        }

        /* FUNCTION TO RUN TIMER */
        function timer(duration) {
            var times_run = 0;
            var timer = duration, hours, minutes, seconds;
            message.author.send("Timer has been set to " + (duration / 60) + " minute(s).");        //prompt timer duration

            //TIMER STARTS
            timer_interval_id = setInterval(async function () {
                if (times_run === 0) {
            //FIRST ITERATION TIMER RUNS
                    TIMERS[message.author.id] = timer_interval_id;                                  //associate timer with user's id when started
                    await createVoiceChannel('Studying', global.STUDY_CHANNEL_DENIED_PERMISSIONS);
                    member.voice.setChannel(TEMP_STUDY_CHANNEL_ID);
                    member.roles.remove(member_role);                                               //restrict user permissions while timer is running
                }
                restrictedAppsChecker(times_run, WARNING_INTERVAL);                                 //check if user starts playing a game while timer is running

                minutes = parseInt(timer / 60, 10);                                                     
                seconds = parseInt(timer % 60, 10);
                if (duration >= 60) {
                    hours = Math.floor(minutes / 60);
                    minutes %= 60;
                } else {
                    hours = 0;
                }
                hours = hours < 10 ? "0" + hours : hours;
                minutes = minutes < 10 ? "0" + minutes : minutes;                                       
                seconds = seconds < 10 ? "0" + seconds : seconds;
                printTimer(hours, minutes, seconds, times_run);                                     //display timer
                timer--;                                                                            //decrement timer
                times_run++;                                                                        //increment number of times timer has been run

            //TIMER ENDS
                if (times_run >= duration) {
                    stopTimer('timer');
                }
            }, 1000);                                                                               //run every 1000 ms = 1 sec
        }

        /* FUNCTION TO STOP TIMER AND DETERMINE IF USER WILL BE GRANTED POINTS */
        function stopTimer(reason) {
            clearInterval(timer_interval_id);                                                       //stop timer                                    
            deleteVoiceChannel(TEMP_STUDY_CHANNEL_ID);                                              //delete temporary study-channel
            member.roles.add(member_role);                                                          //give back user's permissions
            if (reason === 'timer') {
                //timer ran the full duration without interruptions, give user a pomodoro
                request.incrementUserPomodors(message.author.id);                                   //add one pomodoro to user as timer finished successfully
                message.author.send(global.REWARD_QUOTES[global.getRandomInt(0, 3)]);               //prompt random quote to user
            } else if (reason === 'user') {
                //user stopped timer before it ran out
                message.author.send(global.FAIL_QUOTES[global.getRandomInt(0, 2)]);                 //prompt random quote to user
            } else if (reason === 'game') {
                //user played a game during the timer
                message.author.send("You neglected the warnings and played a game during a study session.\n" +
                "Timer was stopped and no :tomato: was added to your inventory.");
            }
            TIMERS[message.author.id] = null;                                                       //dissociate timer from user 
        }

        /* FUNCTION TO DISPLAY TIMER */
        async function printTimer(hours, minutes, seconds, times_run) {
            let { 
                notification_type, 
                interval_length 
            } = await request.getUserConfig(message.author.id);                                     //fetch current user settings from database

            if (notification_type === 'standard') {
                //do not prompt user until timer has ran out
            } else if (notification_type === 'interval') {
                //prompt user with specified interval
                if (times_run % (interval_length * 60) === 0) {
                    message.author.send(hours + ":" + minutes + ":" + seconds);
                }
            } else if (TIME_LEFT_QUERY) {
                //user asked to be prompted with time left on the timer
                message.author.send(hours + ":" + minutes + ":" + seconds);
                TIME_LEFT_QUERY = false;
            }
        }
        
        /* FUNCTION TO CREATE A VOICE CHANNEL */
        async function createVoiceChannel(channel_name, permissions) {  
            const channel = await server.channels.create(channel_name, {                            
                type: 'voice',
                deny: permissions                                 
            });
            TEMP_STUDY_CHANNEL_ID = channel.id;                                                     
            console.log("Created " + channel_name + " channel with ID: " + TEMP_STUDY_CHANNEL_ID + "!");  
            }  

        
        /* FUNCTION TO DELETE A VOICE CHANNEL */
        function deleteVoiceChannel(channel_id) {
            try {
                const channel = message.guild.channels.cache.get(channel_id);
                channel.delete();
            } catch (err) {
                console.log("Cannot delete voice channel.");
            }
        }

        /* FUNCTION TO CHECK IF USER IS PLAYING A GAME */
        function restrictedAppsChecker(timer_runs, interval) {
            var game = member.presence.activities[0];
            if (timer_runs % interval === 0) {                                                      
                if (game != undefined) {
                    //user is playing a game detected by the Discord application, stop timer
                    WARNINGS++;
                    message.author.send("**Warning: (" + WARNINGS + "/" + ALLOWED_WARNINGS + ")**\nStop playing " + game + " or the session will be stopped.");
                    if (WARNINGS >= ALLOWED_WARNINGS) {
                        stopTimer('game');
                        return;
                    }
                }
            }
        }

    }
}