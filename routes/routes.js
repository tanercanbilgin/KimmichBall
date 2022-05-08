const express = require('express');
const Model = require('../models/model');
const router = express.Router();
const axios = require('axios');
const url = require('url');

let accessToken = '';
let refreshToken = '';

router.get('/playerstats/:auth', async (req, res) => {
  try{
        const data = await Model.findOne({auth: req.params.auth}, 'isim oyunlar galibiyet mağlubiyet aktiflik gol asist kk cs puan bakiye');
        res.json(data)
  }
  catch(error){
      res.status(500).json({message: error.message})
  }
})

router.post("/newplayer", async (req, res) => {
  try{
  const post = new Model({
      isim: req.body.isim,
      auth: req.body.auth,
      conn: req.body.conn,
      isAdmin: req.body.isAdmin,
      isVIP: req.body.isVIP,
      isMaster: req.body.isMaster
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
		if (req.body.isim) {
			post.isim = req.body.isim
		}
		if (req.body.auth) {
			post.auth = req.body.auth
		}
		if (req.body.conn) {
			post.conn = req.body.conn
		}
		if (req.body.isAdmin) {
			post.isAdmin = req.body.isAdmin
		}
		if (req.body.isMaster) {
			post.isMaster = req.body.is
		}
		if (req.body.isVIP) {
			post.isVIP= req.body.isVIP
		}
    if (req.body.gol) {
			post.gol = req.body.gol
		}
    if (req.body.asist) {
			post.asist = req.body.asist
		}
    if (req.body.kk) {
			post.kk = req.body.kk
		}
    if (req.body.galibiyet) {
			post.galibiyet = req.body.galibiyet
		}
    if (req.body.aktiflik) {
			post.aktiflik = req.body.aktiflik
		}
    if (req.body.oyunlar) {
			post.oyunlar = req.body.oyunlar
		}
    if (req.body.puan) {
			post.puan = req.body.puan
		}
    if (req.body.cs) {
			post.cs = req.body.cs
		}
    if (req.body.bakiye) {
			post.bakiye = req.body.bakiye
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