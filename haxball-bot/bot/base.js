const { readFileSync, readdirSync } = require('fs')
const buffer = require('buffer')

const kufurlistesi = JSON.parse(readFileSync('haxball-bot/utils/kufurlistesi.json', 'utf8'))
const antrenmanMap = readFileSync('haxball-bot/stadiums/futsalant.json', 'utf8')
const v2Map = readFileSync('haxball-bot/stadiums/futsalv12.json', 'utf8')
const v3Map = readFileSync('haxball-bot/stadiums/futsalv3.json', 'utf8')

require('dotenv').config()

const roomWebhook =
  'https://discord.com/api/webhooks/979845451132076102/9RIyNHCcaUASkZ_drvmrf50bLW3-Gd1wj_wolFUIctyorih6qBGrnIaOFASBptG_K9CI'
const gameWebhook =
  'https://discord.com/api/webhooks/979834834702704670/Ap0OSK-wilADiZQRGvfgVt5yJOe1zK16swSpnfLcq-No3R69d0a-j9WNIPsLvqMIn1Um'
const kickbanWebhook =
  'https://discord.com/api/webhooks/980049915268968508/1YXK-RQhEGxziVvIxHPe8fY4s1Bywgz7QMZF56jNWIngh-RIJ8yNwzPFvrKXTHiWsSeC'
const giriscikisWebhook =
  'https://discord.com/api/webhooks/980050003290640386/TmAz0d-mLNWLTRtFCfwNYdWaQv9lRPfKyeYKlblI3vT3FZDLyENo0o_9ygBFXCLR7UUg'
const recordingWebhook =
  'https://discord.com/api/webhooks/1084552885502738493/ZJlaIzCKBkgXwcmHXE6BT3LrY8eny_hmML4QsQZkLfeZZ7iJSCOyrf7pEMZoXZHO0FDm'

const fetchRecordingVariable = true
const timeLimit = 3
const scoreLimit = 1

let currentStadium = 'antrenman'

room.setScoreLimit(scoreLimit)
room.setTimeLimit(timeLimit)
room.setTeamsLock(true)
room.setKickRateLimit(6, 0, 0)

let roomPassword = ''

/* OPTIONS */

const drawTimeLimit = Infinity
const teamSize = 3
const debugMode = true
const afkLimit = debugMode ? Infinity : 30
const JMap = JSON.parse(v3Map)

const defaultSlowMode = 0.5
const chooseModeSlowMode = 1
let slowMode = defaultSlowMode
const SMSet = new Set()

const mentionPlayersUnpause = true

let allMuted = false

let adminCagirTimeout = false

/* OBJECTS */

class Goal {
  constructor (time, team, striker, assist) {
    this.time = time
    this.team = team
    this.striker = striker
    this.assist = assist
  }
}

class Game {
  constructor () {
    this.date = Date.now()
    this.scores = room.getScores()
    this.playerComp = getStartingLineups()
    this.rec = room.startRecording()
    this.goals = []
    this.touchArray = []
  }
}

class PlayerComposition {
  constructor (player, auth, timeEntry, timeExit) {
    this.player = player
    this.auth = auth
    this.timeEntry = timeEntry
    this.timeExit = timeExit
    this.inactivityTicks = 0
    this.GKTicks = 0
  }
}

class MutePlayer {
  constructor (name, id, auth) {
    this.id = MutePlayer.incrementId()
    this.name = name
    this.playerId = id
    this.auth = auth
    this.unmuteTimeout = null
  }

  static incrementId () {
    if (!this.latestId) this.latestId = 1
    else this.latestId++
    return this.latestId
  }

  setDuration (minutes) {
    this.unmuteTimeout = setTimeout(() => {
      room.sendAnnouncement(
        'Artık yazabilirsin.',
        this.playerId,
        announcementColor,
        'bold',
        HaxNotification.CHAT
      )
      this.remove()
    }, minutes * 60 * 1000)
    muteArray.add(this)
  }

  remove () {
    this.unmuteTimeout = null
    muteArray.removeById(this.id)
  }
}

class MuteList {
  constructor () {
    this.list = []
  }

  add (mutePlayer) {
    this.list.push(mutePlayer)
    return mutePlayer
  }

  getById (id) {
    const index = this.list.findIndex((mutePlayer) => mutePlayer.id === id)
    if (index !== -1) {
      return this.list[index]
    }
    return null
  }

  getByPlayerId (id) {
    const index = this.list.findIndex(mutePlayer => mutePlayer.playerId === id)
    if (index !== -1) {
      return this.list[index]
    }
    return null
  }

  getByAuth (auth) {
    const index = this.list.findIndex((mutePlayer) => mutePlayer.auth === auth)
    if (index !== -1) {
      return this.list[index]
    }
    return null
  }

  removeById (id) {
    const index = this.list.findIndex((mutePlayer) => mutePlayer.id === id)
    if (index !== -1) {
      this.list.splice(index, 1)
    }
  }

  removeByAuth (auth) {
    const index = this.list.findIndex((mutePlayer) => mutePlayer.auth === auth)
    if (index !== -1) {
      this.list.splice(index, 1)
    }
  }
}

class BallTouch {
  constructor (player, time, goal, position) {
    this.player = player
    this.time = time
    this.goal = goal
    this.position = position
  }
}

/* PLAYERS */

const Team = {
  SPECTATORS: 0,
  RED: 1,
  BLUE: 2
}
const State = {
  PLAY: 0,
  PAUSE: 1,
  STOP: 2
}
const Role = {
  PLAYER: 0,
  ADMIN_TEMP: 1,
  VIP: 2,
  ADMIN_PERM: 3,
  MASTER: 4
}
const HaxNotification = {
  NONE: 0,
  CHAT: 1,
  MENTION: 2
}
const Situation = {
  STOP: 0,
  KICKOFF: 1,
  PLAY: 2,
  GOAL: 3
}

let gameState = State.STOP
let playSituation = Situation.STOP
let goldenGoal = false

let playersAll = []
let players = []
let teamRed = []
let teamBlue = []
let teamSpec = []

let teamRedStats = []
let teamBlueStats = []

let banList = []

/* STATS */

let possession = [0, 0]
let actionZoneHalf = [0, 0]
let lastWinner = Team.SPECTATORS
let streak = 0

/* AUTH */

const authArray = []

/* COMMANDS */

const commands = {
  yardım: {
    aliases: ['komutlar'],
    roles: Role.PLAYER,
    desc: `
    Bu komut sana kullanabileceğin komutları gösterir. Nasıl kullanacağını bilmediğin komut için:
Örnek: \'!yardım bb\' sana \'bb\' komutunun nasıl kullanacağını gösterir.`,
    function: helpCommand
  },
  discord: {
    aliases: ['dc'],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odanın discord linkini öğrenebilirsin.`,
    function: dclinkCommand
  },
  afk: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile AFK kalabilirsin.
    En az 1, en fazla 5 dakika afk kalabilirsin. Komutu tekrar kullanmak için 10 dakika beklemelisin`,
    function: afkCommand
  },
  afklar: {
    aliases: ['afklistesi'],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile kimler AFK görebilirsin.`,
    function: afkListCommand
  },
  bb: {
    aliases: ['bay', 'görüşürüz', 'ae'],
    roles: Role.PLAYER,
    desc: `
    Bu komut ile oyunu sorunsuzca terkedebilirsin (önerilir).`,
    function: leaveCommand
  },
  avatar: {
    aliases: ['avatarlar'],
    roles: Role.PLAYER,
    desc: `
    Bu komut ile avatarının neden böyle olduğunu anlayabilirsin.`,
    function: avatarListCommand
  },
  ben: {
    aliases: ['istatistik', 'stat', 'stats', 'me'],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile istatistiklerini görebilirsin.`,
    function: globalStatsCommand
  },
  oyunlar: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en çok oyun oynamış 5 kişiyi görürsün.`,
    function: statsLeaderboardCommand
  },
  galibiyet: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en çok oyun kazanmış 5 kişiyi görürsün.`,
    function: statsLeaderboardCommand
  },
  gol: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en çok gol atmış 5 kişiyi görürsün`,
    function: statsLeaderboardCommand
  },
  asist: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en çok asist yapmış 5 kişiyi görürsün`,
    function: statsLeaderboardCommand
  },
  kk: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki kendi kalesine en çok gol atmış 5 kişiyi görürsün`,
    function: statsLeaderboardCommand
  },
  aktiflik: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en çok zaman geçirmiş 5 kişiyi görürsün.`,
    function: statsLeaderboardCommand
  },
  cs: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en çok gol yememe rekoruna sahip 5 kaleci veya defansı görürsün`,
    function: statsLeaderboardCommand
  },
  puan: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en yüksek puana sahip 5 kişiyi görürsün`,
    function: statsLeaderboardCommand
  },
  bakiye: {
    aliases: [],
    roles: Role.PLAYER,
    desc: `
        Bu komut ile odadaki en yüksek bakiyeye sahip 5 kişiyi görürsün`,
    function: statsLeaderboardCommand
  },
  adminçağır: {
    aliases: ['admincagir', 'administe'],
    roles: Role.PLAYER,
    desc: `
    Bu komut ile önemli durumlarda admin çağırabilirsin.`,
    function: admincagirCommand
  },
  antrenman: {
    aliases: ['ant', 'antr'],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile antrenman haritasını açarsın.`,
    function: stadiumCommand
  },
  v2: {
    aliases: ['v1'],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile v1 - v2 haritasını açarsın.`,
    function: stadiumCommand
  },
  v3: {
    aliases: [''],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile v3 haritasını açarsın.`,
    function: stadiumCommand
  },
  rr: {
    aliases: [],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile oyunu yeniden başlatırsın`,
    function: restartCommand
  },
  rrs: {
    aliases: [],
    roles: Role.ADMIN_TEMP,
    desc: `
    Bu komut ile takımları yer değiştirip oyunu yeniden başlatırsın.`,
    function: restartSwapCommand
  },
  değiş: {
    aliases: ['swap', 's'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Bu komut ile takımları yer değiştirirsin.`,
    function: swapCommand
  },
  kırmızıkick: {
    aliases: [
      'kickr',
      'rediat',
      'redat',
      'kırmızıyıat',
      'kırmızıat',
      'kickrec',
      'kk'
    ],
    roles: Role.ADMIN_TEMP,
    desc: `
    Bu komut ile kırmızı takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
    function: kickTeamCommand
  },
  mavikick: {
    aliases: ['kickb', 'blueat', 'maviyiat', 'maviat', 'kickblue', 'mk'],
    roles: Role.ADMIN_TEMP,
    desc: `
    Bu komut ile mavi takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
    function: kickTeamCommand
  },
  speckick: {
    aliases: [
      'kicks',
      'specat',
      'izleyiciat',
      'izleyiciyiat',
      'izleyicileriat',
      'sk'
    ],
    roles: Role.ADMIN_TEMP,
    desc: `
    Bu komut ile izleyici takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
    function: kickTeamCommand
  },
  mute: {
    aliases: ['sustur', 'mute'],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile bir oyunucuyu susturursun. İstersen yanına kaç dakika susması gerektiğini belirtebilirsin.
        Örnek: !mute #3 20, 3 idsine sahip oyuncuyu 20 dakika boyunca susturur.`,
    function: muteCommand
  },
  muteall: {
    aliases: ['toplusustur', 'toplumute'],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile sunucuyu toplu şekilde susturursun. Sadece adminler mesaj atabilir.`,
    function: muteAllCommand
  },
  unmute: {
    aliases: ['um'],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile mutelanmış oyuncunun cezasını kaldırırsın.
        Örnek: !unmute #3, 3 idsine sahip oyuncu artık yazabilir.`,
    function: unmuteCommand
  },
  mutelar: {
    aliases: ['mutes'],
    roles: Role.ADMIN_TEMP,
    desc: `
        Bu komut ile mutelanmış oyuncuları görürsün.`,
    function: muteListCommand
  },
  rankres: {
    aliases: ['ranksıfırla', 'rankreset'],
    roles: Role.VIP,
    desc: `
        Bu komut ile rankını sıfırlayabilirsin!`,
    function: rankResetCommand
  },
  kick: {
    aliases: ['kickle'],
    roles: Role.ADMIN_PERM,
    desc: `
    Bu komut ile oyuncuları kicklersin.`,
    function: kickCommand
  },
  ban: {
    aliases: ['banla'],
    roles: Role.ADMIN_PERM,
    desc: `
    Bu komut ile oyuncuları süreli veya süresiz banlarsın.`,
    function: banCommand
  },
  banlar: {
    aliases: ['banlist', 'bans', 'banlistesi'],
    roles: Role.ADMIN_PERM,
    desc: `
    Bu komut ile banlanan oyuncuları numarasıyla birlikte görebilirsin.`,
    function: banListCommand
  },
  bankaldır: {
    aliases: ['clearbans'],
    roles: Role.ADMIN_PERM,
    desc: `
    Bu komut ile banlanan bütün oyuncuların banını kaldırabilirsin. Eğer sadece bir kişinin banını kaldırmak istiyorsan !banlar yazmalısın
    Daha sonra oyuncunun yanındaki numarayı öğrenip !bankaldır 45(oyuncunun yanındaki numara) yazmalısın.`,
    function: clearbansCommand
  },
  odaşifresi: {
    aliases: ['roompass', 'odaşifre'],
    roles: Role.MASTER,
    desc: `
        Bu komut ile odaya şifre koyarsın. Kullanımı !odaşifresi deneme123
        Geri kaldırmak için !odaşifresi yazman yeterli`,
    function: passwordCommand
  }
}

/* GAME */

let lastTouches = Array(2).fill(null)
let lastTeamTouched

const speedCoefficient = 100 / (5 * (0.99 ** 60 + 1))
let ballSpeed = 0
const playerRadius = 15
const ballRadius = 6.25
const triggerDistance = playerRadius + ballRadius + 0.01

/* COLORS */

const welcomeColor = 0xc4ff65
var announcementColor = 0xffefd6
const infoColor = 0xbebebe
const privateMessageColor = 0xffc933
const redColor = 0xff4c4c
const blueColor = 0x62cbff
const warningColor = 0xffa135
const errorColor = 0xa40000
const successColor = 0x75ff75
const defaultColor = null

/* AUXILIARY */

let checkTimeVariable = false
let checkStadiumVariable = true
let endGameVariable = false
let cancelGameVariable = false
let kickFetchVariable = false

