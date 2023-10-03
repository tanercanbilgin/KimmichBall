// Definitions
const { SlashCommandBuilder } = require('@discordjs/builders')
const shortcuts = require('../../utils/shortcuts.js')

module.exports = {
  data: {
    name: 'panel',
    cooldown: 5,
    slash: new SlashCommandBuilder()
      .setName('panel')
      .setDescription('Admin panelini açar.')
  },

  async execute (interaction) {
    await error(interaction, 'Komut kodlanmaya devam ediyor...')
  }
}
