const { SlashCommandBuilder } = require('@discordjs/builders')

module.exports = {
  data: {
    name: 'oyuncular',
    cooldown: 1,
    slash: new SlashCommandBuilder()
      .setName('oyuncular')
      .setDescription('Oda oyuncularını gösterir.')
  },

  async execute (interaction) {
    const room = getRoom(3)(room)
    console.log(room)
  }
}