let chooseMode = false
let timeOutCap
let capLeft = false
let redCaptainChoice = ''
let blueCaptainChoice = ''
const chooseTime = 20

const AFKSet = new Set()
const AFKMinSet = new Set()
const AFKCooldownSet = new Set()
const minAFKDuration = 0
const maxAFKDuration = 30
const AFKCooldown = 0

var muteArray = new MuteList()
const muteDuration = 5

let removingPlayers = false
let insertingPlayers = false

let stopTimeout
let startTimeout
let unpauseTimeout
let removingTimeout
let insertingTimeout

const emptyPlayer = {
  id: 0
}
stadiumCommand(emptyPlayer, '!antrenman')

let game = new Game()

/* FUNCTIONS */

/* AUXILIARY FUNCTIONS */

if (typeof String.prototype.replaceAll !== 'function') {
  String.prototype.replaceAll = function (search, replacement) {
    const target = this
    return target.split(search).join(replacement)
  }
}

function getDate () {
  const d = new Date()
  const options = {
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }
  return d.toLocaleString('tr-TR', options)
}

/* MATH FUNCTIONS */

function getRandomInt (max) {
  // returns a random number between 0 and max-1
  return Math.floor(Math.random() * Math.floor(max))
}

function pointDistance (p1, p2) {
  return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2))
}

/* TIME FUNCTIONS */

function getHoursStats (time) {
  return Math.floor(time / 3600)
}

function getMinutesGame (time) {
  const t = Math.floor(time / 60)
  return `${Math.floor(t / 10)}${Math.floor(t % 10)}`
}

function getMinutesReport (time) {
  return Math.floor(Math.round(time) / 60)
}

function getMinutesEmbed (time) {
  const t = Math.floor(Math.round(time) / 60)
  return `${Math.floor(t / 10)}${Math.floor(t % 10)}`
}

function getMinutesStats (time) {
  return Math.floor(time / 60) - getHoursStats(time) * 60
}

function getSecondsGame (time) {
  const t = Math.floor(time - Math.floor(time / 60) * 60)
  return `${Math.floor(t / 10)}${Math.floor(t % 10)}`
}

function getSecondsReport (time) {
  const t = Math.round(time)
  return Math.floor(t - getMinutesReport(t) * 60)
}

function getSecondsEmbed (time) {
  const t = Math.round(time)
  const t2 = Math.floor(t - Math.floor(t / 60) * 60)
  return `${Math.floor(t2 / 10)}${Math.floor(t2 % 10)}`
}

function getTimeGame (time) {
  return `${getMinutesGame(time)}:${getSecondsGame(time)}`
}

function getTimeEmbed (time) {
  return `[${getMinutesEmbed(time)}:${getSecondsEmbed(time)}]`
}

function getTimeStats (time) {
  if (getHoursStats(time) > 0) {
    return `${getHoursStats(time)} saat ${getMinutesStats(time)} dakika`
  } else {
    return `${getMinutesStats(time)} dakika`
  }
}

function getGoalGame () {
  return game.scores.red + game.scores.blue
}

/* REPORT FUNCTIONS */

function findFirstNumberCharString (str) {
  const str_number = str[str.search(/[0-9]/g)]
  return str_number === undefined ? '0' : str_number
}

function getIdReport () {
  const d = new Date()
  return `${d.getFullYear() % 100}${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1
    }${d.getDate() < 10 ? '0' : ''}${d.getDate()}${d.getHours() < 10 ? '0' : ''
    }${d.getHours()}${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}${d.getSeconds() < 10 ? '0' : ''
    }${d.getSeconds()}${findFirstNumberCharString(roomName)}`
}

function getRecordingName (game) {
  const d = new Date()
  const redCap =
    game.playerComp[0][0] != undefined
      ? game.playerComp[0][0].player.name
      : 'Kirmizi'
  const blueCap =
    game.playerComp[1][0] != undefined
      ? game.playerComp[1][0].player.name
      : 'Mavi'
  return `${d.getDate()}-${d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    }-${d.getFullYear() % 100
    }-${d.getHours()}s${d.getMinutes()}-${redCap}vs${blueCap}.hbr2`
}

/* FEATURE FUNCTIONS */

function getCommand (commandStr) {
  if (commands.hasOwnProperty(commandStr)) return commandStr
  for (const [key, value] of Object.entries(commands)) {
    for (const alias of value.aliases) {
      if (alias == commandStr) return key
    }
  }
  return false
}

function getPlayerComp (player) {
  if (player == null || player.id == 0) return null
  const comp = game.playerComp
  let index = comp[0].findIndex((c) => c.auth == authArray[player.id][0])
  if (index != -1) return comp[0][index]
  index = comp[1].findIndex((c) => c.auth == authArray[player.id][0])
  if (index != -1) return comp[1][index]
  return null
}

function getTeamArray (team, includeAFK = true) {
  if (team == Team.RED) return teamRed
  if (team == Team.BLUE) return teamBlue
  if (includeAFK) {
    return playersAll.filter((p) => p.team === Team.SPECTATORS)
  }
  return teamSpec
}

function sendAnnouncementTeam (message, team, color, style, mention) {
  for (const player of team) {
    room.sendAnnouncement(message, player.id, color, style, mention)
  }
}

function teamChat (player, message) {
  if (message.match(checkBadWords(message))) {
    room.sendAnnouncement(
      'Yazdıklarına dikkat et, devam etmen durumunda atılırsın!',
      player.id,
      errorColor,
      'bold',
      2
    )
  } else { var msgArray = message.split(/ +/).slice(1) }
  const emoji =
    player.team == Team.RED ? '🔴' : player.team == Team.BLUE ? '🔵' : '⚪'
  var message = `${emoji} ${player.name}: ${msgArray.join(
    ' '
  )}`
  const team = getTeamArray(player.team, true)
  const color =
    player.team == Team.RED
      ? redColor
      : player.team == Team.BLUE
        ? blueColor
        : null
  const style = 'bold'
  const mention = HaxNotification.CHAT
  sendAnnouncementTeam(message, team, color, style, mention)
}

function playerChat (player, message) {
  if (message.match(checkBadWords(message))) {
    room.sendAnnouncement(
      'Yazdıklarına dikkat et, devam etmen durumunda atılırsın!',
      player.id,
      errorColor,
      'bold',
      2
    )
  } else { var msgArray = message.split(/ +/) }
  const playerTargetIndex = playersAll.findIndex(
    (p) => p.name.replaceAll(' ', '_') == msgArray[0].substring(2)
  )
  if (playerTargetIndex == -1) {
    room.sendAnnouncement(
      'Böyle bir oyuncu bulunamadı, girdiğin ismi kontrol et.',
      player.id,
      errorColor,
      'bold',
      null
    )
    return false
  }
  const playerTarget = playersAll[playerTargetIndex]
  if (player.id == playerTarget.id) {
    room.sendAnnouncement(
      'Kendine mesaj yollayamazsın!',
      player.id,
      errorColor,
      'bold',
      null
    )
    return false
  }
  const messageFrom = `📝 [${playerTarget.name} isimli kullanıcıya] ${player.name
    }: ${msgArray.slice(1).join(' ')}`

  const messageTo = `📝 [${player.name}, bir mesaj gönderdi] ${player.name
    }: ${msgArray.slice(1).join(' ')}`

  room.sendAnnouncement(
    messageFrom,
    player.id,
    privateMessageColor,
    'bold',
    HaxNotification.CHAT
  )
  room.sendAnnouncement(
    messageTo,
    playerTarget.id,
    privateMessageColor,
    'bold',
    HaxNotification.CHAT
  )
}

function checkGoalKickTouch (array, index, goal) {
  if (array != null && array.length >= index + 1) {
    const obj = array[index]
    if (obj != null && obj.goal != null && obj.goal == goal) return obj
  }
  return null
}

/* BUTTONS */

function topButton () {
  if (teamSpec.length > 0) {
    if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
      room.setPlayerTeam(teamSpec[0].id, Team.RED)
      room.setPlayerTeam(teamSpec[1].id, Team.BLUE)
    } else if (teamRed.length < teamBlue.length) { room.setPlayerTeam(teamSpec[0].id, Team.RED) } else room.setPlayerTeam(teamSpec[0].id, Team.BLUE)
  }
}

function randomButton () {
  if (teamSpec.length > 0) {
    if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
      const r = getRandomInt(teamSpec.length)
      room.setPlayerTeam(teamSpec[r].id, Team.RED)
      teamSpec = teamSpec.filter((spec) => spec.id != teamSpec[r].id)
      room.setPlayerTeam(
        teamSpec[getRandomInt(teamSpec.length)].id,
        Team.BLUE
      )
    } else if (teamRed.length < teamBlue.length) {
      room.setPlayerTeam(
        teamSpec[getRandomInt(teamSpec.length)].id,
        Team.RED
      )
    } else {
      room.setPlayerTeam(
        teamSpec[getRandomInt(teamSpec.length)].id,
        Team.BLUE
      )
    }
  }
}

function blueToSpecButton () {
  clearTimeout(removingTimeout)
  removingPlayers = true
  removingTimeout = setTimeout(() => {
    removingPlayers = false
  }, 100)
  for (let i = 0; i < teamBlue.length; i++) {
    room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS)
  }
}

function redToSpecButton () {
  clearTimeout(removingTimeout)
  removingPlayers = true
  removingTimeout = setTimeout(() => {
    removingPlayers = false
  }, 100)
  for (let i = 0; i < teamRed.length; i++) {
    room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS)
  }
}

