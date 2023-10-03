const roomBuilder = (HBInit, config) => {
    const room = HBInit({
        roomName: config.name,
        maxPlayers: config.maxPlayers,
        public: true,
        noPlayer: true,
        token: config.token,
    })
    import("../bot/base.js")
    global.room = room;
    global.roomName = config.name;
    global.maxPlayers = config.maxPlayers;
    global.token = config.token;
    global.public = config.public;
    module.exports.room = room;
}
module.exports = roomBuilder;