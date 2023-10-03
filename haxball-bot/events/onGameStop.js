// Definitions
const room = global.room;

module.exports = {
    event_name: "onGameStop",
    execute(byPlayer) {
    if (currentStadium == 'v3') {
      defLines = []
    }
    clearTimeout(stopTimeout)
    clearTimeout(unpauseTimeout)
    if (byPlayer != null) clearTimeout(startTimeout)
    game.rec = room.stopRecording()
    if (
      !cancelGameVariable &&
      game.playerComp[0].length + game.playerComp[1].length > 0 &&
      ((game.scores.timeLimit != 0 &&
        ((game.scores.time >= 0.5 * game.scores.timeLimit &&
          game.scores.time < 0.75 * game.scores.timeLimit &&
          game.scores.red != game.scores.blue) ||
          game.scores.time >= 0.75 * game.scores.timeLimit)) ||
        endGameVariable)
    ) { fetchSummaryEmbed(game) }
    if (fetchRecordingVariable) {
      setTimeout((gameEnd) => { fetchRecording(gameEnd) }, 500, game)
    }
    cancelGameVariable = false
    gameState = State.STOP
    playSituation = Situation.STOP
    updateTeams()
    handlePlayersStop(byPlayer)
    handleActivityStop()
  }
}