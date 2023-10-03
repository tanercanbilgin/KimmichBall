const { spawn } = require("child_process");
const path = require("path");
const roomConfigs = require("./utils/rooms");

const roomProcesses = {};

roomConfigs.forEach((roomConfig) => {
    const roomPath = path.join(__dirname, "rooms", `v${roomConfig.id}.js`);
    const roomProcess = spawn("node", [roomPath]);

    roomProcess.stdout.on("data", (data) => {
        console.log(`room${roomConfig.id}: ${data}`);
    });

    roomProcess.stderr.on("data", (data) => {
        console.error(`room${roomConfig.id} error: ${data}`);
    });

    roomProcess.on("close", (code) => {
        console.log(`room${roomConfig.id} process exited with code ${code}`);
    });

    // Create a global object for the room script with the room object
    global[`room${roomConfig.id}`] = {
        getRoom: (room) => room,
    };

    // Store the room process in the roomProcesses object
    roomProcesses[roomConfig.id] = roomProcess;
});

// Function to get the room object for a specific room ID
function getRoom(roomId) {
    const roomProcess = roomProcesses[roomId];
    if (!roomProcess) {
        throw new Error(`No room process found for room ${roomId}`);
    }
    const roomObject = global[`room${roomId}`];
    if (!roomObject) {
        throw new Error(`No global room object found for room ${roomId}`);
    }
    return roomObject;
}

module.exports = {
    roomProcesses,
    getRoom,
};