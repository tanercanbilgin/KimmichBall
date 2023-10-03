// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerAdminChange",
    execute(changedPlayer, byPlayer) {
    updateTeams()
    if (!changedPlayer.admin && getRole(changedPlayer) >= Role.ADMIN_TEMP) {
      room.setPlayerAdmin(changedPlayer.id, true)
    }
  }
}