const express = require('express');
const router = express.Router()
const {
    rollback,
    checkUserId,
    checkUserExistence
} = require('../util')
const LRU = require('lru-cache')
const cache = new LRU({
    max: 512,
    maxAge: 120_000,
    stale: true,
    updateAgeOnGet: true
})

// redirect to increment by one
router.get(
    '/:userId/pomodoro/increment',
    (req, res) => {
        let val = cache.get(req.originalUrl)

        if (!val) {
            val = `/api/user/${req.params.userId}/pomodoro/increment/1`
            cache.set(req.originalUrl, val)
        }

        res.redirect(308, val)
    }
)

router.get(
    '/:userId/pomodoro/increment/:amount',
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
                            `UPDATE users SET pomodoro_points = pomodoro_points + ${req.params.amount}, pomodoros_completed = pomodoros_completed + 1 WHERE user_id = ${req.user_id}`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else {
                                    connection.query(
                                        `SELECT pomodoro_points, pomodoros_completed FROM users WHERE user_id = ${req.user_id}`,
                                        (error, results, fields) => {
                                            if (error) {
                                                rollback(connection, res, error)
                                            } else {
                                                connection.commit()
                                                connection.release()

                                                let values = results[0]
                                                cache.set(`/api/user/${req.snowflake}/pomodoro`, values)
                                                cache.set(`/api/user/${req.access_token}/pomodoro`, values)
                                                res.send(values)
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

// redirect to decrement by one
router.get(
    '/:userId/pomodoro/decrement',
    (req, res) => {
        let val = cache.get(req.originalUrl)

        if (!val) {
            val = `/api/user/${req.params.userId}/pomodoro/decrement/1`
            cache.set(req.originalUrl, val)
        }

        res.redirect(308, val)
    }
)

router.get(
    '/:userId/pomodoro/decrement/:amount',
    [checkUserId, checkUserExistence],
    (req, res) => {
        req.db.getConnection((error, connection) => {
            if (error) {
                failedConnection(res)
            } else {
                connection.query(
                    `UPDATE users SET pomodoro_points = pomodoro_points - LEAST(${req.params.amount}, pomodoro_points) WHERE user_id = ${req.user_id}`,
                    (error, results, fields) => {
                        if (error) {
                            rollback(connection, res, error)
                        } else {
                            connection.query(
                                `SELECT pomodoro_points, pomodoros_completed FROM users WHERE user_id = ${req.user_id}`,
                                (error, results, fields) => {
                                    if (error) {
                                        rollback(connection, res, error)
                                    } else {
                                        connection.commit()
                                        connection.release()

                                        let values = results[0]
                                        cache.set(`/api/user/${req.snowflake}/pomodoro`, values)
                                        cache.set(`/api/user/${req.access_token}/pomodoro`, values)
                                        res.send(values)
                                    }
                                }
                            )
                        }
                    }
                )
            }
        })
    }
)

router.get(
    '/:userId/pomodoro',
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
                            `SELECT pomodoro_points, pomodoros_completed FROM users WHERE snowflake = ${req.snowflake};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connetion, res, error)
                                } else {
                                    connection.commit()
                                    connection.release()

                                    let values = results[0]
                                    cache.set(`/api/user/${req.snowflake}/pomodoro`, values)
                                    cache.set(`/api/user/${req.access_token}/pomodoro`, values)
                                    res.send(values)
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