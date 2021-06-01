const express = require('express');
var router = express.Router()
const { checkGame, checkUserId, checkGameExistence, checkUserExistence, rollback, failedConnection} = require('../util')
const LRU = require('lru-cache')
const cache = new LRU({max: 512, maxAge: 120_000, stale: true, updateAgeOnGet: true})

router.get(
    '/:userId/highscore/:game',
    [checkGame, checkUserId, checkGameExistence, checkUserExistence],
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
                            `SELECT highscore FROM ${req.game} WHERE user_id = ${req.user_id};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else if (results[0]) {
                                    connection.commit()
                                    connection.release()
                                    
                                    val = results[0]
                                    cache.set(`/api/${req.snowflake}/highscore/${req.game}`, val)
                                    cache.set(`/api/${req.access_token}/highscore/${req.game}`, val)
                                    res.send(val)
                                } else {
                                    res.status(404).send({
                                        route: req.originalUrl,
                                        error: "User does not have a highscore in that game."
                                    })
                                }
                            }
                        )
                    }
                })
            }
        })
    }
)

/*router.post(
    '/:userId/highscore/:game',
    [checkGame, checkUserId, checkGameExistence, checkUserExistence],
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
                            `SELECT 1 FROM ${req.game} WHERE user_id = ${req.user_id};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else if (results[0]) {
                                    connection.commit()
                                    connection.release()
                                    res.status(409).send({
                                        route: req.originalUrl,
                                        error: "User already exists within the game."
                                    })
                                } else {
                                    connection.query(
                                        `INSERT INTO ${req.game} (user_id) VALUES (${req.user_id});`,
                                        (error, results, fields) => {
                                            if (error) {
                                                rollback(connection, res, error)
                                            } else {
                                                connection.commit()
                                                connection.release()

                                                val = { highscore: 0 }
                                                cache.set(`/api/${req.snowflake}/highscore/${req.game}`, val)
                                                cache.set(`/api/${req.access_token}/highscore/${req.game}`, val)
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
)*/

router.put(
    '/:userId/highscore/:game/:highscore',
    [checkGame, checkUserId, checkGameExistence, checkUserExistence],
    (req, res) => {
        if (!req.params.highscore.match(/^\d+$/)) {
            res.status(400).send({
                route: req.originalUrl,
                error: 'Highscore must be an integer value.'
            })
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
                            `UPDATE ${req.game} SET highscore = GREATEST(highscore, ${req.params.highscore}) WHERE user_id = ${req.user_id};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error) 
                                } else {
                                    connection.query(
                                        `SELECT highscore FROM ${req.game} WHERE user_id = ${req.user_id};`,
                                        (error, results, fields) => {
                                            if (error) {
                                                rollback(connection, res, error)
                                            } else {
                                                connection.commit()
                                                connection.release()
                                                
                                                val = results[0]
                                                console.log(req.user_id)

                                                cache.set(`/api/${req.snowflake}/highscore/${req.game}`, val)
                                                cache.set(`/api/${req.access_token}/highscore/${req.game}`, val)

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