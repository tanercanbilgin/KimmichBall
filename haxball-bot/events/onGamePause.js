// Definitions
const room = global.room;

module.exports = {
    event_name: "onGamePause",
    execute(byPlayer) {
    if (mentionPlayersUnpause && gameState == State.PAUSE) {
      if (byPlayer != null) {
        room.sendAnnouncement(
          `Oyun ${byPlayer.name} tarafından durduruldu!`,
          null,
          defaultColor,
          'bold',
          HaxNotification.NONE
        )
      } else {
        room.sendAnnouncement(
          'Oyun durduruldu !',
          null,
          defaultColor,
          'bold',
          HaxNotification.NONE
        )
      }
    }
    clearTimeout(unpauseTimeout)
    gameState = State.PAUSE
  }
  }