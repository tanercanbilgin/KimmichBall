const express = require('express');
const Model = require('../models/model');
const router = express.Router();
const axios = require('axios');
const url = require('url');

let accessToken = '';
let refreshToken = '';

router.get('/playerstats/:auth', async (req, res) => {
  try{
        const data = await Model.findOne({auth: req.params.auth}, 'playerName games wins winrate playtime goals assists ownGoals elo');
        res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

router.post("/newplayer", async (req, res) => {
  try{
  const post = new Model({
      playerName: req.body.playerName,
      auth: req.body.auth,
      isAdmin: req.body.isAdmin
  })
await post.save()
res.send(post)
  }   
  catch(error){
      res.status(500).json({message: error.message})
  }   
});

//Update by ID Method
router.patch("/update/:auth", async (req, res) => {
	try {
		const post = await Model.findOne({ auth: req.params.auth })

		if (req.body.playerName) {
			post.playerName = req.body.playerName
		}
		if (req.body.auth) {
			post.auth = req.body.auth
		}
		if (req.body.isAdmin) {
			post.isAdmin = req.body.isAdmin
		}
    if (req.body.goals) {
			post.goals = req.body.goals
		}
    if (req.body.assists) {
			post.assists = req.body.assists
		}
    if (req.body.ownGoals) {
			post.ownGoals = req.body.ownGoals
		}
    if (req.body.wins) {
			post.wins = req.body.wins
		}
    if (req.body.loses) {
			post.lose = req.body.loses
		}
    if (req.body.winrate) {
			post.winrate = req.body.winrate
		}
    if (req.body.playtime) {
			post.playtime = req.body.playtime
		}
    if (req.body.games) {
			post.games = req.body.games
		}
    if (req.body.elo) {
			post.elo = req.body.elo
		}
    
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})
/*
router.get('/auth/discord/redirect', async (req, res) => {
  const { code } = req.query;
  if (code) {
    try {
      const formData = new url.URLSearchParams({
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: process.env.REDIRECT_URL,
      });
      const response = await axios.post(
        'https://discord.com/api/v8/oauth2/token',
        formData.toString(),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
      const { access_token, refresh_token } = response.data;
      accessToken = access_token;
      refreshToken = refresh_token;
      console.log(accessToken, refresh_token);
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(400);
    }
  }
});

router.get('/auth/user', async (req, res) => {
  try {
    const response = await axios.get('https://discord.com/api/v8/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    res.send(response.data);
  } catch (err) {
    res.send("1")
  }
});

router.get('/auth/revoke', async (req, res) => {
  const formData = new url.URLSearchParams({
    client_id: process.env.CLIENT_ID,
    client_secret: process.env.CLIENT_SECRET,
    token: accessToken,
  });
  try {
    const response = await axios.post(
      'https://discord.com/api/v8/oauth2/token/revoke',
      formData.toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    res.send(response.data);
  } catch (err) {
    res.sendStatus(400);
  }
});
*/

//Get by Auth method
router.get('/getAuth/:auth', async (req, res) => {
    try{
        const data = await Model.findOne({auth: req.params.auth});
        res.json(data)
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

//Get by Auth method
router.get('/getAll', async (req, res) => {
  try{;
      const data = await Model.find();
      res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

module.exports = router;