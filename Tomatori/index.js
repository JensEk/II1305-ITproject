require('dotenv').config();

const express = require('express');
const path = require('path');

const app = express();

const page = path.join(__dirname, 'index.html')

app.use((err, res, req, next) => {
  console.log(err)
  next()
})
app.use('/oauth', require(`./oauth/router`))
app.use('/', express.static('public/home'))
app.use('/404', express.static('public/404'))
app.use('/login', express.static('public/login'))
app.use('/game/tomatori', express.static('public/game'))
app.use('/game/lootbox', express.static('public/lootbox'))

const port = 8080
app.listen(port, () => console.info(`Listening on port ${port}`));
