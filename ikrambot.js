function dec2hex(dec) {
    return dec.toString(16).padStart(2, "0")
}
const getMaps = require("./getMaps");
const maxPlayers = 16;
let roomLink;
// generateId :: Integer -> String
function generateId(len) {
    var arr = new Uint8Array((len || 40) / 2)
    const { Crypto } = require("@peculiar/webcrypto")
    const crypto = new Crypto()
    crypto.getRandomValues(arr);
    return Array.from(arr, dec2hex).join('')
}
const HaxballJS = require("./haxball.js/src/index");
const {
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");
const {
    exit
} = require("process");
const bot = new Client({
    intents: ["DIRECT_MESSAGES", "GUILDS", "GUILD_BANS", "GUILD_MESSAGE_TYPING", "GUILD_MEMBERS", "GUILD_MESSAGES", "GUILD_MESSAGE_REACTIONS"],
});


let room;
const token = `NzYwMTgyMTkzNTY0NjgwMjQy.X3IU1g.16lN_Psgb8HQ6VKmLwFUwc-rk5Q`;
bot.login(token).then(() => {
    console.log("Logged in successfull");
}).catch(err => {
    console.log(err);
    exit(0);
});
HaxballJS.then(HBInit => {
    function updatePlayerCount(bot) {
        try {
            if (!room)
                throw new Error("Room is not initialized");
            bot.user.setActivity(`Current players : ${room.getPlayerList().filter(p => p.id != 0).length}/${maxPlayers}`, {
                url: roomLink,
                type: "WATCHING"
            });
        }
        catch {
            console.log("Failed to set activity");
        }
    }
    room = HBInit({
        roomName: "0x00's room",
        public: true,
        maxPlayers: maxPlayers,
    });
    room.onRoomLink = async function (url) {
        roomLink = url;
        console.log(url);
        try {
            (await bot.users.createDM("721571588230873198", {})).send(`Room has opened. Link: ${url}`)
        }
        catch { }
    }
    room.onPlayerJoin = async function (player) {
        console.log(`${player.name} joined`);
        updatePlayerCount(bot);
    }
    room.onPlayerLeave = async function (player) {
        console.log(`${player.name} left`);
        updatePlayerCount(bot);
    }
}).catch(err => {
    console.log(err);
    exit(0);
})




bot.on("messageCreate", async function (message) {
    const splittedMsg = message.content.split(/ +/gm);
    console.log(splittedMsg)
    const [command] = splittedMsg;
    if (!room) return;
    if (command == "!kick") {
        const [, id, ...reason] = splittedMsg;
        const $reason = reason.join(" ");
        room.kickPlayer(Number(id), $reason, false);
    }
    if (command == "!ban") {
        const [, id, ...reason] = splittedMsg;
        const $reason = reason.join(" ");
        room.kickPlayer(Number(id), $reason, true);
    }
    if (command == "!admin") {
        let [, id, on_off] = splittedMsg;
        id = Number(id);
        if (on_off == 1) {

            room.setPlayerAdmin(id, true);
        }
        if (on_off == 0) {
            room.setPlayerAdmin(id, false);
        }
        message.reply("Player's administration permission has successfully set.");
    }
    if (command == "!players") {
        let players = room.getPlayerList();
        let content = '';
        if (players.length >= 1) {
            players.forEach((player) => {
                content += `Name: **${player.name}**, \nID: #${player.id
                    }
                  \nPing: ${player?.ping ?? "Ping cannot be taken. Please use the customized API!"
                    }
                  ,\nTeam: ${player.team == 1
                        ? 'Red'
                        : player.team == 2
                            ? 'Blue'
                            : 'Spectator'
                    }, \nIs Admin: ${player.admin ? 'Yes' : 'No'}\n`;
            });
        } else {
            content = 'No one is in the room.';
        }
        const _Embed = new MessageEmbed({
            description: content,
            title: "Players:",
        })
        const component = new MessageActionRow().addComponents(
            new MessageButton().setURL(roomLink || 'https://haxball.com/play').setStyle("LINK").setLabel("Room Link")
        )
        message.channel.send(
            {
                embeds: [_Embed],
                components: [component]
            }
        );
    }
    if (command == "!ping") {
        const msg = message.content.split(/ +/gm);
        let [, playerid, _ping, _mode] = msg;
        if (!isNaN(_ping)) {
            _ping = parseInt(_ping);
        } else {
            return message.reply("Oyuncunun pingini belirtin. Resetlemek icin !ping [id] 0 1.");
        }
        if (_mode && !isNaN(_mode)) {
            _mode = parseInt(_mode);
        }
        else {
            _mode = 0;
        }
        playerid = playerid.replace(/^#/, "");
        room.setPlayerPing(Number(playerid), _ping, _mode);
    }
    if (command == "!password") {
        const [, arg] = message.content.split(/ +/gm);
        if (arg == "clear") {
            room.setPassword(null);
            message.reply(`Password has reset!`)
            return;
        }
        let newPass = generateId(16);
        room.setPassword(newPass);
        message.reply(`Password has set to ${newPass}`)
    }
    if (command == "!disconnect") {
        const [, id] = message.content.split(/ +/gm);
        room.breakConnection(Number(id))
    }
    if (command == "!getmaps") {
        const [, ...args] = message.content.split(/ +/gm);
        const page = args?.[0];
        if (page !== null && page !== undefined && !isNaN(page)) {
            try {
                const title = "Map list";
                let fields = [];
                let _page = Number(page);
                const _result = await getMaps(_page);
                _result.map((val, index) => {
                    fields.push({
                        name: `Map #${val.mapid} ${val.mapName}`,
                        value: `Map yapimcisi: ${val.username || "Ziyaretci"}\nMap aciklamasi:${val.mapDescription}\nKategori:${val.categoryName || "Bos"}`
                    })
                })
                let _Embed = new MessageEmbed({
                    title,
                    fields
                });
                await message.reply({
                    embeds: [_Embed]
                });
            } catch { }
        }
        else {
            return await message.reply("Lutfen sayfa numarasini girin")
        }
    }
});

