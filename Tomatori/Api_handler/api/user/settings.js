const express = require('express');
const router = express.Router()
const { rollback, failedConnection, checkUserId, checkSettingExistence, checkSetting, checkUserExistence } = require('../util')
const LRU = require('lru-cache')
const cache = new LRU({max: 512, maxAge: 120_000, stale: true, updateAgeOnGet: true})


router.get(
    '/:userId/settings/:setting',
    [checkUserId, checkUserExistence, checkSetting, checkSettingExistence],
    (req, res) => {
        let setting = cache.get(req.originalUrl)

        if (setting) {
            res.send(setting)
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
                            `SELECT setting.* FROM ${req.setting} AS setting WHERE setting.user_id = ${req.user_id};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else {
                                    connection.commit()
                                    connection.release()

                                    setting = results[0]
                                    delete setting.user_id
                                    cache.set(`/api/${req.snowflake}/settings/${req.setting}`, setting)
                                    cache.set(`/api/${req.access_token}/settings/${req.setting}`, setting)
                                    res.send(setting)
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
    '/:userId/settings/:setting',
    [checkUserId, checkSetting, checkUserExistence, checkSettingExistence],
    (req, res) => {
        for (const key in req.body) {
            req.settings[key] = req.body[key] || 'DEFAULT'
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
                            `SELECT 1 FROM ${req.setting} WHERE user_id = ${req.user_id};`,
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else if (results[0]) {
                                    res.status(409).send({
                                        errorMessage: 'User already has that setting.'
                                    })
                                } else {
                                    connection.query(
                                        `INSERT INTO ${req.setting} (user_id, ${Object.keys(req.settings)})
                                           VALUES (${req.user_id}, ${Object.values(req.settings)});`,
                                        (error, results, fields) => {
                                            if (error || !results) {
                                                rollback(connection, res, error)
                                            } else {
                                                connection.query(
                                                    `SELECT * FROM ${req.setting} WHERE user_id = ${req.user_id};`,
                                                    (error, results, fields) => {
                                                        if (error) {
                                                            rollback(connection, res, error)
                                                        } else {
                                                            connection.commit()
                                                            connection.release()

                                                            let setting = results[0]
                                                            delete setting.user_id
                                                            cache.set(`/api/${req.snowflake}/settings/${req.setting}`, setting)
                                                            cache.set(`/api/${req.access_token}/settings/${req.setting}`, setting)
                                                            res.send(setting)
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
)*/

router.put(
    '/:userId/settings/:setting',
    [checkUserId, checkSetting, checkUserExistence, checkSettingExistence],
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
                            `UPDATE ${req.setting} SET ? WHERE user_id = ${req.user_id};`,
                            [req.body],
                            (error, results, fields) => {
                                if (error) {
                                    rollback(connection, res, error)
                                } else {
                                    connection.query(
                                        `SELECT * FROM ${req.setting} WHERE user_id = ${req.user_id};`,
                                        (error, results, fields) => {
                                            if (error) {
                                                rollback(connection, res, error)
                                            } else {
                                                connection.commit()
                                                connection.release()

                                                let setting = results[0]
                                                delete setting.user_id
                                                cache.set(`/api/${req.snowflake}/settings/${req.setting}`, setting)
                                                cache.set(`/api/${req.access_token}/settings/${req.setting}`, setting)
                                                res.send(setting)
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