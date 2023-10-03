const HaxballJS = require("haxball.js");
const roomBuilder = require('../structures/gamehandler.js');
const config = require('../utils/rooms.json');

const roomSettings = config[1]

HaxballJS.then(HBInit => roomBuilder(HBInit, roomSettings));