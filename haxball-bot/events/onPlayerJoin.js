// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerJoin",
    async execute(player) {
    authArray[player.id] = [player.auth, player.conn, player.name, false, false, false, false]
  
    if (player.auth == null) { room.kickPlayer(player.id, 'Anonim hesaplar sunucumuza alınmıyor!', true) }
  
    if (await isBlacklisted(player) == true) room.kickPlayer(player.id, 'Artık dinlenme vakti; kitap okuyabilirsin, uyuyabilirsin..', false)
  
    if ((await checkPlayer(authArray[player.id][0])) == null) {
      await newPlayer(
        authArray[player.id][2],
        authArray[player.id][0],
        authArray[player.id][1]
      )
    }
  
    const stats = Object.fromEntries(Object.entries(await checkPlayer(authArray[player.id][0])).filter(([key, value]) => key !== '_id'))
    // 1000 Puan Filtre if (stats.oyunlar > 10 && stats.puan <= 1000 && !stats.isAdmin && !stats.isMaster) room.kickPlayer(player.id, "Sadece 1000 Puan üstü normal odasına girebilir.", false);
  
    authArray[player.id][3] = stats.discordID != 0
    authArray[player.id][4] = stats.isVIP != 0
    authArray[player.id][5] = stats.isAdmin != 0
    authArray[player.id][6] = stats.isMaster != 0
  
    room.setPlayerAvatar(player.id, getAvatar(stats.puan))
  
    if (authArray[player.id][2] != stats.isim) {
      setTimeout(async () => { await updateName(authArray[player.id][0], authArray[player.id][2]) }, '1000')
      room.sendAnnouncement(
        stats.isim + ' ismini ' + player.name + ' olarak değiştirmiş!',
        null,
        0xffffff
      )
    }
  
    if (authArray[player.id][1] != stats.conn) { setTimeout(async () => { await updateConn(authArray[player.id][0], authArray[player.id][1]) }, '1000') }
  
    if (giriscikisWebhook != '') {
      const giriscikisfields = [
        {
          name: '```👤 Kullanıcı Adı```',
          value: `\`\`\`${stats.isim != player.name ? `(${stats.isim})` : ''}${player.name}#${player.id}\`\`\``,
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
          value: `\`\`\`c\n(${playersAll.length + 1}/${maxPlayers})\`\`\``,
          inline: false
        }
      ]
      const giriscikisembed = {
        embeds: [
          {
            fields: giriscikisfields,
            color: 9567999,
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
    room.sendAnnouncement(
      `👋 ${player.name}, hoşgeldin ! Komutlara göz atmayı unutma, !yardım !dc !avatarlar\n${stats.discordID == 0 ? '📢Hesabının Discorda bağlı olmadığı tespit edildi! İstatistiklerinin silinmesini istemiyorsan kayıt olmalısın!\n📢 Discord sunucumuzda kayıt olduktan sonra isminin yanındaki işaret yeşile dönecek.' : ''}`,
      player.id,
      welcomeColor,
      'bold',
      HaxNotification.CHAT
    )
    updateTeams()
    if (authArray[player.id][6] == true) {
      room.sendAnnouncement(
        `KURUCU 👑 ${player.name} odaya giriş yaptı !`,
        null,
        '0xE91E63',
        'bold',
        HaxNotification.CHAT
      )
      room.setPlayerAdmin(player.id, true)
    } else if (authArray[player.id][5] == true) {
      room.sendAnnouncement(
        `ADMİN ⚡️ ${player.name} odaya giriş yaptı !`,
        null,
        '0x5499C7',
        'bold',
        HaxNotification.CHAT
      )
      room.setPlayerAdmin(player.id, true)
    } else if (authArray[player.id][4] == true) {
      room.sendAnnouncement(
        `VIP 💎${player.name} odaya giriş yaptı !`,
        null,
        '0x2ECC71',
        'bold',
        HaxNotification.CHAT
      )
    }
    const sameAuthCheck = playersAll.filter(
      (p) => p.id != player.id && authArray[p.id][0] == player.auth
    )
    if (sameAuthCheck.length > 0 && !debugMode) {
      const oldPlayerArray = playersAll.filter(
        (p) => p.id != player.id && authArray[p.id][0] == player.auth
      )
      for (const oldPlayer of oldPlayerArray) {
        ghostKickHandle(oldPlayer, player)
      }
    }
    handlePlayersJoin()
  }
}