function resetButton () {
  clearTimeout(removingTimeout)
  removingPlayers = true
  removingTimeout = setTimeout(() => {
    removingPlayers = false
  }, 100)
  for (let i = 0; i < Math.max(teamRed.length, teamBlue.length); i++) {
    if (Math.max(teamRed.length, teamBlue.length) - teamRed.length - i > 0) {
      room.setPlayerTeam(
        teamBlue[teamBlue.length - 1 - i].id,
        Team.SPECTATORS
      )
    } else if (
      Math.max(teamRed.length, teamBlue.length) - teamBlue.length - i >
      0
    ) { room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS) } else break
  }
  for (let i = 0; i < Math.min(teamRed.length, teamBlue.length); i++) {
    room.setPlayerTeam(
      teamBlue[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
      Team.SPECTATORS
    )
    room.setPlayerTeam(
      teamRed[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
      Team.SPECTATORS
    )
  }
}

function swapButton () {
  clearTimeout(removingTimeout)
  removingPlayers = true
  removingTimeout = setTimeout(() => {
    removingPlayers = false
  }, 100)
  for (const player of teamBlue) {
    room.setPlayerTeam(player.id, Team.RED)
  }
  for (const player of teamRed) {
    room.setPlayerTeam(player.id, Team.BLUE)
  }
}

/* COMMAND FUNCTIONS */

/* PLAYER COMMANDS */

function leaveCommand (player, message) {
  room.kickPlayer(player.id, 'Görüşürüz !', false)
}

function dclinkCommand (player, message) {
  room.sendAnnouncement(
    'Discord sunucumuza davetlisin ! Link: https://discord.gg/TG7mr7AsQa',
    player.id,
    '0xA569BD',
    'bold',
    HaxNotification.CHAT
  )
}

function helpCommand (player, message) {
  const msgArray = message.split(/ +/).slice(1)
  if (msgArray.length == 0) {
    let commandString = '🎮 Oyuncu komutları :'
    for (const [key, value] of Object.entries(commands)) {
      if (value.desc && value.roles == Role.PLAYER) { commandString += ` !${key},` }
    }
    commandString =
      commandString.substring(0, commandString.length - 1) + '.\n'
    if (getRole(player) >= Role.VIP) {
      commandString += '💎 VIP komutları:'
      for (const [key, value] of Object.entries(commands)) {
        if (value.desc && value.roles == Role.VIP) { commandString += ` !${key},` }
      }
      if (commandString.slice(commandString.length - 1) == ':') { commandString += ' Yok,' }
      commandString =
        commandString.substring(0, commandString.length - 1) + '.\n'
    }
    if (getRole(player) >= Role.ADMIN_PERM) {
      commandString += '⚡️ Admin komutları:'
      for (const [key, value] of Object.entries(commands)) {
        if (value.desc && value.roles == Role.ADMIN_TEMP) { commandString += ` !${key},` }
      }
      if (commandString.slice(commandString.length - 1) == ':') { commandString += ' Yok,' }
      commandString =
        commandString.substring(0, commandString.length - 1) + '.\n'
    }
    if (getRole(player) == Role.MASTER) {
      commandString += '👑 Yetkili komutları :'
      for (const [key, value] of Object.entries(commands)) {
        if (value.desc && value.roles == Role.MASTER) { commandString += ` !${key},` }
      }
      if (commandString.slice(commandString.length - 1) == ':') { commandString += ' Yok,' }
      commandString =
        commandString.substring(0, commandString.length - 1) + '.\n'
    }
    commandString +=
      "\n🤖 Bir komut için detaylı bilgi almak için ''!yardım <komutismi>'."
    room.sendAnnouncement(
      commandString,
      player.id,
      infoColor,
      'bold',
      HaxNotification.CHAT
    )
  } else if (msgArray.length >= 1) {
    const commandName = getCommand(msgArray[0].toLowerCase())
    if (commandName != false && commands[commandName].desc != false) {
      room.sendAnnouncement(
        `🎮 \'${commandName}\' komutu :\n${commands[commandName].desc}`,
        player.id,
        infoColor,
        'bold',
        HaxNotification.CHAT
      )
    } else {
      room.sendAnnouncement(
        '❌ Böyle bir komut yok, komutları görmek için \'!yardım\'',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
    }
  }
}

async function globalStatsCommand (player, message) {
  const data = await checkStats(authArray[player.id][0])
  const stats = Object.fromEntries(
    Object.entries(data).filter(([key, value]) => key !== '_id')
  )
  const statsString = printPlayerStats(stats)
  room.sendAnnouncement(
    statsString,
    player.id,
    infoColor,
    'bold',
    HaxNotification.CHAT
  )
}

function statsLeaderboardCommand (player, message) {
  const key = message.split(/ +/)[0].substring(1).toLowerCase()
  printRankings(key, player.id)
}

function afkCommand (player, message) {
  if (player.team == Team.SPECTATORS || players.length == 1) {
    if (AFKSet.has(player.id)) {
      if (AFKMinSet.has(player.id)) {
        room.sendAnnouncement(
          `Minumum ${minAFKDuration} dakika AFK kalabilirsin. Komutu kötüye kullanmamalısın !`,
          player.id,
          errorColor,
          'bold',
          HaxNotification.CHAT
        )
      } else {
        AFKSet.delete(player.id)
        room.sendAnnouncement(
          `🌅 ${player.name} artık AFK değil !`,
          null,
          announcementColor,
          'bold',
          null
        )
        updateTeams()
        handlePlayersJoin()
      }
    } else {
      if (AFKCooldownSet.has(player.id)) {
        room.sendAnnouncement(
          `Sadece ${AFKCooldown} dakikada bir AFK kalabilirsin. Komutu kötüye kullanmamalısın !`,
          player.id,
          errorColor,
          'bold',
          HaxNotification.CHAT
        )
      } else {
        AFKSet.add(player.id)
        if (!player.admin) {
          AFKMinSet.add(player.id)
          AFKCooldownSet.add(player.id)
          setTimeout(
            (id) => {
              AFKMinSet.delete(id)
            },
            minAFKDuration * 60 * 1000,
            player.id
          )
          setTimeout(
            (id) => {
              AFKSet.delete(id)
            },
            maxAFKDuration * 60 * 1000,
            player.id
          )
          setTimeout(
            (id) => {
              AFKCooldownSet.delete(id)
            },
            AFKCooldown * 60 * 1000,
            player.id
          )
        }
        room.setPlayerTeam(player.id, Team.SPECTATORS)
        room.sendAnnouncement(
          `😴 ${player.name} artık AFK !`,
          null,
          announcementColor,
          'bold',
          null
        )
        updateTeams()
        handlePlayersLeave()
      }
    }
  } else {
    room.sendAnnouncement(
      'Oyundayken AFK kalamazsın !',
      player.id,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
  }
}

function afkListCommand (player, message) {
  if (AFKSet.size == 0) {
    room.sendAnnouncement(
      '😴 AFK listesinde kimse yok',
      player.id,
      announcementColor,
      'bold',
      null
    )
  } else {
    let cstm = '😴 AFK listesi : '
    AFKSet.forEach((_, value) => {
      const p = room.getPlayer(value)
      if (p != null) cstm += p.name + ', '
    })
    cstm = cstm.substring(0, cstm.length - 2) + '.'
    room.sendAnnouncement(cstm, player.id, announcementColor, 'bold', null)
  }
}

/* ADMIN COMMANDS */

function restartCommand (player, message) {
  instantRestart()
}

function restartSwapCommand (player, message) {
  room.stopGame()
  swapButton()
  startTimeout = setTimeout(() => {
    room.startGame()
  }, 10)
}

function swapCommand (player, message) {
  if (playSituation == Situation.STOP) {
    swapButton()
    room.sendAnnouncement(
      '✔️ Takımlar değişti !',
      null,
      announcementColor,
      'bold',
      null
    )
  } else {
    room.sendAnnouncement(
      'Takımları değiştirmek için oyunu durdurmalısın.',
      player.id,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
  }
}

function kickTeamCommand (player, message) {
  const msgArray = message.split(/ +/)
  let reasonString = `${player.name} tarafından takımca kicklendiniz`
  if (msgArray.length > 1) {
    reasonString = msgArray.slice(1).join(' ')
  }
  if (['!kickred', '!kickr'].includes(msgArray[0].toLowerCase())) {
    for (let i = 0; i < teamRed.length; i++) {
      setTimeout(() => {
        room.kickPlayer(teamRed[0].id, reasonString, false)
      }, i * 20)
    }
  } else if (['!kickblue', '!kickb'].includes(msgArray[0].toLowerCase())) {
    for (let i = 0; i < teamBlue.length; i++) {
      setTimeout(() => {
        room.kickPlayer(teamBlue[0].id, reasonString, false)
      }, i * 20)
    }
  } else if (['!kickspec', '!kicks'].includes(msgArray[0].toLowerCase())) {
    for (let i = 0; i < teamSpec.length; i++) {
      setTimeout(() => {
        room.kickPlayer(teamSpec[0].id, reasonString, false)
      }, i * 20)
    }
  }
}

function stadiumCommand (player, message) {
  const msgArray = message.split(/ +/)
  if (gameState == State.STOP) {
    if (['!v2'].includes(msgArray[0].toLowerCase())) {
      if (JSON.parse(v2Map).name == 'v2') {
        room.setDefaultStadium('v2')
      } else {
        room.setCustomStadium(v2Map)
      }
      currentStadium = 'v2'
    } else if (['!v3'].includes(msgArray[0].toLowerCase())) {
      if (JSON.parse(v3Map).name == 'v3') {
        room.setDefaultStadium('v3')
      } else {
        room.setCustomStadium(v3Map)
      }
      currentStadium = 'v3'
    } else if (['!antrenman'].includes(msgArray[0].toLowerCase())) {
      room.setCustomStadium(antrenmanMap)
      currentStadium = 'antrenman'
    } else {
      room.sendAnnouncement(
        'Böyle bir harita yok.',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
    }
  } else {
    room.sendAnnouncement(
      'Bu komutu kullanmak için oyunu durdurmalısın.',
      player.id,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
  }
}

function muteCommand (player, message) {
  const msgArray = message.split(/ +/).slice(1)
  if (msgArray.length > 0) {
    if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
      msgArray[0] = msgArray[0].substring(1, msgArray[0].length)
      if (room.getPlayer(parseInt(msgArray[0])) != null) {
        const playerMute = room.getPlayer(parseInt(msgArray[0]))
        let minutesMute = muteDuration
        if (msgArray.length > 1 && parseInt(msgArray[1]) > 0) {
          minutesMute = parseInt(msgArray[1])
        }
        if (!playerMute.admin) {
          const muteObj = new MutePlayer(
            playerMute.name,
            playerMute.id,
            authArray[playerMute.id][0]
          )
          muteObj.setDuration(minutesMute)
          room.sendAnnouncement(
            `${playerMute.name}, ${minutesMute} dakika boyunca susturuldu.`,
            null,
            announcementColor,
            'bold',
            null
          )
        } else {
          room.sendAnnouncement(
            'Bir admini susturamazsın.',
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
          )
        }
      } else {
        room.sendAnnouncement(
          'Böyle bir IDye sahip oyuncu yok. Komutun kullanımı için !yardım sustur yaz.',
          player.id,
          errorColor,
          'bold',
          HaxNotification.CHAT
        )
      }
    } else {
      room.sendAnnouncement(
        'Yanlış komut kullanımı. Doğru kullanımı için !yardım sustur yaz.',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
    }
  } else {
    room.sendAnnouncement(
      'Yanlış bir numara girdin. Komutun kullanımı için !yardım sustur yaz.',
      player.id,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
  }
}

function muteAllCommand (player, message) {
  if (allMuted == true) {
    allMuted = false
    room.sendAnnouncement(
      'Sohbet tekrardan aktif, tekrardan kapanmaması için lütfen kurallara uyalım.',
      null,
      announcementColor,
      'bold',
      null
    )
  } else {
    allMuted = true
    room.sendAnnouncement(
      'Sohbetin oyunu etkilemesinden dolayı geçici olarak sohbet kapatıldı.',
      null,
      announcementColor,
      'bold',
      null
    )
  }
}

function unmuteCommand (player, message) {
  const msgArray = message.split(/ +/).slice(1)
  if (msgArray.length > 0) {
    if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
      msgArray[0] = msgArray[0].substring(1, msgArray[0].length)
      if (room.getPlayer(parseInt(msgArray[0])) != null) {
        var playerUnmute = room.getPlayer(parseInt(msgArray[0]))
        if (muteArray.getByPlayerId(playerUnmute.id) != null) {
          const muteObj = muteArray.getByPlayerId(playerUnmute.id)
          muteObj.remove()
          room.sendAnnouncement(
            `${playerUnmute.name} artık konuşabilir!`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
          )
        } else {
          room.sendAnnouncement(
            'Bu oyuncu susturulmuş değil !',
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
          )
        }
      } else {
        room.sendAnnouncement(
          'Böyle bir IDye sahip oyuncu yok. Komutun kullanımı için !yardım unmute yaz.',
          player.id,
          errorColor,
          'bold',
          HaxNotification.CHAT
        )
      }
    } else if (
      msgArray[0].length > 0 &&
      parseInt(msgArray[0]) > 0 &&
      muteArray.getById(parseInt(msgArray[0])) != null
    ) {
      var playerUnmute = muteArray.getById(parseInt(msgArray[0]))
      playerUnmute.remove()
      room.sendAnnouncement(
        `${playerUnmute.name} artık konuşabilir !`,
        null,
        announcementColor,
        'bold',
        HaxNotification.CHAT
      )
    } else {
      room.sendAnnouncement(
        'Yanlış komut kullanımı. Doğru kullanımı için !yardım unmute yaz.',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
    }
  } else {
    room.sendAnnouncement(
      'Yanlış bir numara girdin. Komutun kullanımı için !yardım unmute yaz.',
      player.id,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
  }
}

function muteListCommand (player, message) {
  if (muteArray.list.length == 0) {
    room.sendAnnouncement(
      '🔇 Mute listesinde kimse yok',
      player.id,
      announcementColor,
      'bold',
      null
    )
    return false
  }
  let cstm = '🔇 Mute Listesi : '
  for (const mute of muteArray.list) {
    cstm += mute.name + `[${mute.id}], `
  }
  cstm = cstm.substring(0, cstm.length - 2) + '.'
  room.sendAnnouncement(cstm, player.id, announcementColor, 'bold', null)
}

function kickCommand (player, message) {
  const splittedMsg = message.split(/ +/gm)
  const [, gid, ...sebep] = splittedMsg
  const id = parseInt(gid.includes('#') ? gid.replace('#', '') : gid)
  reason = sebep.join(' ')
  room.kickPlayer(id, reason, false)
  room.sendAnnouncement(
    `${authArray[id][2]}, ${reason} sebebiyle odadan atıldı.`,
    player.id,
    announcementColor,
    'bold',
    null
  )
}

async function banCommand (player, message) {
  const splittedMsg = message.split(/ +/gm)
  let [, gid, sure, ...gereksiz] = splittedMsg
  const id = parseInt(gid.includes('#') ? gid.replace('#', '') : gid)
  sure = Number.isInteger(sure) ? sure : parseInt(sure)
  let sebep = ''
  if (room.getPlayer(id) != null) {
    if (sure) {
      setTimeout(async () => {
        await removeBan(authArray[id][1], authArray[id][0]),
        room.clearBan(id),
        banList = banList.filter((p) => p[1] != id)
      }, sure * 60_000)
      sebep = `${sure} dakika boyunca odadan uzaklaştırıldın`
      room.kickPlayer(id, sebep, false)
      banList.push([authArray[id][2], id, sure])
      await addBan(authArray[id][1], authArray[id][0])
      room.sendAnnouncement(
        `${authArray[id][2]}, ${sure} dakika boyunca banlandı.`,
        player.id,
        announcementColor,
        'bold',
        null
      )
    } else {
      sebep = 'Süresiz olarak odadan uzaklaştırıldın'
      room.kickPlayer(id, sebep, false)
      banList.push([authArray[id][2], id, '∞'])
      await addBan(authArray[id][1], authArray[id][0])
      room.sendAnnouncement(
        `${authArray[id][2]}, kalıcı olarak banlandı.`,
        player.id,
        announcementColor,
        'bold',
        null
      )
    }
  } else {
    room.sendAnnouncement(
      'Böyle bir IDye sahip oyuncu yok. Komutun kullanımı için !yardım sustur yaz.',
      player.id,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
  }
}

/* VIP COMMANDS */

async function rankResetCommand (player, message) {
  try {
    const data = await checkStats(authArray[player.id][0])
    const stats = Object.assign({
      gol: 0,
      asist: 0,
      kk: 0,
      galibiyet: 0,
      oyunlar: 0,
      cs: 0,
      puan: 1000
    }, data)
    await updatePlayer(authArray[player.id][0], stats)
    room.sendAnnouncement(
      `${player.name}, başarıyla rankını resetledin!`,
      player.id,
      successColor,
      'bold'
    )
  } catch (error) {
    console.error(error)
    room.sendAnnouncement(
      `${player.name}, bir hata oluştu. Lütfen tekrar dene.`,
      player.id,
      errorColor,
      'bold'
    )
  }
}

/* MASTER COMMANDS */

async function clearbansCommand (player, message) {
  const msgArray = message.split(/ +/).slice(1)
  if (msgArray.length == 1) {
    if (parseInt(msgArray[0]) > 0) {
      const ID = parseInt(msgArray[0])
      room.clearBan(ID)
      if (banList.length != banList.filter((p) => p[1] != ID).length) {
        room.sendAnnouncement(
          `✔️ ${banList.filter((p) => p[1] == ID)[0][0]
          } adlı oyuncunun banlı kaldırıldı !`,
          null,
          announcementColor,
          'bold',
          null
        )
      } else {
        room.sendAnnouncement(
          'Girdiğin numaraya sahip bir oyuncu yok. Komutun kullanımı için !yardım bankaldır yaz.',
          player.id,
          errorColor,
          'bold',
          HaxNotification.CHAT
        )
      }
      await removeBan(authArray[ID][1], authArray[ID][0]),
      banList = banList.filter((p) => p[1] != ID)
    } else {
      room.sendAnnouncement(
        'Yanlış ID girdin. Komutun kullanımı için !yardım bankaldır yaz.',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
    }
  } else {
    room.sendAnnouncement(
      'Yanlış numara girdin. Komutun kullanımı için !yardım bankaldır yaz.',
      player.id,
      errorColor,
      'bold',
      HaxNotification.CHAT
    )
  }
}

function banListCommand (player, message) {
  if (banList.length == 0) {
    room.sendAnnouncement(
      '📢 Ban listesinde kimse yok.',
      player.id,
      announcementColor,
      'bold',
      null
    )
    return false
  }
  let cstm = '📢 Ban listesi : '
  for (const ban of banList) {
    cstm += `[${ban[1]}]` + ban[0] + ` ${ban[2]} dk . `
  }
  cstm = cstm.substring(0, cstm.length - 2) + '.'
  room.sendAnnouncement(cstm, player.id, announcementColor, 'bold', null)
}

function passwordCommand (player, message) {
  const msgArray = message.split(/ +/).slice(1)
  if (msgArray.length > 0) {
    if (msgArray.length == 1 && msgArray[0] == '') {
      roomPassword = ''
      room.setPassword(null)
      room.sendAnnouncement(
        'Oda şifresi kaldırıldı.',
        player.id,
        announcementColor,
        'bold',
        HaxNotification.CHAT
      )
    }
    roomPassword = msgArray.join(' ')
    room.setPassword(roomPassword)
    room.sendAnnouncement(
      `Odanın şifresi artık: ${roomPassword} !`,
      player.id,
      announcementColor,
      'bold',
      HaxNotification.CHAT
    )
  } else {
    if (roomPassword != '') {
      roomPassword = ''
      room.setPassword(null)
      room.sendAnnouncement(
        'Odanın şifresi kaldırıldı.',
        player.id,
        announcementColor,
        'bold',
        HaxNotification.CHAT
      )
    } else {
      room.sendAnnouncement(
        'Odanın şu an bir şifresi yok. !yardım odaşifresi yazarak komut hakkında bilgi sahibi olabilirsin.',
        player.id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
    }
  }
}

function admincagirCommand (player, message) {
  const [, ...sebep] = message.split(/ +/gim)
  const reason = sebep.join(' ')

  if (reason === '' && adminCagirTimeout === false && muteArray.getByAuth(authArray[player.id][0]) === null) {
    room.sendAnnouncement(`${player.name}, admin çağırabilmek için yanına sebebini de yazmalısın.`, player.id, 0x2C89AB, 'bold', 2)
    return false
  }

  if (adminCagirTimeout === true && muteArray.getByAuth(authArray[player.id][0]) === null) {
    room.sendAnnouncement(`${player.name}, kısa bir süre önce zaten admin çağırıldı.`, player.id, 0x2C89AB, 'bold', 2)
    return false
  }

  if (adminCagirTimeout === false && muteArray.getByAuth(authArray[player.id][0]) === null) {
    const admincagirChannel = 'https://discord.com/api/webhooks/984063139043741716/FiBS2xsGBCR7MR5DfmaXzD2y9he1GZ9wFMmVTJkONBDr63fyKA1xZU3VswybjT0-ANGm'
    const admincagirText = `\`\`\`ini\n[${player.name}#${player.id}, ${reason} sebebiyle admin çağırdı]\`\`\`\n||<@&839206422461546557>||`

    fetch(admincagirChannel, {
      method: 'POST',
      body: JSON.stringify({
        content: admincagirText,
        username: 'Admin Çağırma Botu'
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res)

    room.sendAnnouncement(`${player.name}, başarıyla admin çağırdın. Unutma bu komutu kötüye kullanırsan banlanırsın!`, player.id, 0x2C89AB, 'bold', 2)
    adminCagirTimeout = true
    setTimeout(() => { adminCagirTimeout = false }, 90_000)
  }

  return false
}

function avatarListCommand (player, message) {
  setTimeout(() => {
    room.sendAnnouncement(centerText('Pro 👑 2000 | Elit 🏆 1800 | Usta 💎 1600'), player.id,
      welcomeColor,
      'bold',
      HaxNotification.CHAT)
  }, 500)
  setTimeout(() => {
    room.sendAnnouncement(centerText('Yetenekli ⚡ 1400 | Normal 🔥 1200 | Acemi 👎 1000'), player.id,
      welcomeColor,
      'bold',
      HaxNotification.CHAT)
  }, 1_500)
  setTimeout(() => {
    room.sendAnnouncement('1000 puan ile başlarsın ve oynadıkça puan kazanıp kaybedersin. Puanını görmek için !ben yazabilirsin', player.id,
      welcomeColor,
      'bold',
      HaxNotification.CHAT)
  }, 2_500)
}

/* GAME FUNCTIONS */

function checkTime () {
  const scores = room.getScores()
  if (game != undefined) game.scores = scores
  if (
    Math.abs(scores.time - scores.timeLimit) <= 0.01 &&
    scores.timeLimit != 0 &&
    playSituation == Situation.PLAY
  ) {
    if (scores.red != scores.blue) {
      if (!checkTimeVariable) {
        checkTimeVariable = true
        setTimeout(() => {
          checkTimeVariable = false
        }, 3000)
        scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE)
        stopTimeout = setTimeout(() => {
          room.stopGame()
        }, 2000)
      }
      return
    }
    if (drawTimeLimit != 0) {
      goldenGoal = true
      room.sendAnnouncement(
        '⚽ Altın gol ! İlk golü atan kazanır!',
        null,
        announcementColor,
        'bold',
        HaxNotification.CHAT
      )
    }
  }
  if (
    Math.abs(scores.time - drawTimeLimit * 60 - scores.timeLimit) <= 0.01 &&
    scores.timeLimit != 0
  ) {
    if (!checkTimeVariable) {
      checkTimeVariable = true
      setTimeout(() => {
        checkTimeVariable = false
      }, 10)
      endGame(Team.SPECTATORS)
      room.stopGame()
      goldenGoal = false
    }
  }
}

function instantRestart () {
  room.stopGame()
  startTimeout = setTimeout(() => {
    room.startGame()
  }, 10)
}

function resumeGame () {
  startTimeout = setTimeout(() => {
    room.startGame()
  }, 1000)
  setTimeout(() => {
    room.pauseGame(false)
  }, 500)
}

async function endGame (winner) {
  if (players.length >= 2 * teamSize - 1) activateChooseMode()
  const scores = room.getScores()
  game.scores = scores
  lastWinner = winner
  endGameVariable = true
  if (winner == Team.RED) {
    streak++
    room.sendAnnouncement(
      `✨ Kırmız takım kazandı ${scores.red} - ${scores.blue} ! Mevcut seri: ${streak}`,
      null,
      redColor,
      'bold',
      HaxNotification.CHAT
    )
  } else if (winner == Team.BLUE) {
    streak = 1
    room.sendAnnouncement(
      `✨ Mavi takım kazandı ${scores.blue} - ${scores.red} ! Mevcut seri: ${streak}`,
      null,
      blueColor,
      'bold',
      HaxNotification.CHAT
    )
  } else {
    streak = 0
    room.sendAnnouncement(
      '💤 Oyun sıkıcı olmaya başladı.. Bu duruma el atıyorum!',
      null,
      announcementColor,
      'bold',
      HaxNotification.CHAT
    )
  }
  const possessionRedPct =
    (possession[0] / (possession[0] + possession[1])) * 100
  const possessionBluePct = 100 - possessionRedPct
  const actionRedPct =
    (actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1])) * 100
  const possessionString = `🔴 ${possessionRedPct.toFixed(0)}% - ${possessionBluePct.toFixed(0)}% 🔵`
  const actionBluePct = 100 - actionRedPct
  const actionString = `🔴 ${actionRedPct.toFixed(0)}% - ${actionBluePct.toFixed(0)}% 🔵`
  const CSString = getCSString(scores)
  room.sendAnnouncement(
    `📊 Topla oynama: ${possessionString}\n` +
    `📊 Topun oynandığı bölgeler: ${actionString}\n` +
    `${CSString}`,
    null,
    announcementColor,
    'bold',
    HaxNotification.NONE
  )
  await updateStats()
}

/* CHOOSING FUNCTIONS */

function activateChooseMode () {
  chooseMode = true
  slowMode = chooseModeSlowMode
  room.sendAnnouncement(
    `🐢 Oyuncu seçmeniz için bekleme süresi ${chooseModeSlowMode} saniyeye çıkarıldı.`,
    null,
    announcementColor,
    'bold',
    HaxNotification.CHAT
  )
}

function deactivateChooseMode () {
  chooseMode = false
  clearTimeout(timeOutCap)
  if (slowMode != defaultSlowMode) {
    slowMode = defaultSlowMode
    room.sendAnnouncement(
      `🐢 Bekleme süresi tekrar ${defaultSlowMode} saniyeye düşürüldü.`,
      null,
      announcementColor,
      'bold',
      HaxNotification.CHAT
    )
  }
  redCaptainChoice = ''
  blueCaptainChoice = ''
}

function getSpecList (player) {
  if (player == null) return null
  let cstm = 'Oyuncular : '
  for (let i = 0; i < teamSpec.length; i++) {
    cstm += teamSpec[i].name + `[${i + 1}], `
  }
  cstm = cstm.substring(0, cstm.length - 2) + '.'
  room.sendAnnouncement(
    cstm,
    player.id,
    infoColor,
    'bold',
    HaxNotification.CHAT
  )
}

function choosePlayer () {
  clearTimeout(timeOutCap)
  let captain
  if (teamRed.length <= teamBlue.length && teamRed.length != 0) {
    captain = teamRed[0]
  } else if (teamBlue.length < teamRed.length && teamBlue.length != 0) {
    captain = teamBlue[0]
  }
  if (captain != null) {
    room.sendAnnouncement(
      "Oyuncu seçmek için aşağıda verilen oyuncular yanındaki numaralı kullanabilirsin yada 'üst', 'rastgele' or 'alt'.",
      captain.id,
      infoColor,
      'bold',
      HaxNotification.MENTION
    )
    timeOutCap = setTimeout(
      (player) => {
        room.sendAnnouncement(
          `${player.name}, acele et ! Seçmek için sadece ${Number.parseInt(
            String(chooseTime / 2)
          )} saniyen kaldı !`,
          player.id,
          warningColor,
          'bold',
          HaxNotification.MENTION
        )
        timeOutCap = setTimeout(
          (player) => {
            room.kickPlayer(
              player.id,
              'Verilen zamanda oyuncu seçmedin !',
              false
            )
          },
          chooseTime * 500,
          captain
        )
      },
      chooseTime * 1000,
      captain
    )
  }
  if (teamRed.length != 0 && teamBlue.length != 0) {
    getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0])
  }
}

function chooseModeFunction (player, message) {
  const msgArray = message.split(/ +/)
  if (player.id == teamRed[0].id || player.id == teamBlue[0].id) {
    if (teamRed.length <= teamBlue.length && player.id == teamRed[0].id) {
      if (['üst', 'oto'].includes(msgArray[0].toLowerCase())) {
        room.setPlayerTeam(teamSpec[0].id, Team.RED)
        redCaptainChoice = 'üst'
        clearTimeout(timeOutCap)
        room.sendAnnouncement(
          `${player.name}, üstten bir oyuncu seçti !`,
          null,
          announcementColor,
          'bold',
          HaxNotification.CHAT
        )
      } else if (['rastgele', 'rast'].includes(msgArray[0].toLowerCase())) {
        const r = getRandomInt(teamSpec.length)
        room.setPlayerTeam(teamSpec[r].id, Team.RED)
        redCaptainChoice = 'rastgele'
        clearTimeout(timeOutCap)
        room.sendAnnouncement(
          `${player.name}, rastgele oyuncu seçmeyi tercih etti !`,
          null,
          announcementColor,
          'bold',
          HaxNotification.CHAT
        )
      } else if (['alt', 'aşağı'].includes(msgArray[0].toLowerCase())) {
        room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED)
        redCaptainChoice = 'alt'
        clearTimeout(timeOutCap)
        room.sendAnnouncement(
          `${player.name}, alttan oyuncu seçmeyi tercih etti !`,
          null,
          announcementColor,
          'bold',
          HaxNotification.CHAT
        )
      } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
        if (
          Number.parseInt(msgArray[0]) > teamSpec.length ||
          Number.parseInt(msgArray[0]) < 1
        ) {
          room.sendAnnouncement(
            'Girdiğin numara geçersiz !',
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
          )
        } else {
          room.setPlayerTeam(
            teamSpec[Number.parseInt(msgArray[0]) - 1].id,
            Team.RED
          )
          room.sendAnnouncement(
            `${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name
            } adlı oyuncuyu seçti!`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
          )
        }
      } else return false
      return true
    }
    if (teamRed.length > teamBlue.length && player.id == teamBlue[0].id) {
      if (['üst', 'oto'].includes(msgArray[0].toLowerCase())) {
        room.setPlayerTeam(teamSpec[0].id, Team.BLUE)
        blueCaptainChoice = 'üst'
        clearTimeout(timeOutCap)
        room.sendAnnouncement(
          `${player.name}, üstten bir oyuncu seçti !`,
          null,
          announcementColor,
          'bold',
          HaxNotification.CHAT
        )
      } else if (['rastgele', 'rast'].includes(msgArray[0].toLowerCase())) {
        room.setPlayerTeam(
          teamSpec[getRandomInt(teamSpec.length)].id,
          Team.BLUE
        )
        blueCaptainChoice = 'rastgele'
        clearTimeout(timeOutCap)
        room.sendAnnouncement(
          `${player.name}, rastgele oyuncu seçmeyi tercih etti !`,
          null,
          announcementColor,
          'bold',
          HaxNotification.CHAT
        )
      } else if (['alt'].includes(msgArray[0].toLowerCase())) {
        room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE)
        blueCaptainChoice = 'alt'
        clearTimeout(timeOutCap)
        room.sendAnnouncement(
          `${player.name}, alttan oyuncu seçmeyi tercih etti  !`,
          null,
          announcementColor,
          'bold',
          HaxNotification.CHAT
        )
      } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
        if (
          Number.parseInt(msgArray[0]) > teamSpec.length ||
          Number.parseInt(msgArray[0]) < 1
        ) {
          room.sendAnnouncement(
            'Girdiğin numara geçersiz!',
            player.id,
            errorColor,
            'bold',
            HaxNotification.CHAT
          )
        } else {
          room.setPlayerTeam(
            teamSpec[Number.parseInt(msgArray[0]) - 1].id,
            Team.BLUE
          )
          room.sendAnnouncement(
            `${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name
            } adlı oyuncuyu seçti!`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
          )
        }
      } else return false
      return true
    }
  }
}

function checkCaptainLeave (player) {
  if (
    (teamRed.findIndex((red) => red.id == player.id) == 0 &&
      chooseMode &&
      teamRed.length <= teamBlue.length) ||
    (teamBlue.findIndex((blue) => blue.id == player.id) == 0 &&
      chooseMode &&
      teamBlue.length < teamRed.length)
  ) {
    choosePlayer()
    capLeft = true
    setTimeout(() => {
      capLeft = false
    }, 10)
  }
}

function slowModeFunction (player, message) {
  if (!player.admin) {
    if (!SMSet.has(player.id)) {
      SMSet.add(player.id)
      setTimeout(
        (number) => {
          SMSet.delete(number)
        },
        slowMode * 1000,
        player.id
      )
    } else {
      return true
    }
  }
  return false
}

/* PLAYER FUNCTIONS */

function updateTeams () {
  playersAll = room.getPlayerList()
  players = playersAll.filter((p) => !AFKSet.has(p.id))
  teamRed = players.filter((p) => p.team == Team.RED)
  teamBlue = players.filter((p) => p.team == Team.BLUE)
  teamSpec = players.filter((p) => p.team == Team.SPECTATORS)
}

/* PLAYER: 0,
ADMIN_TEMP: 1,
VIP: 2,
ADMIN_PERM: 3,
MASTER: 4
*/
function getRole (player) {
  const [isVIP, isAdmin, isMaster] = authArray[player.id].slice(4)

  if (isMaster) {
    return 4
  } else if (isAdmin) {
    return 3
  } else if (isVIP) {
    return 2
  } else if (player.admin) {
    return 1
  } else {
    return 0
  }
}

function ghostKickHandle (oldP, newP) {
  const teamArrayId = getTeamArray(oldP.team, true).map((p) => p.id)
  teamArrayId.splice(
    teamArrayId.findIndex((id) => id == oldP.id),
    1,
    newP.id
  )

  room.kickPlayer(oldP.id, 'Ghost kick', false)
  room.setPlayerTeam(newP.id, oldP.team)
  room.setPlayerAdmin(newP.id, oldP.admin)
  room.reorderPlayers(teamArrayId, true)

  if (oldP.team != Team.SPECTATORS && playSituation != Situation.STOP) {
    const discProp = room.getPlayerDiscProperties(oldP.id)
    room.setPlayerDiscProperties(newP.id, discProp)
  }
}

/* ACTIVITY FUNCTIONS */

function handleActivityPlayer (player) {
  const pComp = getPlayerComp(player)
  if (pComp != null) {
    pComp.inactivityTicks++
    if (pComp.inactivityTicks == 60 * ((2 / 3) * afkLimit)) {
      room.sendAnnouncement(
        `⛔ ${player.name}, eğer hareket etmezsen ${Math.floor(
          afkLimit / 3
        )} saniye sonra atılacaksın !`,
        player.id,
        warningColor,
        'bold',
        HaxNotification.MENTION
      )
      return
    }
    if (pComp.inactivityTicks >= 60 * afkLimit) {
      pComp.inactivityTicks = 0
      if (game.scores.time <= afkLimit - 0.5) {
        setTimeout(() => {
          !chooseMode ? instantRestart() : room.stopGame()
        }, 10)
      }
      room.kickPlayer(player.id, 'AFK', false)
    }
  }
}

function handleActivityPlayerTeamChange (changedPlayer) {
  if (changedPlayer.team == Team.SPECTATORS) {
    const pComp = getPlayerComp(changedPlayer)
    if (pComp != null) pComp.inactivityTicks = 0
  }
}

function handleActivityStop () {
  for (const player of players) {
    const pComp = getPlayerComp(player)
    if (pComp != null) pComp.inactivityTicks = 0
  }
}

function handleActivity () {
  if (gameState === State.PLAY && players.length > 1) {
    for (const player of teamRed) {
      handleActivityPlayer(player)
    }
    for (const player of teamBlue) {
      handleActivityPlayer(player)
    }
  }
}

/* LINEUP FUNCTIONS */

function getStartingLineups () {
  const compositions = [[], []]
  for (const player of teamRed) {
    compositions[0].push(
      new PlayerComposition(player, authArray[player.id][0], [0], [])
    )
  }
  for (const player of teamBlue) {
    compositions[1].push(
      new PlayerComposition(player, authArray[player.id][0], [0], [])
    )
  }
  return compositions
}

function handleLineupChangeTeamChange (changedPlayer) {
  if (gameState != State.STOP) {
    let playerLineup
    if (changedPlayer.team == Team.RED) {
      // player gets in red team
      var redLineupAuth = game.playerComp[0].map((p) => p.auth)
      var ind = redLineupAuth.findIndex(
        (auth) => auth == authArray[changedPlayer.id][0]
      )
      if (ind != -1) {
        // Player goes back in
        playerLineup = game.playerComp[0][ind]
        if (playerLineup.timeExit.includes(game.scores.time)) {
          // gets subbed off then in at the exact same time -> no sub
          playerLineup.timeExit = playerLineup.timeExit.filter(
            (t) => t != game.scores.time
          )
        } else {
          playerLineup.timeEntry.push(game.scores.time)
        }
      } else {
        playerLineup = new PlayerComposition(
          changedPlayer,
          authArray[changedPlayer.id][0],
          [game.scores.time],
          []
        )
        game.playerComp[0].push(playerLineup)
      }
    } else if (changedPlayer.team == Team.BLUE) {
      // player gets in blue team
      var blueLineupAuth = game.playerComp[1].map((p) => p.auth)
      var ind = blueLineupAuth.findIndex(
        (auth) => auth == authArray[changedPlayer.id][0]
      )
      if (ind != -1) {
        // Player goes back in
        playerLineup = game.playerComp[1][ind]
        if (playerLineup.timeExit.includes(game.scores.time)) {
          // gets subbed off then in at the exact same time -> no sub
          playerLineup.timeExit = playerLineup.timeExit.filter(
            (t) => t != game.scores.time
          )
        } else {
          playerLineup.timeEntry.push(game.scores.time)
        }
      } else {
        playerLineup = new PlayerComposition(
          changedPlayer,
          authArray[changedPlayer.id][0],
          [game.scores.time],
          []
        )
        game.playerComp[1].push(playerLineup)
      }
    }
    if (teamRed.some((r) => r.id == changedPlayer.id)) {
      // player leaves red team
      var redLineupAuth = game.playerComp[0].map((p) => p.auth)
      var ind = redLineupAuth.findIndex(
        (auth) => auth == authArray[changedPlayer.id][0]
      )
      playerLineup = game.playerComp[0][ind]
      if (playerLineup.timeEntry.includes(game.scores.time)) {
        // gets subbed off then in at the exact same time -> no sub
        if (game.scores.time == 0) {
          game.playerComp[0].splice(ind, 1)
        } else {
          playerLineup.timeEntry = playerLineup.timeEntry.filter(
            (t) => t != game.scores.time
          )
        }
      } else {
        playerLineup.timeExit.push(game.scores.time)
      }
    } else if (teamBlue.some((r) => r.id == changedPlayer.id)) {
      // player leaves blue team
      var blueLineupAuth = game.playerComp[1].map((p) => p.auth)
      var ind = blueLineupAuth.findIndex(
        (auth) => auth == authArray[changedPlayer.id][0]
      )
      playerLineup = game.playerComp[1][ind]
      if (playerLineup.timeEntry.includes(game.scores.time)) {
        // gets subbed off then in at the exact same time -> no sub
        if (game.scores.time == 0) {
          game.playerComp[1].splice(ind, 1)
        } else {
          playerLineup.timeEntry = playerLineup.timeEntry.filter(
            (t) => t != game.scores.time
          )
        }
      } else {
        playerLineup.timeExit.push(game.scores.time)
      }
    }
  }
}

function handleLineupChangeLeave (player) {
  if (playSituation != Situation.STOP) {
    if (player.team == Team.RED) {
      // player gets in red team
      const redLineupAuth = game.playerComp[0].map((p) => p.auth)
      var ind = redLineupAuth.findIndex(
        (auth) => auth == authArray[player.id][0]
      )
      var playerLineup = game.playerComp[0][ind]
      if (playerLineup.timeEntry.includes(game.scores.time)) {
        // gets subbed off then in at the exact same time -> no sub
        if (game.scores.time == 0) {
          game.playerComp[0].splice(ind, 1)
        } else {
          playerLineup.timeEntry = playerLineup.timeEntry.filter(
            (t) => t != game.scores.time
          )
        }
      } else {
        playerLineup.timeExit.push(game.scores.time)
      }
    } else if (player.team == Team.BLUE) {
      // player gets in blue team
      const blueLineupAuth = game.playerComp[1].map((p) => p.auth)
      var ind = blueLineupAuth.findIndex(
        (auth) => auth == authArray[player.id][0]
      )
      var playerLineup = game.playerComp[1][ind]
      if (playerLineup.timeEntry.includes(game.scores.time)) {
        // gets subbed off then in at the exact same time -> no sub
        if (game.scores.time == 0) {
          game.playerComp[1].splice(ind, 1)
        } else {
          playerLineup.timeEntry = playerLineup.timeEntry.filter(
            (t) => t != game.scores.time
          )
        }
      } else {
        playerLineup.timeExit.push(game.scores.time)
      }
    }
  }
}

/* TEAM BALANCE FUNCTIONS */

function balanceTeams () {
  if (!chooseMode) {
    if (players.length == 0) {
      room.stopGame()
      room.setScoreLimit(scoreLimit)
      room.setTimeLimit(timeLimit)
    } else if (players.length == 1 && teamRed.length == 0) {
      instantRestart()
      setTimeout(() => {
        stadiumCommand(emptyPlayer, '!antrenman')
      }, 5)
      room.setPlayerTeam(players[0].id, Team.RED)
    } else if (
      Math.abs(teamRed.length - teamBlue.length) == teamSpec.length &&
      teamSpec.length > 0
    ) {
      const n = Math.abs(teamRed.length - teamBlue.length)
      if (players.length == 2) {
        instantRestart()
        setTimeout(() => {
          stadiumCommand(emptyPlayer, '!v2')
        }, 5)
      }
      if (teamRed.length > teamBlue.length) {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamSpec[i].id, Team.BLUE)
        }
      } else {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamSpec[i].id, Team.RED)
        }
      }
    } else if (Math.abs(teamRed.length - teamBlue.length) > teamSpec.length) {
      const n = Math.abs(teamRed.length - teamBlue.length)
      if (players.length == 1) {
        instantRestart()
        setTimeout(() => {
          stadiumCommand(emptyPlayer, '!antrenman')
        }, 5)
        room.setPlayerTeam(players[0].id, Team.RED)
        return
      } else if (teamSize > 2 && players.length == 5) {
        instantRestart()
        setTimeout(() => {
          if (players.length == 5) {
            stadiumCommand(emptyPlayer, '!v2')
          } else {
            setTimeout(() => {
              if (players.length == 5) {
                instantRestart()
                stadiumCommand(emptyPlayer, '!v2')
              } else {
                stadiumCommand(emptyPlayer, '!v3')
              }
            }, 10000)
          }
        }, 5)
      }
      if (players.length == teamSize * 2 - 1) {
        teamRedStats = []
        teamBlueStats = []
      }
      if (teamRed.length > teamBlue.length) {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS)
        }
      } else {
        for (var i = 0; i < n; i++) {
          room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS)
        }
      }
    } else if (
      Math.abs(teamRed.length - teamBlue.length) < teamSpec.length &&
      teamRed.length != teamBlue.length
    ) {
      room.pauseGame(true)
      activateChooseMode()
      choosePlayer()
    } else if (
      teamSpec.length >= 2 &&
      teamRed.length == teamBlue.length &&
      teamRed.length < teamSize
    ) {
      if (teamRed.length == 2) {
        instantRestart()
        setTimeout(() => {
          stadiumCommand(emptyPlayer, '!v3')
        }, 5)
      }
      topButton()
    }
  }
}

