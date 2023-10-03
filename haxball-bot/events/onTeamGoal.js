// Definitions
const room = global.room;

module.exports = {
    event_name: "onTeamGoal",
    async execute(team) {
    const scores = room.getScores()
    game.scores = scores
    playSituation = Situation.GOAL
    ballSpeed = getBallSpeed()
    const goalString = getGoalString(team)
    for (const player of teamRed) {
      var playerComp = getPlayerComp(player)
      team == Team.RED
        ? playerComp.goalsScoredTeam++
        : playerComp.goalsConcededTeam++
    }
    for (const player of teamBlue) {
      var playerComp = getPlayerComp(player)
      team == Team.BLUE
        ? playerComp.goalsScoredTeam++
        : playerComp.goalsConcededTeam++
    }
    room.sendAnnouncement(
      goalString,
      null,
      team == Team.RED ? redColor : blueColor,
      null,
      HaxNotification.CHAT
    )
    if (
      (scores.scoreLimit != 0 &&
        (scores.red == scores.scoreLimit ||
          scores.blue == scores.scoreLimit)) ||
      goldenGoal
    ) {
      await endGame(team)
      goldenGoal = false
      stopTimeout = setTimeout(() => {
        room.stopGame()
      }, 1000)
    }
  }
}