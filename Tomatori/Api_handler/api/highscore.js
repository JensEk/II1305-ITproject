const express = require('express');
const router = express.Router()

const {
    rollback,
    failedConnection,
    checkGame,
    checkGameExistence
} = require('./util')

const LRU = require('lru-cache')
const cache = new LRU({
    max: 1,
    maxAge: 60_000
})

router.get(
    '/:game',
    [checkGame, checkGameExistence],
    (req, res) => {
        let val = cache.get(0)

        if (val) {
            res.send(val)
        } else {
            req.db.getConnection((error, connection) => {
                if (error) {
                    failedConnection(res)
                } else {
                    connection.beginTransaction(error => {
                        if (error) {
                            rollback(connection, res, error)
                        } else {
                            connection.query(
                                `SELECT snowflake, highscore FROM ${req.game}_leaderboard;`,
                                (error, results, fields) => {
                                    if (error) {
                                        rollback(connection, res, error)
                                    } else {
                                        connection.commit()
                                        connection.release()

                                        cache.set(0, results)
                                        res.send(results)
                                    }
                                }
                            )
                        }
                    })
                }
            })
        }
    }
)

module.exports = router