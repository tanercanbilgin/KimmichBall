const express = require('express');
const Model = require('../models/model.js');
const Ban = require('../models/ban.js');

const router = express.Router();

router.get('/playerstats/:auth', async (req, res, next) => {
	try {
		const { auth } = req.params;
		const data = await Model.findOne({ auth }, 'isim oyunlar galibiyet mağlubiyet aktiflik gol asist kk cs puan bakiye');
		res.json(data);
	} catch (error) {
		next(error);
	}
});

router.post("/newplayer", async (req, res, next) => {
	try {
		const { isim, auth, conn, isAdmin, isVIP, isMaster } = req.body;
		const post = new Model({ isim, auth, conn, isAdmin, isVIP, isMaster });
		await post.save();
		res.send(post);
	} catch (error) {
		next(error);
	}
});

//Update by ID Method
router.patch("/update/:auth", async (req, res) => {
	try {
		const post = await Model.findOne({ auth: req.params.auth });
		Object.assign(post, req.body);
		await post.save();
		res.send(post);
	} catch {
		res.status(404).send({ error: "Post doesn't exist!" });
	}
});

//Get by Auth method
router.get('/getAuth/:auth', async (req, res, next) => {
	try {
		const { auth } = req.params;
		const data = await Model.findOne({ auth });
		res.json(data);
	} catch (error) {
		next(error);
	}
});

//Get All method
router.get('/getAll', async (req, res, next) => {
	try {
		const data = await Model.find();
		res.json(data);
	} catch (error) {
		next(error);
	}
});

router.get('/getBlacklist', async (req, res, next) => {
	try {
		const data = await Ban.find();
		res.json(data);
	} catch (error) {
		next(error);
	}
});

router.post('/newBan', async (req, res, next) => {
	try {
		const { auth, conn } = req.body;
		const post = new Ban({ auth, conn });
		await post.save();
		res.send(post);
	} catch (error) {
		next(error);
	}
});


router.delete('/deleteBan/:data', async (req, res) => {
	try {
		let id;
		if (req.params.data.length == 43) {
			id = { auth: req.params.data };
		} else if (req.params.data.length == 26) {
			id = { conn: req.params.data };
		} else {
			throw new Error('Invalid data parameter');
		}

		const result = await Ban.deleteMany(id);
		if (result.deletedCount === 0) {
			throw new Error('Ban not found');
		}
		res.send(`${result.deletedCount} ban(s) deleted`);
	}
	catch (error) {
		res.status(400).json({ message: error.message });
	}
})
module.exports = router;