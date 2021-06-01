const LRU = require('lru-cache')
const existenceCache = new LRU({
    max: 512,
    maxAge: 600000,
    stale: true,
    updateAgeOnGet: true
})
const { performance } = require('perf_hooks')


function rollback(connection, response, error) {
    connection.rollback()
    console.log(error)
    response.status(500).send({
        errorCode: error.code,
        errorMessage: error.message
    })
    connection.release()
}

function failedConnection(response, error) {
    console.log(error)
    response.status(500).send({
        errorMessage: 'Could not establish connection to database.'
    })
}

function checkSnowflake(req, res, next) {
    if (req.access_id) {
        next()
    } else {
        let isSnowflake = req.params.userId.match(/^\d{1,20}$/)

        if (isSnowflake) {
            req.access_id = req.params.userId
            req.access_token = 'snowflake'
            next()
        } else {
            res.status(400).send({
                route: req.originalUrl,
                error: "User ID must be a (at most) 64-bit integer."
            })
        }
    }
}

function checkAccessToken(req, res, next) {
    if (req.access_id) {
        next()
    } else {
        let isAccessToken = req.params.userId.match(/^[\w-=]+$/)

        if (isAccessToken) {
            req.access_id = req.params.userId
            req.access_type = 'access_token'
            next()
        } else {
            res.status(400).send({
                route: req.originalUrl,
                error: "User ID must be a valid Base64 value."
            })
        }
    }
}

function checkUserId(req, res, next) {
    if (req.access_id) {
        next()
    } else {
        let isAccessToken = req.params.userId.match(/^[\w-=]+$/)

        if (isAccessToken) {
            let isSnowflake = req.params.userId.match(/^[0-9]{1,20}$/) // is subset of isAccessToken
            req.access_id = req.params.userId
            req.access_type = isSnowflake ? 'snowflake' : 'access_token'
            next()
        } else {
            res.status(400).send({
                route: req.originalUrl,
                error: "User ID must be a valid Base64 value or (at most) 64-bit integer."
            })
        }
    }
}

function performanceTimeEnd(start, perf) {
  return Math.floor((perf.now() - start) * 1000) / 1000
}

function checkUserExistence(req, res, next) {
    if (req.snowflake || req.user_id) {
        next()
    } else {
        const start = performance.now()
        let val = existenceCache.get(req.params.userId)

        if (val) {
            let {
                snowflake,
                user_id,
                access_token
            } = val

            req.snowflake = snowflake
            req.user_id = user_id
            req.access_token = access_token
        
            console.log("user existence check: " + performanceTimeEnd(start, performance) + 'ms')
            next()
        } else {
            req.db.getConnection((error, connection) => {
                if (error) {
                    failedConnection(res, error)
                } else {
                    connection.beginTransaction(error => {
                        if (error) {
                            rollback(connection, res, error)
                        } else {
                            connection.query(
                                `SELECT snowflake, user_id, access_token FROM users WHERE ${req.access_type} = ?`,
                                [req.access_id],
                                (error, results, fields) => {
                                    console.log("user existence check: " + performanceTimeEnd(start, performance) + 'ms')
                                    if (error) {
                                        rollback(connection, res, error)
                                    } else if (results[0]) {
                                        connection.commit()
                                        connection.release()

                                        val = results[0]
                                        existenceCache.set(req.params.userId, val)

                                        let {
                                            snowflake,
                                            user_id,
                                            access_token
                                        } = val


                                        req.snowflake = snowflake
                                        req.user_id = user_id
                                        req.access_token = access_token

                                        next()
                                    } else {
                                        connection.rollback()
                                        connection.release()
                                        res.status(404).send({
                                            route: req.originalUrl,
                                            error: "User not found."
                                        })
                                    }
                                }
                            )
                        }
                    })
                }
            })
        }
    }
}

