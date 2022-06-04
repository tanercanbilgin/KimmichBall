const {
  Client,
  MessageEmbed,
  MessageActionRow,
  MessageButton,
} = require("discord.js");
const Model = require("./models/model");
const settings = require("./settings");
// Auth token
const token = process.env.AUTH_TOKEN;

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
  const splittedMsg = message.content.split(/ +/gm);
  const [command] = splittedMsg;

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
        }
      } catch (e) {
        console.error(e);
      }
    } else {
      message.reply(
        "kanalın amacının dışına çıkıyorsun, kayıt olman gerekiyor!"
      );
      if (message.deletable) await message.delete({ timeout: 5_000 });
    }
  }
});

bot.login(token);