function handlePlayersJoin () {
  if (chooseMode) {
    if (teamSize > 2 && players.length == 6) {
      setTimeout(() => {
        stadiumCommand(emptyPlayer, '!v3')
      }, 5)
    }
    getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0])
  }
  balanceTeams()
}

function handlePlayersLeave () {
  if (gameState != State.STOP) {
    const scores = room.getScores()
    if (
      players.length >= 2 * teamSize &&
      scores.time >= (5 / 6) * game.scores.timeLimit &&
      teamRed.length != teamBlue.length
    ) {
      let rageQuitCheck = false
      if (teamRed.length < teamBlue.length) {
        if (scores.blue - scores.red == 2) {
          endGame(Team.BLUE)
          rageQuitCheck = true
        }
      } else {
        if (scores.red - scores.blue == 2) {
          endGame(Team.RED)
          rageQuitCheck = true
        }
      }
      if (rageQuitCheck) {
        room.sendAnnouncement(
          'Oyundan kaçma tespit edildi, oyun böyle sonuçlanacak.',
          null,
          infoColor,
          'bold',
          HaxNotification.MENTION
        )
        stopTimeout = setTimeout(() => {
          room.stopGame()
        }, 100)
        return
      }
    }
  }
  if (chooseMode) {
    if (teamSize > 2 && players.length == 5) {
      setTimeout(() => {
        stadiumCommand(emptyPlayer, '!v2')
      }, 5)
    }
    if (teamRed.length == 0 || teamBlue.length == 0) {
      room.setPlayerTeam(
        teamSpec[0].id,
        teamRed.length == 0 ? Team.RED : Team.BLUE
      )
      return
    }
    if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
      deactivateChooseMode()
      resumeGame()
      const b = teamSpec.length
      if (teamRed.length > teamBlue.length) {
        for (var i = 0; i < b; i++) {
          clearTimeout(insertingTimeout)
          insertingPlayers = true
          setTimeout(() => {
            room.setPlayerTeam(teamSpec[0].id, Team.BLUE)
          }, 5 * i)
        }
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 5 * b)
      } else {
        for (var i = 0; i < b; i++) {
          clearTimeout(insertingTimeout)
          insertingPlayers = true
          setTimeout(() => {
            room.setPlayerTeam(teamSpec[0].id, Team.RED)
          }, 5 * i)
        }
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 5 * b)
      }
      return
    }
    if (streak == 0 && gameState == State.STOP) {
      if (Math.abs(teamRed.length - teamBlue.length) == 2) {
        const teamIn = teamRed.length > teamBlue.length ? teamRed : teamBlue
        room.setPlayerTeam(teamIn[teamIn.length - 1].id, Team.SPECTATORS)
      }
    }
    if (teamRed.length == teamBlue.length && teamSpec.length < 2) {
      deactivateChooseMode()
      resumeGame()
      return
    }

    if (capLeft) {
      choosePlayer()
    } else {
      getSpecList(
        teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]
      )
    }
  }
  balanceTeams()
}

