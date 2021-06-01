const express = require('express');
const fetch = require('node-fetch');
const {
	DateTime,
	Duration
} = require('luxon');

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const FQDN = process.env.FQDN || process.env.TEST_FQDN
const API = process.env.API;

const redirect = FQDN + '/oauth/callback';
const discordApi = 'https://discord.com/api'


router.get('/', (req, res) => {
	if (req.headers.cookie) {
		req.cookies = Object.fromEntries(req.headers.cookie.split(';').map(c => c.trim().split('=')))
	}

	if (req.cookies && req.cookies.token) {
		res.redirect('/game')
	} else {
		res.redirect('/login');
	}
});


// Login handler
router.get('/authorize', (_, res) => {
	res.redirect(`${discordApi}/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

// Callback handler
router.get(
	'/callback',
	async (req, res) => {
		const code = req.query.code

    console.log(API)

		const response = await fetch(`${API}/api/oauth/authorize`, {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'
			},
			body: JSON.stringify({
				code
			})
		})

		const {
			snowflake,
			expires
		} = response.json()

		res.cookie('access_token', snowflake, {
			expires,
			secure: true,
			sameSite: 'Strict'
		}).redirect('/game')
	}
);

module.exports = router;