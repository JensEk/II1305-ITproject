const express = require('express');
var router = express.Router()
const { rollback, failedConnection, checkUserId, checkUserExistence, checkSnowflake } = require('../util')
const LRU = require('lru-cache')
const cache = new LRU({max: 512, maxAge: 120_000, stale: true, updateAgeOnGet: true})


router.get(
    '/:userId',
    [checkUserId, checkUserExistence],
    (req, res) => {
        let val = cache.get(req.originalUrl)

        if (val) {
            res.send(val)
            return
        }

        req.db.getConnection((error, connection) => {
            if (error) {
                failedConnection(res)
            } else {
                connection.beginTransaction(error => {
                    if (error) {
                        rollback(connection, res, error)
                    } else {
                        connection.query(
                            `SELECT snowflake, access_token, refresh_token, token_expiry FROM users WHERE snowflake = ${req.snowflake};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else {
                                    connection.commit()
                                    connection.release()
                                    
                                    val = results[0]
                                    cache.set(`/api/${req.snowflake}`, val)
                                    cache.set(`/api/${req.access_token}`, val)
                                    res.send(val)
                                }
                            }
                        )
                    }
                })
            }
        })
    }
)

router.post(
    '/:userId',
    [checkSnowflake],
    (req, res) => {
        req.db.getConnection((error, connection) => {
            if (error) {
                failedConnection(res)
            } else {
                connection.beginTransaction(error => {
                    if (error) {
                        rollback(connection, res, error)
                    } else {
                        connection.query(
                            `SELECT 1 FROM users WHERE snowflake = ${req.access_id};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else if (results[0]) {
                                    res.status(409).send({
                                        errorMessage: 'User already exists.'
                                    })
                                } else {
                                    connection.query(
                                        `INSERT INTO users (snowflake, access_token, refresh_token, token_expiry, pomodoro_points, pomodoros_completed)
                                         VALUES (${req.access_id}, ?, ?, ?, ?, ?);`,
                                        [req.body.access_token, req.body.refresh_token, req.body.token_expiry, req.body.pomodoro_points || 0, req.body.pomodoros_completed || 0],
                                        (error, results, fields) => {
                                            if (error) {
                                                rollback(connection, res, error)
                                            } else {
                                                req.snowflake = req.access_id
                                                req.user_id = results.insertId

                                                connection.query(
                                                    `INSERT INTO timer_notifications (user_id) VALUES (${req.user_id});`,
                                                    (error, results, fields) => {
                                                        if (error) {
                                                            rollback(connection, res, error)
                                                        } else {
                                                            connection.query(`INSERT INTO tomatori (user_id) VALUES (${req.user_id});`,
                                                            (error, results, fields) => {
                                                                if (error) {
                                                                    rollback(connection, res, error)
                                                                } else {
                                                                    connection.query(
                                                                        `SELECT snowflake, access_token, refresh_token, token_expiry FROM users WHERE snowflake = ${req.snowflake}`,
                                                                        (error, results, fields) => {
                                                                            if (error) {
                                                                                rollback(connection, res, error)
                                                                            } else {
                                                                                connection.commit()
                                                                                connection.release()
        
                                                                                let val = results[0]
                                                                                cache.set(`/api/${req.snowflake}`, val)
                                                                                cache.set(`/api/${req.access_token}`, val)
        
                                                                                res.send(val)
                                                                            }
                                                                        }
                                                                    )
                                                                }
                                                            })
                                                        }
                                                    }
                                                )
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                })
            }
        })
    }
)


router.put(
    '/:userId',
    [checkUserId, checkUserExistence],
    (req, res) => {
        req.db.getConnection((error, connection) => {
            if (error) {
                failedConnection(res)
            } else {
                connection.beginTransaction(error => {
                    if (error) {
                        rollback(connection, res, error)
                    } else {
                        connection.query(
                            `UPDATE users 
                               SET access_token = '${req.body.access_token || 'access_token' }', 
                                   refresh_token = '${req.body.refresh_token || 'refresh_token' }', 
                                   token_expiry =  ${req.body.token_expiry ? `NOW() + INTERVAL ${req.body.token_expiry} SECOND` : 'token_expiry' } 
                               WHERE snowflake = ${req.snowflake};`,
                            (error, results, fields) => {
                                if (error || !results) {
                                    rollback(connection, res, error)
                                } else {
                                    connection.query(
                                        `SELECT snowflake, access_token, refresh_token, token_expiry FROM users WHERE snowflake = ${req.snowflake}`,
                                        (error, results, fields) => {
                                            if (error) {
                                                rollback(connection, res, error)
                                            } else {
                                                connection.commit()
                                                connection.release()

                                                let val = results[0]
                                                cache.set(`/api/${req.snowflake}`, val)
                                                cache.set(`/api/${req.access_token}`, val)
                                                res.send(val)
                                            }
                                        }
                                    )
                                }
                            }
                        )
                    }
                })
            }
        })
    }
)

module.exports = router