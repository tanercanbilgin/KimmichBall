// Definitions
const { ActionRowBuilder, ButtonBuilder, StringSelectMenuBuilder, EmbedBuilder } = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders')
const { performance } = require('perf_hooks')
const util = require('util')
const shortcuts = require('../../utils/shortcuts.js')

module.exports = {
  data: {
    name: 'eval',
    cooldown: 0,
    slash: new SlashCommandBuilder()
      .setName('eval')
      .setDescription('Kod denemeye yarar.')
      .addStringOption(option => option.setName('input').setDescription('Döndürülecek kodu gir').setRequired(true))
  },

  async execute (interaction) {
    const clean = text => {
      if (typeof text !== 'string') {
        text = util.inspect(text, { depth: 0 }).replace(/`/g, '`' + String.fromCharCode(8203)).replace(/@/g, '@' + String.fromCharCode(8203))
      };

      return text
    }

    const evalCode = interaction.options.getString('input')
    const startTime = performance.now(); let finishTime
    let gotError = false
    let evaled
    let resultType

    try {
      evaled = await eval(evalCode)
      resultType = typeof evaled
      evaled = clean(evaled)
      finishTime = performance.now()
    } catch (err) {
      evaled = err.toString()
      resultType = err.name
      gotError = true
      finishTime = performance.now()
    };

    const eval_embed = new EmbedBuilder()
      .setTitle(gotError ? 'Komutta Hata Var.' : 'Komut Yürütüldü.')
      .setDescription(`**${gotError ? 'Hata' : 'Tür'}**: ${resultType}\n**Uzunluk**: ${evaled.length}\n**Süre**: \`${(finishTime - startTime).toFixed(3)}\`ms`)
      .setColor(gotError ? '#ED4245' : '#57F287')
      .addFields(
        { name: 'Girilen', value: `\`\`\`js\n${evalCode}\`\`\``, inline: false },
        { name: 'Çıkan', value: `\`\`\`js\n${evaled}\`\`\``, inline: false }
      )
      .setTimestamp()

    interaction.channel.send({ embeds: [eval_embed] })
  }
}
