const { DiscordManager } = require("../discord/discordManager");

class RoomManager {
    constructor(room, discord, config) {
        this.room = room;
        this.discord = discord;
        this.config = config;

        this.room.logging = false;
    
        this.listenEvents();
    }

    listenEvents() {
        this.room.onRoomLink = (link) => {
        }

        this.room.onPlayerJoin = (player) => {
        }

        this.room.onPlayerChat = (player, message) => {
        }
    }
}

module.exports = { RoomManager };
