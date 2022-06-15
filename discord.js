const {
  Client,
  MessageEmbed,
} = require("discord.js");
const { json } = require("express");
const Model = require("./models/model");
const settings = require("./settings");
// Auth token
const token = process.env.MAINBOT;

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

// Handle messages
bot.on("messageCreate", async function (message) {

  // Reply to user with generic message
  if (message.channel.name.includes("discord-kayıt")) {
    const {
      content: messageContent,
      author: userAccount,
      member: guildMember,
    } = message;
    const [cmd, auth] = messageContent.split(/ +/gim);
    if (cmd === "!kayıt" && auth) {
      try {
        const user = await Model.findOne({ auth });
        if (user && !user._doc.discordID) {
          const roles = Object.entries(user._doc).filter(
            ([key, value]) =>
              key.startsWith("is") &&
              value === true &&
              !guildMember.roles.cache.has(settings.roles[key])
          );
          const _roles = Object.entries(settings.roles).filter(([k, v]) =>
            roles.map((r) => r[0]).includes(k)
          );
          await guildMember.roles.add(_roles.map((r) => r[1]));
          await guildMember.roles.add(settings.roles.default);
          await guildMember.setNickname(user.isim)
          await Model.updateOne(
            { auth },
            {
              $set: {
                discordID: userAccount.id,
              },
            }
          );
          if (message.deletable) await message.delete({ timeout: 5_000 });
          message.author.send("Sunucumuza başarıyla kayıt oldun! Odalarımızın devamı için VIP alarak bizlere destek olabilirsin.");
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (message.channel.name.includes("rank-bilgi")) {

    const [cmd,] = message.content.split(/ +/gim);

    if (cmd == "!rank") {
      try {
        // TIME FUNCTIONS
        function getHoursStats(time) {
          return Math.floor(time / 3600);
        }

        function getMinutesStats(time) {
          return Math.floor(time / 60) - getHoursStats(time) * 60;
        }

        function getTimeStats(time) {
          if (getHoursStats(time) > 0) {
            return `${getHoursStats(time)} saat ${getMinutesStats(time)} dakika`;
          } else {
            return `${getMinutesStats(time)} dakika`;
          }
        }

        const data = await Model.find()
        const pos = data.sort(function (a, b) { return b["puan"] - a["puan"]; });
        for (var i = 0; i < pos.length; i++) {
          pos[i].rank = i + 1;
        }
        const user = pos.filter(element => element.discordID == message.author.id);

        const _Embed = new MessageEmbed();

        if (user) {
          function avatar() {
            if (user[0].puan < 850) return "👎";
            if (user[0].puan >= 850 && user[0].puan < 950) return "👍";
            if (user[0].puan >= 950 && user[0].puan < 1000) return "🌵";
            if (user[0].puan >= 1000 && user[0].puan < 1050) return "🔥";
            if (user[0].puan >= 1050 && user[0].puan < 1100) return "💧";
            if (user[0].puan >= 1100 && user[0].puan < 1150) return "⚡";
            if (user[0].puan >= 1150 && user[0].puan < 1200) return "💎";
            if (user[0].puan >= 1200 && user[0].puan < 1250) return "🏆";
            if (user[0].puan >= 1250) return "👑";
          }
          const winrate = ((100 * user[0].galibiyet) / (user[0].oyunlar || 1)).toPrecision(2)
          _Embed.setTitle(`\`\`\`${avatar()}・${user[0].isim} #${user[0].rank}\`\`\``);
          _Embed.setColor("#c0f00b");
          _Embed.setAuthor({ "name": "📈 RANK BİLGİLENDİRME" })
          _Embed.addFields({
            "name": "```⚽ Gol```",
            "value": `\`\`\`c\n${user[0].gol}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```🦶 Asist```",
            "value": `\`\`\`c\n${user[0].asist}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```❌ Kendi Kalene```",
            "value": `\`\`\`c\n${user[0].kk}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```⬆️ Galibiyet```",
            "value": `\`\`\`c\n${user[0].galibiyet}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```🅿️ Toplam Oyunlar```",
            "value": `\`\`\`c\n${user[0].oyunlar}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```💯 Kazanma Oranı```",
            "value": `\`\`\`c\n%${winrate}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```🥅 CS```",
            "value": `\`\`\`c\n${user[0].cs}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```👉 Puan```",
            "value": `\`\`\`c\n${user[0].puan}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```💰 Bakiye```",
            "value": `\`\`\`c\n${user[0].bakiye}\`\`\``,
            "inline": true,
          });
          _Embed.setFooter({
            "text": `${getTimeStats(user[0].aktiflik)} boyunca odamızda oynadın!`,
          });
          message.channel.send({
            embeds: [_Embed],
          });
        }
        else if (!user) {
          _Embed.setColor("#ED4245");
          _Embed.setDescription("Odada böyle bir hesap bulunamadı, lütfen yöneticilerle iletişime geç.");
          message.channel.send({
            embeds: [_Embed],
          });
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

});

bot.login(token);
