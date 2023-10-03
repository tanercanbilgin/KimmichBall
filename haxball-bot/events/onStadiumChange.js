// Definitions
const room = global.room;

module.exports = {
    event_name: "onStadiumChange",
    execute(newStadiumName, byPlayer) {
    if (byPlayer !== null) {
      if (getRole(byPlayer) < Role.MASTER && currentStadium != 'özel') {
        room.sendAnnouncement(
          'Elle harita değiştiremezsin. Lütfen harita komutlarını kullan.',
          byPlayer.id,
          errorColor,
          'bold',
          HaxNotification.CHAT
        )
        stadiumCommand(emptyPlayer, `!${currentStadium}`)
      } else {
        room.sendAnnouncement(
          'Harita değişti fakat bir dahaki sefere harita komutlarını kullan. Böyle bota zarar verebilirsin.',
          byPlayer.id,
          infoColor,
          'bold',
          HaxNotification.CHAT
        )
        currentStadium = 'özel'
      }
    }
    checkStadiumVariable = true
  }
}