function handlePlayersTeamChange (byPlayer) {
  if (chooseMode && !removingPlayers && byPlayer == null) {
    if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
      deactivateChooseMode()
      resumeGame()
      const b = teamSpec.length
      if (teamRed.length > teamBlue.length) {
        for (var i = 0; i < b; i++) {
          clearTimeout(insertingTimeout)
          insertingPlayers = true
          setTimeout(() => {
            room.setPlayerTeam(teamSpec[0].id, Team.BLUE)
          }, 5 * i)
        }
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 5 * b)
      } else {
        for (var i = 0; i < b; i++) {
          clearTimeout(insertingTimeout)
          insertingPlayers = true
          setTimeout(() => {
            room.setPlayerTeam(teamSpec[0].id, Team.RED)
          }, 5 * i)
        }
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 5 * b)
      }
    } else if (
      (teamRed.length == teamSize && teamBlue.length == teamSize) ||
      (teamRed.length == teamBlue.length && teamSpec.length < 2)
    ) {
      deactivateChooseMode()
      resumeGame()
    } else if (teamRed.length <= teamBlue.length && redCaptainChoice != '') {
      if (redCaptainChoice == 'top') {
        room.setPlayerTeam(teamSpec[0].id, Team.RED)
      } else if (redCaptainChoice == 'random') {
        var r = getRandomInt(teamSpec.length)
        room.setPlayerTeam(teamSpec[r].id, Team.RED)
      } else {
        room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED)
      }
    } else if (teamBlue.length < teamRed.length && blueCaptainChoice != '') {
      if (blueCaptainChoice == 'top') {
        room.setPlayerTeam(teamSpec[0].id, Team.BLUE)
      } else if (blueCaptainChoice == 'random') {
        var r = getRandomInt(teamSpec.length)
        room.setPlayerTeam(teamSpec[r].id, Team.BLUE)
      } else {
        room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE)
      }
    } else {
      choosePlayer()
    }
  }
}

