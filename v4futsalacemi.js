const HaxballJS = require("haxball.js");
const kufurlistesi = require("./kufurlistesi.js");
const futsalantmap = require("./map/futsalant.hbs");
const futsalv12map = require("./map/futsalv12.hbs");
const futsalv4map = require("./map/futsalv4.hbs");

const fetch = require("node-fetch")

const { exit } = require('process')

const { program } = require("commander");
program.requiredOption("--token <token>");
program.parse()
let { token: haxtoken } = program.opts();
if (!haxtoken || haxtoken.length != 39) {
  exit(1);
}

const {
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
  Permissions,
  WebhookClient,
  MessageAttachment,
} = require("discord.js");

require("dotenv").config();

const token = process.env.V4ACEMI;

// Init bot
const bot = new Client({
  intents: [
    "DIRECT_MESSAGES",
    "GUILDS",
    "GUILD_BANS",
    "GUILD_MESSAGE_TYPING",
    "GUILD_MEMBERS",
    "GUILD_MESSAGES",
    "GUILD_MESSAGE_REACTIONS",
  ],
});

bot.on("ready", () => {
  console.log("Discord connected");
});

bot.login(token);
HaxballJS.then((HBInit) => {
  function updatePlayerCount(bot) {
    try {
      bot.user.setActivity(
        `${playersAll.length}/${maxPlayers}`,
        {
          name: `${currentStadium}`,
          url: roomLink,
          type: "PLAYING",
        }
      );
    } catch {
      console.log("Bot profili güncellenemedi.");
    }
  }

  bot.on("messageCreate", async function (message) {
    const splittedMsg = message.content.split(/ +/gm);
    const [command] = splittedMsg;
    if (!room) return;

    if (message.channel.name.includes("v4a")) {
      if (command == "!oyuncular") {
        oyuncular = room.getPlayerList();

        let tspec = '' // 0
        let tred = '' // 1
        let tblue = '' // 2

        function isAfk(oyuncu) {
          if (AFKSet.has(oyuncu.id)) return "💤"
          if (!AFKSet.has(oyuncu.id)) return ""
        }

        function getTag(oyuncu) {
          if (getRole(oyuncu) == Role.PLAYER) return "";
          if (getRole(oyuncu) == Role.ADMIN_TEMP) return "✨";
          if (getRole(oyuncu) == Role.VIP) return "💎";
          if (getRole(oyuncu) == Role.ADMIN_PERM) return "⚡️";
          if (getRole(oyuncu) == Role.MASTER) return "👑";
        }

        for (let oyuncu of oyuncular) {
          if (oyuncu.team == 0) (tspec += `#${oyuncu.id} ${oyuncu.name}  ${getTag(oyuncu)}  ${isAfk(oyuncu)}\n`)
          if (oyuncu.team == 1) (tred += `#${oyuncu.id} ${oyuncu.name}  ${getTag(oyuncu)}  ${isAfk(oyuncu)}\n`)
          if (oyuncu.team == 2) (tblue += `#${oyuncu.id} ${oyuncu.name}  ${getTag(oyuncu)}  ${isAfk(oyuncu)}\n`)
        }

        const _Embed = new MessageEmbed();
        if (oyuncular.length >= 1) {
          _Embed.setTitle(roomName);
          _Embed.setColor("#c0f00b");
          if (tred != "")
            _Embed.addFields({
              name: "🔴 Kırmızı Takım",
              value: `${tred}`,
            });
          if (tblue != "")
            _Embed.addFields({
              name: "🔵 Mavi Takım",
              value: `${tblue}`,
            });
          if (tspec != "")
            _Embed.addFields({
              name: "⚪ İzleyiciler",
              value: `${tspec}`,
            });
          _Embed.setFooter({
            text: `🕒 ${getTimeEmbed(game.scores.time)}`,
          });
        } else {
          _Embed.setColor("#E74C3C");
          _Embed.setDescription("Odada kimse yok");
        }
        const component = new MessageActionRow().addComponents(
          new MessageButton()
            .setURL(roomLink || "https://haxball.com/play")
            .setStyle("LINK")
            .setLabel("🔗 ODAYA GİTMEK İÇİN TIKLA")
        );
        message.channel.send({
          embeds: [_Embed],
          components: [component],
        });
      }

      if (command == "!duyuru") {
        const [, ...reason] = splittedMsg;
        const $reason = reason.join(" ");
        dname = message.member.nickname || message.author.username;
        room.sendAnnouncement(
          "DISCORD 💬 " + dname + "・" + $reason,
          null,
          0xA569BD,
          "bold",
          2
        );
        message.reply("Mesajın sunucuya başarıyla iletildi.");
      }
      if (command == "!kick") {
        const [, id, ...reason] = splittedMsg;
        const $reason = reason.join(" ");
        room.kickPlayer(Number(id), $reason, false);
        message.reply(`${authArray[Number(id)][2]}, ${$reason} sebebiyle kicklendi.`);
      }
      if (command == "!ban") {
        const [, id, ...reason] = splittedMsg;
        const $reason = reason.join(" ");
        room.kickPlayer(Number(id), $reason, true);
        banList.push([authArray[Number(id)][2], Number(id)]);
        message.reply(`${authArray[Number(id)][2]}, ${$reason} sebebiyle banlandı.`);
      }
      if (command == "!mute") {
        let [, id, amount] = splittedMsg;
        if ((authArray[Number(id)][4] || authArray[Number(id)][5] || authArray[Number(id)][6]) == false) {
          var muteObj = new MutePlayer(
            authArray[Number(id)][2],
            Number(id),
            authArray[Number(id)][0]
          );
          if (!amount) amount = muteDuration
          muteObj.setDuration(amount);
          message.reply(`${authArray[Number(id)][2]}, ${amount} dakika boyunca susturuldu.`);
        }
        else {
          message.reply(`Yetkili veya VIP birini susturamazsın!`);
        }
      }
      if (command == "!unmute") {
        const [, id] = splittedMsg;
        var muteObj = muteArray.getId(Number(id));
        muteObj.remove();
        message.reply(`${authArray[Number(id)][2]}, artık yazabilir.`);
      }
      if (command == "!banlar") {
        if (banList.length == 0) {
          message.reply("Ban listesinde kimse yok")
        }
        else {
          var cstm = "📢 Ban listesi : ";
          for (let ban of banList) {
            cstm += ban[0] + `[${ban[1]}], `;
          }
          cstm = cstm.substring(0, cstm.length - 2) + ".";
          message.reply(cstm)
        }
      }
      if (command == "!mutelar") {
        if (muteArray.list.length == 0) {
          message.reply("Mute listesinde kimse yok")
        }
        else {
          var cstm = "🔇 Mute Listesi : ";
          for (let mute of muteArray.list) {
            cstm += mute.name + `[${mute.id}], `;
          }
          cstm = cstm.substring(0, cstm.length - 2) + ".";
          message.reply(cstm)
        }
      }
      if (command == "!bankaldır") {
        const [, id] = splittedMsg;
        room.clearBan(Number(id));
        message.reply(`${banList.filter((p) => p[1] == Number(id))[0][0]} adlı oyuncunun banı kaldırıldı.`);
        banList = banList.filter((p) => p[1] != Number(id));
      }
      if (command == "!muteall") {
        dname = message.member.nickname || message.author.username;
        if (allMuted == false) {
          allMuted = true;
          message.reply("Sohbet tüm oyuncular için kapatıldı.");
          room.sendAnnouncement(
            "DISCORD 💬 " + dname + ", oyunu etkilemesinden dolayı sohbeti geçici olarak kapattı.",
            null,
            0xA569BD,
            "bold",
            2
          );
        } else {
          allMuted = false
          message.reply("Sohbet tekrardan açıldı.");
          room.sendAnnouncement(
            "DISCORD 💬 " + dname + ", sohbeti tekrardan açtı. Kapanmaması için kurallara uy!",
            null,
            0xA569BD,
            "bold",
            0
          );
        }
      }
      if (command == "!adminyap") {
        let [, id, on_off] = splittedMsg;
        id = Number(id);
        if (on_off == 1) {
          if (authArray[id][5] == false) {
            authArray[id][5] = true
            room.setPlayerAdmin(id, true);
            message.reply(`${authArray[Number(id)][2]}, başarıyla admin yapıldı.`);
          }
          else {
            message.reply(`${authArray[Number(id)][2]}, zaten admin!`)
          }
        }
        if (on_off == 0) {
          if (authArray[id][5] == true) {
            authArray[id][5] = false
            room.setPlayerAdmin(id, false);
            message.reply(`${authArray[Number(id)][2]}, artık admin değil.`);
          }
          else {
            message.reply(`${authArray[Number(id)][2]}, zaten admin değildi!`)
          }
        }
      }
      if (command == "!vipyap") {
        let [, id, on_off] = splittedMsg;
        id = Number(id);
        if (on_off == 1) {
          if (authArray[id][4] == false) {
            authArray[id][4] = true
            message.reply(`${authArray[Number(id)][2]}, başarıyla VIP yapıldı.`);
          }
          else {
            message.reply(`${authArray[Number(id)][2]}, zaten VIP!`)
          }
        }
        if (on_off == 0) {
          if (authArray[id][4] == true) {
            authArray[id][4] = false
            message.reply(`${authArray[Number(id)][2]}, artık VIP değil.`);
          }
          else {
            message.reply(`${authArray[Number(id)][2]}, zaten VIP değil!`)
          }
        }
      }
    }
  });
  /* VARIABLES */

  /* ROOM */

  const roomName = "🔥 ｖ４ ｆｕｔｓａｌ ａｃｅｍｉ 🔥";
  const maxPlayers = 12;
  const roomPublic = true;

  var roomWebhook =
    "https://discord.com/api/webhooks/981887182837014538/NGdtgMCZ0mnY76f4Wn0fvDjUJsv7Ag0bw6-uvQ6v4VHWFFim-mjHyL0FopBszTBN1vbE";
  var gameWebhook =
    "https://discord.com/api/webhooks/981886983691436043/NOtfTbQ0GLRxQ1Kuy91EELSOhi_pxd8ss7tDWxv2EzHPNGbi3w-jHnECMSj3axCSjbwV";
  var kickbanWebhook =
    "https://discord.com/api/webhooks/981886750714634251/JkH1Q0ar3qlNOvMNFjwj-stYoZG3jeLle96vSX43YIYQMcWORd9s96VxgLi9IG4T-pFs";
  var giriscikisWebhook =
    "https://discord.com/api/webhooks/981886634356244480/-Nd2R1ThrJN2na0Hgp_47d70u_KOu562XX9_Pd97UVPkxBCaeexOHvBjkJbaC2lJyZU9";

  var fetchRecordingVariable = false;
  var timeLimit = 3;
  var scoreLimit = 3;

  const room = HBInit({
    roomName: roomName,
    maxPlayers: maxPlayers,
    public: roomPublic,
    noPlayer: true,
    token: haxtoken,
    geo: { "lat": 39.925533, "lon": 32.866283, "code": "JP", },
  });

  const antrenmanMap = JSON.stringify(futsalantmap)
  const v2Map = JSON.stringify(futsalv12map)
  const v4Map = JSON.stringify(futsalv4map)

  var currentStadium = "antrenman";
  var v4MapObj = JSON.parse(antrenmanMap);

  room.setScoreLimit(scoreLimit);
  room.setTimeLimit(timeLimit);
  room.setTeamsLock(true);
  room.setKickRateLimit(6, 0, 0);

  var roomPassword = "";

  /* OPTIONS */

  var drawTimeLimit = Infinity;
  var teamSize = 4;
  var disableBans = false;
  var debugMode = false;
  var afkLimit = 30;

  var defaultSlowMode = 0.5;
  var chooseModeSlowMode = 1;
  var slowMode = defaultSlowMode;
  var SMSet = new Set();

  var mentionPlayersUnpause = true;

  var allMuted = false

  var adminCagirTimeout = false

  /* OBJECTS */

  class Goal {
    constructor(time, team, striker, assist) {
      this.time = time;
      this.team = team;
      this.striker = striker;
      this.assist = assist;
    }
  }

  class Game {
    constructor() {
      this.date = Date.now();
      this.scores = room.getScores();
      this.playerComp = getStartingLineups();
      this.rec = room.startRecording();
      this.goals = [];
      this.touchArray = [];
    }
  }

  class PlayerComposition {
    constructor(player, auth, timeEntry, timeExit) {
      this.player = player;
      this.auth = auth;
      this.timeEntry = timeEntry;
      this.timeExit = timeExit;
      this.inactivityTicks = 0;
      this.GKTicks = 0;
    }
  }

  class MutePlayer {
    constructor(name, id, auth) {
      this.id = MutePlayer.incrementId();
      this.name = name;
      this.playerId = id;
      this.auth = auth;
      this.unmuteTimeout = null;
    }

    static incrementId() {
      if (!this.latestId) this.latestId = 1;
      else this.latestId++;
      return this.latestId;
    }

    setDuration(minutes) {
      this.unmuteTimeout = setTimeout(() => {
        room.sendAnnouncement(
          `Artık yazabilirsin.`,
          this.playerId,
          announcementColor,
          "bold",
          HaxNotification.CHAT
        );
        this.remove();
      }, minutes * 60 * 1000);
      muteArray.add(this);
    }

    remove() {
      this.unmuteTimeout = null;
      muteArray.removeById(this.id);
    }
  }

  class MuteList {
    constructor() {
      this.list = [];
    }

    add(mutePlayer) {
      this.list.push(mutePlayer);
      return mutePlayer;
    }

    getById(id) {
      var index = this.list.findIndex((mutePlayer) => mutePlayer.id === id);
      if (index !== -1) {
        return this.list[index];
      }
      return null;
    }

    getByPlayerId(id) {
      var index = this.list.findIndex(mutePlayer => mutePlayer.playerId === id);
      if (index !== -1) {
        return this.list[index];
      }
      return null;
    }

    getByAuth(auth) {
      var index = this.list.findIndex((mutePlayer) => mutePlayer.auth === auth);
      if (index !== -1) {
        return this.list[index];
      }
      return null;
    }

    removeById(id) {
      var index = this.list.findIndex((mutePlayer) => mutePlayer.id === id);
      if (index !== -1) {
        this.list.splice(index, 1);
      }
    }

    removeByAuth(auth) {
      var index = this.list.findIndex((mutePlayer) => mutePlayer.auth === auth);
      if (index !== -1) {
        this.list.splice(index, 1);
      }
    }
  }

  class BallTouch {
    constructor(player, time, goal, position) {
      this.player = player;
      this.time = time;
      this.goal = goal;
      this.position = position;
    }
  }

  /* PLAYERS */

  const Team = {
    SPECTATORS: 0,
    RED: 1,
    BLUE: 2,
  };
  const State = {
    PLAY: 0,
    PAUSE: 1,
    STOP: 2,
  };
  const Role = {
    PLAYER: 0,
    ADMIN_TEMP: 1,
    VIP: 2,
    ADMIN_PERM: 3,
    MASTER: 4,
  };
  const HaxNotification = {
    NONE: 0,
    CHAT: 1,
    MENTION: 2,
  };
  const Situation = {
    STOP: 0,
    KICKOFF: 1,
    PLAY: 2,
    GOAL: 3,
  };

  var gameState = State.STOP;
  var playSituation = Situation.STOP;
  var goldenGoal = false;

  var playersAll = [];
  var players = [];
  var teamRed = [];
  var teamBlue = [];
  var teamSpec = [];

  var teamRedStats = [];
  var teamBlueStats = [];

  var banList = [];

  /* STATS */

  var possession = [0, 0];
  var actionZoneHalf = [0, 0];
  var lastWinner = Team.SPECTATORS;
  var streak = 0;

  /* AUTH */

  var authArray = [];

  /* COMMANDS */

  var commands = {
    yardım: {
      aliases: ["komutlar"],
      roles: Role.PLAYER,
      desc: `
    Bu komut sana kullanabileceğin komutları gösterir. Nasıl kullanacağını bilmediğin komut için:
Örnek: \'!yardım bb\' sana \'bb\' komutunun nasıl kullanacağını gösterir.`,
      function: helpCommand,
    },
    discord: {
      aliases: ["dc"],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odanın discord linkini öğrenebilirsin.`,
      function: dclinkCommand,
    },
    afk: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile AFK kalabilirsin.
    En az 1, en fazla 5 dakika afk kalabilirsin. Komutu tekrar kullanmak için 10 dakika beklemelisin`,
      function: afkCommand,
    },
    afklar: {
      aliases: ["afklistesi"],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile kimler AFK görebilirsin.`,
      function: afkListCommand,
    },
    bb: {
      aliases: ["bay", "görüşürüz", "ae"],
      roles: Role.PLAYER,
      desc: `
    Bu komut ile oyunu sorunsuzca terkedebilirsin (önerilir).`,
      function: leaveCommand,
    },
    avatar: {
      aliases: ["avatarlar"],
      roles: Role.PLAYER,
      desc: `
    Bu komut ile avatarının neden böyle olduğunu anlayabilirsin.`,
      function: avatarListCommand,
    },
    ben: {
      aliases: ["istatistik", "stat", "stats", "me"],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile istatistiklerini görebilirsin.`,
      function: globalStatsCommand,
    },
    oyunlar: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en çok oyun oynamış 5 kişiyi görürsün.`,
      function: statsLeaderboardCommand,
    },
    galibiyet: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en çok oyun kazanmış 5 kişiyi görürsün.`,
      function: statsLeaderboardCommand,
    },
    gol: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en çok gol atmış 5 kişiyi görürsün`,
      function: statsLeaderboardCommand,
    },
    asist: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en çok asist yapmış 5 kişiyi görürsün`,
      function: statsLeaderboardCommand,
    },
    kk: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki kendi kalesine en çok gol atmış 5 kişiyi görürsün`,
      function: statsLeaderboardCommand,
    },
    aktiflik: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en çok zaman geçirmiş 5 kişiyi görürsün.`,
      function: statsLeaderboardCommand,
    },
    cs: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en çok gol yememe rekoruna sahip 5 kaleci veya defansı görürsün`,
      function: statsLeaderboardCommand,
    },
    puan: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en yüksek puana sahip 5 kişiyi görürsün`,
      function: statsLeaderboardCommand,
    },
    bakiye: {
      aliases: [],
      roles: Role.PLAYER,
      desc: `
        Bu komut ile odadaki en yüksek bakiyeye sahip 5 kişiyi görürsün`,
      function: statsLeaderboardCommand,
    },
    adminçağır: {
      aliases: ["admincagir", "administe"],
      roles: Role.PLAYER,
      desc: `
    Bu komut ile önemli durumlarda admin çağırabilirsin.`,
      function: admincagirCommand,
    },
    antrenman: {
      aliases: ["ant", "antr"],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile antrenman haritasını açarsın.`,
      function: stadiumCommand,
    },
    v2: {
      aliases: ["v1"],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile v1 - v2 haritasını açarsın.`,
      function: stadiumCommand,
    },
    v4: {
      aliases: [""],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile v4 haritasını açarsın.`,
      function: stadiumCommand,
    },
    rr: {
      aliases: [],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile oyunu yeniden başlatırsın`,
      function: restartCommand,
    },
    rrs: {
      aliases: [],
      roles: Role.ADMIN_TEMP,
      desc: `
    Bu komut ile takımları yer değiştirip oyunu yeniden başlatırsın.`,
      function: restartSwapCommand,
    },
    değiş: {
      aliases: ["swap", "s"],
      roles: Role.ADMIN_TEMP,
      desc: `
    Bu komut ile takımları yer değiştirirsin.`,
      function: swapCommand,
    },
    kırmızıkick: {
      aliases: [
        "kickr",
        "rediat",
        "redat",
        "kırmızıyıat",
        "kırmızıat",
        "kickrec",
        "kk",
      ],
      roles: Role.ADMIN_TEMP,
      desc: `
    Bu komut ile kırmızı takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
      function: kickTeamCommand,
    },
    mavikick: {
      aliases: ["kickb", "blueat", "maviyiat", "maviat", "kickblue", "mk"],
      roles: Role.ADMIN_TEMP,
      desc: `
    Bu komut ile mavi takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
      function: kickTeamCommand,
    },
    speckick: {
      aliases: [
        "kicks",
        "specat",
        "izleyiciat",
        "izleyiciyiat",
        "izleyicileriat",
        "sk",
      ],
      roles: Role.ADMIN_TEMP,
      desc: `
    Bu komut ile izleyici takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
      function: kickTeamCommand,
    },
    mute: {
      aliases: ["sustur", "mute"],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile bir oyunucuyu susturursun. İstersen yanına kaç dakika susması gerektiğini belirtebilirsin.
        Örnek: !mute #3 20, 3 idsine sahip oyuncuyu 20 dakika boyunca susturur.`,
      function: muteCommand,
    },
    muteall: {
      aliases: ["toplusustur", "toplumute"],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile sunucuyu toplu şekilde susturursun. Sadece adminler mesaj atabilir.`,
      function: muteAllCommand,
    },
    unmute: {
      aliases: ["um"],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile mutelanmış oyuncunun cezasını kaldırırsın.
        Örnek: !unmute #3, 3 idsine sahip oyuncu artık yazabilir.`,
      function: unmuteCommand,
    },
    mutelar: {
      aliases: ["mutes"],
      roles: Role.ADMIN_TEMP,
      desc: `
        Bu komut ile mutelanmış oyuncuları görürsün.`,
      function: muteListCommand,
    },
    rankres: {
      aliases: ["ranksıfırla", "rankreset"],
      roles: Role.VIP,
      desc: `
        Bu komut ile rankını sıfırlayabilirsin!`,
      function: rankResetCommand,
    },
    bankaldır: {
      aliases: ["clearbans"],
      roles: Role.MASTER,
      desc: `
    Bu komut ile banlanan bütün oyuncuların banını kaldırabilirsin. Eğer sadece bir kişinin banını kaldırmak istiyorsan !banlar yazmalısın
    Daha sonra oyuncunun yanındaki numarayı öğrenip !bankaldır 45(oyuncunun yanındaki numara) yazmalısın.`,
      function: clearbansCommand,
    },
    banlar: {
      aliases: ["banlist", "bans", "banlistesi"],
      roles: Role.MASTER,
      desc: `
    Bu komut ile banlanan oyuncuları numarasıyla birlikte görebilirsin.`,
      function: banListCommand,
    },
    odaşifresi: {
      aliases: ["roompass", "odaşifre"],
      roles: Role.MASTER,
      desc: `
        Bu komut ile odaya şifre koyarsın. Kullanımı !odaşifresi deneme123
        Geri kaldırmak için !odaşifresi yazman yeterli`,
      function: passwordCommand,
    },
  };

  /* GAME */

  var lastTouches = Array(2).fill(null);
  var lastTeamTouched;

  var speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
  var ballSpeed = 0;
  var playerRadius = 15;
  var ballRadius = 6.25;
  var triggerDistance = playerRadius + ballRadius + 0.01;

  /* COLORS */

  var welcomeColor = 0xc4ff65;
  var announcementColor = 0xffefd6;
  var infoColor = 0xbebebe;
  var privateMessageColor = 0xffc933;
  var redColor = 0xff4c4c;
  var blueColor = 0x62cbff;
  var warningColor = 0xffa135;
  var errorColor = 0xa40000;
  var successColor = 0x75ff75;
  var defaultColor = null;

  /* AUXILIARY */

  var checkTimeVariable = false;
  var checkStadiumVariable = true;
  var endGameVariable = false;
  var cancelGameVariable = false;
  var kickFetchVariable = false;

  var chooseMode = false;
  var timeOutCap;
  var capLeft = false;
  var redCaptainChoice = "";
  var blueCaptainChoice = "";
  var chooseTime = 20;

  var AFKSet = new Set();
  var AFKMinSet = new Set();
  var AFKCooldownSet = new Set();
  var minAFKDuration = 0;
  var maxAFKDuration = 30;
  var AFKCooldown = 0;

  var muteArray = new MuteList();
  var muteDuration = 5;

  var removingPlayers = false;
  var insertingPlayers = false;

  var stopTimeout;
  var startTimeout;
  var unpauseTimeout;
  var removingTimeout;
  var insertingTimeout;

  var emptyPlayer = {
    id: 0,
  };
  stadiumCommand(emptyPlayer, "!antrenman");

  var game = new Game();

  /* FUNCTIONS */

  /* AUXILIARY FUNCTIONS */

  if (typeof String.prototype.replaceAll != "function") {
    String.prototype.replaceAll = function (search, replacement) {
      var target = this;
      return target.split(search).join(replacement);
    };
  }

  function getDate() {
    let d = new Date();
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
  }

  /* MATH FUNCTIONS */

  function getRandomInt(max) {
    // returns a random number between 0 and max-1
    return Math.floor(Math.random() * Math.floor(max));
  }

  function pointDistance(p1, p2) {
    return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
  }

  /* TIME FUNCTIONS */

  function getHoursStats(time) {
    return Math.floor(time / 3600);
  }

  function getMinutesGame(time) {
    var t = Math.floor(time / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
  }

  function getMinutesReport(time) {
    return Math.floor(Math.round(time) / 60);
  }

  function getMinutesEmbed(time) {
    var t = Math.floor(Math.round(time) / 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
  }

  function getMinutesStats(time) {
    return Math.floor(time / 60) - getHoursStats(time) * 60;
  }

  function getSecondsGame(time) {
    var t = Math.floor(time - Math.floor(time / 60) * 60);
    return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
  }

  function getSecondsReport(time) {
    var t = Math.round(time);
    return Math.floor(t - getMinutesReport(t) * 60);
  }

  function getSecondsEmbed(time) {
    var t = Math.round(time);
    var t2 = Math.floor(t - Math.floor(t / 60) * 60);
    return `${Math.floor(t2 / 10)}${Math.floor(t2 % 10)}`;
  }

  function getTimeGame(time) {
    return `${getMinutesGame(time)}:${getSecondsGame(time)}`;
  }

  function getTimeEmbed(time) {
    return `[${getMinutesEmbed(time)}:${getSecondsEmbed(time)}]`;
  }

  function getTimeStats(time) {
    if (getHoursStats(time) > 0) {
      return `${getHoursStats(time)} saat ${getMinutesStats(time)} dakika`;
    } else {
      return `${getMinutesStats(time)} dakika`;
    }
  }

  function getGoalGame() {
    return game.scores.red + game.scores.blue;
  }

  /* REPORT FUNCTIONS */

  function findFirstNumberCharString(str) {
    let str_number = str[str.search(/[0-9]/g)];
    return str_number === undefined ? "0" : str_number;
  }

  function getIdReport() {
    var d = new Date();
    return `${d.getFullYear() % 100}${d.getMonth() < 9 ? "0" : ""}${d.getMonth() + 1
      }${d.getDate() < 10 ? "0" : ""}${d.getDate()}${d.getHours() < 10 ? "0" : ""
      }${d.getHours()}${d.getMinutes() < 10 ? "0" : ""}${d.getMinutes()}${d.getSeconds() < 10 ? "0" : ""
      }${d.getSeconds()}${findFirstNumberCharString(roomName)}`;
  }

  function getRecordingName(game) {
    var d = new Date();
    var redCap =
      game.playerComp[0][0] != undefined
        ? game.playerComp[0][0].player.name
        : "Kirmizi";
    var blueCap =
      game.playerComp[1][0] != undefined
        ? game.playerComp[1][0].player.name
        : "Mavi";
    return `${d.getDate()}-${d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1
      }-${d.getFullYear() % 100
      }-${d.getHours()}s${d.getMinutes()}-${redCap}vs${blueCap}.hbr2`;
  }

  /* FEATURE FUNCTIONS */

  function getCommand(commandStr) {
    if (commands.hasOwnProperty(commandStr)) return commandStr;
    for (const [key, value] of Object.entries(commands)) {
      for (let alias of value.aliases) {
        if (alias == commandStr) return key;
      }
    }
    return false;
  }

  function getPlayerComp(player) {
    if (player == null || player.id == 0) return null;
    var comp = game.playerComp;
    var index = comp[0].findIndex((c) => c.auth == authArray[player.id][0]);
    if (index != -1) return comp[0][index];
    index = comp[1].findIndex((c) => c.auth == authArray[player.id][0]);
    if (index != -1) return comp[1][index];
    return null;
  }

  function getTeamArray(team) {
    return team == Team.RED ? teamRed : team == Team.BLUE ? teamBlue : teamSpec;
  }

  function sendAnnouncementTeam(message, team, color, style, mention) {
    for (let player of team) {
      room.sendAnnouncement(message, player.id, color, style, mention);
    }
  }

  function teamChat(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    var emoji =
      player.team == Team.RED ? "🔴" : player.team == Team.BLUE ? "🔵" : "⚪";
    var message = `${emoji} [TAKIM SOHBETİ] ${player.name}: ${msgArray.join(
      " "
    )}`;
    var team = getTeamArray(player.team);
    var color =
      player.team == Team.RED
        ? redColor
        : player.team == Team.BLUE
          ? blueColor
          : null;
    var style = "bold";
    var mention = HaxNotification.CHAT;
    sendAnnouncementTeam(message, team, color, style, mention);
  }

  function playerChat(player, message) {
    var msgArray = message.split(/ +/);
    var playerTargetIndex = playersAll.findIndex(
      (p) => p.name.replaceAll(" ", "_") == msgArray[0].substring(2)
    );
    if (playerTargetIndex == -1) {
      room.sendAnnouncement(
        `Böyle bir oyuncu bulunamadı, girdiğin ismi kontrol et.`,
        player.id,
        errorColor,
        "bold",
        null
      );
      return false;
    }
    var playerTarget = playersAll[playerTargetIndex];
    if (player.id == playerTarget.id) {
      room.sendAnnouncement(
        `Kendine mesaj yollayamazsın!`,
        player.id,
        errorColor,
        "bold",
        null
      );
      return false;
    }
    var messageFrom = `📝 [${playerTarget.name} isimli kullanıcıya mesajın] ${player.name
      }: ${msgArray.slice(1).join(" ")}`;

    var messageTo = `📝 [${player.name}, bir mesaj gönderdi] ${player.name
      }: ${msgArray.slice(1).join(" ")}`;

    room.sendAnnouncement(
      messageFrom,
      player.id,
      privateMessageColor,
      "bold",
      HaxNotification.CHAT
    );
    room.sendAnnouncement(
      messageTo,
      playerTarget.id,
      privateMessageColor,
      "bold",
      HaxNotification.CHAT
    );
  }

  /* PHYSICS FUNCTIONS */
  /*
    function calculateStadiumVariables() {
      if (checkStadiumVariable && teamRed.length + teamBlue.length > 0) {
        checkStadiumVariable = false;
        setTimeout(() => {
          let ballDisc = room.getDiscProperties(0);
          let playerDisc = room.getPlayerDiscProperties(
            teamRed.concat(teamBlue)[0].id
          );
          ballRadius = 6.25;
          playerRadius = playerDisc.radius;
          triggerDistance = ballRadius + playerRadius + 0.01;
          speedCoefficient =
            100 / (5 * ballDisc.invMass * (ballDisc.damping ** 60 + 1));
        }, 1);
      }
    }*/

  function checkGoalKickTouch(array, index, goal) {
    if (array != null && array.length >= index + 1) {
      var obj = array[index];
      if (obj != null && obj.goal != null && obj.goal == goal) return obj;
    }
    return null;
  }

  /* BUTTONS */

  function topButton() {
    if (teamSpec.length > 0) {
      if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
        room.setPlayerTeam(teamSpec[0].id, Team.RED);
        room.setPlayerTeam(teamSpec[1].id, Team.BLUE);
      } else if (teamRed.length < teamBlue.length)
        room.setPlayerTeam(teamSpec[0].id, Team.RED);
      else room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
    }
  }

  function randomButton() {
    if (teamSpec.length > 0) {
      if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
        var r = getRandomInt(teamSpec.length);
        room.setPlayerTeam(teamSpec[r].id, Team.RED);
        teamSpec = teamSpec.filter((spec) => spec.id != teamSpec[r].id);
        room.setPlayerTeam(
          teamSpec[getRandomInt(teamSpec.length)].id,
          Team.BLUE
        );
      } else if (teamRed.length < teamBlue.length)
        room.setPlayerTeam(
          teamSpec[getRandomInt(teamSpec.length)].id,
          Team.RED
        );
      else
        room.setPlayerTeam(
          teamSpec[getRandomInt(teamSpec.length)].id,
          Team.BLUE
        );
    }
  }

  function blueToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
      removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamBlue.length; i++) {
      room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
    }
  }

  function redToSpecButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
      removingPlayers = false;
    }, 100);
    for (var i = 0; i < teamRed.length; i++) {
      room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
    }
  }

  function resetButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
      removingPlayers = false;
    }, 100);
    for (let i = 0; i < Math.max(teamRed.length, teamBlue.length); i++) {
      if (Math.max(teamRed.length, teamBlue.length) - teamRed.length - i > 0)
        room.setPlayerTeam(
          teamBlue[teamBlue.length - 1 - i].id,
          Team.SPECTATORS
        );
      else if (
        Math.max(teamRed.length, teamBlue.length) - teamBlue.length - i >
        0
      )
        room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
      else break;
    }
    for (let i = 0; i < Math.min(teamRed.length, teamBlue.length); i++) {
      room.setPlayerTeam(
        teamBlue[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
        Team.SPECTATORS
      );
      room.setPlayerTeam(
        teamRed[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
        Team.SPECTATORS
      );
    }
  }

  function swapButton() {
    clearTimeout(removingTimeout);
    removingPlayers = true;
    removingTimeout = setTimeout(() => {
      removingPlayers = false;
    }, 100);
    for (let player of teamBlue) {
      room.setPlayerTeam(player.id, Team.RED);
    }
    for (let player of teamRed) {
      room.setPlayerTeam(player.id, Team.BLUE);
    }
  }

  /* COMMAND FUNCTIONS */

  /* PLAYER COMMANDS */

  function leaveCommand(player, message) {
    room.kickPlayer(player.id, "Görüşürüz !", false);
  }

  function dclinkCommand(player, message) {
    room.sendAnnouncement(
      `Discord sunucumuza davetlisin ! Link: https://discord.gg/TG7mr7AsQa`,
      player.id,
      "0xA569BD",
      "bold",
      HaxNotification.CHAT
    );
  }

  function helpCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length == 0) {
      var commandString = "Oyuncu komutları :";
      for (const [key, value] of Object.entries(commands)) {
        if (value.desc && value.roles == Role.PLAYER)
          commandString += ` !${key},`;
      }
      commandString =
        commandString.substring(0, commandString.length - 1) + ".\n";
      if (getRole(player) >= Role.VIP) {
        commandString += `VIP komutları:`;
        for (const [key, value] of Object.entries(commands)) {
          if (value.desc && value.roles == Role.VIP)
            commandString += ` !${key},`;
        }
        if (commandString.slice(commandString.length - 1) == ":")
          commandString += ` Yok,`;
        commandString =
          commandString.substring(0, commandString.length - 1) + ".\n";
      }
      if (getRole(player) >= Role.ADMIN_PERM) {
        commandString += `Admin komutları:`;
        for (const [key, value] of Object.entries(commands)) {
          if (value.desc && value.roles == Role.ADMIN_TEMP)
            commandString += ` !${key},`;
        }
        if (commandString.slice(commandString.length - 1) == ":")
          commandString += ` Yok,`;
        commandString =
          commandString.substring(0, commandString.length - 1) + ".\n";
      }
      if (getRole(player) == Role.MASTER) {
        commandString += `Yetkili komutları :`;
        for (const [key, value] of Object.entries(commands)) {
          if (value.desc && value.roles == Role.MASTER)
            commandString += ` !${key},`;
        }
        if (commandString.slice(commandString.length - 1) == ":")
          commandString += ` Yok,`;
        commandString =
          commandString.substring(0, commandString.length - 1) + ".\n";
      }
      commandString +=
        "\nBir komut için detaylı bilgi almak için ''!yardım <komutismi>'.";
      room.sendAnnouncement(
        commandString,
        player.id,
        infoColor,
        "bold",
        HaxNotification.CHAT
      );
    } else if (msgArray.length >= 1) {
      var commandName = getCommand(msgArray[0].toLowerCase());
      if (commandName != false && commands[commandName].desc != false)
        room.sendAnnouncement(
          `\'${commandName}\' komutu :\n${commands[commandName].desc}`,
          player.id,
          infoColor,
          "bold",
          HaxNotification.CHAT
        );
      else
        room.sendAnnouncement(
          `Böyle bir komut yok, komutları görmek için \'!yardım\'`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
    }
  }

  async function globalStatsCommand(player, message) {
    var data = await checkStats(authArray[player.id][0]);
    const stats = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => key !== "_id")
    );
    var statsString = printPlayerStats(stats);
    room.sendAnnouncement(
      statsString,
      player.id,
      infoColor,
      "bold",
      HaxNotification.CHAT
    );
  }

  function statsLeaderboardCommand(player, message) {
    var key = message.split(/ +/)[0].substring(1).toLowerCase();
    printRankings(key, player.id);
  }

  function afkCommand(player, message) {
    if (player.team == Team.SPECTATORS || players.length == 1) {
      if (AFKSet.has(player.id)) {
        if (AFKMinSet.has(player.id)) {
          room.sendAnnouncement(
            `Minumum ${minAFKDuration} dakika AFK kalabilirsin. Komutu kötüye kullanmamalısın !`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
          );
        } else {
          AFKSet.delete(player.id);
          room.sendAnnouncement(
            `🌅 ${player.name} artık AFK değil !`,
            null,
            announcementColor,
            "bold",
            null
          );
          updateTeams();
          handlePlayersJoin();
        }
      } else {
        if (AFKCooldownSet.has(player.id)) {
          room.sendAnnouncement(
            `Sadece ${AFKCooldown} dakikada bir AFK kalabilirsin. Komutu kötüye kullanmamalısın !`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
          );
        } else {
          AFKSet.add(player.id);
          if (!player.admin) {
            AFKMinSet.add(player.id);
            AFKCooldownSet.add(player.id);
            setTimeout(
              (id) => {
                AFKMinSet.delete(id);
              },
              minAFKDuration * 60 * 1000,
              player.id
            );
            setTimeout(
              (id) => {
                AFKSet.delete(id);
              },
              maxAFKDuration * 60 * 1000,
              player.id
            );
            setTimeout(
              (id) => {
                AFKCooldownSet.delete(id);
              },
              AFKCooldown * 60 * 1000,
              player.id
            );
          }
          room.setPlayerTeam(player.id, Team.SPECTATORS);
          room.sendAnnouncement(
            `😴 ${player.name} artık AFK !`,
            null,
            announcementColor,
            "bold",
            null
          );
          updateTeams();
          handlePlayersLeave();
        }
      }
    } else {
      room.sendAnnouncement(
        `Oyundayken AFK kalamazsın !`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }

  function afkListCommand(player, message) {
    if (AFKSet.size == 0) {
      room.sendAnnouncement(
        "😴 AFK listesinde kimse yok",
        player.id,
        announcementColor,
        "bold",
        null
      );
      return;
    }
    var cstm = "😴 AFK listesi : ";
    AFKSet.forEach((_, value) => {
      var p = room.getPlayer(value);
      if (p != null) cstm += p.name + `, `;
    });
    cstm = cstm.substring(0, cstm.length - 2) + ".";
    room.sendAnnouncement(cstm, player.id, announcementColor, "bold", null);
  }

  /*
  async function vipCommand(player, message) {
      var data = await checkPlayer(authArray[player.id][0]);
      const perm = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
      if (perm.isVIP == true && vipList.includes(authArray[player.id][0]) == false) {
          vipList.push(authArray[player.id][0]);
          room.sendAnnouncement(
              `${player.name} vip hesabına giriş yaptı!`,
              null,
              announcementColor,
              'bold',
              HaxNotification.CHAT
          );
      } else if (perm.isVIP == false) {
          room.sendAnnouncement(
              `${player.name} yetkili değilsin kanka :(`,
              null,
              announcementColor,
              'bold',
              HaxNotification.MENTION
          );
      } else {
          room.sendAnnouncement(
              `Zaten yetkini aldın kanka!`,
              player.id,
              errorColor,
              'bold',
              HaxNotification.MENTION
          );
      }
  }

  */

  /* YETKİ ALMA KOMUTU
  async function masterCommand(player, message) {
      var data = await checkPlayer(authArray[player.id][0]);
      const perm = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
      if (perm.isMaster == true && !masterList.includes(authArray[player.id][0])) {
          room.setPlayerAdmin(player.id, true);
          masterList.push(authArray[player.id][0]);
          room.sendAnnouncement(
              `${player.name} yetkisini aldı!`,
              null,
              announcementColor,
              'bold',
              HaxNotification.CHAT
          );

      } else if (perm.isAdmin == true && adminList.includes(authArray[player.id][0]) == false) {
          room.setPlayerAdmin(player.id, true);
          adminList.push(authArray[player.id][0]);
          room.sendAnnouncement(
              `${player.name} adminliğini aldı!`,
              null,
              announcementColor,
              'bold',
              HaxNotification.CHAT
          );
      } else if (perm.isAdmin == false && perm.isMaster == false) {
          room.sendAnnouncement(
              `${player.name} yetkili değilsin kanka :(`,
              null,
              announcementColor,
              'bold',
              HaxNotification.MENTION
          );
      } else {
          room.sendAnnouncement(
              `Zaten yetkini aldın kanka!`,
              player.id,
              errorColor,
              'bold',
              HaxNotification.MENTION
          );
      }
  }
  */

  /* ADMIN COMMANDS */

  function restartCommand(player, message) {
    instantRestart();
  }

  function restartSwapCommand(player, message) {
    room.stopGame();
    swapButton();
    startTimeout = setTimeout(() => {
      room.startGame();
    }, 10);
  }

  function swapCommand(player, message) {
    if (playSituation == Situation.STOP) {
      swapButton();
      room.sendAnnouncement(
        "✔️ Takımlar değişti !",
        null,
        announcementColor,
        "bold",
        null
      );
    } else {
      room.sendAnnouncement(
        `Takımları değiştirmek için oyunu durdurmalısın.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }

  function kickTeamCommand(player, message) {
    var msgArray = message.split(/ +/);
    var reasonString = `${player.name} tarafından takımca kicklendiniz`;
    if (msgArray.length > 1) {
      reasonString = msgArray.slice(1).join(" ");
    }
    if (["!kickred", "!kickr"].includes(msgArray[0].toLowerCase())) {
      for (let i = 0; i < teamRed.length; i++) {
        setTimeout(() => {
          room.kickPlayer(teamRed[0].id, reasonString, false);
        }, i * 20);
      }
    } else if (["!kickblue", "!kickb"].includes(msgArray[0].toLowerCase())) {
      for (let i = 0; i < teamBlue.length; i++) {
        setTimeout(() => {
          room.kickPlayer(teamBlue[0].id, reasonString, false);
        }, i * 20);
      }
    } else if (["!kickspec", "!kicks"].includes(msgArray[0].toLowerCase())) {
      for (let i = 0; i < teamSpec.length; i++) {
        setTimeout(() => {
          room.kickPlayer(teamSpec[0].id, reasonString, false);
        }, i * 20);
      }
    }
  }

  function stadiumCommand(player, message) {
    var msgArray = message.split(/ +/);
    if (gameState == State.STOP) {
      if (["!v2"].includes(msgArray[0].toLowerCase())) {
        if (JSON.parse(v2Map).name == "v2") {
          room.setDefaultStadium("v2");
        } else {
          room.setCustomStadium(v2Map);
        }
        currentStadium = "v2";
      } else if (["!v4"].includes(msgArray[0].toLowerCase())) {
        if (JSON.parse(v4Map).name == "v4") {
          room.setDefaultStadium("v4");
        } else {
          room.setCustomStadium(v4Map);
        }
        currentStadium = "v4";
      } else if (["!antrenman"].includes(msgArray[0].toLowerCase())) {
        room.setCustomStadium(antrenmanMap);
        currentStadium = "antrenman";
      } else {
        room.sendAnnouncement(
          `Böyle bir harita yok.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    } else {
      room.sendAnnouncement(
        `Bu komutu kullanmak için oyunu durdurmalısın.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }

  function muteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
      if (msgArray[0].length > 0 && msgArray[0][0] == "#") {
        msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
        if (room.getPlayer(parseInt(msgArray[0])) != null) {
          var playerMute = room.getPlayer(parseInt(msgArray[0]));
          var minutesMute = muteDuration;
          if (msgArray.length > 1 && parseInt(msgArray[1]) > 0) {
            minutesMute = parseInt(msgArray[1]);
          }
          if (!playerMute.admin) {
            var muteObj = new MutePlayer(
              playerMute.name,
              playerMute.id,
              authArray[playerMute.id][0]
            );
            muteObj.setDuration(minutesMute);
            room.sendAnnouncement(
              `${playerMute.name}, ${minutesMute} dakika boyunca susturuldu.`,
              null,
              announcementColor,
              "bold",
              null
            );
          } else {
            room.sendAnnouncement(
              `Bir admini susturamazsın.`,
              player.id,
              errorColor,
              "bold",
              HaxNotification.CHAT
            );
          }
        } else {
          room.sendAnnouncement(
            `Böyle bir IDye sahip oyuncu yok. Komutun kullanımı için !yardım sustur yaz.`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
          );
        }
      } else {
        room.sendAnnouncement(
          `Yanlış komut kullanımı. Doğru kullanımı için !yardım sustur yaz.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    } else {
      room.sendAnnouncement(
        `Yanlış bir numara girdin. Komutun kullanımı için !yardım sustur yaz.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }

  function muteAllCommand(player, message) {
    if (allMuted == true) {
      allMuted = false;
      room.sendAnnouncement(
        `Sohbet tekrardan aktif, tekrardan kapanmaması için lütfen kurallara uyalım.`,
        null,
        announcementColor,
        "bold",
        null
      );
    } else {
      allMuted = true
      room.sendAnnouncement(
        `Sohbetin oyunu etkilemesinden dolayı geçici olarak sohbet kapatıldı.`,
        null,
        announcementColor,
        "bold",
        null
      );
    }
  }

  function unmuteCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
      if (msgArray[0].length > 0 && msgArray[0][0] == "#") {
        msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
        if (room.getPlayer(parseInt(msgArray[0])) != null) {
          var playerUnmute = room.getPlayer(parseInt(msgArray[0]));
          if (muteArray.getByPlayerId(playerUnmute.id) != null) {
            var muteObj = muteArray.getByPlayerId(playerUnmute.id);
            muteObj.remove();
            room.sendAnnouncement(
              `${playerUnmute.name} artık konuşabilir!`,
              null,
              announcementColor,
              "bold",
              HaxNotification.CHAT
            );
          } else {
            room.sendAnnouncement(
              `Bu oyuncu susturulmuş değil !`,
              player.id,
              errorColor,
              "bold",
              HaxNotification.CHAT
            );
          }
        } else {
          room.sendAnnouncement(
            `Böyle bir IDye sahip oyuncu yok. Komutun kullanımı için !yardım unmute yaz.`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
          );
        }
      } else if (
        msgArray[0].length > 0 &&
        parseInt(msgArray[0]) > 0 &&
        muteArray.getById(parseInt(msgArray[0])) != null
      ) {
        var playerUnmute = muteArray.getById(parseInt(msgArray[0]));
        playerUnmute.remove();
        room.sendAnnouncement(
          `${playerUnmute.name} artık konuşabilir !`,
          null,
          announcementColor,
          "bold",
          HaxNotification.CHAT
        );
      } else {
        room.sendAnnouncement(
          `Yanlış komut kullanımı. Doğru kullanımı için !yardım unmute yaz.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    } else {
      room.sendAnnouncement(
        `Yanlış bir numara girdin. Komutun kullanımı için !yardım unmute yaz.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }

  function muteListCommand(player, message) {
    if (muteArray.list.length == 0) {
      room.sendAnnouncement(
        "🔇 Mute listesinde kimse yok",
        player.id,
        announcementColor,
        "bold",
        null
      );
      return false;
    }
    var cstm = "🔇 Mute Listesi : ";
    for (let mute of muteArray.list) {
      cstm += mute.name + `[${mute.id}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + ".";
    room.sendAnnouncement(cstm, player.id, announcementColor, "bold", null);
  }

  /* VIP COMMANDS */

  async function rankResetCommand(player, message) {
    //stats = { "gol": 0, "asist": 0, "kk": 0, "galibiyet": 0, "oyunlar": 0, "cs": 0, "puan": 0 }
    var data = await checkStats(authArray[player.id][0]);
    const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== "_id"));
    stats.gol = "0"
    stats.asist = "0"
    stats.kk = "0"
    stats.galibiyet = "0"
    stats.oyunlar = "0"
    stats.cs = "0"
    stats.puan = "1000"
    await updatePlayer(authArray[player.id][0], stats);
    room.sendAnnouncement(
      `${player.name}, başarıyla rankını resetledin!`,
      player.id,
      successColor,
      "bold"
    );
  }

  /* MASTER COMMANDS */

  function clearbansCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length == 0) {
      room.clearBans();
      room.sendAnnouncement(
        "✔️ Banlar temizlendi !",
        null,
        announcementColor,
        "bold",
        null
      );
      banList = [];
    } else if (msgArray.length == 1) {
      if (parseInt(msgArray[0]) > 0) {
        var ID = parseInt(msgArray[0]);
        room.clearBan(ID);
        if (banList.length != banList.filter((p) => p[1] != ID).length) {
          room.sendAnnouncement(
            `✔️ ${banList.filter((p) => p[1] == ID)[0][0]
            } adlı oyuncunun banlı kaldırıldı !`,
            null,
            announcementColor,
            "bold",
            null
          );
        } else {
          room.sendAnnouncement(
            `Girdiğin numaraya sahip bir oyuncu yok. Komutun kullanımı için !yardım bankaldır yaz.`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
          );
        }
        banList = banList.filter((p) => p[1] != ID);
      } else {
        room.sendAnnouncement(
          `Yanlış ID girdin. Komutun kullanımı için !yardım bankaldır yaz.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    } else {
      room.sendAnnouncement(
        `Yanlış numara girdin. Komutun kullanımı için !yardım bankaldır yaz.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }

  function banListCommand(player, message) {
    if (banList.length == 0) {
      room.sendAnnouncement(
        "📢 Ban listesinde kimse yok.",
        player.id,
        announcementColor,
        "bold",
        null
      );
      return false;
    }
    var cstm = "📢 Ban listesi : ";
    for (let ban of banList) {
      cstm += ban[0] + `[${ban[1]}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + ".";
    room.sendAnnouncement(cstm, player.id, announcementColor, "bold", null);
  }
  /*
  async function adminListCommand(player, message) {
    if (adminList.length == 0) {
      room.sendAnnouncement(
        "📢 Admin listesinde kimse yok.",
        player.id,
        announcementColor,
        "bold",
        null
      );
      return false;
    }
    var cstm = "📢 Admin listesi : ";
    for (let i = 0; i < adminList.length; i++) {
      cstm += adminList[i][1] + `[${i}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + ".";
    room.sendAnnouncement(cstm, player.id, announcementColor, "bold", null);
  }

  async function vipListCommand(player, message) {
    if (vipList.length == 0) {
      room.sendAnnouncement(
        "📢 VIP listesinde kimse yok.",
        player.id,
        announcementColor,
        "bold",
        null
      );
      return false;
    }
    var cstm = "📢 VIP listesi : ";
    for (let i = 0; i < vipList.length; i++) {
      cstm += vipList[i][1] + `[${i}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + ".";
    room.sendAnnouncement(cstm, player.id, announcementColor, "bold", null);
  }

  function setAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
      if (msgArray[0].length > 0 && msgArray[0][0] == "#") {
        msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
        if (room.getPlayer(parseInt(msgArray[0])) != null) {
          var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

          if (
            !adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])
          ) {
            if (!masterList.includes(authArray[playerAdmin.id][0])) {
              room.setPlayerAdmin(playerAdmin.id, true);
              adminList.push([authArray[playerAdmin.id][0], playerAdmin.name]);
              room.sendAnnouncement(
                `${playerAdmin.name} artık oda admini !`,
                null,
                announcementColor,
                "bold",
                HaxNotification.CHAT
              );
            } else {
              room.sendAnnouncement(
                `Bu oyuncu zaten yetkili !`,
                player.id,
                errorColor,
                "bold",
                HaxNotification.CHAT
              );
            }
          } else {
            room.sendAnnouncement(
              `Bu oyuncu zaten kalıcı bir admin !`,
              player.id,
              errorColor,
              "bold",
              HaxNotification.CHAT
            );
          }
        } else {
          room.sendAnnouncement(
            `Yanlış ID girdin. Komutun kullanımı için !yardım adminyap yaz.`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
          );
        }
      } else {
        room.sendAnnouncement(
          `Komutu yanlış girdin. Komutun doğru kullanımı için !yardım adminyap yaz.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    } else {
      room.sendAnnouncement(
        `Yanlış bir numara girdin. Komutun kullanımı için !yardım adminyap yaz.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }

  function removeAdminCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
      if (msgArray[0].length > 0 && msgArray[0][0] == "#") {
        msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
        if (room.getPlayer(parseInt(msgArray[0])) != null) {
          var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

          if (
            adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])
          ) {
            room.setPlayerAdmin(playerAdmin.id, false);
            adminList = adminList.filter(
              (a) => a[0] != authArray[playerAdmin.id][0]
            );
            room.sendAnnouncement(
              `${playerAdmin.name} artık bir oda admini değil !`,
              null,
              announcementColor,
              "bold",
              HaxNotification.CHAT
            );
          } else {
            room.sendAnnouncement(
              `Bu oyuncu kalıcı bir admin değil, kaldırmana gerek yok !`,
              player.id,
              errorColor,
              "bold",
              HaxNotification.CHAT
            );
          }
        } else {
          room.sendAnnouncement(
            `Yanlış ID girdin. Komutun kullanımı için !yardım adminkaldır yaz.`,
            player.id,
            errorColor,
            "bold",
            HaxNotification.CHAT
          );
        }
      } else if (
        msgArray[0].length > 0 &&
        parseInt(msgArray[0]) < adminList.length
      ) {
        var index = parseInt(msgArray[0]);
        var playerAdmin = adminList[index];
        if (
          playersAll.findIndex((p) => authArray[p.id][0] == playerAdmin[0]) !=
          -1
        ) {
          // check if there is the removed admin in the room
          var indexRem = playersAll.findIndex(
            (p) => authArray[p.id][0] == playerAdmin[0]
          );
          room.setPlayerAdmin(playersAll[indexRem].id, false);
        }
        adminList.splice(index);
        room.sendAnnouncement(
          `${playerAdmin[1]} artık oda admini değil !`,
          null,
          announcementColor,
          "bold",
          HaxNotification.CHAT
        );
      } else {
        room.sendAnnouncement(
          `Komutu yanlış girdin. Doğru kullanımı için !yardım adminkaldır yaz.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    } else {
      room.sendAnnouncement(
        `Yanlış bir numara girdin. Komutun kullanımı için !yardım adminkaldır yaz.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
    }
  }
  */

  function passwordCommand(player, message) {
    var msgArray = message.split(/ +/).slice(1);
    if (msgArray.length > 0) {
      if (msgArray.length == 1 && msgArray[0] == "") {
        roomPassword = "";
        room.setPassword(null);
        room.sendAnnouncement(
          `Oda şifresi kaldırıldı.`,
          player.id,
          announcementColor,
          "bold",
          HaxNotification.CHAT
        );
      }
      roomPassword = msgArray.join(" ");
      room.setPassword(roomPassword);
      room.sendAnnouncement(
        `Odanın şifresi artık: ${roomPassword} !`,
        player.id,
        announcementColor,
        "bold",
        HaxNotification.CHAT
      );
    } else {
      if (roomPassword != "") {
        roomPassword = "";
        room.setPassword(null);
        room.sendAnnouncement(
          `Odanın şifresi kaldırıldı.`,
          player.id,
          announcementColor,
          "bold",
          HaxNotification.CHAT
        );
      } else {
        room.sendAnnouncement(
          `Odanın şu an bir şifresi yok. !yardım odaşifresi yazarak komut hakkında bilgi sahibi olabilirsin.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    }
  }

  function admincagirCommand(player, message) {
    const [, ...reason] = message.split(/ +/gim);
    if (reason != "" && adminCagirTimeout == false && muteArray.getByAuth(authArray[player.id][0]) == null) {
      var admincagirChannel = 'https://discord.com/api/webhooks/984063298188247050/VLUBdcpjrCGqhjfWM7WiIqJfuUTK5hIJBc0AhWo7nYpehX9v1e_irlKttuiXVRrECJY6'

      room.sendAnnouncement(`${player.name}, başarıyla admin çağırdın. Unutma bu komutu kötüye kullanırsan banlanırsın!`, player.id, 0x2C89AB, "bold", 2);
      var admincagirText = `\`\`\`ini\n[${player.name}#${player.id}, ${reason} sebebiyle admin çağırdı]\`\`\`\n||<@&839206422461546557>||`;

      fetch(admincagirChannel, {
        method: "POST",
        body: JSON.stringify({
          content: admincagirText,
          username: "Admin Çağırma Botu",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res);
      adminCagirTimeout = true
      setTimeout(() => { adminCagirTimeout = false; }, 90_000);
    } else if (reason == "" && adminCagirTimeout == false && muteArray.getByAuth(authArray[player.id][0]) == null) {
      room.sendAnnouncement(`${player.name}, admin çağırabilmek için yanına sebebini de yazmalısın.`, player.id, 0x2C89AB, "bold", 2);
    } else if (adminCagirTimeout == true && muteArray.getByAuth(authArray[player.id][0]) == null) {
      room.sendAnnouncement(`${player.name}, kısa bir süre önce zaten admin çağırıldı.`, player.id, 0x2C89AB, "bold", 2);
    }
    return false;
  }

  function avatarListCommand(player, message) {
    setTimeout(() => {
      room.sendAnnouncement(`Seviye 9 👑 (1250 puan) | Seviye 8 🏆 (1200 puan) | Seviye 7 💎 (1150 puan)`, player.id,
        welcomeColor,
        "bold",
        HaxNotification.CHAT);
    }, 500);
    setTimeout(() => {
      room.sendAnnouncement(`Seviye 6 ⚡ (1100 puan) | Seviye 5 💧 (1050 puan) | Seviye 4 🔥 (1000 puan)`, player.id,
        welcomeColor,
        "bold",
        HaxNotification.CHAT);
    }, 1_500);
    setTimeout(() => {
      room.sendAnnouncement(`Seviye 3 🌵 (950 puan) | Seviye 2 👍 (850 puan) | Seviye 1 👎 (750 puan ve altı)`, player.id,
        welcomeColor,
        "bold",
        HaxNotification.CHAT);
    }, 2_500);
    setTimeout(() => {
      room.sendAnnouncement(`1000 puan ile başlarsınız ve oynadıkça puan kazanıp kaybedersiniz, puanını görmek için !ben yazabilirsin.`, player.id,
        welcomeColor,
        "bold",
        HaxNotification.CHAT);
    }, 3_500);
  }

  /* GAME FUNCTIONS */

  function checkTime() {
    const scores = room.getScores()
    if (game != undefined) game.scores = scores;
    if (
      Math.abs(scores.time - scores.timeLimit) <= 0.01 &&
      scores.timeLimit != 0 &&
      playSituation == Situation.PLAY
    ) {
      if (scores.red != scores.blue) {
        if (!checkTimeVariable) {
          checkTimeVariable = true;
          setTimeout(() => {
            checkTimeVariable = false;
          }, 3000);
          scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
          stopTimeout = setTimeout(() => {
            room.stopGame();
          }, 2000);
        }
        return;
      }
      if (drawTimeLimit != 0) {
        goldenGoal = true;
        room.sendAnnouncement(
          "⚽ Altın gol ! İlk golü atan kazanır!",
          null,
          announcementColor,
          "bold",
          HaxNotification.CHAT
        );
      }
    }
    if (
      Math.abs(scores.time - drawTimeLimit * 60 - scores.timeLimit) <= 0.01 &&
      scores.timeLimit != 0
    ) {
      if (!checkTimeVariable) {
        checkTimeVariable = true;
        setTimeout(() => {
          checkTimeVariable = false;
        }, 10);
        endGame(Team.SPECTATORS);
        room.stopGame();
        goldenGoal = false;
      }
    }
  }

  function instantRestart() {
    room.stopGame();
    startTimeout = setTimeout(() => {
      room.startGame();
    }, 10);
  }

  function resumeGame() {
    startTimeout = setTimeout(() => {
      room.startGame();
    }, 1000);
    setTimeout(() => {
      room.pauseGame(false);
    }, 500);
  }

  async function endGame(winner) {
    if (players.length >= 2 * teamSize - 1) activateChooseMode();
    const scores = room.getScores();
    game.scores = scores;
    lastWinner = winner;
    endGameVariable = true;
    if (winner == Team.RED) {
      streak++;
      room.sendAnnouncement(
        `✨ Kırmız takım kazandı ${scores.red} - ${scores.blue} ! Mevcut seri: ${streak}`,
        null,
        redColor,
        "bold",
        HaxNotification.CHAT
      );
    } else if (winner == Team.BLUE) {
      streak = 1;
      room.sendAnnouncement(
        `✨ Mavi takım kazandı ${scores.blue} - ${scores.red} ! Mevcut seri: ${streak}`,
        null,
        blueColor,
        "bold",
        HaxNotification.CHAT
      );
    } else {
      streak = 0;
      room.sendAnnouncement(
        "💤 Oyun sıkıcı olmaya başladı.. Bu duruma el atıyorum!",
        null,
        announcementColor,
        "bold",
        HaxNotification.CHAT
      );
    }
    let possessionRedPct =
      (possession[0] / (possession[0] + possession[1])) * 100;
    let possessionBluePct = 100 - possessionRedPct;
    let actionRedPct =
      (actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1])) * 100;
    let possessionString = `🔴 ${possessionRedPct.toPrecision(2)}% - ${possessionBluePct.toPrecision(2)}% 🔵`;
    let actionBluePct = 100 - actionRedPct;
    let actionString = `🔴 ${actionRedPct.toPrecision(2)}% - ${actionBluePct.toPrecision(2)}% 🔵`;
    let CSString = getCSString(scores);
    room.sendAnnouncement(
      `📊 Topla oynama: ${possessionString}\n` +
      `📊 Topun oynandığı bölgeler: ${actionString}\n` +
      `${CSString}`,
      null,
      announcementColor,
      "bold",
      HaxNotification.NONE
    );
    await updateStats();
  }

  /* CHOOSING FUNCTIONS */

  function activateChooseMode() {
    chooseMode = true;
    slowMode = chooseModeSlowMode;
    room.sendAnnouncement(
      `🐢 Oyuncu seçmeniz için bekleme süresi ${chooseModeSlowMode} saniyeye çıkarıldı.`,
      null,
      announcementColor,
      "bold",
      HaxNotification.CHAT
    );
  }

  function deactivateChooseMode() {
    chooseMode = false;
    clearTimeout(timeOutCap);
    if (slowMode != defaultSlowMode) {
      slowMode = defaultSlowMode;
      room.sendAnnouncement(
        `🐢 Bekleme süresi tekrar ${defaultSlowMode} saniyeye düşürüldü.`,
        null,
        announcementColor,
        "bold",
        HaxNotification.CHAT
      );
    }
    redCaptainChoice = "";
    blueCaptainChoice = "";
  }

  function getSpecList(player) {
    if (player == null) return null;
    var cstm = "Oyuncular : ";
    for (let i = 0; i < teamSpec.length; i++) {
      cstm += teamSpec[i].name + `[${i + 1}], `;
    }
    cstm = cstm.substring(0, cstm.length - 2) + ".";
    room.sendAnnouncement(
      cstm,
      player.id,
      infoColor,
      "bold",
      HaxNotification.CHAT
    );
  }

  function choosePlayer() {
    clearTimeout(timeOutCap);
    let captain;
    if (teamRed.length <= teamBlue.length && teamRed.length != 0) {
      captain = teamRed[0];
    } else if (teamBlue.length < teamRed.length && teamBlue.length != 0) {
      captain = teamBlue[0];
    }
    if (captain != null) {
      room.sendAnnouncement(
        "Oyuncu seçmek için aşağıda verilen oyuncular yanındaki numaralı kullanabilirsin yada 'üst', 'rastgele' or 'alt'.",
        captain.id,
        infoColor,
        "bold",
        HaxNotification.MENTION
      );
      timeOutCap = setTimeout(
        (player) => {
          room.sendAnnouncement(
            `${player.name}, acele et ! Seçmek için sadece ${Number.parseInt(
              String(chooseTime / 2)
            )} saniyen kaldı !`,
            player.id,
            warningColor,
            "bold",
            HaxNotification.MENTION
          );
          timeOutCap = setTimeout(
            (player) => {
              room.kickPlayer(
                player.id,
                "Verilen zamanda oyuncu seçmedin !",
                false
              );
            },
            chooseTime * 500,
            captain
          );
        },
        chooseTime * 1000,
        captain
      );
    }
    if (teamRed.length != 0 && teamBlue.length != 0) {
      getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
  }

  function chooseModeFunction(player, message) {
    var msgArray = message.split(/ +/);
    if (player.id == teamRed[0].id || player.id == teamBlue[0].id) {
      if (teamRed.length <= teamBlue.length && player.id == teamRed[0].id) {
        if (["üst", "oto"].includes(msgArray[0].toLowerCase())) {
          room.setPlayerTeam(teamSpec[0].id, Team.RED);
          redCaptainChoice = "üst";
          clearTimeout(timeOutCap);
          room.sendAnnouncement(
            `${player.name}, üstten bir oyuncu seçti !`,
            null,
            announcementColor,
            "bold",
            HaxNotification.CHAT
          );
        } else if (["rastgele", "rast"].includes(msgArray[0].toLowerCase())) {
          var r = getRandomInt(teamSpec.length);
          room.setPlayerTeam(teamSpec[r].id, Team.RED);
          redCaptainChoice = "rastgele";
          clearTimeout(timeOutCap);
          room.sendAnnouncement(
            `${player.name}, rastgele oyuncu seçmeyi tercih etti !`,
            null,
            announcementColor,
            "bold",
            HaxNotification.CHAT
          );
        } else if (["alt", "aşağı"].includes(msgArray[0].toLowerCase())) {
          room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
          redCaptainChoice = "alt";
          clearTimeout(timeOutCap);
          room.sendAnnouncement(
            `${player.name}, alttan oyuncu seçmeyi tercih etti !`,
            null,
            announcementColor,
            "bold",
            HaxNotification.CHAT
          );
        } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
          if (
            Number.parseInt(msgArray[0]) > teamSpec.length ||
            Number.parseInt(msgArray[0]) < 1
          ) {
            room.sendAnnouncement(
              `Girdiğin numara geçersiz !`,
              player.id,
              errorColor,
              "bold",
              HaxNotification.CHAT
            );
          } else {
            room.setPlayerTeam(
              teamSpec[Number.parseInt(msgArray[0]) - 1].id,
              Team.RED
            );
            room.sendAnnouncement(
              `${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name
              } adlı oyuncuyu seçti!`,
              null,
              announcementColor,
              "bold",
              HaxNotification.CHAT
            );
          }
        } else return false;
        return true;
      }
      if (teamRed.length > teamBlue.length && player.id == teamBlue[0].id) {
        if (["üst", "oto"].includes(msgArray[0].toLowerCase())) {
          room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
          blueCaptainChoice = "üst";
          clearTimeout(timeOutCap);
          room.sendAnnouncement(
            `${player.name}, üstten bir oyuncu seçti !`,
            null,
            announcementColor,
            "bold",
            HaxNotification.CHAT
          );
        } else if (["rastgele", "rast"].includes(msgArray[0].toLowerCase())) {
          room.setPlayerTeam(
            teamSpec[getRandomInt(teamSpec.length)].id,
            Team.BLUE
          );
          blueCaptainChoice = "rastgele";
          clearTimeout(timeOutCap);
          room.sendAnnouncement(
            `${player.name}, rastgele oyuncu seçmeyi tercih etti !`,
            null,
            announcementColor,
            "bold",
            HaxNotification.CHAT
          );
        } else if (["alt"].includes(msgArray[0].toLowerCase())) {
          room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
          blueCaptainChoice = "alt";
          clearTimeout(timeOutCap);
          room.sendAnnouncement(
            `${player.name}, alttan oyuncu seçmeyi tercih etti  !`,
            null,
            announcementColor,
            "bold",
            HaxNotification.CHAT
          );
        } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
          if (
            Number.parseInt(msgArray[0]) > teamSpec.length ||
            Number.parseInt(msgArray[0]) < 1
          ) {
            room.sendAnnouncement(
              `Girdiğin numara geçersiz!`,
              player.id,
              errorColor,
              "bold",
              HaxNotification.CHAT
            );
          } else {
            room.setPlayerTeam(
              teamSpec[Number.parseInt(msgArray[0]) - 1].id,
              Team.BLUE
            );
            room.sendAnnouncement(
              `${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name
              } adlı oyuncuyu seçti!`,
              null,
              announcementColor,
              "bold",
              HaxNotification.CHAT
            );
          }
        } else return false;
        return true;
      }
    }
  }

  function checkCaptainLeave(player) {
    if (
      (teamRed.findIndex((red) => red.id == player.id) == 0 &&
        chooseMode &&
        teamRed.length <= teamBlue.length) ||
      (teamBlue.findIndex((blue) => blue.id == player.id) == 0 &&
        chooseMode &&
        teamBlue.length < teamRed.length)
    ) {
      choosePlayer();
      capLeft = true;
      setTimeout(() => {
        capLeft = false;
      }, 10);
    }
  }

  function slowModeFunction(player, message) {
    if (!player.admin) {
      if (!SMSet.has(player.id)) {
        SMSet.add(player.id);
        setTimeout(
          (number) => {
            SMSet.delete(number);
          },
          slowMode * 1000,
          player.id
        );
      } else {
        return true;
      }
    }
    return false;
  }

  /* PLAYER FUNCTIONS */

  function updateTeams() {
    playersAll = room.getPlayerList();
    players = playersAll.filter((p) => !AFKSet.has(p.id));
    teamRed = players.filter((p) => p.team == Team.RED);
    teamBlue = players.filter((p) => p.team == Team.BLUE);
    teamSpec = players.filter((p) => p.team == Team.SPECTATORS);
  }

  function getRole(player) {
    /* PLAYER: 0,
    ADMIN_TEMP: 1,
    VIP: 2,
    ADMIN_PERM: 3,
    MASTER: 4
    */
    if (authArray[player.id][4] == false)
      return (
        !!authArray[player.id][6] * 3 +
        !!authArray[player.id][5] * 2 +
        player.admin * 1
      );
    else if (authArray[player.id][4] == true)
      return (!!authArray[player.id][4] * 2)
  }

  function ghostKickHandle(oldP, newP) {
    var teamArrayId = getTeamArray(oldP.team).map((p) => p.id);
    teamArrayId.splice(
      teamArrayId.findIndex((id) => id == oldP.id),
      1,
      newP.id
    );

    room.kickPlayer(oldP.id, "Ghost kick", false);
    room.setPlayerTeam(newP.id, oldP.team);
    room.setPlayerAdmin(newP.id, oldP.admin);
    room.reorderPlayers(teamArrayId, true);

    if (oldP.team != Team.SPECTATORS && playSituation != Situation.STOP) {
      var discProp = room.getPlayerDiscProperties(oldP.id);
      room.setPlayerDiscProperties(newP.id, discProp);
    }
  }

  /* ACTIVITY FUNCTIONS */

  function handleActivityPlayer(player) {
    let pComp = getPlayerComp(player);
    if (pComp != null) {
      pComp.inactivityTicks++;
      if (pComp.inactivityTicks == 60 * ((2 / 3) * afkLimit)) {
        room.sendAnnouncement(
          `⛔ ${player.name}, eğer hareket etmezsen ${Math.floor(
            afkLimit / 3
          )} saniye sonra atılacaksın !`,
          player.id,
          warningColor,
          "bold",
          HaxNotification.MENTION
        );
        return;
      }
      if (pComp.inactivityTicks >= 60 * afkLimit) {
        pComp.inactivityTicks = 0;
        if (game.scores.time <= afkLimit - 0.5) {
          setTimeout(() => {
            !chooseMode ? instantRestart() : room.stopGame();
          }, 10);
        }
        room.kickPlayer(player.id, "AFK", false);
      }
    }
  }

  function handleActivityPlayerTeamChange(changedPlayer) {
    if (changedPlayer.team == Team.SPECTATORS) {
      let pComp = getPlayerComp(changedPlayer);
      if (pComp != null) pComp.inactivityTicks = 0;
    }
  }

  function handleActivityStop() {
    for (let player of players) {
      let pComp = getPlayerComp(player);
      if (pComp != null) pComp.inactivityTicks = 0;
    }
  }

  function handleActivity() {
    if (gameState === State.PLAY && players.length > 1) {
      for (let player of teamRed) {
        handleActivityPlayer(player);
      }
      for (let player of teamBlue) {
        handleActivityPlayer(player);
      }
    }
  }

  /* LINEUP FUNCTIONS */

  function getStartingLineups() {
    var compositions = [[], []];
    for (let player of teamRed) {
      compositions[0].push(
        new PlayerComposition(player, authArray[player.id][0], [0], [])
      );
    }
    for (let player of teamBlue) {
      compositions[1].push(
        new PlayerComposition(player, authArray[player.id][0], [0], [])
      );
    }
    return compositions;
  }

  function handleLineupChangeTeamChange(changedPlayer) {
    if (gameState != State.STOP) {
      var playerLineup;
      if (changedPlayer.team == Team.RED) {
        // player gets in red team
        var redLineupAuth = game.playerComp[0].map((p) => p.auth);
        var ind = redLineupAuth.findIndex(
          (auth) => auth == authArray[changedPlayer.id][0]
        );
        if (ind != -1) {
          // Player goes back in
          playerLineup = game.playerComp[0][ind];
          if (playerLineup.timeExit.includes(game.scores.time)) {
            // gets subbed off then in at the exact same time -> no sub
            playerLineup.timeExit = playerLineup.timeExit.filter(
              (t) => t != game.scores.time
            );
          } else {
            playerLineup.timeEntry.push(game.scores.time);
          }
        } else {
          playerLineup = new PlayerComposition(
            changedPlayer,
            authArray[changedPlayer.id][0],
            [game.scores.time],
            []
          );
          game.playerComp[0].push(playerLineup);
        }
      } else if (changedPlayer.team == Team.BLUE) {
        // player gets in blue team
        var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
        var ind = blueLineupAuth.findIndex(
          (auth) => auth == authArray[changedPlayer.id][0]
        );
        if (ind != -1) {
          // Player goes back in
          playerLineup = game.playerComp[1][ind];
          if (playerLineup.timeExit.includes(game.scores.time)) {
            // gets subbed off then in at the exact same time -> no sub
            playerLineup.timeExit = playerLineup.timeExit.filter(
              (t) => t != game.scores.time
            );
          } else {
            playerLineup.timeEntry.push(game.scores.time);
          }
        } else {
          playerLineup = new PlayerComposition(
            changedPlayer,
            authArray[changedPlayer.id][0],
            [game.scores.time],
            []
          );
          game.playerComp[1].push(playerLineup);
        }
      }
      if (teamRed.some((r) => r.id == changedPlayer.id)) {
        // player leaves red team
        var redLineupAuth = game.playerComp[0].map((p) => p.auth);
        var ind = redLineupAuth.findIndex(
          (auth) => auth == authArray[changedPlayer.id][0]
        );
        playerLineup = game.playerComp[0][ind];
        if (playerLineup.timeEntry.includes(game.scores.time)) {
          // gets subbed off then in at the exact same time -> no sub
          if (game.scores.time == 0) {
            game.playerComp[0].splice(ind, 1);
          } else {
            playerLineup.timeEntry = playerLineup.timeEntry.filter(
              (t) => t != game.scores.time
            );
          }
        } else {
          playerLineup.timeExit.push(game.scores.time);
        }
      } else if (teamBlue.some((r) => r.id == changedPlayer.id)) {
        // player leaves blue team
        var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
        var ind = blueLineupAuth.findIndex(
          (auth) => auth == authArray[changedPlayer.id][0]
        );
        playerLineup = game.playerComp[1][ind];
        if (playerLineup.timeEntry.includes(game.scores.time)) {
          // gets subbed off then in at the exact same time -> no sub
          if (game.scores.time == 0) {
            game.playerComp[1].splice(ind, 1);
          } else {
            playerLineup.timeEntry = playerLineup.timeEntry.filter(
              (t) => t != game.scores.time
            );
          }
        } else {
          playerLineup.timeExit.push(game.scores.time);
        }
      }
    }
  }

  function handleLineupChangeLeave(player) {
    if (playSituation != Situation.STOP) {
      if (player.team == Team.RED) {
        // player gets in red team
        var redLineupAuth = game.playerComp[0].map((p) => p.auth);
        var ind = redLineupAuth.findIndex(
          (auth) => auth == authArray[player.id][0]
        );
        var playerLineup = game.playerComp[0][ind];
        if (playerLineup.timeEntry.includes(game.scores.time)) {
          // gets subbed off then in at the exact same time -> no sub
          if (game.scores.time == 0) {
            game.playerComp[0].splice(ind, 1);
          } else {
            playerLineup.timeEntry = playerLineup.timeEntry.filter(
              (t) => t != game.scores.time
            );
          }
        } else {
          playerLineup.timeExit.push(game.scores.time);
        }
      } else if (player.team == Team.BLUE) {
        // player gets in blue team
        var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
        var ind = blueLineupAuth.findIndex(
          (auth) => auth == authArray[player.id][0]
        );
        var playerLineup = game.playerComp[1][ind];
        if (playerLineup.timeEntry.includes(game.scores.time)) {
          // gets subbed off then in at the exact same time -> no sub
          if (game.scores.time == 0) {
            game.playerComp[1].splice(ind, 1);
          } else {
            playerLineup.timeEntry = playerLineup.timeEntry.filter(
              (t) => t != game.scores.time
            );
          }
        } else {
          playerLineup.timeExit.push(game.scores.time);
        }
      }
    }
  }

  /* TEAM BALANCE FUNCTIONS */

  function balanceTeams() {
    if (!chooseMode) {
      if (players.length == 0) {
        room.stopGame();
        room.setScoreLimit(scoreLimit);
        room.setTimeLimit(timeLimit);
      } else if (players.length == 1 && teamRed.length == 0) {
        instantRestart();
        setTimeout(() => {
          stadiumCommand(emptyPlayer, `!antrenman`);
        }, 5);
        room.setPlayerTeam(players[0].id, Team.RED);
      } else if (
        Math.abs(teamRed.length - teamBlue.length) == teamSpec.length &&
        teamSpec.length > 0
      ) {
        const n = Math.abs(teamRed.length - teamBlue.length);
        if (players.length == 2) {
          instantRestart();
          setTimeout(() => {
            stadiumCommand(emptyPlayer, `!v2`);
          }, 5);
        }
        if (teamRed.length > teamBlue.length) {
          for (var i = 0; i < n; i++) {
            room.setPlayerTeam(teamSpec[i].id, Team.BLUE);
          }
        } else {
          for (var i = 0; i < n; i++) {
            room.setPlayerTeam(teamSpec[i].id, Team.RED);
          }
        }
      } else if (Math.abs(teamRed.length - teamBlue.length) > teamSpec.length) {
        const n = Math.abs(teamRed.length - teamBlue.length);
        if (players.length == 1) {
          instantRestart();
          setTimeout(() => {
            stadiumCommand(emptyPlayer, `!antrenman`);
          }, 5);
          room.setPlayerTeam(players[0].id, Team.RED);
          return;
        } else if (teamSize > 2 && players.length == 5) {
          instantRestart();
          setTimeout(() => {
            stadiumCommand(emptyPlayer, `!v2`);
          }, 5);
        }
        if (players.length == teamSize * 2 - 1) {
          teamRedStats = [];
          teamBlueStats = [];
        }
        if (teamRed.length > teamBlue.length) {
          for (var i = 0; i < n; i++) {
            room.setPlayerTeam(
              teamRed[teamRed.length - 1 - i].id,
              Team.SPECTATORS
            );
          }
        } else {
          for (var i = 0; i < n; i++) {
            room.setPlayerTeam(
              teamBlue[teamBlue.length - 1 - i].id,
              Team.SPECTATORS
            );
          }
        }
      } else if (
        Math.abs(teamRed.length - teamBlue.length) < teamSpec.length &&
        teamRed.length != teamBlue.length
      ) {
        room.pauseGame(true);
        activateChooseMode();
        choosePlayer();
      } else if (
        teamSpec.length >= 2 &&
        teamRed.length == teamBlue.length &&
        teamRed.length < teamSize
      ) {
        if (teamRed.length == 2) {
          instantRestart();
          setTimeout(() => {
            stadiumCommand(emptyPlayer, `!v4`);
          }, 5);
        }
        topButton();
      }
    }
  }

  function handlePlayersJoin() {
    if (chooseMode) {
      if (teamSize > 2 && players.length == 6) {
        setTimeout(() => {
          stadiumCommand(emptyPlayer, `!v4`);
        }, 5);
      }
      getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
    }
    balanceTeams();
  }

  function handlePlayersLeave() {
    if (gameState != State.STOP) {
      var scores = room.getScores();
      if (
        players.length >= 2 * teamSize &&
        scores.time >= (5 / 6) * game.scores.timeLimit &&
        teamRed.length != teamBlue.length
      ) {
        var rageQuitCheck = false;
        if (teamRed.length < teamBlue.length) {
          if (scores.blue - scores.red == 2) {
            endGame(Team.BLUE);
            rageQuitCheck = true;
          }
        } else {
          if (scores.red - scores.blue == 2) {
            endGame(Team.RED);
            rageQuitCheck = true;
          }
        }
        if (rageQuitCheck) {
          room.sendAnnouncement(
            "Oyundan kaçma tespit edildi, oyun böyle sonuçlanacak.",
            null,
            infoColor,
            "bold",
            HaxNotification.MENTION
          );
          stopTimeout = setTimeout(() => {
            room.stopGame();
          }, 100);
          return;
        }
      }
    }
    if (chooseMode) {
      if (teamSize > 2 && players.length == 5) {
        setTimeout(() => {
          stadiumCommand(emptyPlayer, `!v2`);
        }, 5);
      }
      if (teamRed.length == 0 || teamBlue.length == 0) {
        room.setPlayerTeam(
          teamSpec[0].id,
          teamRed.length == 0 ? Team.RED : Team.BLUE
        );
        return;
      }
      if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
        deactivateChooseMode();
        resumeGame();
        var b = teamSpec.length;
        if (teamRed.length > teamBlue.length) {
          for (var i = 0; i < b; i++) {
            clearTimeout(insertingTimeout);
            insertingPlayers = true;
            setTimeout(() => {
              room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
            }, 5 * i);
          }
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 5 * b);
        } else {
          for (var i = 0; i < b; i++) {
            clearTimeout(insertingTimeout);
            insertingPlayers = true;
            setTimeout(() => {
              room.setPlayerTeam(teamSpec[0].id, Team.RED);
            }, 5 * i);
          }
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 5 * b);
        }
        return;
      }
      if (streak == 0 && gameState == State.STOP) {
        if (Math.abs(teamRed.length - teamBlue.length) == 2) {
          var teamIn = teamRed.length > teamBlue.length ? teamRed : teamBlue;
          room.setPlayerTeam(teamIn[teamIn.length - 1].id, Team.SPECTATORS);
        }
      }
      if (teamRed.length == teamBlue.length && teamSpec.length < 2) {
        deactivateChooseMode();
        resumeGame();
        return;
      }

      if (capLeft) {
        choosePlayer();
      } else {
        getSpecList(
          teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]
        );
      }
    }
    balanceTeams();
  }

  function handlePlayersTeamChange(byPlayer) {
    if (chooseMode && !removingPlayers && byPlayer == null) {
      if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
        deactivateChooseMode();
        resumeGame();
        var b = teamSpec.length;
        if (teamRed.length > teamBlue.length) {
          for (var i = 0; i < b; i++) {
            clearTimeout(insertingTimeout);
            insertingPlayers = true;
            setTimeout(() => {
              room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
            }, 5 * i);
          }
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 5 * b);
        } else {
          for (var i = 0; i < b; i++) {
            clearTimeout(insertingTimeout);
            insertingPlayers = true;
            setTimeout(() => {
              room.setPlayerTeam(teamSpec[0].id, Team.RED);
            }, 5 * i);
          }
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 5 * b);
        }
        return;
      } else if (
        (teamRed.length == teamSize && teamBlue.length == teamSize) ||
        (teamRed.length == teamBlue.length && teamSpec.length < 2)
      ) {
        deactivateChooseMode();
        resumeGame();
      } else if (teamRed.length <= teamBlue.length && redCaptainChoice != "") {
        if (redCaptainChoice == "top") {
          room.setPlayerTeam(teamSpec[0].id, Team.RED);
        } else if (redCaptainChoice == "random") {
          var r = getRandomInt(teamSpec.length);
          room.setPlayerTeam(teamSpec[r].id, Team.RED);
        } else {
          room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
        }
        return;
      } else if (teamBlue.length < teamRed.length && blueCaptainChoice != "") {
        if (blueCaptainChoice == "top") {
          room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
        } else if (blueCaptainChoice == "random") {
          var r = getRandomInt(teamSpec.length);
          room.setPlayerTeam(teamSpec[r].id, Team.BLUE);
        } else {
          room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
        }
        return;
      } else {
        choosePlayer();
      }
    }
  }

  function handlePlayersStop(byPlayer) {
    if (byPlayer == null && endGameVariable) {
      if (chooseMode) {
        if (players.length == 2 * teamSize) {
          chooseMode = false;
          resetButton();
          for (var i = 0; i < teamSize; i++) {
            clearTimeout(insertingTimeout);
            insertingPlayers = true;
            setTimeout(() => {
              randomButton();
            }, 200 * i);
          }
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 200 * teamSize);
          startTimeout = setTimeout(() => {
            room.startGame();
          }, 2000);
        } else {
          if (lastWinner == Team.RED) {
            blueToSpecButton();
          } else if (lastWinner == Team.BLUE) {
            redToSpecButton();
            setTimeout(() => {
              swapButton();
            }, 10);
          } else {
            resetButton();
          }
          clearTimeout(insertingTimeout);
          insertingPlayers = true;
          setTimeout(() => {
            topButton();
          }, 300);
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 300);
        }
      } else {
        if (players.length == 2) {
          if (lastWinner == Team.BLUE) {
            swapButton();
          }
          startTimeout = setTimeout(() => {
            room.startGame();
          }, 2000);
        } else if (players.length == 3 || players.length >= 2 * teamSize + 1) {
          if (lastWinner == Team.RED) {
            blueToSpecButton();
          } else {
            redToSpecButton();
            setTimeout(() => {
              swapButton();
            }, 5);
          }
          clearTimeout(insertingTimeout);
          insertingPlayers = true;
          setTimeout(() => {
            topButton();
          }, 200);
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 300);
          startTimeout = setTimeout(() => {
            room.startGame();
          }, 2000);
        } else if (players.length == 4) {
          resetButton();
          clearTimeout(insertingTimeout);
          insertingPlayers = true;
          setTimeout(() => {
            randomButton();
            setTimeout(() => {
              randomButton();
            }, 500);
          }, 500);
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 2000);
          startTimeout = setTimeout(() => {
            room.startGame();
          }, 2000);
        } else if (players.length == 5 || players.length >= 2 * teamSize + 1) {
          if (lastWinner == Team.RED) {
            blueToSpecButton();
          } else {
            redToSpecButton();
            setTimeout(() => {
              swapButton();
            }, 5);
          }
          clearTimeout(insertingTimeout);
          insertingPlayers = true;
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 200);
          setTimeout(() => {
            topButton();
          }, 200);
          activateChooseMode();
        } else if (players.length == 6) {
          resetButton();
          clearTimeout(insertingTimeout);
          insertingPlayers = true;
          insertingTimeout = setTimeout(() => {
            insertingPlayers = false;
          }, 1500);
          setTimeout(() => {
            randomButton();
            setTimeout(() => {
              randomButton();
              setTimeout(() => {
                randomButton();
              }, 500);
            }, 500);
          }, 500);
          startTimeout = setTimeout(() => {
            room.startGame();
          }, 2000);
        }
      }
    }
  }

  /* STATS FUNCTIONS */

  /* GK FUNCTIONS */

  function handleGKTeam(team) {
    if (team == Team.SPECTATORS) {
      return null;
    }
    let teamArray = team == Team.RED ? teamRed : teamBlue;
    let playerGK = teamArray.reduce((prev, current) => {
      if (team == Team.RED) {
        return (prev?.position.x < current.position.x) ? prev : current
      } else {
        return (prev?.position.x > current.position.x) ? prev : current
      }
    }, null);
    let playerCompGK = getPlayerComp(playerGK);
    return playerCompGK;
  }

  function handleGK() {
    let redGK = handleGKTeam(Team.RED);
    if (redGK != null) {
      redGK.GKTicks++;
    }
    let blueGK = handleGKTeam(Team.BLUE);
    if (blueGK != null) {
      blueGK.GKTicks++;
    }
  }

  function getGK(team) {
    if (team == Team.SPECTATORS) {
      return null;
    }
    let teamArray = team == Team.RED ? game.playerComp[0] : game.playerComp[1];
    let playerGK = teamArray.reduce((prev, current) => {
      return (prev?.GKTicks > current.GKTicks) ? prev : current
    }, null);
    return playerGK;
  }

  function getCS(scores) {
    let playersNameCS = [];
    let redGK = getGK(Team.RED);
    let blueGK = getGK(Team.BLUE);
    if (redGK != null && scores.blue == 0) {
      playersNameCS.push(redGK.player.name);
    }
    if (blueGK != null && scores.red == 0) {
      playersNameCS.push(blueGK.player.name);
    }
    return playersNameCS;
  }

  function getCSString(scores) {
    let playersCS = getCS(scores);
    if (playersCS.length == 0) {
      return `🥅 İki takımda kalesini gole kapatamadı..`;
    } else if (playersCS.length == 1) {
      return `🥅 ${playersCS[0]} gol yemedi!`;
    } else if (playersCS.length == 2) {
      return `🥅 ${playersCS[0]} ve ${playersCS[1]} gol yemedi!`;
    } else {
      return "";
    }
  }

  /* GLOBAL STATS FUNCTIONS */

  function getLastTouchOfTheBall() {
    const ballPosition = room.getBallPosition();
    updateTeams();
    let playerArray = [];
    for (let player of players) {
      if (player.position != null) {
        var distanceToBall = pointDistance(player.position, ballPosition);
        if (distanceToBall < triggerDistance) {
          if (playSituation == Situation.KICKOFF)
            playSituation = Situation.PLAY;
          playerArray.push([player, distanceToBall]);
        }
      }
    }
    if (playerArray.length != 0) {
      let playerTouch = playerArray.sort((a, b) => a[1] - b[1])[0][0];
      if (
        lastTeamTouched == playerTouch.team ||
        lastTeamTouched == Team.SPECTATORS
      ) {
        if (
          lastTouches[0] == null ||
          (lastTouches[0] != null && lastTouches[0].player.id != playerTouch.id)
        ) {
          game.touchArray.push(
            new BallTouch(
              playerTouch,
              game.scores.time,
              getGoalGame(),
              ballPosition
            )
          );
          lastTouches[0] = checkGoalKickTouch(
            game.touchArray,
            game.touchArray.length - 1,
            getGoalGame()
          );
          lastTouches[1] = checkGoalKickTouch(
            game.touchArray,
            game.touchArray.length - 2,
            getGoalGame()
          );
        }
      }
      lastTeamTouched = playerTouch.team;
    }
  }

  function getBallSpeed() {
    var ballProp = room.getDiscProperties(0);
    return (
      Math.sqrt(ballProp.xspeed ** 2 + ballProp.yspeed ** 2) * speedCoefficient
    );
  }

  function getGameStats() {
    if (playSituation == Situation.PLAY && gameState == State.PLAY) {
      lastTeamTouched == Team.RED ? possession[0]++ : possession[1]++;
      var ballPosition = room.getBallPosition();
      ballPosition.x < 0 ? actionZoneHalf[0]++ : actionZoneHalf[1]++;
      handleGK();
    }
  }

  /* GOAL ATTRIBUTION FUNCTIONS */

  function getGoalAttribution(team) {
    var goalAttribution = Array(2).fill(null);
    if (lastTouches[0] != null) {
      if (lastTouches[0].player.team == team) {
        // Direct goal scored by player
        if (lastTouches[1] != null && lastTouches[1].player.team == team) {
          goalAttribution = [lastTouches[0].player, lastTouches[1].player];
        } else {
          goalAttribution = [lastTouches[0].player, null];
        }
      } else {
        // Own goal
        goalAttribution = [lastTouches[0].player, null];
      }
    }
    return goalAttribution;
  }


  function getGoalString(team) {
    var goalString;
    var scores = game.scores;
    var goalAttribution = getGoalAttribution(team);
    if (goalAttribution[0] != null) {
      if (goalAttribution[0].team == team) {
        if (goalAttribution[1] != null && goalAttribution[1].team == team) {
          goalString = `⌛ ${getTimeGame(scores.time)} ┊ ⚽ ${goalAttribution[0].name} ┊ 🦶 ${goalAttribution[1].name} ┊ 💨 ${ballSpeed.toFixed(2)} km/s`;
          game.goals.push(
            new Goal(scores.time, team, goalAttribution[0], goalAttribution[1])
          );
          //golü atan
          room.setPlayerDiscProperties(goalAttribution[0].id, { radius: 30 });
          setTimeout(function () {
            room.setPlayerDiscProperties(goalAttribution[0].id, { radius: 15 });
          }, 2000);
          //asist yapan
          room.setPlayerDiscProperties(goalAttribution[1].id, { radius: 25 });
          setTimeout(function () {
            room.setPlayerDiscProperties(goalAttribution[1].id, { radius: 15 });
          }, 2000);
        } else {
          goalString = `⌛ ${getTimeGame(scores.time)} ┊ ⚽ ${goalAttribution[0].name} ┊ 💨 ${ballSpeed.toFixed(2)} km/s`;
          game.goals.push(
            new Goal(scores.time, team, goalAttribution[0], null)
          );
          //golü atan
          room.setPlayerDiscProperties(goalAttribution[0].id, { radius: 30 });
          setTimeout(function () {
            room.setPlayerDiscProperties(goalAttribution[0].id, { radius: 15 });
          }, 2000);
        }
      } else {
        goalString = `⌛ ${getTimeGame(scores.time)} ┊ 😂 [KK] ${goalAttribution[0].name} ┊ 💨 ${ballSpeed.toFixed(2)} km/s`;
        game.goals.push(new Goal(scores.time, team, goalAttribution[0], null));
        //kk atan
        room.setPlayerDiscProperties(goalAttribution[0].id, { radius: 5 });
        setTimeout(function () {
          room.setPlayerDiscProperties(goalAttribution[0].id, { radius: 15 });
        }, 2000);
      }
    } else {
      goalString = `⌛ ${getTimeGame(scores.time)} ┊ ⚽ ${team == Team.RED ? "Kırmızı Takım" : "Mavi Takım"} ┊ 💨 ${ballSpeed.toFixed(2)} km/s`;
      game.goals.push(new Goal(scores.time, team, null, null));
    }

    return "\n" + goalString + "\n ";
  }

  /* ROOM STATS FUNCTIONS */

  async function totalTeamElo(team) {
    total = 0
    for (var i = 0; i < team.length; i++) {
      var data = await checkStats(authArray[team[i].id][0]);
      const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== "_id"));
      total += stats.puan
    }
    return total
  }

  async function newEloDelta(player, hasWon, redElo, blueElo) {
    abs = 0

    if (player.team == Team.RED) abs = blueElo - redElo
    if (player.team == Team.BLUE) abs = redElo - blueElo

    const k = 15;
    const finalScore = (hasWon ? 1 : 0);
    const expectedScore = 1 / (1 + 10 ** ((abs) / 400));

    return Math.round((finalScore - expectedScore) * k);
  }

  async function updatePlayerStats(player, teamStats, redElo, blueElo) {
    var data = await checkStats(authArray[player.id][0]);
    const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== "_id"));

    var pComp = getPlayerComp(player);
    if (pComp == null) return;
    hasWon = false
    stats.oyunlar++;
    if (lastWinner == teamStats) stats.galibiyet++, (hasWon = true);
    stats.gol += getGoalsPlayer(pComp);
    stats.asist += getAssistsPlayer(pComp);
    stats.kk += getOwnGoalsPlayer(pComp);
    stats.aktiflik += getGametimePlayer(pComp);
    stats.cs += getCSPlayer(pComp);
    const yeniPuan = await newEloDelta(player, hasWon, redElo, blueElo)
    stats.puan += yeniPuan

    room.sendAnnouncement(
      `${player.name}, bu maçın sonucunda aldığın puan: ` + yeniPuan,
      player.id,
      yeniPuan > 0 ? successColor : errorColor,
      "bold"
    );
    await updatePlayer(authArray[player.id][0], stats);
    await setAvatar(stats.puan, player);
  }

  async function updateStats() {
    if (
      players.length >= 2 * teamSize &&
      (game.scores.time >= (5 / 6) * game.scores.timeLimit ||
        game.scores.red == game.scores.scoreLimit ||
        game.scores.blue == game.scores.scoreLimit) &&
      teamRedStats.length >= teamSize &&
      teamBlueStats.length >= teamSize
    ) {
      const redElo = await totalTeamElo(teamRed)
      const blueElo = await totalTeamElo(teamBlue)

      for (let player of teamRedStats) {
        await updatePlayerStats(player, Team.RED, redElo, blueElo);
      }
      for (let player of teamBlueStats) {
        await updatePlayerStats(player, Team.BLUE, redElo, blueElo);
      }
    }
  }

  async function printRankings(statKey, id = 0) {
    const data = await getAll();
    var leaderboard = [];
    data.forEach(function (element) {
      leaderboard.push(
        Object.fromEntries(
          Object.entries(element).filter(([key, value]) =>
            ["isim", `${statKey}`].includes(key)
          )
        )
      );
    });
    if (leaderboard.length < 5) {
      if (id != 0) {
        room.sendAnnouncement(
          "Sıralama yapabilmek için yeterince oyun oynanılmamış !",
          id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      }
      return;
    }
    leaderboard.sort(function (a, b) {
      return b[statKey] - a[statKey];
    });
    var rankingString = `${statKey.charAt(0).toUpperCase() + statKey.slice(1)
      } | `;
    for (let i = 0; i < 5; i++) {
      let playerName = leaderboard[i]["isim"];
      let playerStat = leaderboard[i][statKey];
      if (statKey == "aktiflik") playerStat = getTimeStats(playerStat);
      rankingString += `${i + 1} - ${playerName} : ${playerStat}, `;
    }
    rankingString = rankingString.substring(0, rankingString.length - 2);
    room.sendAnnouncement(
      rankingString,
      id,
      infoColor,
      "bold",
      HaxNotification.CHAT
    );
  }

  /* GET STATS FUNCTIONS */

  async function getGamePlayerStats(player) {
    var data = await checkStats(authArray[player.id][0]);
    const stats = Object.fromEntries(
      Object.entries(data).filter(([key, value]) => key !== "_id")
    );
    var pComp = getPlayerComp(player);
    stats.gol += getGoalsPlayer(pComp);
    stats.assist += getAssistsPlayer(pComp);
    stats.kk += getOwnGoalsPlayer(pComp);
    stats.aktiflik += getGametimePlayer(pComp);
    return stats;
  }

  function getGametimePlayer(pComp) {
    var timePlayer = 0;
    for (let j = 0; j < pComp.timeEntry.length; j++) {
      if (pComp.timeExit.length < j + 1) {
        timePlayer += game.scores.time - pComp.timeEntry[j];
      } else {
        timePlayer += pComp.timeExit[j] - pComp.timeEntry[j];
      }
    }
    return Math.floor(timePlayer);
  }

  function getGoalsPlayer(pComp) {
    var goalPlayer = 0;
    for (let goal of game.goals) {
      if (goal.striker != null && goal.team === pComp.player.team) {
        if (authArray[goal.striker.id][0] == pComp.auth) {
          goalPlayer++;
        }
      }
    }
    return goalPlayer;
  }

  function getOwnGoalsPlayer(pComp) {
    var goalPlayer = 0;
    for (let goal of game.goals) {
      if (goal.striker != null && goal.team !== pComp.player.team) {
        if (authArray[goal.striker.id][0] == pComp.auth) {
          goalPlayer++;
        }
      }
    }
    return goalPlayer;
  }

  function getAssistsPlayer(pComp) {
    var assistPlayer = 0;
    for (let goal of game.goals) {
      if (goal.assist != null) {
        if (authArray[goal.assist.id][0] == pComp.auth) {
          assistPlayer++;
        }
      }
    }
    return assistPlayer;
  }

  function getGKPlayer(pComp) {
    let GKRed = getGK(Team.RED);
    if (pComp.auth == GKRed?.auth) {
      return Team.RED;
    }
    let GKBlue = getGK(Team.BLUE);
    if (pComp.auth == GKBlue?.auth) {
      return Team.BLUE;
    }
    return Team.SPECTATORS;
  }

  function getCSPlayer(pComp) {
    if (getGKPlayer(pComp) == Team.RED && game.scores.blue == 0) {
      return 1;
    } else if (getGKPlayer(pComp) == Team.BLUE && game.scores.red == 0) {
      return 1;
    }
    return 0;
  }

  function actionReportCountTeam(goals, team) {
    let playerActionSummaryTeam = [];
    let indexTeam = team == Team.RED ? 0 : 1;
    let indexOtherTeam = team == Team.RED ? 1 : 0;
    for (let goal of goals[indexTeam]) {
      if (goal[0] != null) {
        if (playerActionSummaryTeam.find(a => a[0].id == goal[0].id)) {
          let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[0].id);
          playerActionSummaryTeam[index][1]++;
        } else {
          playerActionSummaryTeam.push([goal[0], 1, 0, 0]);
        }
        if (goal[1] != null) {
          if (playerActionSummaryTeam.find(a => a[0].id == goal[1].id)) {
            let index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[1].id);
            playerActionSummaryTeam[index][2]++;
          } else {
            playerActionSummaryTeam.push([goal[1], 0, 1, 0]);
          }
        }
      }
    }
    if (goals[indexOtherTeam].length == 0) {
      let playerCS = getGK(team)?.player;
      if (playerCS != null) {
        if (playerActionSummaryTeam.find(a => a[0].id == playerCS.id)) {
          let index = playerActionSummaryTeam.findIndex(a => a[0].id == playerCS.id);
          playerActionSummaryTeam[index][3]++;
        } else {
          playerActionSummaryTeam.push([playerCS, 0, 0, 1]);
        }
      }
    }

    playerActionSummaryTeam.sort((a, b) => (a[1] + a[2] + a[3]) - (b[1] + b[2] + b[3]));
    return playerActionSummaryTeam;
  }

  /* PRINT FUNCTIONS */

  function printPlayerStats(stats) {
    let statsString = "";
    for (let [key, value] of Object.entries(stats)) {
      if (key == "isim") statsString += `${value}: `;
      else {
        if (key == "aktiflik") value = getTimeStats(value);
        let reCamelCase = /([A-Z](?=[a-z]+)|[A-Z]+(?![a-z]))/g;
        let statName = key.replaceAll(reCamelCase, " $1").trim();
        statsString += `${statName.charAt(0).toUpperCase() + statName.slice(1)
          }: ${value}, `;
      }
    }
    statsString = statsString.substring(0, statsString.length - 2);
    return statsString;
  }

  /* FETCH FUNCTIONS */

  function fetchGametimeReport(game) {
    var fieldGametimeRed = {
      name: "🔴**KIRMIZI TAKIM:**",
      value: "⌛ __**Oyun Süresi:**__\n\n",
      inline: true,
    };
    var fieldGametimeBlue = {
      name: "🔵**MAVİ TAKIM**",
      value: "⌛ __**Oyun Süresi:**__\n\n",
      inline: true,
    };
    var redTeamTimes = game.playerComp[0].map((p) => [
      p.player,
      getGametimePlayer(p),
    ]);
    var blueTeamTimes = game.playerComp[1].map((p) => [
      p.player,
      getGametimePlayer(p),
    ]);

    for (let time of redTeamTimes) {
      var minutes = getMinutesReport(time[1]);
      var seconds = getSecondsReport(time[1]);
      fieldGametimeRed.value +=
        `> **${time[0].name}:** ${minutes > 0 ? `${minutes} dk` : ""}` +
        `${seconds > 0 || minutes == 0 ? `${seconds} sn` : ""}\n`;
    }
    fieldGametimeRed.value += `\n${blueTeamTimes.length - redTeamTimes.length > 0
      ? "\n".repeat(blueTeamTimes.length - redTeamTimes.length)
      : ""
      }`;
    fieldGametimeRed.value += "=====================";

    for (let time of blueTeamTimes) {
      var minutes = getMinutesReport(time[1]);
      var seconds = getSecondsReport(time[1]);
      fieldGametimeBlue.value +=
        `> **${time[0].name}:** ${minutes > 0 ? `${minutes} dk` : ""}` +
        `${seconds > 0 || minutes == 0 ? `${seconds} sn` : ""}\n`;
    }
    fieldGametimeBlue.value += `\n${redTeamTimes.length - blueTeamTimes.length > 0
      ? "\n".repeat(redTeamTimes.length - blueTeamTimes.length)
      : ""
      }`;
    fieldGametimeBlue.value += "=====================";

    return [fieldGametimeRed, fieldGametimeBlue];
  }

  function fetchActionsSummaryReport(game) {
    var fieldReportRed = {
      name: "🔴**KIRMIZI TAKIM**",
      value: "📊 __**Oyuncu İstatistikleri:**__\n\n",
      inline: true,
    };
    var fieldReportBlue = {
      name: "🔵**MAVİ TAKIM**",
      value: "📊 __**Oyuncu İstatistikleri:**__\n\n",
      inline: true,
    };
    var goals = [[], []];
    for (let i = 0; i < game.goals.length; i++) {
      goals[game.goals[i].team - 1].push([
        game.goals[i].striker,
        game.goals[i].assist,
      ]);
    }
    var redActions = actionReportCountTeam(goals, Team.RED);
    if (redActions.length > 0) {
      for (let act of redActions) {
        fieldReportRed.value += `> **${act[0].team != Team.RED ? '[KK] ' : ''}${act[0].name}:**` +
          `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
          `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
          `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
      }
    }
    var blueActions = actionReportCountTeam(goals, Team.BLUE);
    if (blueActions.length > 0) {
      for (let act of blueActions) {
        fieldReportBlue.value += `> **${act[0].team != Team.BLUE ? '[KK] ' : ''}${act[0].name}:**` +
          `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
          `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
          `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`;
      }
    }

    fieldReportRed.value += `\n${blueActions.length - redActions.length > 0
      ? "\n".repeat(blueActions.length - redActions.length)
      : ""
      }`;
    fieldReportRed.value += "=====================";

    fieldReportBlue.value += `\n${redActions.length - blueActions.length > 0
      ? "\n".repeat(redActions.length - blueActions.length)
      : ""
      }`;
    fieldReportBlue.value += "=====================";

    return [fieldReportRed, fieldReportBlue];
  }

  function fetchSummaryEmbed(game) {
    var fetchEndgame = [fetchGametimeReport, fetchActionsSummaryReport];
    var logChannel = gameWebhook;
    var fields = [
      {
        name: "🔴**KIRMIZI TAKIM**",
        value: "=====================\n\n",
        inline: true,
      },
      {
        name: "🔵**MAVİ TAKIM**",
        value: "=====================\n\n",
        inline: true,
      },
    ];
    for (let i = 0; i < fetchEndgame.length; i++) {
      var fieldsReport = fetchEndgame[i](game);
      fields[0].value += fieldsReport[0].value + "\n\n";
      fields[1].value += fieldsReport[1].value + "\n\n";
    }
    fields[0].value = fields[0].value.substring(0, fields[0].value.length - 2);
    fields[1].value = fields[1].value.substring(0, fields[1].value.length - 2);

    var possR = possession[0] / (possession[0] + possession[1]);
    var possB = 1 - possR;
    var possRString = (possR * 100).toPrecision(2).toString();
    var possBString = (possB * 100).toPrecision(2).toString();
    var zoneR = actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1]);
    var zoneB = 1 - zoneR;
    var zoneRString = (zoneR * 100).toPrecision(2).toString();
    var zoneBString = (zoneB * 100).toPrecision(2).toString();
    var win =
      (game.scores.red > game.scores.blue) * 1 +
      (game.scores.blue > game.scores.red) * 2;
    let embedColor = win == 1 ? 14958399 : 9567999;
    var objectBodyWebhook = {
      embeds: [
        {
          title: `📝 MAÇ RAPORU #${getIdReport()}`,
          description:
            `**${getTimeEmbed(game.scores.time)}** ` +
            (win == 1 ? "**Kırmızı Takım** " : "Kırmızı Takım ") +
            game.scores.red +
            " - " +
            game.scores.blue +
            (win == 2 ? " **Mavi Takım**" : " Mavi Takım") +
            "\n```c\nTopla oynama: " +
            possRString +
            "% - " +
            possBString +
            "%" +
            "\nTopun oynandığı bölgeler: " +
            zoneRString +
            "% - " +
            zoneBString +
            "%\n```\n\n",
          color: embedColor,
          fields: fields,
          footer: {
            text: `Kayıt: ${getRecordingName(game)}`,
          },
          timestamp: new Date().toISOString(),
        },
      ],
      username: "Maç Özeti Botu",
    };
    if (logChannel != "") {
      fetch(logChannel, {
        method: "POST",
        body: JSON.stringify(objectBodyWebhook),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res);
    }
  }

  /* EVENTS */

  /* PLAYER MOVEMENT */

  room.onPlayerJoin = async function (player) {

    authArray[player.id] = [player.auth, player.conn, player.name, false, false, false, false];

    if (player.auth == null)
      room.kickPlayer(player.id, "Anonim hesaplar sunucumuza alınmıyor!", true);

    if ((await checkPlayer(authArray[player.id][0])) == null)
      await newPlayer(
        authArray[player.id][2],
        authArray[player.id][0],
        authArray[player.id][1]
      );

    const stats = Object.fromEntries(Object.entries(await checkPlayer(authArray[player.id][0])).filter(([key, value]) => key !== "_id"));
    authArray[player.id][3] = stats.discordID != 0;
    authArray[player.id][4] = stats.isVIP != 0;
    authArray[player.id][5] = stats.isAdmin != 0;
    authArray[player.id][6] = stats.isMaster != 0;

    await setAvatar(stats.puan, player);
    if (authArray[player.id][2] != stats.isim)
      setTimeout(async () => { await updateName(authArray[player.id][0], authArray[player.id][2]) }, "1000"),
        room.sendAnnouncement(
          stats.isim + " ismini " + player.name + " olarak değiştirmiş!",
          null,
          0xffffff
        );
    if (authArray[player.id][1] != stats.conn)
      setTimeout(async () => { await updateConn(authArray[player.id][0], authArray[player.id][1]) }, "1000")
    if (giriscikisWebhook != "") {
      fetch(giriscikisWebhook, {
        method: "POST",
        body: JSON.stringify({
          content: `\`\`\`fix\n[${getDate()}] ${player.name
            }, odaya giriş yaptı (${playersAll.length + 1}/${maxPlayers})\`\`\``,
          username: "Giriş - Çıkış Takip Botu",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res);
    }
    room.sendAnnouncement(
      `👋 ${player.name}, hoşgeldin ! Komutlara göz atmayı unutma, !yardım !dc !avatarlar.\n${stats.discordID == 0 ? "📢Hesabının Discorda bağlı olmadığı tespit edildi! İstatistiklerinin silinmesini istemiyorsan kayıt olmalısın!\n📢 Discord sunucumuzda kayıt olduktan sonra isminin yanındaki işaret yeşile dönecek." : ""}`,
      player.id,
      welcomeColor,
      "bold",
      HaxNotification.CHAT
    );
    updateTeams();
    if (authArray[player.id][6] == true) {
      room.sendAnnouncement(
        `KURUCU 👑 ${player.name} odaya giriş yaptı !`,
        null,
        "0xE91E63",
        "bold",
        HaxNotification.CHAT
      );
      room.setPlayerAdmin(player.id, true);
    } else if (authArray[player.id][5] == true) {
      room.sendAnnouncement(
        `ADMİN ⚡️ ${player.name} odaya giriş yaptı !`,
        null,
        "0x5499C7",
        "bold",
        HaxNotification.CHAT
      );
      room.setPlayerAdmin(player.id, true);
    } else if (authArray[player.id][4] == true) {
      room.sendAnnouncement(
        `VIP 💎${player.name} odaya giriş yaptı !`,
        null,
        "0x2ECC71",
        "bold",
        HaxNotification.CHAT
      );
    }
    var sameAuthCheck = playersAll.filter(
      (p) => p.id != player.id && authArray[p.id][0] == player.auth
    );
    if (sameAuthCheck.length > 0 && !debugMode) {
      var oldPlayerArray = playersAll.filter(
        (p) => p.id != player.id && authArray[p.id][0] == player.auth
      );
      for (let oldPlayer of oldPlayerArray) {
        ghostKickHandle(oldPlayer, player);
      }
    }
    handlePlayersJoin();
    updatePlayerCount(bot);
  };

  room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
    handleLineupChangeTeamChange(changedPlayer);
    if (AFKSet.has(changedPlayer.id) && changedPlayer.team != Team.SPECTATORS) {
      room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
      room.sendAnnouncement(
        `${changedPlayer.name} AFK olduğu için onu kullanamazsın !`,
        null,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
      return;
    }
    updateTeams();
    if (gameState != State.STOP) {
      if (
        changedPlayer.team != Team.SPECTATORS &&
        game.scores.time <= (3 / 4) * game.scores.timeLimit &&
        Math.abs(game.scores.blue - game.scores.red) < 2
      ) {
        changedPlayer.team == Team.RED
          ? teamRedStats.push(changedPlayer)
          : teamBlueStats.push(changedPlayer);
      }
    }
    handleActivityPlayerTeamChange(changedPlayer);
    handlePlayersTeamChange(byPlayer);
  };

  room.onPlayerLeave = function (player) {
    setTimeout(() => {
      if (!kickFetchVariable) {
        if (giriscikisWebhook != "") {
          var stringContent = `\`\`\`fix\n[${getDate()}] ${player.name
            }, odadan çıkış yaptı (${playersAll.length}/${maxPlayers})\`\`\``;
          fetch(giriscikisWebhook, {
            method: "POST",
            body: JSON.stringify({
              content: stringContent,
              username: "Giriş - Çıkış Takip Botu",
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }).then((res) => res);
        }
      } else kickFetchVariable = false;
    }, 10);
    handleLineupChangeLeave(player);
    checkCaptainLeave(player);
    updateTeams();
    handlePlayersLeave();
    updatePlayerCount(bot);
  };

  room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
    kickFetchVariable = true;
    if (kickbanWebhook != "") {
      var stringContent =
        `\`\`\`diff\n-[${getDate()}] (${players.length}/${maxPlayers})\n` +
        `-${kickedPlayer.name}, ${byPlayer != null ? "" + byPlayer.name + " tarafından" : ""}${reason} sebebiyle ${ban ? "banlandı" : "kicklendi"}!\`\`\``;

      fetch(kickbanWebhook, {
        method: "POST",
        body: JSON.stringify({
          content: stringContent,
          username: "Kick - Ban Takip Botu",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res);
    }

    if (
      (ban &&
        ((byPlayer != null &&
          (byPlayer.id == kickedPlayer.id ||
            getRole(byPlayer) < Role.MASTER)) ||
          getRole(kickedPlayer) == Role.MASTER)) ||
      disableBans
    ) {
      room.clearBan(kickedPlayer.id);
      return;
    }
    if (byPlayer != null && getRole(byPlayer) < Role.ADMIN_PERM) {
      room.sendAnnouncement(
        "Oyuncuları atmak için yetkin yok !",
        byPlayer.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
      room.setPlayerAdmin(byPlayer.id, false);
      return;
    }
    if (ban) banList.push([kickedPlayer.name, kickedPlayer.id]);
  };

  /* PLAYER ACTIVITY */

  const asianRegex = RegExp(
    /[\p{Script_Extensions=Mymr}\p{Script_Extensions=Han}\p{Script_Extensions=Hira}\p{Script_Extensions=Kana}\p{Script_Extensions=Bopo}\p{Script=Khmer}\p{Script=Lao}\p{Script_Extensions=Phag}\p{Script=Tai_Tham}\p{Script=Thai}\p{Script=Tibetan}]/gu
  );
  const emojiRegex = RegExp(
    /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu
  );
  const longRegex = RegExp(/(⸻|𒈙|𒐫|﷽|𒍙|𒊎|𒄡|𒅌|𒁏|𒀰|𒐪|𒐩|𒈙|𒐫)/gi);

  function isUsingIllegalChars(message) {
    const asian = (message.match(asianRegex) || []).length;
    const emoji = (message.match(emojiRegex) || []).length;
    const long = (message.match(longRegex) || []).length;

    if (long > 0) return true;
    if (asian > 10) return true;
    if (asian + emoji > 15) return true;

    return false;
  }

  room.onPlayerChat = function (player, message) {

    if (gameState !== State.STOP && player.team != Team.SPECTATORS) {
      let pComp = getPlayerComp(player);
      if (pComp != null) pComp.inactivityTicks = 0;
    }
    let msgArray = message.split(/ +/);
    if (roomWebhook != "")
      fetch(roomWebhook, {
        method: "POST",
        body: JSON.stringify({
          content: `\`\`\`diff\n+ [${getDate()}] ${player.name
            } : ${message.replace("@", "@ ")}\`\`\``,
          username: "Sohbet Tekrarı Botu",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((res) => res);

    if (msgArray[0][0] == "!") {
      let command = getCommand(msgArray[0].slice(1).toLowerCase());
      if (command != false && commands[command].roles <= getRole(player))
        commands[command].function(player, message);
      else
        room.sendAnnouncement(
          `Böyle bir komut yok, komutlar için !yardım yazabilirsin.`,
          player.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
      return false;
    }
    if (msgArray[0].toLowerCase() == "t") {
      teamChat(player, message);
      return false;
    }
    if (msgArray[0].substring(0, 2) === "@@") {
      playerChat(player, message);
      return false;
    }
    if (chooseMode && teamRed.length * teamBlue.length != 0) {
      var choosingMessageCheck = chooseModeFunction(player, message);
      if (choosingMessageCheck) return false;
    }
    if (slowMode > 0) {
      var filter = slowModeFunction(player, message);
      if (filter) return false;
    }
    if (!player.admin && muteArray.getByAuth(authArray[player.id][0]) != null) {
      room.sendAnnouncement(
        `Ceza yediğin için mesaj yazamazsın !`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
      for (var a = 0; a < playersAll.length; a++) {
        if (playersAll[a].admin == true) {
          room.sendAnnouncement(player.name + "・" + message, playersAll[a].id, 0xFFFF00, "bold", 1);
        }
      }
      return false;
    }

    if (isUsingIllegalChars(message)) {

      room.sendAnnouncement(
        `Yasaklı karakterler kullanmaya devam edersen banlanacaksın!`,
        player.id,
        errorColor,
        "bold",
        2
      );

      return false;
    }
    if (message.match(checkBadWords(message))) {
      if (getRole(player) <= Role.ADMIN_TEMP) {
        room.sendAnnouncement(
          `Böyle konuşmaya devam edersen kalıcı olarak banlanacaksın!`,
          player.id,
          errorColor,
          "bold",
          2
        );
        for (var a = 0; a < playersAll.length; a++) {
          if (playersAll[a].admin == true) {
            room.sendAnnouncement("KÜFÜR 💢 " + player.name + "・" + message, playersAll[a].id, errorColor, "bold", 0);
          }
        }
        return false;
      }
    }

    // Renkli Yazı
    if (getRole(player) == Role.MASTER) {
      room.sendAnnouncement(
        "👑 " + player.name + "・" + message,
        undefined,
        "0xE91E63",
        "normal"
      );
      return false;
    } else if (getRole(player) == Role.ADMIN_PERM) {
      room.sendAnnouncement(
        "⚡️ " + player.name + "・" + message,
        undefined,
        "0x5499C7",
        "normal"
      );
      return false;
    } else if (getRole(player) == Role.VIP) {
      room.sendAnnouncement(
        "VIP 💎 " + player.name + "・" + message,
        undefined,
        "0x2ECC71",
        "normal"
      );
      return false;
    } else if (getRole(player) == Role.ADMIN_TEMP) {
      room.sendAnnouncement(
        "✨ " + player.name + "・" + message,
        undefined,
        "0xC0D8E8",
        "normal"
      );
      return false;
    } else if ((getRole(player) < Role.ADMIN_TEMP)) {
      if (allMuted == true) {
        for (var a = 0; a < playersAll.length; a++) {
          if (playersAll[a].admin == true) {
            room.sendAnnouncement(player.name + "・" + message, playersAll[a].id, 0xFFFF00, "bold", 1);
          }
        }
        room.sendAnnouncement(
          `Sohbet şu anda bütün oyuncular için kapalı, açıldığında tekrar konuşabileceksin.`,
          player.id,
          errorColor,
          "bold",
          null
        );
      }
      else {
        const tag = authArray[player.id][3] ? "✔️ " : "❌ ";
        room.sendAnnouncement(
          tag + player.name + "・" + message,
          undefined,
          "0xD5D8DC",
          "normal"
        );
      }
      return false;
    }
  };

  room.onPlayerActivity = function (player) {
    if (gameState !== State.STOP) {
      let pComp = getPlayerComp(player);
      if (pComp != null) pComp.inactivityTicks = 0;
    }
  };

  room.onPlayerBallKick = function (player) {
    if (playSituation != Situation.GOAL) {
      var ballPosition = room.getBallPosition();
      if (
        game.touchArray.length == 0 ||
        player.id != game.touchArray[game.touchArray.length - 1].player.id
      ) {
        if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
        lastTeamTouched = player.team;
        game.touchArray.push(
          new BallTouch(player, game.scores.time, getGoalGame(), ballPosition)
        );
        lastTouches[0] = checkGoalKickTouch(
          game.touchArray,
          game.touchArray.length - 1,
          getGoalGame()
        );
        lastTouches[1] = checkGoalKickTouch(
          game.touchArray,
          game.touchArray.length - 2,
          getGoalGame()
        );
      }
    }
  };

  /* GAME MANAGEMENT */

  room.onGameStart = async function (byPlayer) {
    room.startRecording();
    clearTimeout(startTimeout);
    if (byPlayer != null) clearTimeout(stopTimeout);
    game = new Game();
    possession = [0, 0];
    actionZoneHalf = [0, 0];
    gameState = State.PLAY;
    endGameVariable = false;
    goldenGoal = false;
    playSituation = Situation.KICKOFF;
    lastTouches = Array(2).fill(null);
    lastTeamTouched = Team.SPECTATORS;
    teamRedStats = [];
    teamBlueStats = [];
    if (teamRed.length == teamSize && teamBlue.length == teamSize) {
      for (var i = 0; i < teamSize; i++) {
        teamRedStats.push(teamRed[i]);
        teamBlueStats.push(teamBlue[i]);
      }
    }
    //calculateStadiumVariables();
  };

  room.onGameStop = function (byPlayer) {
    clearTimeout(stopTimeout);
    clearTimeout(unpauseTimeout);
    if (byPlayer != null) clearTimeout(startTimeout);
    game.rec = room.stopRecording();
    if (
      !cancelGameVariable &&
      game.playerComp[0].length + game.playerComp[1].length > 0 &&
      ((game.scores.timeLimit != 0 &&
        ((game.scores.time >= 0.5 * game.scores.timeLimit &&
          game.scores.time < 0.75 * game.scores.timeLimit &&
          game.scores.red != game.scores.blue) ||
          game.scores.time >= 0.75 * game.scores.timeLimit)) ||
        endGameVariable)
    )
      fetchSummaryEmbed(game);
    if (fetchRecordingVariable) {
      setTimeout((gameEnd) => { fetchRecording(gameEnd); }, 500, game);
    }
    cancelGameVariable = false;
    gameState = State.STOP;
    playSituation = Situation.STOP;
    updateTeams();
    handlePlayersStop(byPlayer);
    handleActivityStop();
  };

  room.onGamePause = function (byPlayer) {
    if (mentionPlayersUnpause && gameState == State.PAUSE) {
      if (byPlayer != null) {
        room.sendAnnouncement(
          `Oyun ${byPlayer.name} tarafından durduruldu!`,
          null,
          defaultColor,
          "bold",
          HaxNotification.NONE
        );
      } else {
        room.sendAnnouncement(
          `Oyun durduruldu !`,
          null,
          defaultColor,
          "bold",
          HaxNotification.NONE
        );
      }
    }
    clearTimeout(unpauseTimeout);
    gameState = State.PAUSE;
  };

  room.onGameUnpause = function (byPlayer) {
    unpauseTimeout = setTimeout(() => {
      gameState = State.PLAY;
    }, 2000);
    if (mentionPlayersUnpause) {
      if (byPlayer != null) {
        room.sendAnnouncement(
          `Oyun ${byPlayer.name} tarafından devam ettiriliyor !`,
          null,
          defaultColor,
          "bold",
          HaxNotification.NONE
        );
      } else {
        room.sendAnnouncement(
          `Oyun devam ediyor !`,
          null,
          defaultColor,
          "bold",
          HaxNotification.NONE
        );
      }
    }
    if (
      (teamRed.length == teamSize &&
        teamBlue.length == teamSize &&
        chooseMode) ||
      (teamRed.length == teamBlue.length && teamSpec.length < 2 && chooseMode)
    ) {
      deactivateChooseMode();
    }
  };

  room.onTeamGoal = async function (team) {
    const scores = room.getScores();
    game.scores = scores;
    playSituation = Situation.GOAL;
    ballSpeed = getBallSpeed();
    var goalString = getGoalString(team);
    for (let player of teamRed) {
      var playerComp = getPlayerComp(player);
      team == Team.RED
        ? playerComp.goalsScoredTeam++
        : playerComp.goalsConcededTeam++;
    }
    for (let player of teamBlue) {
      var playerComp = getPlayerComp(player);
      team == Team.BLUE
        ? playerComp.goalsScoredTeam++
        : playerComp.goalsConcededTeam++;
    }
    room.sendAnnouncement(
      goalString,
      null,
      team == Team.RED ? redColor : blueColor,
      null,
      HaxNotification.CHAT
    );
    /* if (roomWebhook != '') {
        fetch(roomWebhook, {
            method: 'POST',
            body: JSON.stringify({
                content: `[${getDate()}] ${goalString}`,
                username: roomName,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    } */
    if (
      (scores.scoreLimit != 0 &&
        (scores.red == scores.scoreLimit ||
          scores.blue == scores.scoreLimit)) ||
      goldenGoal
    ) {
      await endGame(team);
      goldenGoal = false;
      stopTimeout = setTimeout(() => {
        room.stopGame();
      }, 1000);
    }
  };

  room.onPositionsReset = function () {
    lastTouches = Array(2).fill(null);
    lastTeamTouched = Team.SPECTATORS;
    playSituation = Situation.KICKOFF;
  };

  /* MISCELLANEOUS */

  room.onRoomLink = async function (url) {
    console.log(`${roomName} adlı oda açıldı.`);
    roomLink = url;
  };

  room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
    updateTeams();
    if (!changedPlayer.admin && getRole(changedPlayer) >= Role.ADMIN_TEMP) {
      room.setPlayerAdmin(changedPlayer.id, true);
      return;
    }
  };

  room.onKickRateLimitSet = function (min, rate, burst, byPlayer) {
    if (byPlayer != null) {
      room.sendAnnouncement(
        `Kickrate değerlerini değiştiremezsin! Bu sunucuda değerler sabit.`,
        player.id,
        errorColor,
        "bold",
        HaxNotification.CHAT
      );
      room.setKickRateLimit(6, 0, 0);
    }
  };

  room.onStadiumChange = function (newStadiumName, byPlayer) {
    if (byPlayer !== null) {
      if (getRole(byPlayer) < Role.MASTER && currentStadium != "özel") {
        room.sendAnnouncement(
          `Elle harita değiştiremezsin. Lütfen harita komutlarını kullan.`,
          byPlayer.id,
          errorColor,
          "bold",
          HaxNotification.CHAT
        );
        stadiumCommand(emptyPlayer, `!${currentStadium}`);
      } else {
        room.sendAnnouncement(
          `Harita değişti fakat bir dahaki sefere harita komutlarını kullan. Böyle bota zarar verebilirsin.`,
          byPlayer.id,
          infoColor,
          "bold",
          HaxNotification.CHAT
        );
        currentStadium = "özel";
      }
    }
    checkStadiumVariable = true;
  };

  room.onGameTick = function () {
    checkTime();
    getLastTouchOfTheBall();
    getGameStats();
    handleActivity();
  };

  // kimmich difference
  async function newPlayer(a, b, c) {
    const data = {
      isim: a,
      auth: b,
      conn: c,
      isAdmin: false,
      isMaster: false,
      isVIP: false,
      gol: 0,
      assist: 0,
      kk: 0,
      galibiyet: 0,
      mağlubiyet: 0,
      aktiflik: 0,
      oyunlar: 0,
      cs: 0,
      puan: 1000,
      bakiye: 0,
    };
    await fetch(`http://localhost:3000/api/newplayer`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res);
  }

  async function checkPlayer(a) {
    const req = await fetch(`http://localhost:3000/api/getAuth/${a}`);
    const res = await req.json();
    return res;
  }

  async function checkStats(a) {
    const req = await fetch(`http://localhost:3000/api/playerstats/${a}`);
    const res = await req.json();
    return res;
  }

  async function updatePlayer(a, data) {
    await fetch(`http://localhost:3000/api/update/${a}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res);
  }
  async function updateName(a, name) {
    const data = {
      isim: name,
    };
    await fetch(`http://localhost:3000/api/update/${a}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res);
  }
  async function updateConn(a, conn) {
    const data = {
      conn: conn,
    };
    await fetch(`http://localhost:3000/api/update/${a}`, {
      method: "PATCH",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res);
  }

  async function getAll() {
    const req = await fetch(`http://localhost:3000/api/getAll`);
    const res = await req.json();
    return res;
  }

  async function setAvatar(puan, player) {
    if (puan < 850) return room.setPlayerAvatar(player.id, "👎");
    if (puan >= 850 && puan < 950) return room.setPlayerAvatar(player.id, "👍");
    if (puan >= 950 && puan < 1000) return room.setPlayerAvatar(player.id, "🌵");
    if (puan >= 1000 && puan < 1050) return room.setPlayerAvatar(player.id, "🔥");
    if (puan >= 1050 && puan < 1100) return room.setPlayerAvatar(player.id, "💧");
    if (puan >= 1100 && puan < 1150) return room.setPlayerAvatar(player.id, "⚡");
    if (puan >= 1150 && puan < 1200) return room.setPlayerAvatar(player.id, "💎");
    if (puan >= 1200 && puan < 1250) return room.setPlayerAvatar(player.id, "🏆");
    if (puan >= 1250) return room.setPlayerAvatar(player.id, "👑");
  }

  function fetchRecording(game) {
    const data = JSON.stringify(Array.from(game.rec));
    const bufferData = Buffer.from(JSON.parse(data));

    const kayitWebhook = new WebhookClient({
      id: "981886983691436043",
      token:
        "NOtfTbQ0GLRxQ1Kuy91EELSOhi_pxd8ss7tDWxv2EzHPNGbi3w-jHnECMSj3axCSjbwV",
    });

    if (bufferData != null) {
      const attachment = new MessageAttachment(
        bufferData,
        getRecordingName(game)
      );
      kayitWebhook.send({ files: [attachment] });
    }
  }


  function checkBadWords() {
    const KUFURLER = kufurlistesi.kelimeler
    let content = "";
    const lastIndex = KUFURLER.length - 1;
    for (let i = 0; i < KUFURLER.length; i++) {
      let kufur = KUFURLER[i];
      kufur = kufur.replace(/[A-Z]/gim, (p) => `${p}\\s*`);
      content += kufur;
      if (i != lastIndex) content += "|";
    }
    return new RegExp(`${content}`, "gim");
  };

  setInterval(() => {
    room.sendAnnouncement("                                        ▒█▀▀▄ ▀█▀ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▄ ", null, 0x5F85FF, "normal", 0)
    room.sendAnnouncement("                                        ▒█░▒█ ▒█░ ░▀▀▀▄▄ ▒█░░░ ▒█░░▒█ ▒█▄▄▀ ▒█░▒█ ", null, 0x7E76FF, "normal", 0)
    room.sendAnnouncement("                                        ▒█▄▄▀ ▄█▄ ▒█▄▄▄█ ▒█▄▄█ ▒█▄▄▄█ ▒█░▒█ ▒█▄▄▀ ", null, 0x9E66FF, "normal", 0);
    room.sendAnnouncement("                  VIP ALARAK BİZE DESTEKTE BULUNABİLİRSİN ➡ discord.gg/TG7mr7AsQa ⬅", null, 0x17E8EC, "normal", 2);
  }, 3 * 60 * 1000);

  room.setTeamColors(1, 60, 0xcfcfcf, [0xcf1238]);
  room.setTeamColors(2, 60, 0xcfcfcf, [0x2c89ab]);

  //Infos

  function randomInt(max) {
    return Math.floor(Math.random() * max);
  }

  const infoText = [
    "📢 Mesajının başına t koyarsan sadece takımına mesaj gönderirsin",
    "📢 Mesajının başına @@isim koyarsan sadece belirttiğin isme mesaj gönderirsin",
    "😎 Rankını beğenmiyorsan VIP alarak !rankres komutunu kullanabilirsin.",
    "💖 Odalarımız kar amacı gütmeden desteklerle açılıyor, sende bunun bir parçası olmak istersen Discorda gelebilirsin",
    "💖 Odaları seviyorsan ve devamını istiyorsan bize VIP alarak destek olabilirsin",
    "😒 Sunucu hakkında önerin veya şikayetin varsa bizlere Discord üzerinden ulaşabilirsin",
    "😲 Bu avatarlar ne böyle diyorsan !avatarlar yazıp bilgi alabilirsin",
    "😲 Komutların ne olduğu hakkında fikrin yoksa !yardım yazabilirsin",
    "📣 Admin başvurularımız açık, sende ekibin parçası olmak için Discord üzerinden başvurabilirsin",
    "📣 Discord sunucumuzda sürekli etkinlikler oluyor, sende bir parçası olmak için Discord sunucumuza gelebilirsin"
  ]

  setInterval(() => { room.sendAnnouncement(infoText[randomInt(infoText.length)], null, 0xF4D03F, "normal", 1); }, 30_000);

});
