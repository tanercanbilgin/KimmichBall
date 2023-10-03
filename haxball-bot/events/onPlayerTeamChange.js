// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerTeamChange",
    execute(changedPlayer, byPlayer) {
  handleLineupChangeTeamChange(changedPlayer)
  if (AFKSet.has(changedPlayer.id) && changedPlayer.team != Team.SPECTATORS) {
    room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS)
    room.sendAnnouncement(
      `${changedPlayer.name} AFK olduğu için onu kullanamazsın !`,
      null,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
    return
  }
  updateTeams()
  if (gameState != State.STOP) {
    if (
      changedPlayer.team != Team.SPECTATORS &&
      game.scores.time <= (3 / 4) * game.scores.timeLimit &&
      Math.abs(game.scores.blue - game.scores.red) < 2
    ) {
      changedPlayer.team == Team.RED
        ? teamRedStats.push(changedPlayer)
        : teamBlueStats.push(changedPlayer)
    }
  }
  handleActivityPlayerTeamChange(changedPlayer)
  handlePlayersTeamChange(byPlayer)
}
}