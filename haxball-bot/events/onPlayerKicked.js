// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerKicked",
    execute(kickedPlayer, reason, ban, byPlayer) {
    kickFetchVariable = true
    if (kickbanWebhook != '') {
      const kickbanfields = [
        {
          name: '```👤 Kullanıcı Adı```',
          value: `\`\`\`${kickedPlayer.name}#${kickedPlayer.id}\`\`\``,
          inline: false
        },
        {
          name: '```📝 Sebep```',
          value: `\`\`\`${reason == '' ? 'Yok' : reason}\`\`\``,
          inline: false
        },
        {
          name: `\`\`\`${ban ? '🔨 Banlayan' : '🔧 Kickleyen'}\`\`\``,
          value: `\`\`\`${byPlayer == null ? '🤖 Bot' : byPlayer.name}\`\`\``,
          inline: false
        },
        {
          name: '```🗓️ Tarih```',
          value: `\`\`\`c\n${getDate()}\`\`\``,
          inline: false
        },
        {
          name: '```👤 Oyuncu Sayısı```',
          value: `\`\`\`c\n(${playersAll.length}/${maxPlayers})\`\`\``,
          inline: false
        }
      ]
      const kickbanembed = {
        embeds: [
          {
            fields: kickbanfields,
            color: 14958399,
            username: 'Kick - Ban Takip Botu'
          }
        ]
      }
      fetch(kickbanWebhook, {
        method: 'POST',
        body: JSON.stringify(kickbanembed),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res)
    }
  }
}