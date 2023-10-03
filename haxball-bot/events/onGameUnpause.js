// Definitions
const room = global.room;

module.exports = {
    event_name: "onGameUnpause",
    execute(byPlayer) {
    unpauseTimeout = setTimeout(() => {
      gameState = State.PLAY
    }, 2000)
    if (mentionPlayersUnpause) {
      if (byPlayer != null) {
        room.sendAnnouncement(
          `Oyun ${byPlayer.name} tarafından devam ettiriliyor !`,
          null,
          defaultColor,
          'bold',
          HaxNotification.NONE
        )
      } else {
        room.sendAnnouncement(
          'Oyun devam ediyor !',
          null,
          defaultColor,
          'bold',
          HaxNotification.NONE
        )
      }
    }
    if (
      (teamRed.length == teamSize &&
        teamBlue.length == teamSize &&
        chooseMode) ||
      (teamRed.length == teamBlue.length && teamSpec.length < 2 && chooseMode)
    ) {
      deactivateChooseMode()
    }
  }
}