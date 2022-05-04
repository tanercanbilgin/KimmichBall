const express = require('express');
const Model = require('../models/model');
const router = express.Router();
const axios = require('axios');
const url = require('url');

//Get by Auth method

let accessToken = '';
let refreshToken = '';

//Update by ID Method
router.patch("/updateA/:auth", async (req, res) => {
	try {
		const post = await Model.findOne({ auth: req.params.auth })

		if (req.body.name) {
			post.name = req.body.name
		}

		if (req.body.auth) {
			post.auth = req.body.auth
		}

		if (req.body.isAdmin) {
			post.isAdmin = req.body.isAdmin
		}

    if (req.body.discordID) {
			post.discordID = req.body.discordID
		}

    if (req.body.goals) {
			post.goals = req.body.goals
		}

		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

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
        console.log(err);
        res.sendStatus(400);
      }
    }
  });
  
router.get('/auth/user', async (req, res)=> {
    try {
      const response = await axios.get('https://discord.com/api/v8/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      res.send(response.data);
    } catch (err) {
      console.log(err);
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
      console.log(err);
      res.sendStatus(400);
    }
  });

router.post("/newplayer", async (req, res) => {
    try{
    const post = new Model({
        name: req.body.name,
        auth: req.body.auth,
        isAdmin: req.body.isAdmin,
        discordID: req.body.discordID,
        goals: req.body.goals
    })
	await post.save()
	res.send(post)
    }   
    catch(error){
        res.status(500).json({message: error.message})
    }   
});

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

//Get by ID Method
router.get('/getOne/:id', async (req, res) => {
    try {
        const data = await Model.findById(req.params.id);
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Get all Method
router.get('/getAll', async (req, res) => {
    try {
        const data = await Model.find();
        res.json(data)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Update by ID Method
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updatedData = req.body;
        const options = { new: true };

        const result = await Model.findByIdAndUpdate(
            id, updatedData, options
        )

        res.send(result)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

//Delete by ID Method
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Model.findByIdAndDelete(id)
        res.send(`Document with ${data.name} has been deleted..`)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;