function handlePlayersStop (byPlayer) {
  if (byPlayer == null && endGameVariable) {
    if (chooseMode) {
      if (players.length == 2 * teamSize) {
        chooseMode = false
        resetButton()
        for (let i = 0; i < teamSize; i++) {
          clearTimeout(insertingTimeout)
          insertingPlayers = true
          setTimeout(() => {
            randomButton()
          }, 200 * i)
        }
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 200 * teamSize)
        startTimeout = setTimeout(() => {
          room.startGame()
        }, 2000)
      } else {
        if (lastWinner == Team.RED) {
          blueToSpecButton()
        } else if (lastWinner == Team.BLUE) {
          redToSpecButton()
          setTimeout(() => {
            swapButton()
          }, 10)
        } else {
          resetButton()
        }
        clearTimeout(insertingTimeout)
        insertingPlayers = true
        setTimeout(() => {
          topButton()
        }, 300)
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 300)
      }
    } else {
      if (players.length == 2) {
        if (lastWinner == Team.BLUE) {
          swapButton()
        }
        startTimeout = setTimeout(() => {
          room.startGame()
        }, 2000)
      } else if (players.length == 3 || players.length >= 2 * teamSize + 1) {
        if (lastWinner == Team.RED) {
          blueToSpecButton()
        } else {
          redToSpecButton()
          setTimeout(() => {
            swapButton()
          }, 5)
        }
        clearTimeout(insertingTimeout)
        insertingPlayers = true
        setTimeout(() => {
          topButton()
        }, 200)
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 300)
        startTimeout = setTimeout(() => {
          room.startGame()
        }, 2000)
      } else if (players.length == 4) {
        resetButton()
        clearTimeout(insertingTimeout)
        insertingPlayers = true
        setTimeout(() => {
          randomButton()
          setTimeout(() => {
            randomButton()
          }, 500)
        }, 500)
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 2000)
        startTimeout = setTimeout(() => {
          room.startGame()
        }, 2000)
      } else if (players.length == 5 || players.length >= 2 * teamSize + 1) {
        if (lastWinner == Team.RED) {
          blueToSpecButton()
        } else {
          redToSpecButton()
          setTimeout(() => {
            swapButton()
          }, 5)
        }
        clearTimeout(insertingTimeout)
        insertingPlayers = true
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 200)
        setTimeout(() => {
          topButton()
        }, 200)
        activateChooseMode()
      } else if (players.length == 6) {
        resetButton()
        clearTimeout(insertingTimeout)
        insertingPlayers = true
        insertingTimeout = setTimeout(() => {
          insertingPlayers = false
        }, 1500)
        setTimeout(() => {
          randomButton()
          setTimeout(() => {
            randomButton()
            setTimeout(() => {
              randomButton()
            }, 500)
          }, 500)
        }, 500)
        startTimeout = setTimeout(() => {
          room.startGame()
        }, 2000)
      }
    }
  }
}

/* STATS FUNCTIONS */

/* GK FUNCTIONS */

function handleGKTeam (team) {
  if (team == Team.SPECTATORS) {
    return null
  }
  const teamArray = team == Team.RED ? teamRed : teamBlue
  const playerGK = teamArray.reduce((prev, current) => {
    if (team == Team.RED) {
      return (prev?.position.x < current.position.x) ? prev : current
    } else {
      return (prev?.position.x > current.position.x) ? prev : current
    }
  }, null)
  const playerCompGK = getPlayerComp(playerGK)
  return playerCompGK
}

function handleGK () {
  const redGK = handleGKTeam(Team.RED)
  if (redGK != null) {
    redGK.GKTicks++
  }
  const blueGK = handleGKTeam(Team.BLUE)
  if (blueGK != null) {
    blueGK.GKTicks++
  }
}

function getGK (team) {
  if (team == Team.SPECTATORS) {
    return null
  }
  const teamArray = team == Team.RED ? game.playerComp[0] : game.playerComp[1]
  const playerGK = teamArray.reduce((prev, current) => {
    return (prev?.GKTicks > current.GKTicks) ? prev : current
  }, null)
  return playerGK
}

function getCS (scores) {
  const playersNameCS = []
  const redGK = getGK(Team.RED)
  const blueGK = getGK(Team.BLUE)
  if (redGK != null && scores.blue == 0) {
    playersNameCS.push(redGK.player.name)
  }
  if (blueGK != null && scores.red == 0) {
    playersNameCS.push(blueGK.player.name)
  }
  return playersNameCS
}

function getCSString (scores) {
  const playersCS = getCS(scores)
  if (playersCS.length == 0) {
    return '🥅 İki takımda kalesini gole kapatamadı..'
  } else if (playersCS.length == 1) {
    return `🥅 ${playersCS[0]} gol yemedi!`
  } else if (playersCS.length == 2) {
    return `🥅 ${playersCS[0]} ve ${playersCS[1]} gol yemedi!`
  } else {
    return ''
  }
}

/* GLOBAL STATS FUNCTIONS */

function getLastTouchOfTheBall () {
  const ballPosition = room.getBallPosition()
  updateTeams()
  const playerArray = []
  for (const player of players) {
    if (player.position != null) {
      const distanceToBall = pointDistance(player.position, ballPosition)
      if (distanceToBall < triggerDistance) {
        if (playSituation == Situation.KICKOFF) { playSituation = Situation.PLAY }
        playerArray.push([player, distanceToBall])
      }
    }
  }
  if (playerArray.length != 0) {
    const playerTouch = playerArray.sort((a, b) => a[1] - b[1])[0][0]
    if (
      lastTeamTouched == playerTouch.team ||
      lastTeamTouched == Team.SPECTATORS
    ) {
      if (
        lastTouches[0] == null ||
        (lastTouches[0] != null && lastTouches[0].player.id != playerTouch.id)
      ) {
        game.touchArray.push(
          new BallTouch(
            playerTouch,
            game.scores.time,
            getGoalGame(),
            ballPosition
          )
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
    lastTeamTouched = playerTouch.team
  }
}

function getBallSpeed () {
  const ballProp = room.getDiscProperties(0)
  return (
    Math.sqrt(ballProp.xspeed ** 2 + ballProp.yspeed ** 2) * speedCoefficient
  )
}

function getGameStats () {
  if (playSituation == Situation.PLAY && gameState == State.PLAY) {
    lastTeamTouched == Team.RED ? possession[0]++ : possession[1]++
    const ballPosition = room.getBallPosition()
    ballPosition.x < 0 ? actionZoneHalf[0]++ : actionZoneHalf[1]++
    handleGK()
  }
}

/* GOAL ATTRIBUTION FUNCTIONS */

function getGoalAttribution (team) {
  let goalAttribution = Array(2).fill(null)
  if (lastTouches[0] != null) {
    if (lastTouches[0].player.team == team) {
      // Direct goal scored by player
      if (lastTouches[1] != null && lastTouches[1].player.team == team) {
        goalAttribution = [lastTouches[0].player, lastTouches[1].player]
      } else {
        goalAttribution = [lastTouches[0].player, null]
      }
    } else {
      // Own goal
      goalAttribution = [lastTouches[0].player, null]
    }
  }
  return goalAttribution
}

function getGoalString (team) {
  let goalString
  let goalString2
  const scores = game.scores
  const goalAttribution = getGoalAttribution(team)
  const spiker = [
    '😲 GOOOLL!! NEFİS BİR GOL, KLASINI KONUŞTURDU!',
    '😲 TOPA ÖYLE BİR VURDU Kİ RAKİP KALECİ DONA KALDI GOOLLL!!',
    '😲 GOOLL! Fevklade bir şut!',
    '😲 GOLL! Kuponları bozduran cinsten bir şut',
    '😲 GOLLL! RTÜK GOLÜ GÖRSE SANSÜR KOYAR!!',
    '😲 Bu adam neyin nesi bu adam uzaylı 👽',
    '🏎️🏎️SUPPPRAAAAA 🏎️🏎️',
    '🤵 Virtüöz.. Orkestra şefi.. Şov yaptı'
  ]
  if (goalAttribution[0] != null) {
    if (goalAttribution[0].team == team) {
      if (goalAttribution[1] != null && goalAttribution[1].team == team) {
        goalString = `⌛ ${getTimeGame(scores.time)} ┊ ⚽ ${goalAttribution[0].name} ┊ 👟 ${goalAttribution[1].name} ┊ 💨 ${ballSpeed.toFixed(0)} km/s`
        goalString2 = spiker[randomInt(spiker.length)]
        goalCelebration(goalAttribution[0].id, goalAttribution[1].id, null, team)
        game.goals.push(
          new Goal(scores.time, team, goalAttribution[0], goalAttribution[1])
        )
      } else {
        goalString = `⌛ ${getTimeGame(scores.time)} ┊ ⚽ ${goalAttribution[0].name} ┊ 💨 ${ballSpeed.toFixed(0)} km/s`
        goalString2 = spiker[randomInt(spiker.length)]
        goalCelebration(goalAttribution[0].id, null, null, team)
        game.goals.push(
          new Goal(scores.time, team, goalAttribution[0], null)
        )
      }
    } else {
      goalCelebration(null, null, goalAttribution[0].id, team)
      goalString = `⌛ ${getTimeGame(scores.time)} ┊ 😂 [KK] ${goalAttribution[0].name} ┊ 💨 ${ballSpeed.toFixed(0)} km/s`
      game.goals.push(new Goal(scores.time, team, goalAttribution[0], null))
    }
  } else {
    goalString = `⌛ ${getTimeGame(scores.time)} ┊ ⚽ ${team == Team.RED ? 'Kırmızı Takım' : 'Mavi Takım'} ┊ 💨 ${ballSpeed.toFixed(0)} km/s`
    game.goals.push(new Goal(scores.time, team, null, null))
  }
  son = centerText(goalString) + '\n' + centerText(goalString2)
  return son
}

/* ROOM STATS FUNCTIONS */

async function totalTeamElo (team) {
  total = 0
  for (let i = 0; i < team.length; i++) {
    const data = await checkStats(authArray[team[i].id][0])
    const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
    total += stats.puan
  }
  return total
}

/* v3 */
async function newEloDelta (player, hasWon, redTeamElo, blueTeamElo, isGk) {
  const k = 32
  const redTeamScore = 1 / (1 + 10 ** ((blueTeamElo - redTeamElo) / 400))
  const blueTeamScore = 1 / (1 + 10 ** ((redTeamElo - blueTeamElo) / 400))
  const playerTeamScore = player.team === Team.RED ? redTeamScore : blueTeamScore
  const opposingTeamScore = player.team === Team.RED ? blueTeamScore : redTeamScore
  const outcome = hasWon ? 1 : 0
  const expectedOutcome = playerTeamScore / (playerTeamScore + opposingTeamScore)
  const eloDelta = Math.round(k * (outcome - expectedOutcome))

  if (hasWon && eloDelta < 0) {
    eloDelta = Math.max(1, Math.round(eloDelta / 4))
  }

  if (isGk) {
    eloDelta += 10
  }

  return eloDelta
}

async function updatePlayerStats (player, teamStats, redElo, blueElo) {
  // Fetch player stats from the database
  const data = await checkStats(authArray[player.id][0])
  const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))

  // Get the player's stats for this match
  const playerComp = getPlayerComp(player)

  // Update the player's stats
  stats.oyunlar++
  if (lastWinner === teamStats) {
    stats.galibiyet++
  }
  stats.gol += getGoalsPlayer(playerComp)
  stats.asist += getAssistsPlayer(playerComp)
  stats.kk += getOwnGoalsPlayer(playerComp)
  stats.aktiflik += getGametimePlayer(playerComp)
  stats.cs += getCSPlayer(playerComp)
  const isGk = (player.team === Team.RED && player.id === getGK(Team.RED).id) || (player.team === Team.BLUE && player.id === getGK(Team.BLUE).id)
  const yeniPuan = await newEloDelta(player, lastWinner === teamStats, redElo, blueElo, isGk)
  stats.puan += yeniPuan

  room.sendAnnouncement(
    `${player.name}, bu maçın sonucunda aldığın puan: ` + yeniPuan,
    player.id,
    yeniPuan > 0 ? successColor : errorColor,
    'bold'
  )
  await updatePlayer(authArray[player.id][0], stats)
  room.setPlayerAvatar(player.id, getAvatar(stats.puan))
}

async function updateStats () {
  if (
    players.length >= 2 * teamSize &&
    (game.scores.time >= (5 / 6) * game.scores.timeLimit ||
      game.scores.red == game.scores.scoreLimit ||
      game.scores.blue == game.scores.scoreLimit) &&
    teamRedStats.length >= teamSize &&
    teamBlueStats.length >= teamSize
  ) {
    const redElo = await totalTeamElo(teamRed)
    const blueElo = await totalTeamElo(teamBlue)

    for (const player of teamRedStats) {
      await updatePlayerStats(player, Team.RED, redElo, blueElo)
    }
    for (const player of teamBlueStats) {
      await updatePlayerStats(player, Team.BLUE, redElo, blueElo)
    }
  }
}

async function printRankings (statKey, id = 0) {
  const data = await getAll()
  const leaderboard = []
  data.forEach(function (element) {
    leaderboard.push(
      Object.fromEntries(
        Object.entries(element).filter(([key, value]) =>
          ['isim', `${statKey}`].includes(key)
        )
      )
    )
  })
  if (leaderboard.length < 5) {
    if (id != 0) {
      room.sendAnnouncement(
        'Sıralama yapabilmek için yeterince oyun oynanılmamış !',
        id,
        errorColor,
        'bold',
        HaxNotification.CHAT
      )
    }
    return
  }
  leaderboard.sort(function (a, b) {
    return b[statKey] - a[statKey]
  })
  let rankingString = `${statKey.charAt(0).toUpperCase() + statKey.slice(1)
    } | `
  for (let i = 0; i < 5; i++) {
    const playerName = leaderboard[i].isim
    let playerStat = leaderboard[i][statKey]
    if (statKey == 'aktiflik') playerStat = getTimeStats(playerStat)
    rankingString += `${i + 1} - ${playerName} : ${playerStat}, `
  }
  rankingString = rankingString.substring(0, rankingString.length - 2)
  room.sendAnnouncement(
    rankingString,
    id,
    infoColor,
    'bold',
    HaxNotification.CHAT
  )
}

function getGametimePlayer (pComp) {
  if (pComp == null) return 0
  let timePlayer = 0
  for (let j = 0; j < pComp.timeEntry.length; j++) {
    if (pComp.timeExit.length < j + 1) {
      timePlayer += game.scores.time - pComp.timeEntry[j]
    } else {
      timePlayer += pComp.timeExit[j] - pComp.timeEntry[j]
    }
  }
  return Math.floor(timePlayer)
}

function getGoalsPlayer (pComp) {
  if (pComp == null) return 0
  let goalPlayer = 0
  for (const goal of game.goals) {
    if (goal.striker != null && goal.team === pComp.player.team) {
      if (authArray[goal.striker.id][0] == pComp.auth) {
        goalPlayer++
      }
    }
  }
  return goalPlayer
}

function getOwnGoalsPlayer (pComp) {
  if (pComp == null) return 0
  let goalPlayer = 0
  for (const goal of game.goals) {
    if (goal.striker != null && goal.team !== pComp.player.team) {
      if (authArray[goal.striker.id][0] == pComp.auth) {
        goalPlayer++
      }
    }
  }
  return goalPlayer
}

function getAssistsPlayer (pComp) {
  if (pComp == null) return 0
  let assistPlayer = 0
  for (const goal of game.goals) {
    if (goal.assist != null) {
      if (authArray[goal.assist.id][0] == pComp.auth) {
        assistPlayer++
      }
    }
  }
  return assistPlayer
}

function getGKPlayer (pComp) {
  if (pComp == null) return 0
  const GKRed = getGK(Team.RED)
  if (pComp.auth == GKRed?.auth) {
    return Team.RED
  }
  const GKBlue = getGK(Team.BLUE)
  if (pComp.auth == GKBlue?.auth) {
    return Team.BLUE
  }
  return Team.SPECTATORS
}

function getCSPlayer (pComp) {
  if (pComp == null || game.scores == null) return 0
  if (getGKPlayer(pComp) == Team.RED && game.scores.blue == 0) {
    return 1
  } else if (getGKPlayer(pComp) == Team.BLUE && game.scores.red == 0) {
    return 1
  }
  return 0
}

function actionReportCountTeam (goals, team) {
  const playerActionSummaryTeam = []
  const indexTeam = team == Team.RED ? 0 : 1
  const indexOtherTeam = team == Team.RED ? 1 : 0
  for (const goal of goals[indexTeam]) {
    if (goal[0] != null) {
      if (playerActionSummaryTeam.find(a => a[0].id == goal[0].id)) {
        const index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[0].id)
        playerActionSummaryTeam[index][1]++
      } else {
        playerActionSummaryTeam.push([goal[0], 1, 0, 0])
      }
      if (goal[1] != null) {
        if (playerActionSummaryTeam.find(a => a[0].id == goal[1].id)) {
          const index = playerActionSummaryTeam.findIndex(a => a[0].id == goal[1].id)
          playerActionSummaryTeam[index][2]++
        } else {
          playerActionSummaryTeam.push([goal[1], 0, 1, 0])
        }
      }
    }
  }
  if (goals[indexOtherTeam].length == 0) {
    const playerCS = getGK(team)?.player
    if (playerCS != null) {
      if (playerActionSummaryTeam.find(a => a[0].id == playerCS.id)) {
        const index = playerActionSummaryTeam.findIndex(a => a[0].id == playerCS.id)
        playerActionSummaryTeam[index][3]++
      } else {
        playerActionSummaryTeam.push([playerCS, 0, 0, 1])
      }
    }
  }

  playerActionSummaryTeam.sort((a, b) => (a[1] + a[2] + a[3]) - (b[1] + b[2] + b[3]))
  return playerActionSummaryTeam
}

