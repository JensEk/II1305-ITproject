const express = require('express');
var router = express.Router()

const help = {
    pomodoros: {
        route: "/api/user/{access token or snowflake}/pomodoro",
        description: "Returns Pomodoro Points and Pomodoros Completed of a user.",
        requestTypes: ['GET']
    },
    increment_pomodoros: {
        route: "/api/user/{access token or snowflake}/pomodoro/increment/{amount}",
        description: "Returns Pomodoro Points and Pomodoros Completed of a user after incrementing them.",
        requestTypes: ['GET']
    },
    decrement_pomodoros: {
        route: "/api/user/{access token or snowflake}/pomodoro/decrement/{amount}",
        description: "Returns Pomodoro Points after decrementing them and Pomodoros Completed of a user.",
        requestTypes: ['GET']
    },
    user_info: {
        route: "/api/user/{access token or snowflake}",
        description: "Returns user information, such as Access Token, Refresh Token, etc",
        requestTypes: ['GET', 'POST', 'PUT']
    },
    settings: {
        route: "/api/user/{access token or snowflake}/settings/{setting name}",
        description: "Returns the specified setting's values of a user.",
        requestTypes: ['GET', 'PUT']
    },
    highscore: {
        route: "/api/user/{access token or snowflake}/highscore/{game name}",
        description: "Returns the specified games's highscore of a user.",
        requestTypes: ['GET', 'PUT']
    }
}
router.get('/', (_, res) => res.send(help))

router.use('/user/', require('./user/router'))
router.use('/highscore/', require('./highscore'))


module.exports = router