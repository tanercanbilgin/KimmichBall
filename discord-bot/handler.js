// Definitions
const { Collection, Client, REST, Routes } = require("discord.js");
const { readdir, readdirSync } = require("fs");
require('dotenv').config();

// Event Loader
try {
    const eventFiles = readdirSync("./discord-bot/src//events").filter(file => file.endsWith(".js"));
    for (const file of eventFiles) {
        const event = require(`./src/events/${file}`);
        if (!event) return;
        client.on(event.event_name, event.execute);
        console.log(`[D-EVENT] ${event.name} adlı event başarıyla yüklendi!`);
    }
} catch (e) {
    console.log(`[D-HATA] Eventler yüklenirken bir hata ortaya çıktı:\n` + e);
}

// Command Loader
const rest = new REST({ version: '10' }).setToken(process.env.MAINBOT);
const slash_commands = [];
client.commands = new Collection();
client.cooldowns = new Collection();

const commandDirs = readdirSync("./discord-bot/src/commands");

for (const dir of commandDirs) {
    const files = readdirSync(`./discord-bot/src//commands/${dir}`).filter(file => file.endsWith(".js"));
    for (const file of files) {
        const command = require(`./src/commands/${dir}/${file}`);
        client.commands.set(command.data.name, command);
        slash_commands.push(command.data.slash.toJSON());
        console.log(`[D-COMMAND] ${command.data.name} adlı komut yüklendi.`);
    }
}

setTimeout(() =>
    rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), { body: slash_commands }).then(() => console.log("[BOT] Slash komutları başarıyla yüklendi."))
    , 1_000);

// Error Handler
process.on('uncaughtException', err => console.log(err));