/* PRINT FUNCTIONS */

function printPlayerStats (stats) {
  let statsString = ''
  for (let [key, value] of Object.entries(stats)) {
    if (key == 'isim') statsString += `${value}: `
    else {
      if (key == 'aktiflik') value = getTimeStats(value)
      const reCamelCase = /([A-Z](?=[a-z]+)|[A-Z]+(?![a-z]))/g
      const statName = key.replaceAll(reCamelCase, ' $1').trim()
      statsString += `${statName.charAt(0).toUpperCase() + statName.slice(1)
        }: ${value}, `
    }
  }
  statsString = statsString.substring(0, statsString.length - 2)
  return statsString
}

/* FETCH FUNCTIONS */

function fetchGametimeReport (game) {
  const fieldGametimeRed = {
    name: '🔴**KIRMIZI TAKIM:**',
    value: '⌛ __**Oyun Süresi:**__\n\n',
    inline: true
  }
  const fieldGametimeBlue = {
    name: '🔵**MAVİ TAKIM**',
    value: '⌛ __**Oyun Süresi:**__\n\n',
    inline: true
  }
  const redTeamTimes = game.playerComp[0].map((p) => [
    p.player,
    getGametimePlayer(p)
  ])
  const blueTeamTimes = game.playerComp[1].map((p) => [
    p.player,
    getGametimePlayer(p)
  ])

  for (const time of redTeamTimes) {
    var minutes = getMinutesReport(time[1])
    var seconds = getSecondsReport(time[1])
    fieldGametimeRed.value +=
      `> **${time[0].name}:** ${minutes > 0 ? `${minutes} dk` : ''}` +
      `${seconds > 0 || minutes == 0 ? `${seconds} sn` : ''}\n`
  }
  fieldGametimeRed.value += `\n${blueTeamTimes.length - redTeamTimes.length > 0
    ? '\n'.repeat(blueTeamTimes.length - redTeamTimes.length)
    : ''
    }`
  fieldGametimeRed.value += '====================='

  for (const time of blueTeamTimes) {
    var minutes = getMinutesReport(time[1])
    var seconds = getSecondsReport(time[1])
    fieldGametimeBlue.value +=
      `> **${time[0].name}:** ${minutes > 0 ? `${minutes} dk` : ''}` +
      `${seconds > 0 || minutes == 0 ? `${seconds} sn` : ''}\n`
  }
  fieldGametimeBlue.value += `\n${redTeamTimes.length - blueTeamTimes.length > 0
    ? '\n'.repeat(redTeamTimes.length - blueTeamTimes.length)
    : ''
    }`
  fieldGametimeBlue.value += '====================='

  return [fieldGametimeRed, fieldGametimeBlue]
}

function fetchActionsSummaryReport (game) {
  const fieldReportRed = {
    name: '🔴**KIRMIZI TAKIM**',
    value: '📊 __**Oyuncu İstatistikleri:**__\n\n',
    inline: true
  }
  const fieldReportBlue = {
    name: '🔵**MAVİ TAKIM**',
    value: '📊 __**Oyuncu İstatistikleri:**__\n\n',
    inline: true
  }
  const goals = [[], []]
  for (let i = 0; i < game.goals.length; i++) {
    goals[game.goals[i].team - 1].push([
      game.goals[i].striker,
      game.goals[i].assist
    ])
  }
  const redActions = actionReportCountTeam(goals, Team.RED)
  if (redActions.length > 0) {
    for (const act of redActions) {
      fieldReportRed.value += `> **${act[0].team != Team.RED ? '[KK] ' : ''}${act[0].name}:**` +
        `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
        `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
        `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`
    }
  }
  const blueActions = actionReportCountTeam(goals, Team.BLUE)
  if (blueActions.length > 0) {
    for (const act of blueActions) {
      fieldReportBlue.value += `> **${act[0].team != Team.BLUE ? '[KK] ' : ''}${act[0].name}:**` +
        `${act[1] > 0 ? ` ${act[1]}G` : ''}` +
        `${act[2] > 0 ? ` ${act[2]}A` : ''}` +
        `${act[3] > 0 ? ` ${act[3]}CS` : ''}\n`
    }
  }

  fieldReportRed.value += `\n${blueActions.length - redActions.length > 0
    ? '\n'.repeat(blueActions.length - redActions.length)
    : ''
    }`
  fieldReportRed.value += '====================='

  fieldReportBlue.value += `\n${redActions.length - blueActions.length > 0
    ? '\n'.repeat(redActions.length - blueActions.length)
    : ''
    }`
  fieldReportBlue.value += '====================='

  return [fieldReportRed, fieldReportBlue]
}

function fetchSummaryEmbed (game) {
  const fetchEndgame = [fetchGametimeReport, fetchActionsSummaryReport]
  const logChannel = gameWebhook
  const fields = [
    {
      name: '🔴**KIRMIZI TAKIM**',
      value: '=====================\n\n',
      inline: true
    },
    {
      name: '🔵**MAVİ TAKIM**',
      value: '=====================\n\n',
      inline: true
    }
  ]
  for (let i = 0; i < fetchEndgame.length; i++) {
    const fieldsReport = fetchEndgame[i](game)
    fields[0].value += fieldsReport[0].value + '\n\n'
    fields[1].value += fieldsReport[1].value + '\n\n'
  }
  fields[0].value = fields[0].value.substring(0, fields[0].value.length - 2)
  fields[1].value = fields[1].value.substring(0, fields[1].value.length - 2)

  const possR = possession[0] / (possession[0] + possession[1])
  const possB = 1 - possR
  const possRString = (possR * 100).toFixed(0).toString()
  const possBString = (possB * 100).toFixed(0).toString()
  const zoneR = actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1])
  const zoneB = 1 - zoneR
  const zoneRString = (zoneR * 100).toFixed(0).toString()
  const zoneBString = (zoneB * 100).toFixed(0).toString()
  const win =
    (game.scores.red > game.scores.blue) * 1 +
    (game.scores.blue > game.scores.red) * 2
  const embedColor = win == 1 ? 14958399 : 9567999
  const objectBodyWebhook = {
    embeds: [
      {
        title: `📝 MAÇ RAPORU #${getIdReport()}`,
        description:
          `**${getTimeEmbed(game.scores.time)}** ` +
          (win == 1 ? '**Kırmızı Takım** ' : 'Kırmızı Takım ') +
          game.scores.red +
          ' - ' +
          game.scores.blue +
          (win == 2 ? ' **Mavi Takım**' : ' Mavi Takım') +
          '\n```c\nTopla oynama: ' +
          possRString +
          '% - ' +
          possBString +
          '%' +
          '\nTopun oynandığı bölgeler: ' +
          zoneRString +
          '% - ' +
          zoneBString +
          '%\n```\n\n',
        color: embedColor,
        fields,
        footer: {
          text: `Kayıt: ${getRecordingName(game)}`
        },
        timestamp: new Date().toISOString()
      }
    ],
    username: 'Maç Özeti Botu'
  }
  if (logChannel != '') {
    fetch(logChannel, {
      method: 'POST',
      body: JSON.stringify(objectBodyWebhook),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((res) => res)
  }
}

/* EVENTS */

/* PLAYER MOVEMENT */
async function fetchRecording (game) {
  if (recordingWebhook != '') {
    const form = new FormData()
    form.append(null, new buffer.File([game.rec], getRecordingName(game), { type: 'text/plain' }))
    form.append('payload_json', JSON.stringify({
      username: roomName
    }))

    fetch(recordingWebhook, {
      method: 'POST',
      body: form
    }).then((res) => res)
  }
}

/* PLAYER ACTIVITY */

const asianRegex = RegExp(
  /[\p{Script_Extensions=Mymr}\p{Script_Extensions=Han}\p{Script_Extensions=Hira}\p{Script_Extensions=Kana}\p{Script_Extensions=Bopo}\p{Script=Khmer}\p{Script=Lao}\p{Script_Extensions=Phag}\p{Script=Tai_Tham}\p{Script=Thai}\p{Script=Tibetan}]/gu
)
const emojiRegex = RegExp(
  /[\u{1f300}-\u{1f5ff}\u{1f900}-\u{1f9ff}\u{1f600}-\u{1f64f}\u{1f680}-\u{1f6ff}\u{2600}-\u{26ff}\u{2700}-\u{27bf}\u{1f1e6}-\u{1f1ff}\u{1f191}-\u{1f251}\u{1f004}\u{1f0cf}\u{1f170}-\u{1f171}\u{1f17e}-\u{1f17f}\u{1f18e}\u{3030}\u{2b50}\u{2b55}\u{2934}-\u{2935}\u{2b05}-\u{2b07}\u{2b1b}-\u{2b1c}\u{3297}\u{3299}\u{303d}\u{00a9}\u{00ae}\u{2122}\u{23f3}\u{24c2}\u{23e9}-\u{23ef}\u{25b6}\u{23f8}-\u{23fa}]/gu
)
const longRegex = RegExp(/(⸻|𒈙|𒐫|﷽|𒍙|𒊎|𒄡|𒅌|𒁏|𒀰|𒐪|𒐩|𒈙|𒐫)/gi)

function isUsingIllegalChars (message) {
  const asian = (message.match(asianRegex) || []).length
  const emoji = (message.match(emojiRegex) || []).length
  const long = (message.match(longRegex) || []).length

  if (long > 0) return true
  if (asian > 10) return true
  if (asian + emoji > 15) return true

  return false
}

// kimmich difference
async function newPlayer (a, b, c) {
  const data = {
    isim: a,
    auth: b,
    conn: c,
    isAdmin: false,
    isMaster: false,
    isVIP: false,
    gol: 0,
    assist: 0,
    kk: 0,
    galibiyet: 0,
    mağlubiyet: 0,
    aktiflik: 0,
    oyunlar: 0,
    cs: 0,
    puan: 1000,
    bakiye: 0
  }
  const response = await fetch('http://localhost:3100/api/newplayer', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error('Error adding new player')
  }
}

async function checkPlayer (auth) {
  const response = await fetch(`http://localhost:3100/api/getAuth/${auth}`)
  if (!response.ok) {
    throw new Error('Error checking player')
  }
  const result = await response.json()
  return result
}

async function checkStats (auth) {
  const response = await fetch(
    `http://localhost:3100/api/playerstats/${auth}`
  )
  if (!response.ok) {
    throw new Error('Error checking player stats')
  }
  const result = await response.json()
  return result
}

async function updatePlayer (auth, data) {
  const response = await fetch(`http://localhost:3100/api/update/${auth}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error('Error updating player')
  }
}

async function updateName (auth, name) {
  const data = {
    isim: name
  }
  await updatePlayer(auth, data)
}

async function updateConn (auth, conn) {
  const data = {
    conn
  }
  await updatePlayer(auth, data)
}

async function getAll () {
  const response = await fetch('http://localhost:3100/api/getAll')
  if (!response.ok) {
    throw new Error('Error getting all players')
  }
  const result = await response.json()
  return result
}

async function getBlacklist () {
  const response = await fetch('http://localhost:3100/api/getBlacklist')
  if (!response.ok) {
    throw new Error('Error getting blacklist')
  }
  const result = await response.json()
  return result
}

async function addBan (conn, auth) {
  const data = {
    conn,
    auth
  }
  const response = await fetch('http://localhost:3100/api/newBan/', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!response.ok) {
    throw new Error('Error adding ban')
  }
}

async function removeBan (conn, auth) {
  const headers = {
    'Content-Type': 'application/json'
  }
  try {
    const response1 = await fetch(`http://localhost:3100/api/deleteBan/${conn}`, {
      method: 'DELETE',
      headers
    })
    const response2 = await fetch(`http://localhost:3100/api/deleteBan/${auth}`, {
      method: 'DELETE',
      headers
    })
    const json1 = await response1.json()
    const json2 = await response2.json()
    return [json1, json2]
  } catch (error) {
    console.error(error)
  }
}

