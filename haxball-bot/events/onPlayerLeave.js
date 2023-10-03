// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerLeave",
    execute(player) {
    setTimeout(() => {
      if (!kickFetchVariable) {
        if (giriscikisWebhook != '') {
          const giriscikisfields = [
            {
              name: '```👤 Kullanıcı Adı```',
              value: `\`\`\`${player.name}#${player.id}\`\`\``,
              inline: false
            },
            {
              name: '```🔑 Auth```',
              value: `\`\`\`${authArray[player.id][0]}\`\`\``,
              inline: false
            },
            {
              name: '```🔒 Conn```',
              value: `\`\`\`${authArray[player.id][1]}\`\`\``,
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
          const giriscikisembed = {
            embeds: [
              {
                fields: giriscikisfields,
                color: 14958399,
                username: 'Giriş - Çıkış Takip Botu'
              }
            ]
          }
          fetch(giriscikisWebhook, {
            method: 'POST',
            body: JSON.stringify(giriscikisembed),
            headers: {
              'Content-Type': 'application/json'
            }
          }).then((res) => res)
        }
      } else kickFetchVariable = false
    }, 10)
    handleLineupChangeLeave(player)
    checkCaptainLeave(player)
    updateTeams()
    handlePlayersLeave()
  }
}