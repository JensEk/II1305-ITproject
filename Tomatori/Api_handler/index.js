require('dotenv').config()
const { performance } = require('perf_hooks')
const express = require('express')
const mysql = require('mysql')

const app = express()
    .use(express.json())
    .use(express.urlencoded({
        extended: true
}))


const database_config = {
    connectionLimit: 15,
    host: process.env['DATABASE_HOST'],
    port: parseInt(process.env['DATABASE_PORT']),
    database: process.env['DATABASE_DATABASE'],
    user: process.env['DATABASE_USER'],
    password: process.env['DATABASE_PASSWORD'],
    supportBigNumbers: true,
}

var database_connection;

function connectionLostHandler() {
    database_connection = mysql.createPool(database_config)

    database_connection.on('error', error => {
        if (error.code === 'PROTOCOL_CONNECTION_LOST') {
            connectionLostHandler()
        } else {
            throw err
        }
    })
}

connectionLostHandler()

app.use((_, res, next) => {
    const start = performance.now()
    res.on('finish', () => console.log('route: ' + (Math.floor((performance.now() - start) * 1000) / 1000) + 'ms\n'))
    next()
})

app.all(
    '/api/*',
    (req, res, next) => {
        console.log(`${req.method} ${req.originalUrl} from ${req.ip}`)
        if (req.body && Object.keys(req.body).length > 0) {
            console.log(req.body)
        }
        
        res.header('Access-Control-Allow-Origin', process.env.SITE_FQDN || '*')
        res.header("Access-Control-Allow-Methods", "PUT, POST, GET, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, Access-Control-Allow-Headers, Authorization")
        req.db = database_connection
        
        next()
    }
)
    
app.use('/api/', require('./api/router'))
    
const port = 8080
app.listen(port, () => console.log(`API listening on http://localhost:${port}`))