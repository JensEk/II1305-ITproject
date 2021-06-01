const express = require('express');
const fetch = require('node-fetch');
const { DateTime, Duration } = require('luxon');

const router = express.Router();

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const FQDN = process.env.FQDN || process.env.TEST_FQDN

const redirect = FQDN + '/oauth/callback';
const discordApi = 'https://discord.com/api'


router.get('/', (req, res) => {
  if (req.headers.cookie) {
	  req.cookies = Object.fromEntries(req.headers.cookie.split(';').map(c => c.trim().split('=')))
  }

	if (req.cookies && req.cookies.access_token) {
		res.redirect('/game/tomatori')
	} else if (req.cookies && req.cookies.refresh_token) {
		res.redirect('oauth/refresh')
	} else {
		res.redirect('/login');
	}
});


// Login handler
router.get('/authorize', (_, res) => {
	res.redirect(`${discordApi}/oauth2/authorize?client_id=${CLIENT_ID}&scope=identify&response_type=code&redirect_uri=${redirect}`);
});

// Data used when contacting the Discord API for a Token Exchange
var accessTokenData = {
	client_id: CLIENT_ID,
	client_secret: CLIENT_SECRET,
	grant_type: 'authorization_code',
	redirect_uri: redirect,
	scope: ['identify'],
};


// Callback handler
router.get(
	'/callback',
	async (req, res) => {
		// ACESS TOKEN EXCHANGE
		if (req.query.error) {
			res.redirect('/404')
			return
		}

		accessTokenData.code = req.query.code;

		// GET TOKEN INFO
		const tokenResponse = await fetch(
			`${discordApi}/oauth2/token`, 
			{
				method: 'POST',
				body: new URLSearchParams(accessTokenData),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			}
		).then(async res => {
			let json = await res.json()
			json.date = DateTime.fromHTTP(res.headers.get('date'))
			return json
		})

		// GET USER DATA
		const userDataResponse = await fetch(
			`${discordApi}/users/@me`,
			{
				headers: {
					Authorization: `Bearer ${tokenResponse.access_token}`
				}
			}
		).then(res => res.json())

		const snowflake = userDataResponse.id

		const userData = {
			access_token: tokenResponse.access_token,
			refresh_token: tokenResponse.refresh_token,
			token_exipiry: tokenResponse.date.toJSDate()
		}

		const userUrl = `https://higgsboson2021.tobiky.repl.co/api/user/${snowflake}`
		let requestData = {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'
			},
			body: JSON.stringify(userData)
		}

		let response = await fetch(userUrl, requestData)

		if (response.status > 300) {
			requestData.method = 'POST'
			response = await fetch(userUrl, requestData)
		}

		// cookie() adds the Set-Cookie header. We add access_token and refresh_token as cookies.
		res.cookie(
				'access_token', 
				tokenResponse.access_token, 
				{
					expires: tokenResponse.date.plus({seconds: tokenResponse.expires_in}).toJSDate(),
					secure: true,
					sameSite: 'Strict'
				})
			.cookie(
				'refresh_token',
				tokenResponse.refresh_token,
				{
					maxAge: Duration.fromObject({days: 30}).as('seconds'), // Max age of a cookie is 20 years.
					secure: true,
					sameSite: 'Strict'
				}
			)
			.redirect('/game/tomatori');
	}
);

// Data used when contacting the Discord API for a Token replacement
var dataRefresh = {
    'client_id': CLIENT_ID,
    'client_secret': CLIENT_SECRET,
    'grant_type': 'refresh_token',
};

router.get(
	'/refresh',
	async (req, res) => {
		req.cookies = Object.fromEntries(req.headers.cookie.split(';').map(c => c.trim().split('=')))
		dataRefresh['refresh_token'] = req.cookies.refresh_token

		// REFRESH TOKEN EXCHANGE
		const tokenRefresh = await fetch(
			`${discordApi}/oauth2/token`,
			{
				method: 'POST',
				body: new URLSearchParams(dataRefresh),
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
				},
			}
		).then(async res => {
			let json = await res.json()
			json.date = DateTime.fromHTTP(res.headers.get('date'))
			return json
		});

		// GET USER DATA
		const userDataResponse = await fetch(
			`${discordApi}/users/@me`,
			{
				headers: {
					Authorization: `Bearer ${tokenRefresh.access_token}`
				}
			}
		).then(res => res.json())
		
		const snowflake = userDataResponse.id

		const userData = {
			access_token: tokenRefresh.access_token,
			refresh_token: tokenRefresh.refresh_token,
			token_exipiry: tokenRefresh.date.toJSDate()
		}

		const userUrl = `https://higgsboson2021.tobiky.repl.co/api/user/${snowflake}`
		let requestData = {
			method: 'PUT',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'Authorization': 'Bearer PYDBdFllFDZ6jEKhVrizOXTJVNnBKTuDDCyCr5hcpOI'
			},
			body: JSON.stringify(userData)
		}

		let response = await fetch(userUrl, requestData)

		if (response.status >= 300) {
			res.redirect('/gg')
			return
		}

		// cookie() adds the Set-Cookie header. We add access_token and refresh_token as cookies.
		res.cookie(
				'access_token', 
				tokenRefresh.access_token, 
				{
					expires: tokenRefresh.date.plus({seconds: tokenRefresh.expires_in}).toJSDate(),
					secure: true,
					sameSite: 'Strict'
				})
			.cookie(
				'refresh_token',
				tokenRefresh.refresh_token,
				{
					maxAge: Duration.fromObject({days: 30}).as('seconds'),
					secure: true,
					sameSite: 'Strict'
				}
			)
			.redirect('/game');
	}	
)

module.exports = router;
