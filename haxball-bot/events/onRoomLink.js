// Definitions
const room = global.room;

module.exports = {
    event_name: "onRoomLink",
    execute(url) {
    if (currentStadium == 'v3') {
      if (isRoomSet == false) {
        fillIndicators()
        isRoomSet = true
      }
    }
    console.log(`${url}`)
    roomLink = url
  }
}