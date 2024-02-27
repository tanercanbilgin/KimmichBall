const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  data: {
    name: 'oyuncular',
    cooldown: 1,
    slash: new SlashCommandBuilder()
      .setName('oyuncular')
      .setDescription('Oda oyuncularını gösterir.')
  },

  async execute(interaction) {
    // Retrieve the player list from the Haxball room
    const players = client.room.getPlayerList();

    // Check if there are no players
    if (players.length === 0) {
      await interaction.reply('Odada oyuncu yok');
      return;
    }

    // Create a formatted message with the player list
    const playerListMessage = 'Players in the room:\n' +
    players.map(player => `ID: ${player.id}, Name: ${player.name}`).join('\n');

    // Send the player list as a reply to the Discord channel
    await interaction.reply(playerListMessage);
  }
};
