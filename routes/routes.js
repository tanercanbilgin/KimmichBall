const express = require('express');
const Model = require('../models/model');
const Ban = require('../models/ban');
const router = express.Router();

router.get('/playerstats/:auth', async (req, res) => {
	try {
		const data = await Model.findOne({ auth: req.params.auth }, 'isim oyunlar galibiyet mağlubiyet aktiflik gol asist kk cs puan bakiye');
		res.json(data)
	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
})

router.post("/newplayer", async (req, res) => {
	try {
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
	catch (error) {
		res.status(500).json({ message: error.message })
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
			post.isVIP = req.body.isVIP
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
		if (req.body.discordID) {
			post.discordID = req.body.discordID
		}
		await post.save()
		res.send(post)
	} catch {
		res.status(404)
		res.send({ error: "Post doesn't exist!" })
	}
})

//Get by Auth method
router.get('/getAuth/:auth', async (req, res) => {
	try {
		const data = await Model.findOne({ auth: req.params.auth });
		res.json(data)
	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
})

//Get All method
router.get('/getAll', async (req, res) => {
	try {
		;
		const data = await Model.find();
		res.json(data)
	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
})

router.get('/getBlacklist', async (req, res) => {
	try {
		const data = await Ban.find();
		res.json(data)
	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
})

router.post('/newBan', async (req, res) => {
	try {
		const post = new Ban({
			auth: req.body.auth,
			conn: req.body.conn,
		})
		await post.save()
		res.send(post)
	}
	catch (error) {
		res.status(500).json({ message: error.message })
	}
});

router.delete('/deleteBan/:data', async (req, res) => {
	try {
		if (req.params.data.length == 43) id = { auth: req.params.data }
		if (req.params.data.length == 26) id = { conn: req.params.data }
		await Ban.deleteMany(id)
		res.send(`${id} deleted`)
	}
	catch (error) {
		res.status(400).json({ message: error.message })
	}
})

module.exports = router;