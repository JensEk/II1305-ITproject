var mysql = require('mysql');                                                                       //Node.js can use this module to manipulate the MySQL database:
require('dotenv').config(); 

module.exports = {
    name: 'connection',
    description: "Share created connection with other files.",
    connection: mysql.createConnection({
        host: 'atabeyli.com',
        port: 3306,
        database: 'atabeyli_pomodoro_bot',
        user: 'atabeyli_pomodor',
        password: 'Higgsboson_21',
    }),
}
