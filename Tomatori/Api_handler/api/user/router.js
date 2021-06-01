const express = require('express');
var router = express.Router()

const bearerToken = process.env['API_TOKEN']

// all routes starting with /api/user/ must pass through this
router.all(
    '/*',
    (req, res, next) => {
        if (req.method === 'OPTIONS') {
            next()
            return
        }

        let auth_header = req.header('Authorization')
        if (auth_header) {
            let [type, creds] = auth_header.split(' ')

            if (type === 'Bearer' && creds === bearerToken) {
                next()
                return
            }
        }
        res.status(401).header('WWW-Authenticate', 'Bearer realm="API Access"').send()
    }
)

router.use('/', require('./user'))
router.use('/', require('./highscore'))
router.use('/', require('./pomodoro'))
router.use('/', require('./settings'))

module.exports = router