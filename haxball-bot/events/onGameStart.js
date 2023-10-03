// Definitions
const room = global.room;

module.exports = {
  event_name: "onGameStart",
  execute(byPlayer) {
      if (currentStadium == 'v3') {
        findDefLines()
      }
      room.startRecording()
      clearTimeout(startTimeout)
      if (byPlayer != null) clearTimeout(stopTimeout)
      game = new Game()
      possession = [0, 0]
      actionZoneHalf = [0, 0]
      gameState = State.PLAY
      endGameVariable = false
      goldenGoal = false
      playSituation = Situation.KICKOFF
      lastTouches = Array(2).fill(null)
      lastTeamTouched = Team.SPECTATORS
      teamRedStats = []
      teamBlueStats = []
      if (teamRed.length == teamSize && teamBlue.length == teamSize) {
        for (let i = 0; i < teamSize; i++) {
          teamRedStats.push(teamRed[i])
          teamBlueStats.push(teamBlue[i])
        }
      }
      // calculateStadiumVariables();
    }
  }