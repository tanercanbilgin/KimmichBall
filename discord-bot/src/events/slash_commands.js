// Definitions

const client = global.client

module.exports = {
  name: 'Discord Slash Komut Handler',
  event_name: 'interactionCreate',
  execute (interaction) {
    if (!interaction.isCommand()) return

    const command = client.commands.get(interaction.commandName)
    if (!command) return

    const finish = new Date()
    finish.setSeconds(finish.getSeconds() + command.data.cooldown)

    if (client.cooldowns.has(`${interaction.commandName}_${interaction.user.id}`)) {
      const finish = client.cooldowns.get(`${interaction.commandName}_${interaction.user.id}`)
      const date = new Date()
      const kalan = (new Date(finish - date).getTime() / 1000).toFixed(2)
      return error(interaction, `Bu komutu tekrardan kullanabilmek için **${kalan} saniye** beklemeniz gerekmektedir.`)
    };

    command.execute(interaction)
    if (command.data.cooldown > 0) {
      client.cooldowns.set(`${interaction.commandName}_${interaction.user.id}`, finish)
      setTimeout(() => {
        client.cooldowns.delete(`${interaction.commandName}_${interaction.user.id}`)
      }, command.data.cooldown * 1000)
    };
  }
}