function checkSetting(req, res, next) {
    if (req.access_setting) {
        next()
    } else if (req.params.setting.match(/^\w+$/)) {
        req.access_setting = req.params.setting
        next()
    } else {
        res.status(400).send({
            route: req.originalUrl,
            error: "Setting may only contain a combination of alphanumerics or underscores."
        })
    }
}

function checkSettingExistence(req, res, next) {
    if (req.setting) {
        next()
    } else {
        const start = performance.now()
        let settings = existenceCache.get(req.params.setting)

        if (settings) {
            let {
                setting,
                sts // settings but settings cant be reused
            } = settings;

            req.setting = setting
            req.settings = sts
            
            console.log("setting existence check: " + performanceTimeEnd(start, performance) + 'ms')

            next()
        } else {
            req.db.getConnection((error, connection) => {
                if (error) {
                    failedConnection(re, errors)
                } else {
                    connection.beginTransaction(error => {
                        if (error) {
                            rollback(connection, res, error)
                        } else {
                            connection.query(
                                `SHOW TABLES LIKE '${req.access_setting}';`,
                                (error, results, fields) => {
                                    if (error) {
                                        rollback(connection, res, error)
                                    } else if (results[0]) {
                                        req.setting = req.access_setting
                                        connection.query(
                                            `SHOW COLUMNS FROM ${req.access_setting}`,
                                            (error, results, fields) => {
                                                console.log("setting existence check: " + performanceTimeEnd(start, performance) + 'ms')
                                                if (error) {
                                                    rollback(connection, res, error)
                                                } else {
                                                    connection.commit()
                                                    connection.release()


                                                    settings = Object.fromEntries(results.map(row => [row.Field, 'DEFAULT']))
                                                    delete settings.user_id
                                                    req.settings = settings


                                                    existenceCache.set(req.params.setting, {
                                                        setting: req.setting,
                                                        settings
                                                    })

                                                    next()
                                                }
                                            }
                                        )
                                    } else {
                                        connection.rollback()
                                        connection.release()
                                        res.status(404).send({
                                            route: req.originalUrl,
                                            error: "Setting not found."
                                        })
                                    }
                                }
                            )
                        }
                    })
                }
            })
        }
    }
}

function checkGame(req, res, next) {
    if (req.access_game) {
        next()
    } else {
        let isGame = req.params.game.match(/^[A-Za-z_]+$/)

        if (isGame) {
            req.access_game = req.params.game
            next()
        } else {
            res.status(400).send({
                route: req.originalUrl,
                error: 'Game may only contain ASCII alphabet characters and underscore.'
            })
        }
    }
}

function checkGameExistence(req, res, next) {
    if (req.game) {
        next()
    } else {
        const start = performance.now()
        let val = existenceCache.get(req.params.game)

        if (val) {
            req.game = req.access_game
            console.log("game existence check: " + performanceTimeEnd(start, performance) + 'ms')
            next()
        } else {
            req.db.getConnection((error, connection) => {
                if (error) {
                    failedConnection(res, error)
                } else {
                    connection.beginTransaction(error => {
                        if (error) {
                            rollback(connection, res, error)
                        } else {
                            connection.query(
                                `SHOW TABLES LIKE '${req.access_game}';`,
                                (error, results, fields) => {
                                    console.log("game existence check: " + performanceTimeEnd(start, performance) + 'ms')
                                    if (error) {
                                        rollback(connection, res, error)
                                    } else if (results[0]) {
                                        connection.commit()
                                        connection.release()

                                        existenceCache.set(req.params.game, 1)
                                        req.game = req.access_game


                                        next()
                                    } else {
                                        connection.rollback()
                                        connection.release()
                                        res.status(404).send({
                                            route: req.originalUrl,
                                            error: "Game not found."
                                        })
                                    }
                                }
                            )
                        }
                    })
                }
            })
        }
    }
}

module.exports = {
    rollback,
    failedConnection,

    checkSnowflake,
    checkAccessToken,
    checkUserId,
    checkSetting,
    checkGame,

    checkUserExistence,
    checkSettingExistence,
    checkGameExistence,

    existenceCache
}