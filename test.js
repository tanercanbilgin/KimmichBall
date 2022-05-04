var testtoken = "thr1.AAAAAGJxU4R5Xfc6-yAbsg.ZD-7-i8Xlmk"
var room = HBInit({ roomName: "kimmich birşeyler deniyor", token: testtoken, noPlayer: true, maxPlayers: 4, public: true });

room.setDefaultStadium("Big");
room.setScoreLimit(3);
room.setTimeLimit(3);


let playerdata = new Map();

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

async function newPlayer (a, b, c) {
  await postData(`http://localhost:3000/api/newplayer`, { name: a, auth: b, isAdmin: false, discordID: c, goals: 0 });
};

function playercode() {
  var uuid = Math.random().toString(36).slice(-6);
  return uuid
}

async function checkPlayer (a) {
  const req = await fetch (`http://localhost:3000/api/getAuth/${a}`);
  const res = await req.json();
  return res;
}

async function checkAdmin (a, b) {
  const req = await fetch (`http://localhost:3000/api/getAuth/${a}`);
  const res = await req.json();
  if (res != undefined){
    if (Object.values(res).includes(true)) {
      room.setPlayerAdmin(b, true)
  }
}
}

async function checkDiscord () {
  const req = await fetch (`http://localhost:3000/api/auth/user`);
  const res = await req.json();
  if (res != 1) {
    return res["id"]
  }
}

const authUrl = "https://shorturl.at/gtwF4"

room.onPlayerChat = async function(player, message) {
  if (message == "!dc") {
    const pchecker = await checkPlayer(players.get(player.id).auth);
    const dchecker = await checkDiscord();
    console.log("pchecker "+pchecker+" dchecker "+dchecker)
    if (pchecker == undefined && dchecker == undefined) {
      room.sendAnnouncement("❎ Kayıtlı değilsin.\nKayıt olmak için hesabını discorda bağla.", players.get(player.id).id,0xf7fff9,"normal",1);
      room.sendAnnouncement("Kayıt olman için gereken discord linki: "+ authUrl, players.get(player.id).id,0xf7fff9,"normal",1);
    } else if (dchecker != undefined) {
        newPlayer(players.get(player.id).name, players.get(player.id).auth, dchecker);
        room.sendAnnouncement("Discord hesabınla başarıyla kaydoldun!", players.get(player.id).id,0xf7fff9,"normal",1);
        fetch("http://localhost:3000/api/auth/revoke");
    } else if (pchecker != null && dchecker == undefined) {
      room.sendAnnouncement("Discord hesabını zaten eşleştirdin!", players.get(player.id).id,0xf7fff9,"normal",1);
  }
  }
}

let players = new Map;

room.onPlayerJoin = async function(player) {
  players.set(player.id,player);
  await checkAdmin(players.get(player.id).auth, players.get(player.id).id);
};