const HaxballJS = require("haxball.js");
const { exit } = require('process')
const { program } = require("commander");
program.requiredOption("--token <token>");
program.parse()
let { token: haxtoken } = program.opts();
if (!haxtoken || haxtoken.length != 39) {
    exit(1);
}

HaxballJS.then((HBInit) => {

    const room = HBInit({
        roomName: "[--------------ｋｉｍｍｉｃｈ--------------]",
        maxPlayers: 2,
        noPlayer: true,
        geo: { lat: 40.625533, lon: 29.500281, code: "eu", },
        public: true,
        token: haxtoken,
        password: "karim123"
    });

    room.setDefaultStadium("Big");
    room.setScoreLimit(5);
    room.setTimeLimit(0);

    room.onRoomLink = function (link) {
        console.log("Footer text");
    };

});