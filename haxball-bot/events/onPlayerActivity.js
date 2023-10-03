// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerActivity",
    execute(player) {
    if (gameState !== State.STOP) {
      const pComp = getPlayerComp(player)
      if (pComp != null) pComp.inactivityTicks = 0
    }
  }
}