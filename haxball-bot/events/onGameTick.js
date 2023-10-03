// Definitions
const room = global.room;

module.exports = {
    event_name: "onGameTick",
    execute() {
    checkTime()
    getLastTouchOfTheBall()
    getGameStats()
    handleActivity()
    if (GetTeam(1).length > 0 && GetTeam(2).length > 0 && currentStadium == 'v3') {
      mostForwardPlayer()
      adjustDefLines()
      moveDefLines()
      redDefPlayerCount()
      blueDefPlayerCount()
    }
  }
}