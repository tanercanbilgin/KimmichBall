// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerChat",
    execute(player, message) {
    const tag = authArray[player.id][3] ? '✔️ ' : '❌ '
  
    if (gameState !== State.STOP && player.team != Team.SPECTATORS) {
      const pComp = getPlayerComp(player)
      if (pComp != null) pComp.inactivityTicks = 0
    }
    const msgArray = message.split(/ +/)
    if (roomWebhook != '') {
      fetch(roomWebhook, {
        method: 'POST',
        body: JSON.stringify({
          content: `\`\`\`diff\n+ [${getDate()}] ${player.name
            } : ${message.replace('@', '@ ')}\`\`\``,
          username: 'Sohbet Tekrarı Botu'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((res) => res)
    }
  
    if (msgArray[0][0] == '!') {
      const command = getCommand(msgArray[0].slice(1).toLowerCase())
      if (command != false && commands[command].roles <= getRole(player)) { commands[command].function(player, message) } else {
        room.sendAnnouncement(
          'Böyle bir komut yok, komutlar için !yardım yazabilirsin.',
          player.id,
          errorColor,
          'bold',
          HaxNotification.CHAT
        )
      }
      return false
    }
    if (msgArray[0].toLowerCase() == 't') {
      teamChat(player, message)
      return false
    }
    if (msgArray[0].substring(0, 2) === '@@') {
      playerChat(player, message)
      return false
    }
    if (chooseMode && teamRed.length * teamBlue.length != 0) {
      const choosingMessageCheck = chooseModeFunction(player, message)
      if (choosingMessageCheck) return false
    }
    if (slowMode > 0) {
      const filter = slowModeFunction(player, message)
      if (filter) return false
    }
    if (!player.admin && muteArray.getByAuth(authArray[player.id][0]) != null) {
      room.sendAnnouncement(
        'Ceza yediğin için mesaj yazamazsın !',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
      for (var a = 0; a < playersAll.length; a++) {
        if (playersAll[a].admin == true) {
          room.sendAnnouncement(tag + player.name + '・' + message, playersAll[a].id, 0xFFFF00, 'bold', 1)
        }
      }
      return false
    }
  
    if (isUsingIllegalChars(message)) {
      room.sendAnnouncement(
        'Yasaklı karakterler kullanmaya devam edersen banlanacaksın!',
        player.id,
        errorColor,
        'bold',
        2
      )
  
      return false
    }
    if (message.match(checkBadWords(message))) {
      if (getRole(player) <= Role.ADMIN_TEMP) {
        room.sendAnnouncement(
          'Böyle konuşmaya devam edersen kalıcı olarak banlanacaksın!',
          player.id,
          errorColor,
          'bold',
          2
        )
        for (var a = 0; a < playersAll.length; a++) {
          if (playersAll[a].admin == true) {
            room.sendAnnouncement(tag + player.name + '・' + message, playersAll[a].id, errorColor, 'bold', 0)
          }
        }
        return false
      }
    }
  
    // Renkli Yazı
    if (getRole(player) == Role.MASTER) {
      room.sendAnnouncement(
        '👑 ' + player.name + '・' + message,
        undefined,
        '0xE91E63',
        'normal'
      )
      return false
    } else if (getRole(player) == Role.ADMIN_PERM) {
      room.sendAnnouncement(
        '⚡️ ' + player.name + '・' + message,
        undefined,
        '0x5499C7',
        'normal'
      )
      return false
    } else if (getRole(player) == Role.VIP) {
      room.sendAnnouncement(
        'VIP 💎 ' + player.name + '・' + message,
        undefined,
        '0x2ECC71',
        'normal'
      )
      return false
    } else if (getRole(player) == Role.ADMIN_TEMP) {
      room.sendAnnouncement(
        '✨ ' + player.name + '・' + message,
        undefined,
        '0xC0D8E8',
        'normal'
      )
      return false
    } else if ((getRole(player) < Role.ADMIN_TEMP)) {
      if (allMuted == true) {
        for (var a = 0; a < playersAll.length; a++) {
          if (playersAll[a].admin == true) {
            room.sendAnnouncement(tag + player.name + '・' + message, playersAll[a].id, 0xFFFF00, 'normal', 1)
          }
        }
        room.sendAnnouncement(
          'Sohbet şu anda bütün oyuncular için kapalı, açıldığında tekrar konuşabileceksin.',
          player.id,
          errorColor,
          'bold',
          null
        )
        return false
      }
      room.sendAnnouncement(
        tag + player.name + '・' + message,
        undefined,
        '0xD5D8DC',
        'normal'
      )
      return false
    }
  }
}