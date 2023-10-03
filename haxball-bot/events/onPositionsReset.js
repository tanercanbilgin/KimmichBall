// Definitions
const room = global.room;

module.exports = {
    event_name: "onPositionsReset",
    execute() {
    lastTouches = Array(2).fill(null)
    lastTeamTouched = Team.SPECTATORS
    playSituation = Situation.KICKOFF
  }
}