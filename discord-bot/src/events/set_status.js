// Definitions
const client = global.client;

module.exports = {
    name: "Durum Ayarlama",
    event_name: "ready",
    execute() {
        client.user.setPresence({
            activities: [{ name: 'GELİYORUZ..' }],
            status: 'idle',
            type: 'PLAYING'
        })
    }
}