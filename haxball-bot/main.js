const HaxballJS = require("haxball.js");
const roomConfigs = require('./utils/rooms')
const roomBuilder = require('./structures/GameHandler')

roomConfigs.forEach((roomConfig) => {
  const { id, name, maxPlayers, token, file } = roomConfig;
  roomBuilder(id, name, maxPlayers, token, file);
});