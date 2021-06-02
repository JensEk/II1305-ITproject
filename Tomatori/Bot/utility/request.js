/**
 *  This file contains necessary GET, PUT & POST requests in order to access the database 
 *  through an API to change user's settings and score.
 */

const axios = require('axios');
const fetch = require('node-fetch');
const reqToken = "Bearer " + process.env.REQ_TOKEN;

module.exports = {
    name: 'request',
    description: "Manage HTTP requests through API.",

    /* FUNCTION TO ADD A NEW USER TO THE DATABASE */
    addNewUser : function (user_id) {
        axios.post("https://Higgsboson2021.Tobiky.repl.co/api/user/" + user_id, {
            pomodoro_points: 0,
            pomodoros_completed: 0
        },
        {
            headers: {
                Authorization: reqToken
            }
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    },

    /* FUNCTION TO ADD A USER CONFIG TO THE DATABASE */
    //TO BE REMOVED TO BE REMOVED TO BE REMOVED TO BE REMOVED TO BE REMOVED TO BE REMOVED
    addNewUserConfig : function (user_id) {
        axios.post("https://Higgsboson2021.Tobiky.repl.co/api/user/" + user_id + "/settings/timer_notifications", {
            notification_type: 0,
            interval_length: 0
        },
        {
            headers: {
                Authorization: reqToken
            }
        })
        .then(function (response) {
            console.log(response);
        })
        .catch(error => {
            console.log(error);
        });
    },

    /* FUNCTION TO UPDATE EXISTING USER CONFIG IN THE DATABASE */
    updateUserConfig : function (user_id, type, interval) {
      const new_config = {
          notification_type: type,
          interval_length: interval
      }
      const query = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': reqToken
        },
        body: JSON.stringify(new_config) 
        }

        fetch("https://Higgsboson2021.Tobiky.repl.co/api/user/" + user_id + "/settings/timer_notifications", query);
    },

    /* FUNCTION TO GET USER'S CURRENT CONFIG FROM DATABASE */
    getUserConfig : async function (user_id) {
        const response = await fetch ("https://Higgsboson2021.Tobiky.repl.co/api/user/" + user_id + "/settings/timer_notifications", {
            method: 'GET',
            headers: {
                'Authorization': reqToken
            }
        });
        const data = await response.json();
        return {
            notification_type: data.notification_type,
            interval_length: data.interval_length
        }
    },

    /* FUNCTION TO GET USER'S CURRENT POMODORO POINTS FROM DATABASE */
    getUserPomodoros : async function (user_id) {
        const response = await fetch ("https://Higgsboson2021.Tobiky.repl.co/api/user/" + user_id + "/pomodoro", {
            method: 'GET',
            headers: {
                'Authorization': reqToken
            }
        });
        const data = await response.json();
        return data.pomodoro_points;
    },

    /* FUNCTION TO INCREMENT USER'S POMODORO POINTS IN THE DATABASE */
    incrementUserPomodors : async function (user_id) {
        const response = await fetch ("https://Higgsboson2021.Tobiky.repl.co/api/user/" + user_id + "/pomodoro/increment", {
            method: 'GET',
            headers: {
                'Authorization': reqToken
            }
        });
        const data = await response.json();
        return data;
    }

}