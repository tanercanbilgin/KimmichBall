const {
  Client,
  MessageEmbed,
} = require("discord.js");
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

  if (message.channel.id == '980178670914265089') {
    const {
      content: messageContent,
      author: userAccount,
      member: guildMember,
    } = message;
    const [cmd, auth] = messageContent.split(/ +/gim);
    if (cmd === "!kayıt" && auth) {
      try {
        const user = await Model.findOne({ auth });
        if (user && user._doc.discordID == "0") {
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
          message.author.send("```c\nSunucumuza başarıyla kayıt oldun! Odalarımızın devamı için VIP alarak bizlere destek olabilirsin.");
        }
        else if (auth) {
          if (message.deletable) await message.delete({ timeout: 5_000 });
          message.author.send("```c\nKodu yanlış veya eksik girmiş olabilirsin, tekrar kontrol et. Ayrıca, uygulama kullanıyosan kodun farklı; yöneticilerden yardım alabilirsin.```")
        }
      } catch (e) {
        console.error(e);
      }
    }
  }

  if (message.channel.id == '984939359675498498') {

    const [cmd,] = message.content.split(/ +/gim);

    if (cmd == "!rank") {
      try {

        const pos = await Model.find()
          .sort({ puan: -1 })

        for (var i = 0; i < pos.length; i++) {
          pos[i].rank = i + 1;
        }

        const user = pos.filter(element => element.discordID == message.author.id);

        const _Embed = new MessageEmbed();

        if (user != "") {

          function getDate(tarih) {
            var options = {
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            };
            var date = new Date(tarih * 1000);
            var date_string = date.toLocaleString('tr-TR', options);
            return date_string
          }

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

          const winrate = Math.floor((100 * user[0].galibiyet) / (user[0].oyunlar || 1))

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
          _Embed.addFields({
            "name": "```🗓️ Kayıt```",
            "value": `\`\`\`c\n${getDate(user[0].createdAt)}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```⌛ Aktiflik```",
            "value": `\`\`\`c\n${getTimeStats(user[0].aktiflik)}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```📅 Son Giriş```",
            "value": `\`\`\`c\n${getDate(user[0].updatedAt)}\`\`\``,
            "inline": true,
          });
          _Embed.setFooter({
            "text": `💖 VIP alarak bu sunucunun devamını sağlayabilirsin `,
          });
          message.channel.send({
            embeds: [_Embed],
          });
        }
        else if (user = "") {
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

  if (message.channel.id == '989128942982152292') {

    const [cmd,] = message.content.split(/ +/gim);

    if (cmd == "!sıralama") {
      try {

        const data = await Model.find()
          .sort({ puan: -1 })
          .limit(10)

        const _Embed = new MessageEmbed();

        if (data != "") {

          function avatar(user) {
            if (user.puan < 850) return "👎";
            if (user.puan >= 850 && user.puan < 950) return "👍";
            if (user.puan >= 950 && user.puan < 1000) return "🌵";
            if (user.puan >= 1000 && user.puan < 1050) return "🔥";
            if (user.puan >= 1050 && user.puan < 1100) return "💧";
            if (user.puan >= 1100 && user.puan < 1150) return "⚡";
            if (user.puan >= 1150 && user.puan < 1200) return "💎";
            if (user.puan >= 1200 && user.puan < 1250) return "🏆";
            if (user.puan >= 1250) return "👑";
          }

          function winrate(user) {
            return Math.floor((100 * user.galibiyet) / (user.oyunlar || 1))
          }

          let first = '';
          let second = '';
          let third = '';

          for (let i = 0; i < data.length; i++) {
            first += `${avatar(data[i])} ${data[i].isim}\n`;
            second += `${data[i].puan}\n`
            third += `%${winrate(data[i])}\n`
          }

          _Embed.setColor("#c0f00b");
          _Embed.addFields({
            "name": "```İsim```",
            "value": `\`\`\`c\n${first}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```Puan```",
            "value": `\`\`\`c\n${second}\`\`\``,
            "inline": true,
          });
          _Embed.addFields({
            "name": "```Kazanma Oranı```",
            "value": `\`\`\`c\n${third}\`\`\``,
            "inline": true,
          });
          _Embed.setFooter({
            "text": `💖 VIP alarak bu sunucunun devamını sağlayabilirsin `,
          });
          message.channel.send({
            embeds: [_Embed],
          });
        }
        else {
          _Embed.setColor("#ED4245");
          _Embed.setDescription("Bir sorun var, lütfen yöneticilerle iletişime geç.");
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
