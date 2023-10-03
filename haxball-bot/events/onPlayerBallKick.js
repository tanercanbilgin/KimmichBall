// Definitions
const room = global.room;

module.exports = {
    event_name: "onPlayerBallKick",
    execute(player) {
    if (playSituation != Situation.GOAL) {
      const ballPosition = room.getBallPosition()
      if (
        game.touchArray.length == 0 ||
        player.id != game.touchArray[game.touchArray.length - 1].player.id
      ) {
        if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY
        lastTeamTouched = player.team
        game.touchArray.push(
          new BallTouch(player, game.scores.time, getGoalGame(), ballPosition)
        )
        lastTouches[0] = checkGoalKickTouch(
          game.touchArray,
          game.touchArray.length - 1,
          getGoalGame()
        )
        lastTouches[1] = checkGoalKickTouch(
          game.touchArray,
          game.touchArray.length - 2,
          getGoalGame()
        )
      }
    }
  }
}