function getAvatar (puan) {
  if (puan < 1000) return '👎'
  if (puan >= 1000 && puan < 1200) return '🔥'
  if (puan >= 1200 && puan < 1400) return '⚡'
  if (puan >= 1400 && puan < 1600) return '💎'
  if (puan >= 1600 && puan < 1800) return '🏆'
  if (puan >= 1800 && puan < 2000) return '👑'
  if (puan >= 2000) return '💯'
}

function checkBadWords () {
  const KUFURLER = kufurlistesi.kelimeler
  let content = ''
  const lastIndex = KUFURLER.length - 1
  for (let i = 0; i < KUFURLER.length; i++) {
    let kufur = KUFURLER[i]
    kufur = kufur.replace(/[A-Z]/gim, (p) => `${p}\\s*`)
    content += kufur
    if (i != lastIndex) content += '|'
  }
  return new RegExp(`${content}`, 'gim')
};

async function isBlacklisted (player) {
  const blacklist = await getBlacklist()
  return blacklist.filter(b => b.auth == player.auth || b.conn == player.conn).length > 0
}

room.setTeamColors(1, 60, 0xcfcfcf, [0xcf1238])
room.setTeamColors(2, 60, 0xcfcfcf, [0x2c89ab])

function goalCelebration (goalPlayer, assistPlayer, ogPlayer) {
  if (goalPlayer) {
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        room.setPlayerDiscProperties(goalPlayer, { radius: (i + 15) })
      }, i * 50)
    }
    for (let i = 8; i > 0; i--) {
      setTimeout(() => {
        room.setPlayerDiscProperties(goalPlayer, { radius: (23 - i) })
      }, (i * 50) + 400)
    }
    if (assistPlayer) {
      for (let i = 0; i < 4; i++) {
        setTimeout(() => {
          room.setPlayerDiscProperties(assistPlayer, { radius: (i + 15) })
        }, i * 50)
      }
      for (let i = 4; i > 0; i--) {
        setTimeout(() => {
          room.setPlayerDiscProperties(assistPlayer, { radius: (19 - i) })
        }, (i * 50) + 400)
      }
    }
  } else if (ogPlayer) {
    for (let i = 6; i > 0; i--) {
      setTimeout(() => {
        room.setPlayerDiscProperties(ogPlayer, { radius: (15 - i) })
      }, i * 50)
    }
    for (let i = 0; i <= 6; i++) {
      setTimeout(() => {
        room.setPlayerDiscProperties(ogPlayer, { radius: (i + 9) })
      }, (i * 50) + 400)
    }
  }
}
// Infos

function randomInt (max) {
  return Math.floor(Math.random() * max)
}

const infoText = [
  '📢 Mesajının başına t koyarsan sadece takımına mesaj gönderirsin',
  '📢 Mesajının başına @@isim koyarsan sadece belirttiğin isme mesaj gönderirsin',
  '😎 Rankını beğenmiyorsan VIP alarak !rankres komutunu kullanabilirsin.',
  '💖 Odalarımız sizin desteklerinizle açılıyor, sen de bunun bir parçası olmak istersen Discorda gelebilirsin',
  '💖 Odaları seviyorsan ve devamını istiyorsan bize VIP alarak destek olabilirsin',
  '😒 Sunucu hakkında önerin veya şikayetin varsa bizlere Discord üzerinden ulaşabilirsin',
  '😲 Bu avatarlar ne böyle diyorsan !avatarlar yazıp bilgi alabilirsin',
  '😲 Komutların ne olduğu hakkında fikrin yoksa !yardım yazabilirsin',
  '📣 Admin başvurularımız açık, sen de ekibin parçası olmak için Discord üzerinden başvurabilirsin',
  '👑 Gol krallını ya da asist kralını mı merak ediyorsun? Discorda gelerek hepsini görebilirsin',
  '🚀 Discord ile ailemize katılabilirsin! ➡ discord.gg/TG7mr7AsQa ⬅',
  '⚠️ 3 kişi defans veya atak yapmak yasaktır!',
  '⚠️ Kurallara uymamak ban sebebidir, discord üzerinden her an ban yiyebilirsiniz :)'
]

setInterval(() => { room.sendAnnouncement(infoText[randomInt(infoText.length)], null, 0xF4D03F, 'normal', 0) }, 45_000)

function centerText (string) {
  if (string == undefined) return ''
  let space = parseInt((100 - string.length) * 1, 10)
  if (space < 0) space = 0
  return ' '.repeat(space) + string + ' '.repeat(space)
}

// 3 Defence

var defLines = []
const cf = room.CollisionFlags

const def_zone_player_count_bound = 2

const number_indicators_red_first = []
const number_indicators_red_second = []
const number_indicators_blue_first = []
const number_indicators_blue_second = []

var isRoomSet = false

function fillIndicators () {
  for (let d = 0; d < JMap.discs.length; d++) {
    if (JMap.discs[d].trait == 'threeDefLineBall_RedFirst') {
      number_indicators_red_first.push(d + 1)
    } else if (JMap.discs[d].trait == 'threeDefLineBall_RedSecond') {
      number_indicators_red_second.push(d + 1)
    } else if (JMap.discs[d].trait == 'threeDefLineBall_BlueFirst') {
      number_indicators_blue_first.push(d + 1)
    } else if (JMap.discs[d].trait == 'threeDefLineBall_BlueSecond') {
      number_indicators_blue_second.push(d + 1)
    }
  }
}

function GetTeam (id) {
  return room.getPlayerList().filter((player) => player.id != 0 && player.team == id)
}

function updateAdmins () {
  const players = room.getPlayerList().filter(player => player.id != 0)
  if (players.length == 0) return
  if (players.find(player => player.admin) != null) return
  room.setPlayerAdmin(players[0].id, true)
}

function adjustDefLines (player) {
  const players = room.getPlayerList()
  const mfp_red = mostForwardPlayer(1)
  const mfp_blue = mostForwardPlayer(2)
  const non_mfp_red = GetTeam(1).filter(p => p.id !== mfp_red.id)
  const non_mfp_blue = GetTeam(2).filter(p => p.id !== mfp_blue.id)

  if (room.getPlayerDiscProperties(mfp_red.id).cGroup === cf.red) {
    room.setPlayerDiscProperties(mfp_red.id, { cGroup: cf.red | cf.c0 })
  }
  if (room.getPlayerDiscProperties(mfp_blue.id).cGroup === cf.blue) {
    room.setPlayerDiscProperties(mfp_blue.id, { cGroup: cf.blue | cf.c1 })
  }

  for (r in non_mfp_red) {
    if (room.getPlayerDiscProperties(non_mfp_red[r].id).cGroup !== cf.red) {
      room.setPlayerDiscProperties(non_mfp_red[r].id, { cGroup: cf.red })
    }
  }
  for (b in non_mfp_blue) {
    if (room.getPlayerDiscProperties(non_mfp_blue[b].id).cGroup !== cf.blue) {
      room.setPlayerDiscProperties(non_mfp_blue[b].id, { cGroup: cf.blue })
    }
  }
}

function findDefLines () {
  defLines = JMap.segments.filter(s => s.trait == 'threeDefLine')
}

function redDefPlayerCount () {
  return room.getPlayerList().filter(p => room.getPlayerDiscProperties(p.id) != null && p.team == 1 && room.getPlayerDiscProperties(p.id).x <= JMap.vertexes[defLines[0].v0].x).length
}

function blueDefPlayerCount () {
  return room.getPlayerList().filter(p => room.getPlayerDiscProperties(p.id) != null && p.team == 2 && room.getPlayerDiscProperties(p.id).x >= JMap.vertexes[defLines[1].v0].x).length
}

function moveDefLines () {
  if (redDefPlayerCount() >= def_zone_player_count_bound) {
    for (var n in number_indicators_red_first) {
      if (room.getDiscProperties(number_indicators_red_first[n]).x > -JMap.width) {
        room.setDiscProperties(number_indicators_red_first[n], { x: room.getDiscProperties(number_indicators_red_first[n]).x - 1000 })
      }
    }
    for (var n in number_indicators_red_second) {
      if (room.getDiscProperties(number_indicators_red_second[n]).x < -JMap.width) {
        room.setDiscProperties(number_indicators_red_second[n], { x: room.getDiscProperties(number_indicators_red_second[n]).x + 1000 })
      }
    }
  }

  if (redDefPlayerCount() < def_zone_player_count_bound) {
    for (var n in number_indicators_red_first) {
      if (room.getDiscProperties(number_indicators_red_first[n]).x < -JMap.width) {
        room.setDiscProperties(number_indicators_red_first[n], { x: room.getDiscProperties(number_indicators_red_first[n]).x + 1000 })
      }
    }
    for (var n in number_indicators_red_second) {
      if (room.getDiscProperties(number_indicators_red_second[n]).x > -JMap.width) {
        room.setDiscProperties(number_indicators_red_second[n], { x: room.getDiscProperties(number_indicators_red_second[n]).x - 1000 })
      }
    }
  }

  if (blueDefPlayerCount() >= def_zone_player_count_bound) {
    for (var n in number_indicators_blue_first) {
      if (room.getDiscProperties(number_indicators_blue_first[n]).x < JMap.width) {
        room.setDiscProperties(number_indicators_blue_first[n], { x: room.getDiscProperties(number_indicators_blue_first[n]).x + 1000 })
      }
    }
    for (var n in number_indicators_blue_second) {
      if (room.getDiscProperties(number_indicators_blue_second[n]).x > JMap.width) {
        room.setDiscProperties(number_indicators_blue_second[n], { x: room.getDiscProperties(number_indicators_blue_second[n]).x - 1000 })
      }
    }
  }

  if (blueDefPlayerCount() < def_zone_player_count_bound) {
    for (var n in number_indicators_blue_first) {
      if (room.getDiscProperties(number_indicators_blue_first[n]).x > JMap.width) {
        room.setDiscProperties(number_indicators_blue_first[n], { x: room.getDiscProperties(number_indicators_blue_first[n]).x - 1000 })
      }
    }
    for (var n in number_indicators_blue_second) {
      if (room.getDiscProperties(number_indicators_blue_second[n]).x < JMap.width) {
        room.setDiscProperties(number_indicators_blue_second[n], { x: room.getDiscProperties(number_indicators_blue_second[n]).x + 1000 })
      }
    }
  }
}

function sortByPosition (players) {
  return players.sort(function (p1, p2) {
    return p1.position.x - p2.position.x
  })
}

function mostForwardPlayer (teamID) {
  const players = room.getPlayerList()
  const playersTeam = players.filter(p => p.team === teamID)
  const redTeam = GetTeam(1)
  const blueTeam = GetTeam(2)
  const redTeamLength = GetTeam(1).length
  const blueTeamLength = GetTeam(2).length
  teamSorted = sortByPosition(playersTeam)
  if (teamID === 1) {
    return teamSorted[redTeamLength - 1]
  } else if (teamID === 2) {
    return teamSorted[0]
  }
}

// Event Handler 
try {
  readdirSync("./haxball-bot/events").filter(file => file.endsWith(".js")).forEach(async file => {
      const event = await import(`../events/${file}`).then(file => file.default);
      room[event.event_name] = await event.execute;
      await console.log(`[H-EVENT] ${event.event_name} adlı event başarıyla yüklendi!`);
  });
} catch(e) {
  console.log(`[H-HATA] Eventler yüklenirken bir hata ortaya çıktı:\n` + e); 
};