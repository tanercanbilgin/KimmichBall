// Definitions
const room = global.room;

module.exports = {
    event_name: "onKickRateLimitSet",
    execute(min, rate, burst, byPlayer) {
    if (byPlayer != null) {
      room.sendAnnouncement(
        'Kickrate değerlerini değiştiremezsin! Bu sunucuda değerler sabit.',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
      room.setKickRateLimit(6, 0, 0)
    }
  }
}