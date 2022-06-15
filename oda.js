const HaxballJS = require("haxball.js");

HaxballJS.then((HBInit) => {
    /* VARIABLES */

    /* ROOM */

    const roomName = 'Futsal v4 | Kimmich Odaları';
    const maxPlayers = 16;
    const roomPublic = true;
    const token = "thr1.AAAAAGJ807AwC1vcHpjmug.EXOqt77hFwY"; // Insert token here

    var roomWebhook = ''//'https://discord.com/api/webhooks/967743887781277726/4eaP_gumD2y5wvLEfoyMDEmHUt6a7SqpM0JEnJGXxPAELThViUq1haaqbzP5lhhV-HhA'; // this webhook is used to send the details of the room (chat, join, leave) ; it should be in a private discord channel
    var gameWebhook = 'https://discord.com/api/webhooks/967744035634700288/dd40UebVebst5LTVmscG51T-f80Wekd-mUd1Mw4nKpIbRUPt9xV4Gl3_WXVnagKyXQRh'; // this webhook is used to send the summary of the games ; it should be in a public discord channel

    var saveRecordingVariable = false;
    var timeLimit = 3;
    var scoreLimit = 3;

    var gameConfig = {
        roomName: roomName,
        maxPlayers: maxPlayers,
        public: roomPublic,
        noPlayer: true,
        code: 'tr',
        lon: 27.1,
        lat: 38.4
    }

    if (typeof token == 'string' && token.length == 39) {
        gameConfig.token = token;
    }

    var room = HBInit(gameConfig);

    const antrenmanMap = '{"name":"Futsal 🔥 Antrenman","width":900,"height":404,"spawnDistance":310,"bg":{"type":"","width":793,"height":346,"kickOffRadius":95,"cornerRadius":0,"color":"474E52"},"vertexes":[{"x":-793,"y":346,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"A199A3","bias":0,"_data":{"mirror":{}}},{"x":-793,"y":-346,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"A199A3"},{"x":-793,"y":-346,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"A199A3"},{"x":793,"y":346,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"A199A3"},{"x":793,"y":95,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"a3a3a3"},{"x":793,"y":-95,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"a3a3a3"},{"x":793,"y":-346,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"A199A3"},{"x":0,"y":404,"bCoef":0,"cMask":["c2"],"cGroup":["c2"],"trait":"kickOffBarrier"},{"x":0,"y":95,"bCoef":0,"cMask":["c2"],"cGroup":["c2"],"trait":"kickOffBarrier","vis":true,"curve":-180,"color":"A199A3"},{"x":0,"y":-95,"bCoef":0,"cMask":["c2"],"cGroup":["c2"],"trait":"line","vis":true,"curve":-180,"color":"A199A3"},{"x":0,"y":-404,"bCoef":0,"cMask":["c2"],"cGroup":["c2"],"trait":"kickOffBarrier"},{"x":840,"y":-95,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet","curve":0,"color":"a3a3a3"},{"x":840,"y":95,"bCoef":0.1,"cMask":["ball"],"trait":"goalNet","curve":0,"color":"a3a3a3"},{"x":793,"y":346,"bCoef":1,"trait":"ballArea","color":"A199A3","bias":0,"_data":{"mirror":{}}},{"x":793,"y":-346,"bCoef":1,"trait":"ballArea","color":"A199A3"},{"x":0,"y":346,"bCoef":0,"trait":"line","vis":true,"curve":0,"color":"A199A3"},{"x":0,"y":-346,"bCoef":0,"trait":"line","vis":true,"curve":0,"color":"A199A3"},{"x":0,"y":95,"trait":"kickOffBarrier","vis":true,"curve":180,"color":"A199A3"},{"x":0,"y":-95,"trait":"kickOffBarrier","vis":true,"curve":180,"color":"A199A3"},{"x":795,"y":-96,"bCoef":1,"cMask":["ball"],"trait":"ballArea","curve":0,"color":"696969"},{"x":793,"y":-346,"bCoef":1,"cMask":["ball"],"trait":"ballArea","color":"696969"},{"x":793,"y":348,"bCoef":1,"trait":"ballArea","color":"696969","bias":0},{"x":793,"y":348,"bCoef":1,"trait":"ballArea","color":"696969","bias":0},{"x":-634,"y":300,"bCoef":1,"cMask":["wall"],"cGroup":["all"],"color":"ffffff"},{"x":-169,"y":300,"bCoef":1,"cMask":["wall"],"cGroup":["ball"],"color":"ffffff"},{"x":-634,"y":300,"bCoef":1,"cMask":["ball"],"cGroup":["wall"],"vis":true,"color":"A199A3","_data":{"mirror":{}}},{"x":-169,"y":300,"bCoef":1,"cMask":["ball"],"cGroup":["wall"],"vis":true,"color":"A199A3","_data":{"mirror":{}}},{"x":-634,"y":-5,"bCoef":1,"cMask":["ball"],"cGroup":["wall"],"color":"A199A3","vis":true},{"x":-169,"y":-5,"bCoef":1,"cMask":["ball"],"cGroup":["wall"],"color":"A199A3","vis":true},{"x":-169,"y":-5,"bCoef":1,"cMask":["ball"],"cGroup":["all"],"color":"A199A3","bias":-20},{"x":-169,"y":300,"bCoef":1,"cMask":["ball"],"cGroup":["all"],"color":"A199A3","bias":-20},{"x":-634,"y":-5,"bCoef":1,"cMask":["ball"],"cGroup":["wall"],"color":"A199A3"},{"x":-634,"y":300,"bCoef":1,"cMask":["ball"],"cGroup":["wall"],"color":"A199A3"},{"x":-558,"y":-128,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":-180,"radius":10,"bias":-1},{"x":-591,"y":-128,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":-180,"radius":10,"bias":-1},{"x":-558,"y":-128,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":180,"radius":10,"bias":-1},{"x":-591,"y":-128,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":180,"radius":10,"bias":-1},{"x":-411,"y":-329,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":-180,"radius":10,"bias":-1},{"x":-411,"y":-294,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":-180,"radius":10,"bias":-1},{"x":-411,"y":-329,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":180,"radius":10,"bias":-1},{"x":-411,"y":-294,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":180,"radius":10,"bias":-1},{"x":-242,"y":-150,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":-180,"radius":10,"bias":-1},{"x":-242,"y":-115,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":-180,"radius":10,"bias":-1},{"x":-242,"y":-150,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":180,"radius":10,"bias":-1},{"x":-242,"y":-115,"bCoef":0,"cMask":["wall"],"cGroup":["c2"],"color":"ffffff","curve":180,"radius":10,"bias":-1},{"x":-635,"y":-42,"bCoef":0.5,"cMask":["ball"],"cGroup":["wall"],"vis":false},{"x":-141,"y":-42,"bCoef":0.5,"cMask":["ball"],"cGroup":["wall"],"vis":false},{"x":-635,"y":-342,"bCoef":0.5,"cMask":["ball"],"cGroup":["wall"],"vis":false},{"x":-141,"y":-342,"bCoef":0.5,"cMask":["ball"],"cGroup":["wall"],"vis":false},{"x":780,"y":-83.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":780,"y":79.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":780,"y":-83.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":810,"y":-83.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":810,"y":-83.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":810,"y":79.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":780,"y":79.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":810,"y":79.99,"bCoef":1,"cMask":["wall"],"cGroup":["all"]},{"x":336,"y":-345,"bCoef":0.5,"cMask":["ball"],"cGroup":["wall"],"color":"A199A3"},{"x":336,"y":350,"bCoef":0.5,"cMask":["ball"],"cGroup":["wall"],"color":"A199A3"},{"x":45,"y":-206,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":71,"y":-206,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":43,"y":-206,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":73,"y":-206,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":41,"y":-206,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":75,"y":-206,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":-259,"y":-256,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-259,"y":-286,"cMask":["wall"],"cGroup":["all"],"curve":210,"color":"A199A3"},{"x":-259,"y":-271,"cMask":["wall"],"cGroup":["all"],"curve":210,"color":"A199A3"},{"x":-247.20001220703125,"y":-256,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-237.20001220703125,"y":-286,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-227.20001220703125,"y":-256,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-242.20001220703125,"y":-271,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-231.20001220703125,"y":-271,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-208.20001220703125,"y":-278.4000015258789,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-223.20001220703125,"y":-278.4000015258789,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-207.20001220703125,"y":-264.4000015258789,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-223.20001220703125,"y":-264.4000015258789,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":255.20001220703125,"y":-340.99999713897705,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":255.20001220703125,"y":-318.39999866485596,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":273.20001220703125,"y":-318.39999866485596,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":245.79998779296875,"y":-334.39999866485596,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":230.79998779296875,"y":-334.39999866485596,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":246.79998779296875,"y":-320.39999866485596,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":230.79998779296875,"y":-320.39999866485596,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":273.20001220703125,"y":-340.99999713897705,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":174,"y":-311.0000047683716,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":174,"y":-341.0000047683716,"cMask":["wall"],"cGroup":["all"],"curve":210,"color":"A199A3"},{"x":175.79998779296875,"y":-326.0000047683716,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":186.79998779296875,"y":-341.0000047683716,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":187.79998779296875,"y":-311.0000047683716,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":193.79998779296875,"y":-325.80000019073486,"cMask":["wall"],"cGroup":["all"],"curve":180,"color":"A199A3"},{"x":221.79998779296875,"y":-325.80000019073486,"cMask":["wall"],"cGroup":["all"],"curve":180,"color":"A199A3"},{"x":111,"y":-259,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":137,"y":-259,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":109,"y":-259,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":139,"y":-259,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":107,"y":-259,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":141,"y":-259,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":165,"y":-205,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":191,"y":-205,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":163,"y":-205,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":193,"y":-205,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":161,"y":-205,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":195,"y":-205,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":220,"y":-260,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180,"_data":{"mirror":{}}},{"x":246,"y":-260,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180,"_data":{"mirror":{}}},{"x":218,"y":-260,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":248,"y":-260,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":216,"y":-260,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":250,"y":-260,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":274,"y":-207,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":300,"y":-207,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":272,"y":-207,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":302,"y":-207,"bCoef":0,"cMask":["red","blue"],"color":"ffffff","curve":180},{"x":270,"y":-207,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":304,"y":-207,"bCoef":0,"cMask":["red","blue"],"color":"000000","curve":180},{"x":350,"y":-288,"bCoef":0,"cMask":["wall"],"cGroup":["wall"],"curve":0},{"x":307,"y":-261,"bCoef":0,"cMask":["wall"],"cGroup":["wall"],"curve":0},{"x":315,"y":-287,"bCoef":0,"cMask":["wall"],"cGroup":["wall"]},{"x":334,"y":-262,"bCoef":0,"cMask":["wall"],"cGroup":["wall"]},{"x":-739,"y":70.99999523162842,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-739,"y":40.99999523162842,"cMask":["wall"],"cGroup":["all"],"curve":210,"color":"A199A3"},{"x":-737.2000122070312,"y":55.99999523162842,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-726.2000122070312,"y":40.99999523162842,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-725.2000122070312,"y":70.99999523162842,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-710.2000122070312,"y":72,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-700.2000122070312,"y":42,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-690.2000122070312,"y":72,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-705.2000122070312,"y":57,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-694.2000122070312,"y":57,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-682,"y":56,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-667.25,"y":42.5,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-666.75,"y":70,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-672.25,"y":79.75,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":-672.5,"y":84.25,"cMask":["wall"],"cGroup":["all"],"color":"A199A3"},{"x":500,"y":-250,"trait":"v"},{"x":480,"y":-230,"trait":"v"},{"x":500,"y":250,"trait":"v"},{"x":480,"y":230,"trait":"v"},{"x":480,"y":-60,"trait":"v"},{"x":480,"y":60,"trait":"v"},{"x":600,"y":250,"trait":"v"},{"x":500,"y":235,"trait":"v"},{"x":600,"y":235,"trait":"v"},{"x":600,"y":-250,"trait":"v"},{"x":500,"y":-235,"trait":"v"},{"x":600,"y":-235,"trait":"v"},{"x":600,"y":210,"trait":"v"},{"x":600,"y":-210,"trait":"v"},{"x":620,"y":235,"trait":"v"},{"x":620,"y":210,"trait":"v"},{"x":620,"y":-235,"trait":"v"},{"x":620,"y":-210,"trait":"v"},{"x":620,"y":230,"trait":"v"},{"x":620,"y":-230,"trait":"v"},{"x":585,"y":190,"trait":"v","color":"ffffff"},{"x":585,"y":-190,"trait":"v","color":"ffffff"},{"x":635,"y":190,"trait":"v","color":"ffffff"},{"x":635,"y":-190,"trait":"v","color":"ffffff"},{"x":480,"y":50,"trait":"v","color":"ffffff"},{"x":500,"y":50,"trait":"v","color":"ffffff"},{"x":480,"y":-50,"trait":"v","color":"ffffff"},{"x":500,"y":-50,"trait":"v","color":"ffffff"}],"segments":[{"v0":0,"v1":1,"trait":"ballArea"},{"v0":3,"v1":4,"trait":"ballArea"},{"v0":5,"v1":6,"trait":"ballArea"},{"v0":7,"v1":8,"bCoef":0,"cMask":["c2"],"cGroup":["c2"],"trait":"kickOffBarrier"},{"v0":8,"v1":9,"curve":180,"vis":true,"cGroup":["blueKO"],"trait":"kickOffBarrier"},{"v0":8,"v1":9,"curve":-180,"vis":true,"cMask":["c2"],"cGroup":["c2"],"trait":"kickOffBarrier"},{"v0":9,"v1":10,"bCoef":0,"cMask":["c2"],"cGroup":["c2"],"trait":"kickOffBarrier"},{"v0":5,"v1":11,"curve":0,"vis":true,"color":"a3a3a3","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":-95},{"v0":4,"v1":12,"curve":0,"vis":true,"color":"a3a3a3","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","y":95},{"v0":11,"v1":12,"curve":0,"vis":true,"color":"a3a3a3","bCoef":0.1,"cMask":["ball"],"trait":"goalNet","x":840},{"v0":1,"v1":0,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":-665},{"v0":4,"v1":3,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":665},{"v0":5,"v1":6,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"trait":"ballArea","x":665},{"v0":0,"v1":13,"vis":true,"color":"A199A3","bCoef":1,"trait":"ballArea","bias":0,"y":290,"_data":{"mirror":{},"arc":{"a":[-793,346],"b":[793,346],"radius":null,"center":[null,null],"from":null,"to":null}}},{"v0":2,"v1":14,"vis":true,"color":"A199A3","bCoef":1,"trait":"ballArea","y":-290},{"v0":15,"v1":16,"curve":0,"vis":true,"color":"A199A3","bCoef":0,"trait":"line"},{"v0":9,"v1":8,"curve":-180,"vis":true,"color":"A199A3","bCoef":0,"trait":"line"},{"v0":18,"v1":17,"curve":180,"vis":true,"color":"A199A3","bCoef":0,"trait":"line"},{"v0":5,"v1":4,"curve":0,"vis":true,"color":"a3a3a3","bCoef":0,"trait":"line"},{"v0":25,"v1":26,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"cGroup":["wall"],"_data":{"mirror":{},"arc":{"a":[-634,300],"b":[-169,300],"radius":null,"center":[null,null],"from":null,"to":null}}},{"v0":27,"v1":28,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"cGroup":["wall"],"y":90},{"v0":29,"v1":30,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"cGroup":["all"],"bias":-20},{"v0":31,"v1":32,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"cGroup":["wall"]},{"v0":33,"v1":34,"curve":-180,"color":"ffffff","bCoef":0,"cMask":["wall"],"cGroup":["c2"],"bias":-1,"x":-600,"radius":10,"y":-202},{"v0":35,"v1":36,"curve":180,"color":"ffffff","bCoef":0,"cMask":["wall"],"cGroup":["c2"],"bias":-1,"x":-600,"radius":10,"y":-202},{"v0":37,"v1":38,"curve":-180,"color":"ffffff","bCoef":0,"cMask":["wall"],"cGroup":["c2"],"bias":-1,"x":0,"radius":10},{"v0":39,"v1":40,"curve":180,"color":"ffffff","bCoef":0,"cMask":["wall"],"cGroup":["c2"],"bias":-1,"x":0,"radius":10},{"v0":41,"v1":42,"curve":-180,"color":"ffffff","bCoef":0,"cMask":["wall"],"cGroup":["c2"],"bias":-1,"x":169,"radius":10},{"v0":43,"v1":44,"curve":180,"color":"ffffff","bCoef":0,"cMask":["wall"],"cGroup":["c2"],"bias":-1,"x":169,"radius":10},{"v0":45,"v1":46,"vis":false,"color":"000000","bCoef":0.5,"cMask":["ball"],"cGroup":["wall"]},{"v0":47,"v1":48,"vis":false,"color":"000000","bCoef":0.5,"cMask":["ball"],"cGroup":["wall"],"y":-2},{"v0":48,"v1":46,"vis":false,"color":"000000","bCoef":0.5,"cMask":["ball"],"cGroup":["wall"]},{"v0":47,"v1":45,"vis":false,"color":"000000","bCoef":0.5,"cMask":["ball"],"cGroup":["wall"]},{"v0":49,"v1":50,"vis":false,"bCoef":1,"cMask":["wall"],"cGroup":["all"],"x":-715},{"v0":51,"v1":52,"vis":false,"bCoef":1,"cMask":["wall"],"cGroup":["all"],"y":-81.99},{"v0":53,"v1":54,"vis":false,"bCoef":1,"cMask":["wall"],"cGroup":["all"],"x":-685},{"v0":55,"v1":56,"vis":false,"bCoef":1,"cMask":["wall"],"cGroup":["all"],"y":81.99},{"v0":57,"v1":58,"vis":false,"color":"A199A3","bCoef":0.5,"cMask":["ball"],"cGroup":["wall"]},{"v0":59,"v1":60,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":60,"v1":59,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":61,"v1":62,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":62,"v1":61,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":63,"v1":64,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":64,"v1":63,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":65,"v1":66,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"],"x":250},{"v0":66,"v1":67,"curve":210,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"],"x":250},{"v0":68,"v1":69,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":69,"v1":70,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":71,"v1":72,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"],"y":0},{"v0":73,"v1":74,"curve":-174.5473780121959,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":74,"v1":75,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":75,"v1":76,"curve":180,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":77,"v1":78,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":78,"v1":79,"curve":-149.93913895313347,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":80,"v1":81,"curve":-174.5473780121959,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":81,"v1":82,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":82,"v1":83,"curve":180,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":79,"v1":84,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":85,"v1":86,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"],"x":250},{"v0":87,"v1":88,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":87,"v1":89,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":90,"v1":91,"curve":180,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":91,"v1":90,"curve":180,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":92,"v1":93,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":93,"v1":92,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":94,"v1":95,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":95,"v1":94,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":96,"v1":97,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":97,"v1":96,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":98,"v1":99,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":99,"v1":98,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":100,"v1":101,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":101,"v1":100,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":102,"v1":103,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":103,"v1":102,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":104,"v1":105,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"],"_data":{"mirror":{},"arc":{"a":[220,-260],"b":[246,-260],"curve":180,"radius":13,"center":[233,-260],"from":3.141592653589793,"to":0}}},{"v0":105,"v1":104,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":106,"v1":107,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":107,"v1":106,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":108,"v1":109,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":109,"v1":108,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":110,"v1":111,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":111,"v1":110,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":112,"v1":113,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":113,"v1":112,"curve":180,"vis":true,"color":"ffffff","bCoef":0,"cMask":["red","blue"]},{"v0":114,"v1":115,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":115,"v1":114,"curve":180,"vis":true,"color":"000000","bCoef":0,"cMask":["red","blue"]},{"v0":116,"v1":117,"curve":0,"vis":true,"bCoef":0,"cMask":["wall"],"cGroup":["wall"]},{"v0":117,"v1":118,"curve":0,"vis":true,"bCoef":0,"cMask":["wall"],"cGroup":["wall"]},{"v0":117,"v1":119,"curve":0,"vis":true,"bCoef":0,"cMask":["wall"],"cGroup":["wall"]},{"v0":120,"v1":121,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"],"x":250},{"v0":122,"v1":123,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":122,"v1":124,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":125,"v1":126,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":126,"v1":127,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":128,"v1":129,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"],"y":0},{"v0":130,"v1":131,"curve":126.39147766496146,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":130,"v1":132,"curve":-145.17931560409485,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":133,"v1":134,"vis":true,"color":"A199A3","cMask":["wall"],"cGroup":["all"]},{"v0":135,"v1":136,"curve":-90,"trait":"tup"},{"v0":138,"v1":137,"curve":-90,"trait":"tup"},{"v0":136,"v1":139,"trait":"tup"},{"v0":140,"v1":138,"trait":"tup"},{"v0":139,"v1":140,"trait":"tup"},{"v0":137,"v1":141,"trait":"tup"},{"v0":143,"v1":142,"trait":"tup"},{"v0":144,"v1":135,"trait":"tup"},{"v0":145,"v1":146,"trait":"tup"},{"v0":142,"v1":145,"trait":"tup"},{"v0":147,"v1":143,"trait":"tup"},{"v0":146,"v1":148,"trait":"tup"},{"v0":149,"v1":150,"trait":"tup"},{"v0":152,"v1":151,"trait":"tup"},{"v0":141,"v1":153,"curve":-90,"trait":"tup"},{"v0":154,"v1":144,"curve":-90,"trait":"tup"},{"v0":155,"v1":147,"trait":"tup"},{"v0":148,"v1":156,"trait":"tup"},{"v0":150,"v1":157,"trait":"tup"},{"v0":158,"v1":152,"trait":"tup"},{"v0":159,"v1":160,"color":"ffffff","bCoef":-3,"cMask":["ball"]},{"v0":162,"v1":161,"color":"ffffff","bCoef":-3,"cMask":["ball"]},{"v0":155,"v1":157,"color":"ffffff","bCoef":-2.7,"cMask":["ball"]},{"v0":158,"v1":156,"color":"ffffff","bCoef":-2.7,"cMask":["ball"]}],"goals":[],"discs":[{"radius":5,"pos":[793,95],"color":"a3a3a3","trait":"goalPost"},{"radius":5,"pos":[793,-95],"color":"a3a3a3","trait":"goalPost"},{"radius":7,"pos":[-607,283],"color":"444245","bCoef":0.5,"cMask":["all"],"cGroup":["ball","kick","score","c2"],"_data":{"mirror":{}}},{"radius":15,"invMass":1e-30,"pos":[-344,63],"color":"ffffff","bCoef":1,"cMask":["wall","red","blue","c2"],"cGroup":["ball"],"damping":1,"speed":[-0.3,5]},{"radius":15,"invMass":1e-30,"pos":[-515,144],"color":"ffffff","bCoef":1,"cMask":["wall","red","blue","c2"],"cGroup":["ball"],"damping":1,"speed":[2,-0.9],"_data":{"mirror":{}}},{"radius":15,"invMass":1e-30,"pos":[-576,42],"color":"ffffff","bCoef":1,"cMask":["wall","red","blue","c2"],"cGroup":["ball"],"damping":1,"speed":[3,1]},{"radius":15,"invMass":1e-30,"pos":[-253,171],"color":"ffffff","bCoef":1,"cMask":["wall","red","blue","c2"],"cGroup":["ball"],"damping":1,"speed":[-0.3,5]},{"radius":15,"invMass":1e-30,"pos":[-220,279],"color":"ffffff","bCoef":1,"cMask":["wall","red","blue","c2"],"cGroup":["ball"],"damping":1,"speed":[-3,-1]},{"radius":7,"pos":[-496,-170],"color":"444245","bCoef":0.5,"cMask":["wall","red","blue"],"cGroup":["ball","kick","score","ball"],"_data":{"mirror":{}}},{"radius":7,"pos":[457,6],"color":"ffffff","bCoef":0.5,"cMask":["wall","red","blue"],"cGroup":["ball","kick","score","ball"]},{"radius":7,"pos":[399,-61],"color":"ffffff","bCoef":0.5,"cMask":["wall","red","blue"],"cGroup":["ball","kick","score","ball"]},{"radius":7,"pos":[403,62],"color":"ffffff","bCoef":0.5,"cMask":["wall","red","blue"],"cGroup":["ball","kick","score","ball"]},{"radius":15,"invMass":1e-30,"pos":[795,-2],"color":"ffffff","bCoef":1,"cMask":["all"],"cGroup":["wall"],"damping":1,"speed":[0,2.5]}],"planes":[{"normal":[0,1],"dist":-346,"trait":"ballArea","_data":{"extremes":{"normal":[0,1],"dist":-346,"canvas_rect":[-900,-404,900,404],"a":[-900,-346],"b":[900,-346]}}},{"normal":[0,-1],"dist":-346,"trait":"ballArea","_data":{"extremes":{"normal":[0,-1],"dist":-346,"canvas_rect":[-900,-404,900,404],"a":[-900,346],"b":[900,346]}}},{"normal":[0,1],"dist":-404,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[0,1],"dist":-404,"canvas_rect":[-900,-404,900,404],"a":[-900,-404],"b":[900,-404]}}},{"normal":[0,-1],"dist":-404,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[0,-1],"dist":-404,"canvas_rect":[-900,-404,900,404],"a":[-900,404],"b":[900,404]}}},{"normal":[1,0],"dist":-900,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[1,0],"dist":-900,"canvas_rect":[-900,-404,900,404],"a":[-900,-404],"b":[-900,404]}}},{"normal":[-1,0],"dist":-900,"bCoef":0.2,"cMask":["all"],"_data":{"extremes":{"normal":[-1,0],"dist":-900,"canvas_rect":[-900,-404,900,404],"a":[900,-404],"b":[900,404]}}},{"normal":[0,-1],"dist":-306,"bCoef":0.5,"cMask":["c2"],"cGroup":["wall"],"_data":{"extremes":{"normal":[0,-1],"dist":-306,"canvas_rect":[-900,-404,900,404],"a":[-900,306],"b":[900,306]}}},{"normal":[1,0],"dist":-636.0704190430693,"bCoef":0.5,"cMask":["c2"],"cGroup":["wall"],"_data":{"extremes":{"normal":[1,0],"dist":-636.0704190430693,"canvas_rect":[-900,-404,900,404],"a":[-636.0704190430693,-404],"b":[-636.0704190430693,404]}}}],"traits":{"v":{"cMask":[""]},"ballArea":{"vis":false,"bCoef":1,"cMask":["ball"]},"goalPost":{"radius":8,"invMass":0,"bCoef":1},"goalNet":{"vis":true,"bCoef":0.1,"cMask":["all"]},"kickOffBarrier":{"vis":false,"bCoef":0.1,"cGroup":["redKO","blueKO"],"cMask":["red","blue"]},"line":{"vis":true,"bCoef":0,"cMask":[""]},"arco":{"radius":2,"cMask":["n/d"],"color":"cccccc"},"tup":{"bCoef":0,"cMask":["ball"],"bias":3}},"playerPhysics":{"acceleration":0.12,"kickingAcceleration":0.1,"kickStrength":6},"ballPhysics":{"radius":0,"color":""},"joints":[],"redSpawnPoints":[],"blueSpawnPoints":[],"canBeStored":false,"cameraFollow":"player"}';
    const v2Map = '{"name":"Futsal 🔥 1-2","width":465,"height":230,"bg":{"type":"","width":400,"height":200,"kickOffRadius":75,"cornerRadius":50,"color":"474E52"},"vertexes":[{"x":-401,"y":-200,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":401,"y":-200,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":-401,"y":200,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":401,"y":200,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":400,"y":-201,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":0,"color":"A199A3"},{"x":400,"y":201,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":0,"color":"A199A3"},{"x":-400,"y":-201,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":-400,"y":201,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":-403,"y":-202,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":403,"y":-202,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":-403,"y":202,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":403,"y":202,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":402,"y":-203,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":0,"color":"A199A3"},{"x":402,"y":203,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"curve":0,"color":"A199A3"},{"x":-402,"y":-203,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":-402,"y":203,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"color":"A199A3","curve":0},{"x":0,"y":-60,"cMask":["red","blue"],"cGroup":["redKO"],"vis":true,"curve":-180,"color":"A199A3"},{"x":0,"y":-230,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":true,"color":"A199A3"},{"x":0,"y":60,"cMask":["red","blue"],"cGroup":["redKO"],"vis":true,"curve":-180,"color":"A199A3"},{"x":0,"y":230,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"vis":true,"color":"A199A3"},{"x":0,"y":-60,"cMask":["red","blue"],"cGroup":["blueKO"],"vis":true,"curve":-180,"color":"A199A3"},{"x":0,"y":60,"cMask":["red","blue"],"cGroup":["blueKO"],"vis":true,"curve":-180,"color":"A199A3"},{"x":-400,"y":-200,"bCoef":1,"cMask":["ball"],"bias":10,"color":"A199A3","curve":0,"vis":true},{"x":-400,"y":-70,"bCoef":1,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"A199A3","curve":0,"vis":true},{"x":400,"y":-200,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"bias":-10,"curve":0,"color":"A199A3","vis":true},{"x":400,"y":-70,"bCoef":1,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"curve":0,"color":"A199A3","vis":true},{"x":-400,"y":70,"bCoef":1,"cMask":["ball"],"cGroup":["ball"],"bias":10,"curve":0,"color":"A199A3","vis":true},{"x":-400,"y":200,"bCoef":1,"cMask":["ball"],"bias":10,"curve":0,"color":"A199A3","vis":true},{"x":400,"y":70,"bCoef":1,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"curve":0,"color":"A199A3","vis":true},{"x":400,"y":200,"bCoef":1,"cMask":["wall"],"cGroup":["wall"],"bias":-10,"curve":0,"color":"A199A3","vis":true},{"x":-436,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"A3A3A3"},{"x":-400,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"A3A3A3"},{"x":-436,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"A3A3A3"},{"x":-400,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"A3A3A3"},{"x":400,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"A3A3A3"},{"x":436,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"A3A3A3"},{"x":-435,"y":-71,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"A3A3A3"},{"x":-435,"y":71,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"A3A3A3"},{"x":435,"y":-71,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"A3A3A3"},{"x":435,"y":71,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"color":"A3A3A3"},{"x":400,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"A3A3A3"},{"x":436,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"color":"A3A3A3"},{"x":-400,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"CF1238","curve":0},{"x":-400,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"CF1238","curve":0},{"x":-402,"y":-70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"CF1238","curve":0},{"x":-402,"y":70,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"color":"CF1238","curve":0},{"x":400,"y":-70,"bCoef":0.2,"cMask":["wall"],"cGroup":["wall"],"color":"2C89AB","curve":0},{"x":400,"y":70,"bCoef":0.2,"cMask":["wall"],"cGroup":["wall"],"color":"2C89AB","curve":0},{"x":400,"y":-70,"bCoef":0.2,"cMask":["wall"],"cGroup":["wall"],"color":"a3a3a3","curve":0},{"x":400,"y":70,"bCoef":0.2,"cMask":["wall"],"cGroup":["wall"],"color":"a3a3a3","curve":0},{"x":-438,"y":-72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":-400,"y":-72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":-437,"y":-73,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":-437,"y":73,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":-438,"y":72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":-400,"y":72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":437,"y":-73,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":437,"y":73,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":400,"y":-72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":438,"y":-72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":400,"y":72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":438,"y":72,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10}],"segments":[{"v0":0,"v1":1,"curve":0,"color":"A199A3","bCoef":1,"cMask":["ball"]},{"v0":2,"v1":3,"curve":0,"color":"A199A3","bCoef":1,"cMask":["ball"],"y":200},{"v0":16,"v1":17,"curve":0,"vis":true,"color":"A199A3","cMask":["red","blue"],"cGroup":["redKO","blueKO"],"x":0},{"v0":18,"v1":19,"curve":0,"vis":true,"color":"A199A3","cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":16,"v1":18,"curve":180,"vis":true,"color":"A199A3","cMask":["red","blue"],"cGroup":["redKO"]},{"v0":20,"v1":21,"curve":-180,"vis":true,"color":"A199A3","cMask":["red","blue"],"cGroup":["blueKO"]},{"v0":22,"v1":23,"curve":0,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":10,"x":-400},{"v0":24,"v1":25,"curve":0,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10,"x":400},{"v0":26,"v1":27,"curve":0,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":10,"x":-400},{"v0":28,"v1":29,"curve":0,"vis":true,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10,"x":400},{"v0":30,"v1":31,"curve":0,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"v0":32,"v1":33,"curve":0,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"y":70},{"v0":34,"v1":35,"curve":0,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"v0":36,"v1":37,"curve":0,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"x":-435},{"v0":38,"v1":39,"curve":0,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"x":435},{"v0":40,"v1":41,"curve":0,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"y":70},{"v0":42,"v1":43,"curve":0,"color":"CF1238","cMask":["wall"],"cGroup":["wall"],"x":-400},{"v0":46,"v1":47,"curve":0,"color":"2C89AB","cMask":["wall"],"cGroup":["wall"],"x":400}],"planes":[{"normal":[0,-1],"dist":-200,"bCoef":1,"cMask":["ball"],"radius":1,"_data":{"extremes":{"normal":[0,-1],"dist":-200,"canvas_rect":[-624,-230,624,230],"a":[-624,200],"b":[624,200]}}},{"normal":[0,1],"dist":-200,"bCoef":1,"cMask":["ball"],"radius":1,"_data":{"extremes":{"normal":[0,1],"dist":-200,"canvas_rect":[-624,-230,624,230],"a":[-624,-200],"b":[624,-200]}}},{"normal":[1,0],"dist":-465,"cMask":["red","blue"],"radius":1,"_data":{"extremes":{"normal":[1,0],"dist":-465,"canvas_rect":[-624,-230,624,230],"a":[-465,-230],"b":[-465,230]}}},{"normal":[0,-1],"dist":-230,"cMask":["red","blue"],"radius":1,"_data":{"extremes":{"normal":[0,-1],"dist":-230,"canvas_rect":[-624,-230,624,230],"a":[-624,230],"b":[624,230]}}},{"normal":[0,1],"dist":-230,"cMask":["red","blue"],"radius":1,"_data":{"extremes":{"normal":[0,1],"dist":-230,"canvas_rect":[-624,-230,624,230],"a":[-624,-230],"b":[624,-230]}}},{"normal":[-1,0],"dist":-465,"cMask":["red","blue"],"radius":1,"_data":{"extremes":{"normal":[-1,0],"dist":-465,"canvas_rect":[-624,-230,624,230],"a":[465,-230],"b":[465,230]}}}],"goals":[{"p0":[-405.8,-70],"p1":[-405.8,70],"team":"red"},{"p0":[405.8,-70],"p1":[405.8,70],"team":"blue"}],"discs":[{"radius":5,"invMass":0,"pos":[-400,-70],"color":"A3A3A3","bCoef":1,"cMask":["all"],"cGroup":["all"]},{"radius":5,"invMass":0,"pos":[-400,70],"color":"A3A3A3","bCoef":1,"cMask":["all"],"cGroup":["all"]},{"radius":5,"invMass":0,"pos":[400,-70],"color":"A3A3A3","bCoef":1,"cMask":["all"],"cGroup":["all"]},{"radius":5,"invMass":0,"pos":[400,70],"color":"A3A3A3","bCoef":1,"cMask":["all"],"cGroup":["all"]}],"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":4.545},"ballPhysics":{"radius":6.25,"invMass":1.5,"bCoef":0.474,"cGroup":["ball","kick","score"]},"spawnDistance":75,"traits":{},"redSpawnPoints":[[-150,0],[-365,0]],"blueSpawnPoints":[[150,0],[365,0]],"joints":[],"canBeStored":false}';
    const v4Map = '{"name":"Futsal 🔥 4","width":800,"height":350,"bg":{"kickOffRadius":80,"color":"474E52"},"vertexes":[{"x":-701,"y":-320,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":701,"y":-320,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":701,"y":320,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":-701.4,"y":320,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":0,"y":320,"cMask":["wall"],"color":"A199A3"},{"x":0,"y":-320,"cMask":["wall"],"color":"A199A3"},{"x":0,"y":-80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"A199A3"},{"x":0,"y":80,"cMask":["red","blue"],"cGroup":["redKO","blueKO"],"color":"A199A3"},{"x":-700,"y":85,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":-700,"y":-320,"cMask":[],"cGroup":[]},{"x":-701,"y":320,"cMask":[],"cGroup":[]},{"x":-700,"y":-85,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":700,"y":-85,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3","_data":{"mirror":{}}},{"x":700,"y":85,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":0,"y":350,"cMask":[],"cGroup":[]},{"x":0,"y":-350,"cMask":[],"cGroup":[]},{"x":-400,"y":-318.5,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":-400,"y":318.5,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":400,"y":-318.5,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":400,"y":318.5,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":-702.5,"y":-85,"cMask":[],"cGroup":[]},{"x":-702.5,"y":85,"cMask":[],"cGroup":[]},{"x":702.5,"y":85,"cMask":[],"cGroup":[]},{"x":702.5,"y":-85,"cMask":[],"cGroup":[]},{"x":-700,"y":-321,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":700,"y":-321,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3","_data":{"mirror":{}}},{"x":700,"y":321,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":-700,"y":321,"bCoef":1,"cMask":[],"cGroup":[],"color":"A199A3"},{"x":0,"y":81.5,"cMask":["wall"],"color":"A199A3"},{"x":0,"y":-81.5,"cMask":["wall"],"color":"A199A3"},{"x":-702,"y":-85,"cMask":["wall"]},{"x":-702,"y":85,"cMask":["wall"]},{"x":-698,"y":-85,"cMask":["wall"],"color":"80111f","curve":0},{"x":-698,"y":85,"cMask":["wall"],"color":"80111f","curve":0},{"x":698,"y":-85,"cMask":["wall"],"color":"0f2842","curve":0},{"x":698,"y":85,"cMask":["wall"],"color":"0f2842","curve":0},{"x":702,"y":-85,"cMask":["wall"],"color":"0f2842","curve":0},{"x":702,"y":85,"cMask":["wall"],"color":"0f2842","curve":0},{"x":700,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":736,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":700,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":736,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":735,"y":-86,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":735,"y":86,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"]},{"x":-736,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":-700,"y":-85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10},{"x":-736,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":-700,"y":85,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":-735,"y":-86,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10},{"x":-735,"y":86,"bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10}],"segments":[{"v0":0,"v1":1,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10},{"v0":25,"v1":12,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10,"_data":{"mirror":{},"arc":{"a":[700,-321],"b":[700,-85],"radius":null,"center":[null,null],"from":null,"to":null}}},{"v0":13,"v1":26,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10},{"v0":2,"v1":3,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10},{"v0":27,"v1":8,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10},{"v0":11,"v1":24,"color":"A199A3","bCoef":1,"cMask":["ball"],"bias":-10},{"v0":6,"v1":15,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":7,"v1":14,"vis":false,"bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO","blueKO"]},{"v0":6,"v1":7,"curve":180,"color":"A199A3","bCoef":0.1,"cMask":["red","blue"],"cGroup":["redKO"],"curveF":6.123233995736766e-17},{"v0":7,"v1":6,"curve":180,"color":"A199A3","bCoef":0.1,"cMask":["red","blue"],"cGroup":["blueKO"],"curveF":6.123233995736766e-17},{"v0":17,"v1":16,"color":"A199A3","bCoef":0,"cMask":[]},{"v0":19,"v1":18,"color":"A199A3","bCoef":0,"cMask":[]},{"v0":11,"v1":8,"color":"CF1238","bCoef":0,"cMask":[]},{"v0":12,"v1":13,"color":"2C89AB","bCoef":0,"cMask":[]},{"v0":4,"v1":28,"color":"A199A3","cMask":["wall"]},{"v0":5,"v1":29,"color":"A199A3","cMask":["wall"]},{"v0":38,"v1":39,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"y":-85},{"v0":40,"v1":41,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"y":85},{"v0":42,"v1":43,"color":"A3A3A3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"x":735},{"v0":44,"v1":45,"color":"a3a3a3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":-10,"y":-85},{"v0":46,"v1":47,"color":"a3a3a3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"y":85},{"v0":48,"v1":49,"color":"a3a3a3","bCoef":0.2,"cMask":["ball"],"cGroup":["ball"],"bias":10,"x":-735}],"planes":[{"normal":[0,1],"dist":-350,"bCoef":0,"_data":{"extremes":{"normal":[0,1],"dist":-350,"canvas_rect":[-800,-350,1500,350],"a":[-800,-350],"b":[1500,-350]}}},{"normal":[0,-1],"dist":-350,"bCoef":0,"_data":{"extremes":{"normal":[0,-1],"dist":-350,"canvas_rect":[-800,-350,1500,350],"a":[-800,350],"b":[1500,350]}}},{"normal":[1,0],"dist":-800,"bCoef":0,"_data":{"extremes":{"normal":[1,0],"dist":-800,"canvas_rect":[-800,-350,1500,350],"a":[-800,-350],"b":[-800,350]}}},{"normal":[-1,0],"dist":-800,"bCoef":0,"_data":{"extremes":{"normal":[-1,0],"dist":-800,"canvas_rect":[-800,-350,1500,350],"a":[800,-350],"b":[800,350]}}},{"normal":[-1,0],"dist":-1200,"bCoef":-1,"cMask":["c0"],"cGroup":["c0"],"_data":{"extremes":{"normal":[-1,0],"dist":-1200,"canvas_rect":[-800,-350,1500,350],"a":[1200,-350],"b":[1200,350]}}},{"normal":[-1,0],"dist":-1500,"bCoef":0,"cMask":["c0"],"cGroup":["c0"],"_data":{"extremes":{"normal":[-1,0],"dist":-1500,"canvas_rect":[-800,-350,1500,350],"a":[1500,-350],"b":[1500,350]}}},{"normal":[-1,0],"dist":-1500,"bCoef":-1,"cMask":["c0"],"cGroup":["c0"],"_data":{"extremes":{"normal":[-1,0],"dist":-1500,"canvas_rect":[-800,-350,1500,350],"a":[1500,-350],"b":[1500,350]}}}],"goals":[{"p0":[-705.8,85],"p1":[-705.8,-85],"team":"red"},{"p0":[705.8,85],"p1":[705.8,-85],"team":"blue"}],"discs":[{"radius":5,"invMass":0,"pos":[-700,-85],"color":"A3A3A3","bCoef":1},{"radius":5,"invMass":0,"pos":[-700,85],"color":"A3A3A3","bCoef":1},{"radius":5,"invMass":0,"pos":[700,-85],"color":"A3A3A3","bCoef":1},{"radius":5,"invMass":0,"pos":[700,85],"color":"A3A3A3","bCoef":1}],"playerPhysics":{"bCoef":0,"acceleration":0.11,"kickingAcceleration":0.083,"kickStrength":4.545},"ballPhysics":{"radius":6.25,"invMass":1.5,"bCoef":0.474,"cGroup":["ball","kick","score"]},"joints":[],"canBeStored":false,"traits":{},"redSpawnPoints":[[-135,-80],[-135,80],[-420,0],[-700,0]],"blueSpawnPoints":[[135,-80],[135,80],[420,0],[700,0]],"kickOffReset":"full"}';
    var currentStadium = 'antrenman';
    var bigMapObj = JSON.parse(antrenmanMap);

    room.setScoreLimit(scoreLimit);
    room.setTimeLimit(timeLimit);
    room.setTeamsLock(true);
    room.setKickRateLimit(6, 0, 0);

    var roomPassword = '';

    /* OPTIONS */

    var drawTimeLimit = Infinity;
    var teamSize = 4;
    var maxAdmins = 0;
    var disableBans = false;
    var debugMode = false;
    var afkLimit = 60;

    var defaultSlowMode = 0.5;
    var chooseModeSlowMode = 1;
    var slowMode = defaultSlowMode;
    var SMSet = new Set();

    var hideClaimMessage = true;
    var mentionPlayersUnpause = true;

    /* OBJECTS */

    class Goal {
        constructor(time, team, striker, assist) {
            this.time = time;
            this.team = team;
            this.striker = striker;
            this.assist = assist;
        }
    }

    class Game {
        constructor() {
            this.date = Date.now();
            this.scores = room.getScores();
            this.playerComp = getStartingLineups();
            this.goals = [];
            this.rec = room.startRecording();
            this.touchArray = [];
        }
    }

    class PlayerComposition {
        constructor(player, auth, timeEntry, timeExit) {
            this.player = player;
            this.auth = auth;
            this.timeEntry = timeEntry;
            this.timeExit = timeExit;
            this.inactivityTicks = 0;
        }
    }

    class MutePlayer {
        constructor(name, id, auth) {
            this.id = MutePlayer.incrementId();
            this.name = name;
            this.playerId = id;
            this.auth = auth;
            this.unmuteTimeout = null;
        }

        static incrementId() {
            if (!this.latestId) this.latestId = 1
            else this.latestId++
            return this.latestId
        }

        setDuration(minutes) {
            this.unmuteTimeout = setTimeout(() => {
                room.sendAnnouncement(
                    `Artık yazabilirsin.`,
                    this.playerId,
                    announcementColor,
                    "bold",
                    HaxNotification.CHAT
                );
                this.remove();
            }, minutes * 60 * 1000);
            muteArray.add(this);
        }

        remove() {
            this.unmuteTimeout = null;
            muteArray.removeById(this.id);
        }
    }

    class MuteList {
        constructor() {
            this.list = [];
        }

        add(mutePlayer) {
            this.list.push(mutePlayer);
            return mutePlayer;
        }

        getById(id) {
            var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
            if (index !== -1) {
                return this.list[index];
            }
            return null;
        }

        getByAuth(auth) {
            var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
            if (index !== -1) {
                return this.list[index];
            }
            return null;
        }

        removeById(id) {
            var index = this.list.findIndex(mutePlayer => mutePlayer.id === id);
            if (index !== -1) {
                this.list.splice(index, 1);
            }
        }

        removeByAuth(auth) {
            var index = this.list.findIndex(mutePlayer => mutePlayer.auth === auth);
            if (index !== -1) {
                this.list.splice(index, 1);
            }
        }
    }

    class BallTouch {
        constructor(player, time, goal, position) {
            this.player = player;
            this.time = time;
            this.goal = goal;
            this.position = position;
        }
    }

    /* PLAYERS */

    const Team = { SPECTATORS: 0, RED: 1, BLUE: 2 };
    const State = { PLAY: 0, PAUSE: 1, STOP: 2 };
    const Role = { PLAYER: 0, ADMIN_TEMP: 1, ADMIN_PERM: 2, MASTER: 3, VIP: 4 };
    const HaxNotification = { NONE: 0, CHAT: 1, MENTION: 2 };
    const Situation = { STOP: 0, KICKOFF: 1, PLAY: 2, GOAL: 3 };

    var gameState = State.STOP;
    var playSituation = Situation.STOP;
    var goldenGoal = false;

    var playersAll = [];
    var players = [];
    var teamRed = [];
    var teamBlue = [];
    var teamSpec = [];

    var teamRedStats = [];
    var teamBlueStats = [];

    var banList = [];

    /* STATS */

    var possession = [0, 0];
    var actionZoneHalf = [0, 0];
    var lastWinner = Team.SPECTATORS;
    var streak = 0;

    /* AUTH */

    var authArray = [];
    var adminList = [
        // ['INSERT_AUTH_HERE_1', 'NICK_OF_ADMIN_1'],
        // ['INSERT_AUTH_HERE_2', 'NICK_OF_ADMIN_2'],
    ];
    var masterList = [
        // 'INSERT_MASTER_AUTH_HERE',
        // 'INSERT_MASTER_AUTH_HERE_2'
    ];
    var vipList = [
        // 'INSERT_VIP_AUTH_HERE',
        // 'INSERT_VIP_AUTH_HERE_2'
    ];

    /* COMMANDS */

    var commands = {
        yardım: {
            aliases: ['komutlar'],
            roles: Role.PLAYER,
            desc: `
    Bu komut sana kullanabileceğin komutları gösterir. Nasıl kullanacağını bilmediğin komut için:
Örnek: \'!yardım bb\' sana \'bb\' komutunun nasıl kullanacağını gösterir.`,
            function: helpCommand,
        },
        discord: {
            aliases: ['dc'],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odanın discord linkini öğrenebilirsin.`,
            function: dclinkCommand,
        },
        yetki: {
            aliases: [],
            roles: Role.PLAYER,
            desc: false,
            function: masterCommand,
        },
        vip: {
            aliases: [],
            roles: Role.PLAYER,
            desc: false,
            function: vipCommand,
        },
        vipler: {
            aliases: ['vips'],
            roles: Role.PLAYER,
            desc: `Bu komut ile sunucumuzdan VIP almış oyuncuları görebilirsin.
        Sende aralarında bulunmak istiyorsan hemen discord sunucumuza gel!`,
            function: vipListCommand,
        },
        afk: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile AFK kalabilirsin.
    En az 1, en fazla 5 dakika afk kalabilirsin. Komutu tekrar kullanmak için 10 dakika beklemelisin`,
            function: afkCommand,
        },
        afklar: {
            aliases: ['afklistesi'],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile kimler AFK görebilirsin.`,
            function: afkListCommand,
        },
        bb: {
            aliases: ['bay', 'görüşürüz', 'ae'],
            roles: Role.PLAYER,
            desc: `
    Bu komut ile oyunu sorunsuzca terkedebilirsin (önerilir).`,
            function: leaveCommand,
        },
        ben: {
            aliases: ['istatistik', 'stat', 'stats', 'me'],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile istatistiklerini görebilirsin.`,
            function: globalStatsCommand,
        },
        oyunlar: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en çok oyun oynamış 5 kişiyi görürsün.`,
            function: statsLeaderboardCommand,
        },
        galibiyet: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en çok oyun kazanmış 5 kişiyi görürsün.`,
            function: statsLeaderboardCommand,
        },
        gol: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en çok gol atmış 5 kişiyi görürsün`,
            function: statsLeaderboardCommand,
        },
        asist: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en çok asist yapmış 5 kişiyi görürsün`,
            function: statsLeaderboardCommand,
        },
        kk: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki kendi kalesine en çok gol atmış 5 kişiyi görürsün`,
            function: statsLeaderboardCommand,
        },
        aktiflik: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en çok zaman geçirmiş 5 kişiyi görürsün.`,
            function: statsLeaderboardCommand,
        },
        cs: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en çok gol yememe rekoruna sahip 5 kaleci veya defansı görürsün`,
            function: statsLeaderboardCommand,
        },
        puan: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en yüksek puana sahip 5 kişiyi görürsün`,
            function: statsLeaderboardCommand,
        },
        bakiye: {
            aliases: [],
            roles: Role.PLAYER,
            desc: `
        Bu komut ile odadaki en yüksek bakiyeye sahip 5 kişiyi görürsün`,
            function: statsLeaderboardCommand,
        },
        antrenman: {
            aliases: ['ant', 'antr'],
            roles: Role.ADMIN_TEMP,
            desc: `
        Bu komut ile antrenman haritasını açarsın.`,
            function: stadiumCommand,
        },
        v2: {
            aliases: ['v1'],
            roles: Role.ADMIN_TEMP,
            desc: `
        Bu komut ile v1 - v2 haritasını açarsın.`,
            function: stadiumCommand,
        },
        v4: {
            aliases: [''],
            roles: Role.ADMIN_TEMP,
            desc: `
        Bu komut ile v4 haritasını açarsın.`,
            function: stadiumCommand,
        },
        rr: {
            aliases: [],
            roles: Role.ADMIN_TEMP,
            desc: `
        Bu komut ile oyunu yeniden başlatırsın`,
            function: restartCommand,
        },
        rrs: {
            aliases: [],
            roles: Role.ADMIN_TEMP,
            desc: `
    Bu komut ile takımları yer değiştirip oyunu yeniden başlatırsın.`,
            function: restartSwapCommand,
        },
        değiş: {
            aliases: ['swap', 's'],
            roles: Role.ADMIN_TEMP,
            desc: `
    Bu komut ile takımları yer değiştirirsin.`,
            function: swapCommand,
        },
        kırmızıkick: {
            aliases: ['kickr', 'rediat', 'redat', 'kırmızıyıat', 'kırmızıat', 'kickrec', 'kk'],
            roles: Role.ADMIN_TEMP,
            desc: `
    Bu komut ile kırmızı takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
            function: kickTeamCommand,
        },
        mavikick: {
            aliases: ['kickb', 'blueat', 'maviyiat', 'maviat', 'kickblue', 'mk'],
            roles: Role.ADMIN_TEMP,
            desc: `
    Bu komut ile mavi takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
            function: kickTeamCommand,
        },
        speckick: {
            aliases: ['kicks', 'specat', 'izleyiciat', 'izleyiciyiat', 'izleyicileriat', 'sk'],
            roles: Role.ADMIN_TEMP,
            desc: `
    Bu komut ile izleyici takımını oyundan atarsın(sen de dahilsin). Neden attığını belirtmen gerekiyor.`,
            function: kickTeamCommand,
        },
        mute: {
            aliases: ['sustur', 'mute'],
            roles: Role.ADMIN_TEMP,
            desc: `
        Bu komut ile bir oyunucuyu susturursun. İstersen yanına kaç dakika susması gerektiğini belirtebilirsin.
        Örnek: !mute #3 20, 3 idsine sahip oyuncuyu 20 dakika boyunca susturur.`,
            function: muteCommand,
        },
        unmute: {
            aliases: ['um'],
            roles: Role.ADMIN_TEMP,
            desc: `
        Bu komut ile mutelanmış oyuncunun cezasını kaldırırsın.
        !mutelar yazarak mutelanmış oyuncunun numarasını bulursun ve !unmute 45(oyuncunun yanında numarası yazıyor) yazarsın.`,
            function: unmuteCommand,
        },
        mutelar: {
            aliases: ['mutes'],
            roles: Role.ADMIN_TEMP,
            desc: `
        Bu komut ile mutelanmış oyuncuları görürsün.`,
            function: muteListCommand,
        },
        bankaldır: {
            aliases: ['clearbans'],
            roles: Role.MASTER,
            desc: `
    Bu komut ile banlanan bütün oyuncuların banını kaldırabilirsin. Eğer sadece bir kişinin banını kaldırmak istiyorsan !banlar yazmalısın
    Daha sonra oyuncunun yanındaki numarayı öğrenip !bankaldır 45(oyuncunun yanındaki numara) yazmalısın.`,
            function: clearbansCommand,
        },
        banlar: {
            aliases: ['banlist', 'bans', 'banlistesi'],
            roles: Role.MASTER,
            desc: `
    Bu komut ile banlanan oyuncuları numarasıyla birlikte görebilirsin.`,
            function: banListCommand,
        },
        adminler: {
            aliases: ['adminlist', 'adminlistesi'],
            roles: Role.MASTER,
            desc: `
        Bu komut ile admin listesini görebilirsin.`,
            function: adminListCommand,
        },
        adminyap: {
            aliases: ['setadmin'],
            roles: Role.MASTER,
            desc: `
    Bu komut birini admin yapmanı sağlar.
    Örnek: !adminyap #3, idsi 3 olan oyuncuyu admin yapar.`,
            function: setAdminCommand,
        },
        adminkaldır: {
            aliases: ['unadmin', 'removeadmin'],
            roles: Role.MASTER,
            desc: `
        Bu komut ile bir oyuncunun adminliğini alabilirsin.
        !adminler yazarak oyuncunun numarasını bulursun ve !adminkaldır 45(oyuncunun yanında numarası yazıyor) yazarsın.`,
            function: removeAdminCommand,
        },
        odaşifresi: {
            aliases: ['roompass', 'odaşifre'],
            roles: Role.MASTER,
            desc: `
        Bu komut ile odaya şifre koyarsın. Kullanımı !odaşifresi deneme123
        Geri kaldırmak için !odaşifresi yazman yeterli`,
            function: passwordCommand,
        }
    };

    /* GAME */

    var lastTouches = Array(2).fill(null);
    var lastTeamTouched;

    var speedCoefficient = 100 / (5 * (0.99 ** 60 + 1));
    var ballSpeed = 0;
    var playerRadius = 15;
    var ballRadius = 6.25;
    var triggerDistance = playerRadius + ballRadius + 0.01;

    /* COLORS */

    var welcomeColor = 0xc4ff65;
    var announcementColor = 0xffefd6;
    var infoColor = 0xbebebe;
    var privateMessageColor = 0xffc933;
    var redColor = 0xff4c4c;
    var blueColor = 0x62cbff;
    var warningColor = 0xffa135;
    var errorColor = 0xa40000;
    var successColor = 0x75ff75;
    var defaultColor = null;

    /* AUXILIARY */

    var checkTimeVariable = false;
    var checkStadiumVariable = true;
    var endGameVariable = false;
    var cancelGameVariable = false;
    var kickFetchVariable = false;

    var chooseMode = false;
    var timeOutCap;
    var capLeft = false;
    var redCaptainChoice = '';
    var blueCaptainChoice = '';
    var chooseTime = 20;

    var AFKSet = new Set();
    var AFKMinSet = new Set();
    var AFKCooldownSet = new Set();
    var minAFKDuration = 0;
    var maxAFKDuration = 30;
    var AFKCooldown = 0;

    var muteArray = new MuteList();
    var muteDuration = 5;

    var removingPlayers = false;
    var insertingPlayers = false;

    var stopTimeout;
    var startTimeout;
    var unpauseTimeout;
    var removingTimeout;
    var insertingTimeout;

    var emptyPlayer = {
        id: 0,
    };
    stadiumCommand(emptyPlayer, "!antrenman");

    var game = new Game();

    /* FUNCTIONS */

    /* AUXILIARY FUNCTIONS */

    if (typeof String.prototype.replaceAll != 'function') {
        String.prototype.replaceAll = function (search, replacement) {
            var target = this;
            return target.split(search).join(replacement);
        };
    }

    function getDate() {
        let d = new Date();
        return d.toLocaleDateString() + ' ' + d.toLocaleTimeString();
    }

    /* MATH FUNCTIONS */

    function getRandomInt(max) {
        // returns a random number between 0 and max-1
        return Math.floor(Math.random() * Math.floor(max));
    }

    function pointDistance(p1, p2) {
        return Math.sqrt(Math.pow(p1.x - p2.x, 2) + Math.pow(p1.y - p2.y, 2));
    }

    /* TIME FUNCTIONS */

    function getHoursStats(time) {
        return Math.floor(time / 3600);
    }

    function getMinutesGame(time) {
        var t = Math.floor(time / 60);
        return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
    }

    function getMinutesReport(time) {
        return Math.floor(Math.round(time) / 60);
    }

    function getMinutesEmbed(time) {
        var t = Math.floor(Math.round(time) / 60);
        return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
    }

    function getMinutesStats(time) {
        return Math.floor(time / 60) - getHoursStats(time) * 60;
    }

    function getSecondsGame(time) {
        var t = Math.floor(time - Math.floor(time / 60) * 60);
        return `${Math.floor(t / 10)}${Math.floor(t % 10)}`;
    }

    function getSecondsReport(time) {
        var t = Math.round(time);
        return Math.floor(t - getMinutesReport(t) * 60);
    }

    function getSecondsEmbed(time) {
        var t = Math.round(time);
        var t2 = Math.floor(t - Math.floor(t / 60) * 60);
        return `${Math.floor(t2 / 10)}${Math.floor(t2 % 10)}`;
    }

    function getTimeGame(time) {
        return `[${getMinutesGame(time)}:${getSecondsGame(time)}]`;
    }

    function getTimeEmbed(time) {
        return `[${getMinutesEmbed(time)}:${getSecondsEmbed(time)}]`;
    }

    function getTimeStats(time) {
        if (getHoursStats(time) > 0) {
            return `${getHoursStats(time)} s${getMinutesStats(time)} dk`;
        } else {
            return `${getMinutesStats(time)} dk`;
        }
    }

    function getGoalGame() {
        return game.scores.red + game.scores.blue;
    }

    /* REPORT FUNCTIONS */

    function findFirstNumberCharString(str) {
        return str[str.search(/[0-9]/g)];
    }

    function getIdReport() {
        var d = new Date();
        return `${d.getFullYear() % 100}${d.getMonth() < 9 ? '0' : ''}${d.getMonth() + 1}${d.getDate() < 10 ? '0' : ''}${d.getDate()}${d.getHours() < 10 ? '0' : ''}${d.getHours()}${d.getMinutes() < 10 ? '0' : ''}${d.getMinutes()}${d.getSeconds() < 10 ? '0' : ''}${d.getSeconds()}${findFirstNumberCharString(roomName)}`;
    }

    function getRecordingName(game) {
        var d = new Date();
        var redCap = game.playerComp[0][0] != undefined ? game.playerComp[0][0].player.name : 'Kırmızı';
        var blueCap = game.playerComp[1][0] != undefined ? game.playerComp[1][0].player.name : 'Mavi';
        return `${d.getDate()}-${d.getMonth() < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1}-${d.getFullYear() % 100}-${d.getHours()}s${d.getMinutes()}-${redCap}vs${blueCap}.hbr2`;
    }

    /* FEATURE FUNCTIONS */

    function getCommand(commandStr) {
        if (commands.hasOwnProperty(commandStr)) return commandStr;
        for (const [key, value] of Object.entries(commands)) {
            for (let alias of value.aliases) {
                if (alias == commandStr) return key;
            }
        }
        return false;
    }

    function getPlayerComp(player) {
        if (player == null || player.id == 0) return null;
        var comp = game.playerComp;
        var index = comp[0].findIndex((c) => c.auth == authArray[player.id][0]);
        if (index != -1) return comp[0][index];
        index = comp[1].findIndex((c) => c.auth == authArray[player.id][0]);
        if (index != -1) return comp[1][index];
        return null;
    }

    function getTeamArray(team) {
        return team == Team.RED ? teamRed : team == Team.BLUE ? teamBlue : teamSpec;
    }

    function sendAnnouncementTeam(message, team, color, style, mention) {
        for (let player of team) {
            room.sendAnnouncement(message, player.id, color, style, mention);
        }
    }

    function teamChat(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        var emoji = player.team == Team.RED ? '🔴' : player.team == Team.BLUE ? '🔵' : '⚪';
        var message = `${emoji} [TAKIM SOHBETİ] ${player.name}: ${msgArray.join(' ')}`;
        var team = getTeamArray(player.team);
        var color = player.team == Team.RED ? redColor : player.team == Team.BLUE ? blueColor : null;
        var style = 'bold';
        var mention = HaxNotification.CHAT;
        sendAnnouncementTeam(message, team, color, style, mention);
    }

    function playerChat(player, message) {
        var msgArray = message.split(/ +/);
        var playerTargetIndex = playersAll.findIndex(
            (p) => p.name.replaceAll(' ', '_') == msgArray[0].substring(2)
        );
        if (playerTargetIndex == -1) {
            room.sendAnnouncement(
                `Böyle bir oyuncu bulunamadı, girdiğin ismi kontrol et.`,
                player.id,
                errorColor,
                'bold',
                null
            );
            return false;
        }
        var playerTarget = playersAll[playerTargetIndex];
        if (player.id == playerTarget.id) {
            room.sendAnnouncement(
                `Kendine mesaj yollayamazsın!`,
                player.id,
                errorColor,
                'bold',
                null
            );
            return false;
        }
        var messageFrom = `📝 [${playerTarget.name} isimli kullanıcıya mesajın] ${player.name}: ${msgArray.slice(1).join(' ')}`

        var messageTo = `📝 [${player.name}, bir mesaj gönderdi] ${player.name}: ${msgArray.slice(1).join(' ')}`

        room.sendAnnouncement(
            messageFrom,
            player.id,
            privateMessageColor,
            'bold',
            HaxNotification.CHAT
        );
        room.sendAnnouncement(
            messageTo,
            playerTarget.id,
            privateMessageColor,
            'bold',
            HaxNotification.CHAT
        );
    }

    /* PHYSICS FUNCTIONS */

    function calculateStadiumVariables() {
        if (checkStadiumVariable && teamRed.length + teamBlue.length > 0) {
            checkStadiumVariable = false;
            setTimeout(() => {
                let ballDisc = room.getDiscProperties(0);
                let playerDisc = room.getPlayerDiscProperties(teamRed.concat(teamBlue)[0].id);
                ballRadius = 6.25;
                playerRadius = playerDisc.radius;
                triggerDistance = ballRadius + playerRadius + 0.01;
                speedCoefficient = 100 / (5 * ballDisc.invMass * (ballDisc.damping ** 60 + 1));
            }, 1);
        }
    }

    function checkGoalKickTouch(array, index, goal) {
        if (array != null && array.length >= index + 1) {
            var obj = array[index];
            if (obj != null && obj.goal != null && obj.goal == goal) return obj;
        }
        return null;
    }

    /* BUTTONS */

    function topButton() {
        if (teamSpec.length > 0) {
            if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
                room.setPlayerTeam(teamSpec[1].id, Team.BLUE);
            } else if (teamRed.length < teamBlue.length)
                room.setPlayerTeam(teamSpec[0].id, Team.RED);
            else room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
        }
    }

    function randomButton() {
        if (teamSpec.length > 0) {
            if (teamRed.length == teamBlue.length && teamSpec.length > 1) {
                var r = getRandomInt(teamSpec.length);
                room.setPlayerTeam(teamSpec[r].id, Team.RED);
                teamSpec = teamSpec.filter((spec) => spec.id != teamSpec[r].id);
                room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
            } else if (teamRed.length < teamBlue.length)
                room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.RED);
            else
                room.setPlayerTeam(teamSpec[getRandomInt(teamSpec.length)].id, Team.BLUE);
        }
    }

    function blueToSpecButton() {
        clearTimeout(removingTimeout);
        removingPlayers = true;
        removingTimeout = setTimeout(() => {
            removingPlayers = false;
        }, 100);
        for (var i = 0; i < teamBlue.length; i++) {
            room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
        }
    }

    function redToSpecButton() {
        clearTimeout(removingTimeout);
        removingPlayers = true;
        removingTimeout = setTimeout(() => {
            removingPlayers = false;
        }, 100);
        for (var i = 0; i < teamRed.length; i++) {
            room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
        }
    }

    function resetButton() {
        clearTimeout(removingTimeout);
        removingPlayers = true;
        removingTimeout = setTimeout(() => {
            removingPlayers = false;
        }, 100);
        for (let i = 0; i < Math.max(teamRed.length, teamBlue.length); i++) {
            if (Math.max(teamRed.length, teamBlue.length) - teamRed.length - i > 0)
                room.setPlayerTeam(teamBlue[teamBlue.length - 1 - i].id, Team.SPECTATORS);
            else if (Math.max(teamRed.length, teamBlue.length) - teamBlue.length - i > 0)
                room.setPlayerTeam(teamRed[teamRed.length - 1 - i].id, Team.SPECTATORS);
            else break;
        }
        for (let i = 0; i < Math.min(teamRed.length, teamBlue.length); i++) {
            room.setPlayerTeam(
                teamBlue[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
                Team.SPECTATORS
            );
            room.setPlayerTeam(
                teamRed[Math.min(teamRed.length, teamBlue.length) - 1 - i].id,
                Team.SPECTATORS
            );
        }
    }

    function swapButton() {
        clearTimeout(removingTimeout);
        removingPlayers = true;
        removingTimeout = setTimeout(() => {
            removingPlayers = false;
        }, 100);
        for (let player of teamBlue) {
            room.setPlayerTeam(player.id, Team.RED);
        }
        for (let player of teamRed) {
            room.setPlayerTeam(player.id, Team.BLUE);
        }
    }

    /* COMMAND FUNCTIONS */

    /* PLAYER COMMANDS */

    function leaveCommand(player, message) {
        room.kickPlayer(player.id, 'Görüşürüz !', false);
    }

    function dclinkCommand(player, message) {
        room.sendAnnouncement(
            `Discord sunucumuza davetlisin ! Link: https://discord.gg/wspDawNSDp`,
            player.id,
            infoColor,
            'bold',
            HaxNotification.CHAT
        );
    }

    function helpCommand(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length == 0) {
            var commandString = 'Oyuncu komutları :';
            for (const [key, value] of Object.entries(commands)) {
                if (value.desc && value.roles == Role.PLAYER) commandString += ` !${key},`;
            }
            commandString = commandString.substring(0, commandString.length - 1) + '.\n';
            if (getRole(player) >= Role.ADMIN_TEMP) {
                commandString += `Admin komutları:`;
                for (const [key, value] of Object.entries(commands)) {
                    if (value.desc && value.roles == Role.ADMIN_TEMP) commandString += ` !${key},`;
                }
                if (commandString.slice(commandString.length - 1) == ':')
                    commandString += ` Yok,`;
                commandString = commandString.substring(0, commandString.length - 1) + '.\n';
            }
            if (getRole(player) >= Role.MASTER) {
                commandString += `Yetkili komutları :`;
                for (const [key, value] of Object.entries(commands)) {
                    if (value.desc && value.roles == Role.MASTER) commandString += ` !${key},`;
                }
                if (commandString.slice(commandString.length - 1) == ':') commandString += ` Yok,`;
                commandString = commandString.substring(0, commandString.length - 1) + '.\n';
            }
            commandString += "\nBir komut için detaylı bilgi almak için ''!yardım <komutismi>'.";
            room.sendAnnouncement(
                commandString,
                player.id,
                infoColor,
                'bold',
                HaxNotification.CHAT
            );
        } else if (msgArray.length >= 1) {
            var commandName = getCommand(msgArray[0].toLowerCase());
            if (commandName != false && commands[commandName].desc != false)
                room.sendAnnouncement(
                    `\'${commandName}\' komutu :\n${commands[commandName].desc}`,
                    player.id,
                    infoColor,
                    'bold',
                    HaxNotification.CHAT
                );
            else
                room.sendAnnouncement(
                    `Böyle bir komut yok, komutları görmek için \'!yardım\'`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
        }
    }

    async function globalStatsCommand(player, message) {
        var data = await checkStats(authArray[player.id][0]);
        const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
        var statsString = printPlayerStats(stats);
        room.sendAnnouncement(
            statsString,
            player.id,
            infoColor,
            'bold',
            HaxNotification.CHAT
        );
    }

    function statsLeaderboardCommand(player, message) {
        var key = message.split(/ +/)[0].substring(1).toLowerCase();
        printRankings(key, player.id);
    }

    function afkCommand(player, message) {
        if (player.team == Team.SPECTATORS || players.length == 1) {
            if (AFKSet.has(player.id)) {
                if (AFKMinSet.has(player.id)) {
                    room.sendAnnouncement(
                        `Minumum ${minAFKDuration} dakika AFK kalabilirsin. Komutu kötüye kullanmamalısın !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    AFKSet.delete(player.id);
                    room.sendAnnouncement(
                        `🌅 ${player.name} artık AFK değil !`,
                        null,
                        announcementColor,
                        'bold',
                        null
                    );
                    updateTeams();
                    handlePlayersJoin();
                }
            } else {
                if (AFKCooldownSet.has(player.id)) {
                    room.sendAnnouncement(
                        `Sadece ${AFKCooldown} dakikada bir AFK kalabilirsin. Komutu kötüye kullanmamalısın !`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else {
                    AFKSet.add(player.id);
                    if (!player.admin) {
                        AFKMinSet.add(player.id);
                        AFKCooldownSet.add(player.id);
                        setTimeout(
                            (id) => {
                                AFKMinSet.delete(id);
                            },
                            minAFKDuration * 60 * 1000,
                            player.id
                        );
                        setTimeout(
                            (id) => {
                                AFKSet.delete(id);
                            },
                            maxAFKDuration * 60 * 1000,
                            player.id
                        );
                        setTimeout(
                            (id) => {
                                AFKCooldownSet.delete(id);
                            },
                            AFKCooldown * 60 * 1000,
                            player.id
                        );
                    }
                    room.setPlayerTeam(player.id, Team.SPECTATORS);
                    room.sendAnnouncement(
                        `😴 ${player.name} artık AFK !`,
                        null,
                        announcementColor,
                        'bold',
                        null
                    );
                    updateTeams();
                    handlePlayersLeave();
                }
            }
        } else {
            room.sendAnnouncement(
                `Oyundayken AFK kalamazsın !`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function afkListCommand(player, message) {
        if (AFKSet.size == 0) {
            room.sendAnnouncement(
                "😴 AFK listesinde kimse yok",
                player.id,
                announcementColor,
                'bold',
                null
            );
            return;
        }
        var cstm = '😴 AFK listesi : ';
        AFKSet.forEach((_, value) => {
            var p = room.getPlayer(value);
            if (p != null) cstm += p.name + `, `;
        });
        cstm = cstm.substring(0, cstm.length - 2) + '.';
        room.sendAnnouncement(cstm, player.id, announcementColor, 'bold', null);
    }

    async function vipCommand(player, message) {
        var data = await checkPlayer(authArray[player.id][0]);
        const perm = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
        if (perm.isVIP == true && vipList.includes(authArray[player.id][0]) == false) {
            vipList.push(authArray[player.id][0]);
            room.sendAnnouncement(
                `${player.name} vip hesabına giriş yaptı!`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else if (perm.isVIP == false) {
            room.sendAnnouncement(
                `${player.name} yetkili değilsin kanka :(`,
                null,
                announcementColor,
                'bold',
                HaxNotification.MENTION
            );
        } else {
            room.sendAnnouncement(
                `Zaten yetkini aldın kanka!`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.MENTION
            );
        }
    }

    async function masterCommand(player, message) {
        var data = await checkPlayer(authArray[player.id][0]);
        const perm = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
        if (perm.isMaster == true && masterList.includes(authArray[player.id][0]) == false) {
            room.setPlayerAdmin(player.id, true);
            masterList.push(authArray[player.id][0]);
            room.sendAnnouncement(
                `${player.name} yetkisini aldı!`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );

        } else if (perm.isAdmin == true && adminList.includes(authArray[player.id][0]) == false) {
            room.setPlayerAdmin(player.id, true);
            adminList.push(authArray[player.id][0]);
            room.sendAnnouncement(
                `${player.name} adminliğini aldı!`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else if (perm.isAdmin == false && perm.isMaster == false) {
            room.sendAnnouncement(
                `${player.name} yetkili değilsin kanka :(`,
                null,
                announcementColor,
                'bold',
                HaxNotification.MENTION
            );
        } else {
            room.sendAnnouncement(
                `Zaten yetkini aldın kanka!`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.MENTION
            );
        }
    }

    /* ADMIN COMMANDS */

    function restartCommand(player, message) {
        instantRestart();
    }

    function restartSwapCommand(player, message) {
        room.stopGame();
        swapButton();
        startTimeout = setTimeout(() => {
            room.startGame();
        }, 10);
    }

    function swapCommand(player, message) {
        if (playSituation == Situation.STOP) {
            swapButton();
            room.sendAnnouncement(
                '✔️ Takımlar değişti !',
                null,
                announcementColor,
                'bold',
                null
            );
        } else {
            room.sendAnnouncement(
                `Takımları değiştirmek için oyunu durdurmalısın.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function kickTeamCommand(player, message) {
        var msgArray = message.split(/ +/);
        var reasonString = `Team kick by ${player.name}`;
        if (msgArray.length > 1) {
            reasonString = msgArray.slice(1).join(' ');
        }
        if (['!kickred', '!kickr'].includes(msgArray[0].toLowerCase())) {
            for (let i = 0; i < teamRed.length; i++) {
                setTimeout(() => {
                    room.kickPlayer(teamRed[0].id, reasonString, false);
                }, i * 20)
            }
        } else if (['!kickblue', '!kickb'].includes(msgArray[0].toLowerCase())) {
            for (let i = 0; i < teamBlue.length; i++) {
                setTimeout(() => {
                    room.kickPlayer(teamBlue[0].id, reasonString, false);
                }, i * 20)
            }
        } else if (['!kickspec', '!kicks'].includes(msgArray[0].toLowerCase())) {
            for (let i = 0; i < teamSpec.length; i++) {
                setTimeout(() => {
                    room.kickPlayer(teamSpec[0].id, reasonString, false);
                }, i * 20)
            }
        }
    }

    function stadiumCommand(player, message) {
        var msgArray = message.split(/ +/);
        if (gameState == State.STOP) {
            if (['!v2'].includes(msgArray[0].toLowerCase())) {
                if (JSON.parse(v2Map).name == 'v2') {
                    room.setDefaultStadium('v2');
                } else {
                    room.setCustomStadium(v2Map);
                }
                currentStadium = 'v2';
            } else if (['!v4'].includes(msgArray[0].toLowerCase())) {
                if (JSON.parse(v4Map).name == 'v4') {
                    room.setDefaultStadium('v4');
                } else {
                    room.setCustomStadium(v4Map);
                }
                currentStadium = 'v4';
            } else if (['!antrenman'].includes(msgArray[0].toLowerCase())) {
                room.setCustomStadium(antrenmanMap);
                currentStadium = 'antrenman';
            } else {
                room.sendAnnouncement(
                    `Böyle bir harita yok.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Bu komutu kullanmak için oyunu durdurmalısın.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function muteCommand(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length > 0) {
            if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
                msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
                if (room.getPlayer(parseInt(msgArray[0])) != null) {
                    var playerMute = room.getPlayer(parseInt(msgArray[0]));
                    var minutesMute = muteDuration;
                    if (msgArray.length > 1 && parseInt(msgArray[1]) > 0) {
                        minutesMute = parseInt(msgArray[1]);
                    }
                    if (!playerMute.admin) {
                        var muteObj = new MutePlayer(playerMute.name, playerMute.id, authArray[playerMute.id][0]);
                        muteObj.setDuration(minutesMute);
                        room.sendAnnouncement(
                            `${playerMute.name}, ${minutesMute} dakika boyunca susturuldu.`,
                            null,
                            announcementColor,
                            'bold',
                            null
                        );
                    } else {
                        room.sendAnnouncement(
                            `Bir admini susturamazsın.`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else {
                    room.sendAnnouncement(
                        `Böyle bir IDye sahip oyuncu yok. Komutun kullanımı için !yardım sustur yaz.`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `Yanlış komut kullanımı. Doğru kullanımı için !yardım sustur yaz.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Yanlış bir numara girdin. Komutun kullanımı için !yardım sustur yaz.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function unmuteCommand(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length > 0) {
            if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
                msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
                if (room.getPlayer(parseInt(msgArray[0])) != null) {
                    var playerUnmute = room.getPlayer(parseInt(msgArray[0]));
                    if (muteArray.getById(playerUnmute.id) != null) {
                        var muteObj = muteArray.getById(playerUnmute.id);
                        muteObj.remove()
                        room.sendAnnouncement(
                            `${playerUnmute.name} artık konuşabilir!`,
                            null,
                            announcementColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    } else {
                        room.sendAnnouncement(
                            `Bu oyuncu susturulmuş değil !`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else {
                    room.sendAnnouncement(
                        `Böyle bir IDye sahip oyuncu yok. Komutun kullanımı için !yardım unmute yaz.`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) > 0 && muteArray.getById(parseInt(msgArray[0])) != null) {
                var playerUnmute = muteArray.getById(parseInt(msgArray[0]));
                playerUnmute.remove();
                room.sendAnnouncement(
                    `${playerUnmute.name} artık konuşabilir !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else {
                room.sendAnnouncement(
                    `Yanlış komut kullanımı. Doğru kullanımı için !yardım unmute yaz.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Yanlış bir numara girdin. Komutun kullanımı için !yardım unmute yaz.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function muteListCommand(player, message) {
        if (muteArray.list.length == 0) {
            room.sendAnnouncement(
                "🔇 Sustur listesinde kimse yok",
                player.id,
                announcementColor,
                'bold',
                null
            );
            return false;
        }
        var cstm = '🔇 mutelanmış oyuncular : ';
        for (let mute of muteArray.list) {
            cstm += mute.name + `[${mute.id}], `;
        }
        cstm = cstm.substring(0, cstm.length - 2) + '.';
        room.sendAnnouncement(
            cstm,
            player.id,
            announcementColor,
            'bold',
            null
        );
    }

    /* MASTER COMMANDS */

    function clearbansCommand(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length == 0) {
            room.clearBans();
            room.sendAnnouncement(
                '✔️ Banlar temizlendi !',
                null,
                announcementColor,
                'bold',
                null
            );
            banList = [];
        } else if (msgArray.length == 1) {
            if (parseInt(msgArray[0]) > 0) {
                var ID = parseInt(msgArray[0]);
                room.clearBan(ID);
                if (banList.length != banList.filter((p) => p[1] != ID).length) {
                    room.sendAnnouncement(
                        `✔️ ${banList.filter((p) => p[1] == ID)[0][0]} adlı oyuncunun banlı kaldırıldı !`,
                        null,
                        announcementColor,
                        'bold',
                        null
                    );
                } else {
                    room.sendAnnouncement(
                        `Girdiğin numaraya sahip bir oyuncu yok. Komutun kullanımı için !yardım bankaldır yaz.`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
                banList = banList.filter((p) => p[1] != ID);
            } else {
                room.sendAnnouncement(
                    `Yanlış ID girdin. Komutun kullanımı için !yardım bankaldır yaz.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Yanlış numara girdin. Komutun kullanımı için !yardım bankaldır yaz.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function banListCommand(player, message) {
        if (banList.length == 0) {
            room.sendAnnouncement(
                "📢 Ban listesinde kimse yok.",
                player.id,
                announcementColor,
                'bold',
                null
            );
            return false;
        }
        var cstm = '📢 Ban listesi : ';
        for (let ban of banList) {
            cstm += ban[0] + `[${ban[1]}], `;
        }
        cstm = cstm.substring(0, cstm.length - 2) + '.';
        room.sendAnnouncement(
            cstm,
            player.id,
            announcementColor,
            'bold',
            null
        );
    }

    async function adminListCommand(player, message) {
        if (adminList.length == 0) {
            room.sendAnnouncement(
                "📢 Admin listesinde kimse yok.",
                player.id,
                announcementColor,
                'bold',
                null
            );
            return false;
        }
        var cstm = '📢 Admin listesi : ';
        for (let i = 0; i < adminList.length; i++) {
            cstm += adminList[i][1] + `[${i}], `;
        }
        cstm = cstm.substring(0, cstm.length - 2) + '.';
        room.sendAnnouncement(
            cstm,
            player.id,
            announcementColor,
            'bold',
            null
        );
    }

    async function vipListCommand(player, message) {
        if (vipList.length == 0) {
            room.sendAnnouncement(
                "📢 VIP listesinde kimse yok.",
                player.id,
                announcementColor,
                'bold',
                null
            );
            return false;
        }
        var cstm = '📢 VIP listesi : ';
        for (let i = 0; i < vipList.length; i++) {
            cstm += vipList[i][1] + `[${i}], `;
        }
        cstm = cstm.substring(0, cstm.length - 2) + '.';
        room.sendAnnouncement(
            cstm,
            player.id,
            announcementColor,
            'bold',
            null
        );
    }

    function setAdminCommand(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length > 0) {
            if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
                msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
                if (room.getPlayer(parseInt(msgArray[0])) != null) {
                    var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                    if (!adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])) {
                        if (!masterList.includes(authArray[playerAdmin.id][0])) {
                            room.setPlayerAdmin(playerAdmin.id, true);
                            adminList.push([authArray[playerAdmin.id][0], playerAdmin.name]);
                            room.sendAnnouncement(
                                `${playerAdmin.name} artık oda admini !`,
                                null,
                                announcementColor,
                                'bold',
                                HaxNotification.CHAT
                            );
                        } else {
                            room.sendAnnouncement(
                                `Bu oyuncu zaten yetkili !`,
                                player.id,
                                errorColor,
                                'bold',
                                HaxNotification.CHAT
                            );
                        }
                    } else {
                        room.sendAnnouncement(
                            `Bu oyuncu zaten kalıcı bir admin !`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else {
                    room.sendAnnouncement(
                        `Yanlış ID girdin. Komutun kullanımı için !yardım adminyap yaz.`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else {
                room.sendAnnouncement(
                    `Komutu yanlış girdin. Komutun doğru kullanımı için !yardım adminyap yaz.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Yanlış bir numara girdin. Komutun kullanımı için !yardım adminyap yaz.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function removeAdminCommand(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length > 0) {
            if (msgArray[0].length > 0 && msgArray[0][0] == '#') {
                msgArray[0] = msgArray[0].substring(1, msgArray[0].length);
                if (room.getPlayer(parseInt(msgArray[0])) != null) {
                    var playerAdmin = room.getPlayer(parseInt(msgArray[0]));

                    if (adminList.map((a) => a[0]).includes(authArray[playerAdmin.id][0])) {
                        room.setPlayerAdmin(playerAdmin.id, false);
                        adminList = adminList.filter((a) => a[0] != authArray[playerAdmin.id][0]);
                        room.sendAnnouncement(
                            `${playerAdmin.name} artık bir oda admini değil !`,
                            null,
                            announcementColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    } else {
                        room.sendAnnouncement(
                            `Bu oyuncu kalıcı bir admin değil, kaldırmana gerek yok !`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else {
                    room.sendAnnouncement(
                        `Yanlış ID girdin. Komutun kullanımı için !yardım adminkaldır yaz.`,
                        player.id,
                        errorColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                }
            } else if (msgArray[0].length > 0 && parseInt(msgArray[0]) < adminList.length) {
                var index = parseInt(msgArray[0]);
                var playerAdmin = adminList[index];
                if (playersAll.findIndex((p) => authArray[p.id][0] == playerAdmin[0]) != -1) {
                    // check if there is the removed admin in the room
                    var indexRem = playersAll.findIndex((p) => authArray[p.id][0] == playerAdmin[0]);
                    room.setPlayerAdmin(playersAll[indexRem].id, false);
                }
                adminList.splice(index);
                room.sendAnnouncement(
                    `${playerAdmin[1]} artık oda admini değil !`,
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else {
                room.sendAnnouncement(
                    `Komutu yanlış girdin. Doğru kullanımı için !yardım adminkaldır yaz.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        } else {
            room.sendAnnouncement(
                `Yanlış bir numara girdin. Komutun kullanımı için !yardım adminkaldır yaz.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
        }
    }

    function passwordCommand(player, message) {
        var msgArray = message.split(/ +/).slice(1);
        if (msgArray.length > 0) {
            if (msgArray.length == 1 && msgArray[0] == '') {
                roomPassword = '';
                room.setPassword(null);
                room.sendAnnouncement(
                    `Oda şifresi kaldırıldı.`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
            roomPassword = msgArray.join(' ');
            room.setPassword(roomPassword);
            room.sendAnnouncement(
                `Odanın şifresi artık: ${roomPassword} !`,
                player.id,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            if (roomPassword != '') {
                roomPassword = '';
                room.setPassword(null);
                room.sendAnnouncement(
                    `Odanın şifresi kaldırıldı.`,
                    player.id,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            } else {
                room.sendAnnouncement(
                    `Odanın şu an bir şifresi yok. !yardım odaşifresi yazarak komut hakkında bilgi sahibi olabilirsin.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        }
    }

    /* GAME FUNCTIONS */

    function checkTime() {
        const scores = room.getScores();
        if (game != undefined) game.scores = scores;
        if (Math.abs(scores.time - scores.timeLimit) <= 0.01 && scores.timeLimit != 0 && playSituation == Situation.PLAY) {
            if (scores.red != scores.blue) {
                if (!checkTimeVariable) {
                    checkTimeVariable = true;
                    setTimeout(() => {
                        checkTimeVariable = false;
                    }, 3000);
                    scores.red > scores.blue ? endGame(Team.RED) : endGame(Team.BLUE);
                    stopTimeout = setTimeout(() => {
                        room.stopGame();
                    }, 2000);
                }
                return;
            }
            if (drawTimeLimit != 0) {
                goldenGoal = true;
                room.sendAnnouncement(
                    '⚽ Altın gol ! İlk golü atan kazanır!',
                    null,
                    announcementColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
        }
        if (Math.abs(scores.time - drawTimeLimit * 60 - scores.timeLimit) <= 0.01 && scores.timeLimit != 0) {
            if (!checkTimeVariable) {
                checkTimeVariable = true;
                setTimeout(() => {
                    checkTimeVariable = false;
                }, 10);
                endGame(Team.SPECTATORS);
                room.stopGame();
                goldenGoal = false;
            }
        }
    }

    function instantRestart() {
        room.stopGame();
        startTimeout = setTimeout(() => {
            room.startGame();
        }, 10);
    }

    function resumeGame() {
        startTimeout = setTimeout(() => {
            room.startGame();
        }, 1000);
        setTimeout(() => {
            room.pauseGame(false);
        }, 500);
    }

    async function endGame(winner) {
        if (players.length >= 2 * teamSize - 1) activateChooseMode();
        const scores = room.getScores();
        game.scores = scores;
        lastWinner = winner;
        endGameVariable = true;
        if (winner == Team.RED) {
            streak++;
            room.sendAnnouncement(
                `✨ Kırmız takım kazandı ${scores.red} - ${scores.blue} ! Mevcut seri: ${streak}`,
                null,
                redColor,
                'bold',
                HaxNotification.CHAT
            );
        } else if (winner == Team.BLUE) {
            streak = 1;
            room.sendAnnouncement(
                `✨ Mavi takım kazandı ${scores.blue} - ${scores.red} ! Mevcut seri: ${streak}`,
                null,
                blueColor,
                'bold',
                HaxNotification.CHAT
            );
        } else {
            streak = 0;
            room.sendAnnouncement(
                '💤 Oyun sıkıcı olmaya başladı.. Bu duruma el atıyorum!',
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
        let possessionRedPct = (possession[0] / (possession[0] + possession[1])) * 100;
        let possessionBluePct = 100 - possessionRedPct;
        let actionRedPct = (actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1])) * 100;
        let actionBluePct = 100 - actionRedPct;
        room.sendAnnouncement(
            `📊 Topla oynama: 🔴 ${(possessionRedPct).toPrecision(3)}% - ${(possessionBluePct).toPrecision(3)}% 🔵\n` +
            `📊 Topun oynandığı bölgeler: 🔴 ${(actionRedPct).toPrecision(3)}% - ${(actionBluePct).toPrecision(3)}% 🔵`,
            null,
            announcementColor,
            'bold',
            HaxNotification.NONE
        );
        await updateStats();
    }

    /* CHOOSING FUNCTIONS */

    function activateChooseMode() {
        chooseMode = true;
        slowMode = chooseModeSlowMode;
        room.sendAnnouncement(
            `🐢 Oyuncu seçmeniz için bekleme süresi ${chooseModeSlowMode} saniyeye çıkarıldı.`,
            null,
            announcementColor,
            'bold',
            HaxNotification.CHAT
        );
    }

    function deactivateChooseMode() {
        chooseMode = false;
        clearTimeout(timeOutCap);
        if (slowMode != defaultSlowMode) {
            slowMode = defaultSlowMode;
            room.sendAnnouncement(
                `🐢 Bekleme süresi tekrar ${defaultSlowMode} saniyeye düşürüldü.`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
        redCaptainChoice = '';
        blueCaptainChoice = '';
    }

    function getSpecList(player) {
        if (player == null) return null;
        var cstm = 'Oyuncular : ';
        for (let i = 0; i < teamSpec.length; i++) {
            cstm += teamSpec[i].name + `[${i + 1}], `;
        }
        cstm = cstm.substring(0, cstm.length - 2) + '.';
        room.sendAnnouncement(
            cstm,
            player.id,
            infoColor,
            'bold',
            HaxNotification.CHAT
        );
    }

    function choosePlayer() {
        clearTimeout(timeOutCap);
        let captain;
        if (teamRed.length <= teamBlue.length && teamRed.length != 0) {
            captain = teamRed[0];
        } else if (teamBlue.length < teamRed.length && teamBlue.length != 0) {
            captain = teamBlue[0];
        }
        if (captain != null) {
            room.sendAnnouncement(
                "Oyuncu seçmek için aşağıda verilen oyuncular yanındaki numaralı kullanabilirsin yada 'üst', 'rastgele' or 'alt'.",
                captain.id,
                infoColor,
                'bold',
                HaxNotification.MENTION
            );
            timeOutCap = setTimeout(
                (player) => {
                    room.sendAnnouncement(
                        `${player.name}, acele et ! Seçmek için sadece ${Number.parseInt(String(chooseTime / 2))} saniyen kaldı !`,
                        player.id,
                        warningColor,
                        'bold',
                        HaxNotification.MENTION
                    );
                    timeOutCap = setTimeout(
                        (player) => {
                            room.kickPlayer(
                                player.id,
                                "Verilen zamanda oyuncu seçmedin !",
                                false
                            );
                        },
                        chooseTime * 500,
                        captain
                    );
                },
                chooseTime * 1000,
                captain
            );
        }
        if (teamRed.length != 0 && teamBlue.length != 0) {
            getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
        }
    }

    function chooseModeFunction(player, message) {
        var msgArray = message.split(/ +/);
        if (player.id == teamRed[0].id || player.id == teamBlue[0].id) {
            if (teamRed.length <= teamBlue.length && player.id == teamRed[0].id) {
                if (['üst', 'oto'].includes(msgArray[0].toLowerCase())) {
                    room.setPlayerTeam(teamSpec[0].id, Team.RED);
                    redCaptainChoice = 'üst';
                    clearTimeout(timeOutCap);
                    room.sendAnnouncement(
                        `${player.name}, üstten bir oyuncu seçti !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else if (['rastgele', 'rast'].includes(msgArray[0].toLowerCase())) {
                    var r = getRandomInt(teamSpec.length);
                    room.setPlayerTeam(teamSpec[r].id, Team.RED);
                    redCaptainChoice = 'rastgele';
                    clearTimeout(timeOutCap);
                    room.sendAnnouncement(
                        `${player.name}, rastgele oyuncu seçmeyi tercih etti !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else if (['alt', 'aşağı'].includes(msgArray[0].toLowerCase())) {
                    room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
                    redCaptainChoice = 'alt';
                    clearTimeout(timeOutCap);
                    room.sendAnnouncement(
                        `${player.name}, alttan oyuncu seçmeyi tercih etti !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                    if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                        room.sendAnnouncement(
                            `Girdiğin numara geçersiz !`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    } else {
                        room.setPlayerTeam(
                            teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                            Team.RED
                        );
                        room.sendAnnouncement(
                            `${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} adlı oyuncuyu seçti!`,
                            null,
                            announcementColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else return false;
                return true;
            }
            if (teamRed.length > teamBlue.length && player.id == teamBlue[0].id) {
                if (['üst', 'oto'].includes(msgArray[0].toLowerCase())) {
                    room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                    blueCaptainChoice = 'üst';
                    clearTimeout(timeOutCap);
                    room.sendAnnouncement(
                        `${player.name}, üstten bir oyuncu seçti !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else if (['rastgele', 'rast'].includes(msgArray[0].toLowerCase())) {
                    room.setPlayerTeam(
                        teamSpec[getRandomInt(teamSpec.length)].id,
                        Team.BLUE
                    );
                    blueCaptainChoice = 'rastgele';
                    clearTimeout(timeOutCap);
                    room.sendAnnouncement(
                        `${player.name}, rastgele oyuncu seçmeyi tercih etti !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else if (['alt'].includes(msgArray[0].toLowerCase())) {
                    room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
                    blueCaptainChoice = 'alt';
                    clearTimeout(timeOutCap);
                    room.sendAnnouncement(
                        `${player.name}, alttan oyuncu seçmeyi tercih etti  !`,
                        null,
                        announcementColor,
                        'bold',
                        HaxNotification.CHAT
                    );
                } else if (!Number.isNaN(Number.parseInt(msgArray[0]))) {
                    if (Number.parseInt(msgArray[0]) > teamSpec.length || Number.parseInt(msgArray[0]) < 1) {
                        room.sendAnnouncement(
                            `Girdiğin numara geçersiz!`,
                            player.id,
                            errorColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    } else {
                        room.setPlayerTeam(
                            teamSpec[Number.parseInt(msgArray[0]) - 1].id,
                            Team.BLUE
                        );
                        room.sendAnnouncement(
                            `${player.name}, ${teamSpec[Number.parseInt(msgArray[0]) - 1].name} adlı oyuncuyu seçti!`,
                            null,
                            announcementColor,
                            'bold',
                            HaxNotification.CHAT
                        );
                    }
                } else return false;
                return true;
            }
        }
    }

    function checkCaptainLeave(player) {
        if (
            (teamRed.findIndex((red) => red.id == player.id) == 0 && chooseMode && teamRed.length <= teamBlue.length) ||
            (teamBlue.findIndex((blue) => blue.id == player.id) == 0 && chooseMode && teamBlue.length < teamRed.length)
        ) {
            choosePlayer();
            capLeft = true;
            setTimeout(() => {
                capLeft = false;
            }, 10);
        }
    }

    function slowModeFunction(player, message) {
        if (!player.admin) {
            if (!SMSet.has(player.id)) {
                SMSet.add(player.id);
                setTimeout(
                    (number) => {
                        SMSet.delete(number);
                    },
                    slowMode * 1000,
                    player.id
                );
            } else {
                return true;
            }
        }
        return false;
    }

    /* PLAYER FUNCTIONS */

    function updateTeams() {
        playersAll = room.getPlayerList();
        players = playersAll.filter((p) => !AFKSet.has(p.id));
        teamRed = players.filter((p) => p.team == Team.RED);
        teamBlue = players.filter((p) => p.team == Team.BLUE);
        teamSpec = players.filter((p) => p.team == Team.SPECTATORS);
    }

    function updateAdmins(excludedPlayerID = 0) {
        if (players.length != 0 && players.filter((p) => p.admin).length < maxAdmins) {
            let playerArray = players.filter((p) => p.id != excludedPlayerID && !p.admin);
            let arrayID = playerArray.map((player) => player.id);
            room.setPlayerAdmin(Math.min(...arrayID), true);
        }
    }

    function getRole(player) {
        return (
            !!masterList.find((a) => a == authArray[player.id][0]) * 2 +
            !!adminList.find((a) => a[0] == authArray[player.id][0]) * 1 +
            player.admin * 1
        );
    }

    function ghostKickHandle(oldP, newP) {
        var teamArrayId = getTeamArray(oldP.team).map((p) => p.id);
        teamArrayId.splice(teamArrayId.findIndex((id) => id == oldP.id), 1, newP.id);

        room.kickPlayer(oldP.id, 'Ghost kick', false);
        room.setPlayerTeam(newP.id, oldP.team);
        room.setPlayerAdmin(newP.id, oldP.admin);
        room.reorderPlayers(teamArrayId, true);

        if (oldP.team != Team.SPECTATORS && playSituation != Situation.STOP) {
            var discProp = room.getPlayerDiscProperties(oldP.id);
            room.setPlayerDiscProperties(newP.id, discProp);
        }
    }

    /* ACTIVITY FUNCTIONS */

    function handleActivityPlayer(player) {
        let pComp = getPlayerComp(player);
        if (pComp != null) {
            pComp.inactivityTicks++;
            if (pComp.inactivityTicks == 60 * ((2 / 3) * afkLimit)) {
                room.sendAnnouncement(
                    `⛔ ${player.name}, eğer hareket etmezsen ${Math.floor(afkLimit / 3)} saniye sonra atılacaksın !`,
                    player.id,
                    warningColor,
                    'bold',
                    HaxNotification.MENTION
                );
                return;
            }
            if (pComp.inactivityTicks >= 60 * afkLimit) {
                pComp.inactivityTicks = 0;
                if (game.scores.time <= afkLimit - 0.5) {
                    setTimeout(() => {
                        !chooseMode ? instantRestart() : room.stopGame();
                    }, 10);
                }
                room.kickPlayer(player.id, 'AFK', false);
            }
        }
    }

    function handleActivityPlayerTeamChange(changedPlayer) {
        if (changedPlayer.team == Team.SPECTATORS) {
            let pComp = getPlayerComp(changedPlayer);
            if (pComp != null) pComp.inactivityTicks = 0;
        }
    }

    function handleActivityStop() {
        for (let player of players) {
            let pComp = getPlayerComp(player);
            if (pComp != null) pComp.inactivityTicks = 0;
        }
    }

    function handleActivity() {
        if (gameState === State.PLAY && players.length > 1) {
            for (let player of teamRed) {
                handleActivityPlayer(player);
            }
            for (let player of teamBlue) {
                handleActivityPlayer(player);
            }
        }
    }

    /* LINEUP FUNCTIONS */

    function getStartingLineups() {
        var compositions = [[], []];
        for (let player of teamRed) {
            compositions[0].push(
                new PlayerComposition(player, authArray[player.id][0], [0], [])
            );
        }
        for (let player of teamBlue) {
            compositions[1].push(
                new PlayerComposition(player, authArray[player.id][0], [0], [])
            );
        }
        return compositions;
    }

    function handleLineupChangeTeamChange(changedPlayer) {
        if (gameState != State.STOP) {
            var playerLineup;
            if (changedPlayer.team == Team.RED) {
                // player gets in red team
                var redLineupAuth = game.playerComp[0].map((p) => p.auth);
                var ind = redLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
                if (ind != -1) {
                    // Player goes back in
                    playerLineup = game.playerComp[0][ind];
                    if (playerLineup.timeExit.includes(game.scores.time)) {
                        // gets subbed off then in at the exact same time -> no sub
                        playerLineup.timeExit = playerLineup.timeExit.filter((t) => t != game.scores.time);
                    } else {
                        playerLineup.timeEntry.push(game.scores.time);
                    }
                } else {
                    playerLineup = new PlayerComposition(
                        changedPlayer,
                        authArray[changedPlayer.id][0],
                        [game.scores.time],
                        []
                    );
                    game.playerComp[0].push(playerLineup);
                }
            } else if (changedPlayer.team == Team.BLUE) {
                // player gets in blue team
                var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
                var ind = blueLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
                if (ind != -1) {
                    // Player goes back in
                    playerLineup = game.playerComp[1][ind];
                    if (playerLineup.timeExit.includes(game.scores.time)) {
                        // gets subbed off then in at the exact same time -> no sub
                        playerLineup.timeExit = playerLineup.timeExit.filter((t) => t != game.scores.time);
                    } else {
                        playerLineup.timeEntry.push(game.scores.time);
                    }
                } else {
                    playerLineup = new PlayerComposition(
                        changedPlayer,
                        authArray[changedPlayer.id][0],
                        [game.scores.time],
                        []
                    );
                    game.playerComp[1].push(playerLineup);
                }
            }
            if (teamRed.some((r) => r.id == changedPlayer.id)) {
                // player leaves red team
                var redLineupAuth = game.playerComp[0].map((p) => p.auth);
                var ind = redLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
                playerLineup = game.playerComp[0][ind];
                if (playerLineup.timeEntry.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    if (game.scores.time == 0) {
                        game.playerComp[0].splice(ind, 1);
                    } else {
                        playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                    }
                } else {
                    playerLineup.timeExit.push(game.scores.time);
                }
            } else if (teamBlue.some((r) => r.id == changedPlayer.id)) {
                // player leaves blue team
                var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
                var ind = blueLineupAuth.findIndex((auth) => auth == authArray[changedPlayer.id][0]);
                playerLineup = game.playerComp[1][ind];
                if (playerLineup.timeEntry.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    if (game.scores.time == 0) {
                        game.playerComp[1].splice(ind, 1);
                    } else {
                        playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                    }
                } else {
                    playerLineup.timeExit.push(game.scores.time);
                }
            }
        }
    }

    function handleLineupChangeLeave(player) {
        if (playSituation != Situation.STOP) {
            if (player.team == Team.RED) {
                // player gets in red team
                var redLineupAuth = game.playerComp[0].map((p) => p.auth);
                var ind = redLineupAuth.findIndex((auth) => auth == authArray[player.id][0]);
                var playerLineup = game.playerComp[0][ind];
                if (playerLineup.timeEntry.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    if (game.scores.time == 0) {
                        game.playerComp[0].splice(ind, 1);
                    } else {
                        playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                    }
                } else {
                    playerLineup.timeExit.push(game.scores.time);
                }
            } else if (player.team == Team.BLUE) {
                // player gets in blue team
                var blueLineupAuth = game.playerComp[1].map((p) => p.auth);
                var ind = blueLineupAuth.findIndex((auth) => auth == authArray[player.id][0]);
                var playerLineup = game.playerComp[1][ind];
                if (playerLineup.timeEntry.includes(game.scores.time)) {
                    // gets subbed off then in at the exact same time -> no sub
                    if (game.scores.time == 0) {
                        game.playerComp[1].splice(ind, 1);
                    } else {
                        playerLineup.timeEntry = playerLineup.timeEntry.filter((t) => t != game.scores.time);
                    }
                } else {
                    playerLineup.timeExit.push(game.scores.time);
                }
            }
        }
    }

    /* TEAM BALANCE FUNCTIONS */

    function balanceTeams() {
        if (!chooseMode) {
            if (players.length == 0) {
                room.stopGame();
                room.setScoreLimit(scoreLimit);
                room.setTimeLimit(timeLimit);
            } else if (players.length == 1 && teamRed.length == 0) {
                instantRestart();
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!antrenman`);
                }, 5);
                room.setPlayerTeam(players[0].id, Team.RED);
            } else if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length && teamSpec.length > 0) {
                const n = Math.abs(teamRed.length - teamBlue.length);
                if (players.length == 2) {
                    instantRestart();
                    setTimeout(() => {
                        stadiumCommand(emptyPlayer, `!v2`);
                    }, 5);
                }
                if (teamRed.length > teamBlue.length) {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(teamSpec[i].id, Team.BLUE);
                    }
                } else {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(teamSpec[i].id, Team.RED);
                    }
                }
            } else if (Math.abs(teamRed.length - teamBlue.length) > teamSpec.length) {
                const n = Math.abs(teamRed.length - teamBlue.length);
                if (players.length == 1) {
                    instantRestart();
                    setTimeout(() => {
                        stadiumCommand(emptyPlayer, `!antrenman`);
                    }, 5);
                    room.setPlayerTeam(players[0].id, Team.RED);
                    return;
                } else if (teamSize > 2 && players.length == 5) {
                    instantRestart();
                    setTimeout(() => {
                        stadiumCommand(emptyPlayer, `!v2`);
                    }, 5);
                }
                if (players.length == teamSize * 2 - 1) {
                    teamRedStats = [];
                    teamBlueStats = [];
                }
                if (teamRed.length > teamBlue.length) {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(
                            teamRed[teamRed.length - 1 - i].id,
                            Team.SPECTATORS
                        );
                    }
                } else {
                    for (var i = 0; i < n; i++) {
                        room.setPlayerTeam(
                            teamBlue[teamBlue.length - 1 - i].id,
                            Team.SPECTATORS
                        );
                    }
                }
            } else if (Math.abs(teamRed.length - teamBlue.length) < teamSpec.length && teamRed.length != teamBlue.length) {
                room.pauseGame(true);
                activateChooseMode();
                choosePlayer();
            } else if (teamSpec.length >= 2 && teamRed.length == teamBlue.length && teamRed.length < teamSize) {
                if (teamRed.length == 2) {
                    instantRestart();
                    setTimeout(() => {
                        stadiumCommand(emptyPlayer, `!v4`);
                    }, 5);
                }
                topButton();
            }
        }
    }

    function handlePlayersJoin() {
        if (chooseMode) {
            if (teamSize > 2 && players.length == 6) {
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!v4`);
                }, 5);
            }
            getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
        }
        balanceTeams();
    }

    function handlePlayersLeave() {
        if (gameState != State.STOP) {
            var scores = room.getScores();
            if (players.length >= 2 * teamSize && scores.time >= (5 / 6) * game.scores.timeLimit && teamRed.length != teamBlue.length) {
                var rageQuitCheck = false;
                if (teamRed.length < teamBlue.length) {
                    if (scores.blue - scores.red == 2) {
                        endGame(Team.BLUE);
                        rageQuitCheck = true;
                    }
                } else {
                    if (scores.red - scores.blue == 2) {
                        endGame(Team.RED);
                        rageQuitCheck = true;
                    }
                }
                if (rageQuitCheck) {
                    room.sendAnnouncement(
                        "Oyundan kaçma tespit edildi, oyun böyle sonuçlanacak.",
                        null,
                        infoColor,
                        'bold',
                        HaxNotification.MENTION
                    )
                    stopTimeout = setTimeout(() => {
                        room.stopGame();
                    }, 100);
                    return;
                }
            }
        }
        if (chooseMode) {
            if (teamSize > 2 && players.length == 5) {
                setTimeout(() => {
                    stadiumCommand(emptyPlayer, `!v2`);
                }, 5);
            }
            if (teamRed.length == 0 || teamBlue.length == 0) {
                room.setPlayerTeam(teamSpec[0].id, teamRed.length == 0 ? Team.RED : Team.BLUE);
                return;
            }
            if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
                deactivateChooseMode();
                resumeGame();
                var b = teamSpec.length;
                if (teamRed.length > teamBlue.length) {
                    for (var i = 0; i < b; i++) {
                        clearTimeout(insertingTimeout);
                        insertingPlayers = true;
                        setTimeout(() => {
                            room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                        }, 5 * i);
                    }
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 5 * b);
                } else {
                    for (var i = 0; i < b; i++) {
                        clearTimeout(insertingTimeout);
                        insertingPlayers = true;
                        setTimeout(() => {
                            room.setPlayerTeam(teamSpec[0].id, Team.RED);
                        }, 5 * i);
                    }
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 5 * b);
                }
                return;
            }
            if (streak == 0 && gameState == State.STOP) {
                if (Math.abs(teamRed.length - teamBlue.length) == 2) {
                    var teamIn = teamRed.length > teamBlue.length ? teamRed : teamBlue;
                    room.setPlayerTeam(teamIn[teamIn.length - 1].id, Team.SPECTATORS)
                }
            }
            if (teamRed.length == teamBlue.length && teamSpec.length < 2) {
                deactivateChooseMode();
                resumeGame();
                return;
            }

            if (capLeft) {
                choosePlayer();
            } else {
                getSpecList(teamRed.length <= teamBlue.length ? teamRed[0] : teamBlue[0]);
            }
        }
        balanceTeams();
    }

    function handlePlayersTeamChange(byPlayer) {
        if (chooseMode && !removingPlayers && byPlayer == null) {
            if (Math.abs(teamRed.length - teamBlue.length) == teamSpec.length) {
                deactivateChooseMode();
                resumeGame();
                var b = teamSpec.length;
                if (teamRed.length > teamBlue.length) {
                    for (var i = 0; i < b; i++) {
                        clearTimeout(insertingTimeout);
                        insertingPlayers = true;
                        setTimeout(() => {
                            room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                        }, 5 * i);
                    }
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 5 * b);
                } else {
                    for (var i = 0; i < b; i++) {
                        clearTimeout(insertingTimeout);
                        insertingPlayers = true;
                        setTimeout(() => {
                            room.setPlayerTeam(teamSpec[0].id, Team.RED);
                        }, 5 * i);
                    }
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 5 * b);
                }
                return;
            } else if (
                (teamRed.length == teamSize && teamBlue.length == teamSize) ||
                (teamRed.length == teamBlue.length && teamSpec.length < 2)
            ) {
                deactivateChooseMode();
                resumeGame();
            } else if (teamRed.length <= teamBlue.length && redCaptainChoice != '') {
                if (redCaptainChoice == 'top') {
                    room.setPlayerTeam(teamSpec[0].id, Team.RED);
                } else if (redCaptainChoice == 'random') {
                    var r = getRandomInt(teamSpec.length);
                    room.setPlayerTeam(teamSpec[r].id, Team.RED);
                } else {
                    room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.RED);
                }
                return;
            } else if (teamBlue.length < teamRed.length && blueCaptainChoice != '') {
                if (blueCaptainChoice == 'top') {
                    room.setPlayerTeam(teamSpec[0].id, Team.BLUE);
                } else if (blueCaptainChoice == 'random') {
                    var r = getRandomInt(teamSpec.length);
                    room.setPlayerTeam(teamSpec[r].id, Team.BLUE);
                } else {
                    room.setPlayerTeam(teamSpec[teamSpec.length - 1].id, Team.BLUE);
                }
                return;
            } else {
                choosePlayer();
            }
        }
    }

    function handlePlayersStop(byPlayer) {
        if (byPlayer == null && endGameVariable) {
            if (chooseMode) {
                if (players.length == 2 * teamSize) {
                    chooseMode = false;
                    resetButton();
                    for (var i = 0; i < teamSize; i++) {
                        clearTimeout(insertingTimeout);
                        insertingPlayers = true;
                        setTimeout(() => {
                            randomButton();
                        }, 200 * i);
                    }
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 200 * teamSize);
                    startTimeout = setTimeout(() => {
                        room.startGame();
                    }, 2000);
                } else {
                    if (lastWinner == Team.RED) {
                        blueToSpecButton();
                    } else if (lastWinner == Team.BLUE) {
                        redToSpecButton();
                        setTimeout(() => {
                            swapButton();
                        }, 10);
                    } else {
                        resetButton();
                    }
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        topButton();
                    }, 300);
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 300);
                }
            } else {
                if (players.length == 2) {
                    if (lastWinner == Team.BLUE) {
                        swapButton();
                    }
                    startTimeout = setTimeout(() => {
                        room.startGame();
                    }, 2000);
                } else if (players.length == 3 || players.length >= 2 * teamSize + 1) {
                    if (lastWinner == Team.RED) {
                        blueToSpecButton();
                    } else {
                        redToSpecButton();
                        setTimeout(() => {
                            swapButton();
                        }, 5);
                    }
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        topButton();
                    }, 200);
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 300);
                    startTimeout = setTimeout(() => {
                        room.startGame();
                    }, 2000);
                } else if (players.length == 4) {
                    resetButton();
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    setTimeout(() => {
                        randomButton();
                        setTimeout(() => {
                            randomButton();
                        }, 500);
                    }, 500);
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 2000);
                    startTimeout = setTimeout(() => {
                        room.startGame();
                    }, 2000);
                } else if (players.length == 5 || players.length >= 2 * teamSize + 1) {
                    if (lastWinner == Team.RED) {
                        blueToSpecButton();
                    } else {
                        redToSpecButton();
                        setTimeout(() => {
                            swapButton();
                        }, 5);
                    }
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 200);
                    setTimeout(() => {
                        topButton();
                    }, 200);
                    activateChooseMode();
                } else if (players.length == 6) {
                    resetButton();
                    clearTimeout(insertingTimeout);
                    insertingPlayers = true;
                    insertingTimeout = setTimeout(() => {
                        insertingPlayers = false;
                    }, 1500);
                    setTimeout(() => {
                        randomButton();
                        setTimeout(() => {
                            randomButton();
                            setTimeout(() => {
                                randomButton();
                            }, 500);
                        }, 500);
                    }, 500);
                    startTimeout = setTimeout(() => {
                        room.startGame();
                    }, 2000);
                }
            }
        }
    }

    /* STATS FUNCTIONS */

    /* GLOBAL STATS FUNCTIONS */

    function getLastTouchOfTheBall() {
        const ballPosition = room.getBallPosition();
        updateTeams();
        let playerArray = [];
        for (let player of players) {
            if (player.position != null) {
                var distanceToBall = pointDistance(player.position, ballPosition);
                if (distanceToBall < triggerDistance) {
                    if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
                    playerArray.push([player, distanceToBall]);
                }
            }
        }
        if (playerArray.length != 0) {
            let playerTouch = playerArray.sort((a, b) => a[1] - b[1])[0][0];
            if (lastTeamTouched == playerTouch.team || lastTeamTouched == Team.SPECTATORS) {
                if (lastTouches[0] == null || (lastTouches[0] != null && lastTouches[0].player.id != playerTouch.id)) {
                    game.touchArray.push(
                        new BallTouch(
                            playerTouch,
                            game.scores.time,
                            getGoalGame(),
                            ballPosition
                        )
                    );
                    lastTouches[0] = checkGoalKickTouch(
                        game.touchArray,
                        game.touchArray.length - 1,
                        getGoalGame()
                    );
                    lastTouches[1] = checkGoalKickTouch(
                        game.touchArray,
                        game.touchArray.length - 2,
                        getGoalGame()
                    );
                }
            }
            lastTeamTouched = playerTouch.team;
        }
    }

    function getBallSpeed() {
        var ballProp = room.getDiscProperties(0);
        return Math.sqrt(ballProp.xspeed ** 2 + ballProp.yspeed ** 2) * speedCoefficient;
    }

    function getGameStats() {
        if (playSituation == Situation.PLAY && gameState == State.PLAY) {
            lastTeamTouched == Team.RED ? possession[0]++ : possession[1]++;
            var ballPosition = room.getBallPosition();
            ballPosition.x < 0 ? actionZoneHalf[0]++ : actionZoneHalf[1]++;
        }
    }

    /* GOAL ATTRIBUTION FUNCTIONS */

    function getGoalAttribution(team) {
        var goalAttribution = Array(2).fill(null);
        if (lastTouches[0] != null) {
            if (lastTouches[0].player.team == team) {
                // Direct goal scored by player
                if (lastTouches[1] != null && lastTouches[1].player.team == team) {
                    goalAttribution = [lastTouches[0].player, lastTouches[1].player];
                } else {
                    goalAttribution = [lastTouches[0].player, null];
                }
            } else {
                // Own goal
                goalAttribution = [lastTouches[0].player, null];
            }
        }
        return goalAttribution;
    }

    function getGoalString(team) {
        var goalString;
        var scores = game.scores;
        var goalAttribution = getGoalAttribution(team);
        if (goalAttribution[0] != null) {
            if (goalAttribution[0].team == team) {
                if (goalAttribution[1] != null && goalAttribution[1].team == team) {
                    goalString = `⚽ ${getTimeGame(scores.time)} ${goalAttribution[0].name} ${ballSpeed.toFixed(2)}km hızla mükemmel bir gol atıyor ! Bu güzel asistin sahibi ise ${goalAttribution[1].name}.`;
                    game.goals.push(
                        new Goal(
                            scores.time,
                            team,
                            goalAttribution[0],
                            goalAttribution[1]
                        )
                    );
                } else {
                    goalString = `⚽ ${getTimeGame(scores.time)} ${goalAttribution[0].name} ${ballSpeed.toFixed(2)}km hızla mükemmel bir gol atıyor !`;
                    game.goals.push(
                        new Goal(scores.time, team, goalAttribution[0], null)
                    );
                }
            } else {
                goalString = `😂 ${getTimeGame(scores.time)} Olamaz! ${goalAttribution[0].name} ${ballSpeed.toFixed(2)}km hızla kendi kalesine attı!`;
                game.goals.push(
                    new Goal(scores.time, team, goalAttribution[0], null)
                );
            }
        } else {
            goalString = `⚽ ${getTimeGame(scores.time)} ${team == Team.RED ? 'kırmızı' : 'mavi'} takımı gol atıyor ! Golün hızı : ${ballSpeed.toFixed(2)}km.`;
            game.goals.push(
                new Goal(scores.time, team, null, null)
            );
        }

        return goalString;
    }

    /* ROOM STATS FUNCTIONS */

    async function updatePlayerStats(player, teamStats) {
        var data = await checkStats(authArray[player.id][0]);
        const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
        var pComp = getPlayerComp(player);
        stats.oyunlar++;
        hasWon = false
        cs = false
        if (lastWinner == teamStats) stats.galibiyet++, hasWon = true;
        if ((lastWinner == teamStats) && (game.scores.red == 0 || game.scores.blue == 0) && (player.id == teamRed[3].id || player.id == teamBlue[3].id) && (player.id == teamRed[2].id || player.id == teamBlue[2].id)) cs = true, stats.cs++;
        const csbonus = (cs ? 3 : 0);
        const bonus = (hasWon ? 2 : -3);
        stats.gol += getGoalsPlayer(pComp);
        stats.asist += getAssistsPlayer(pComp);
        stats.kk += getOwnGoalsPlayer(pComp);
        stats.aktiflik += getGametimePlayer(pComp);
        const yeniPuan = getGoalsPlayer(pComp) * 5 + getAssistsPlayer(pComp) * 3 - getOwnGoalsPlayer(pComp) * 5 + bonus * 5 + csbonus * 4
        stats.puan += yeniPuan
        console.log(player.name, yeniPuan)
        room.sendAnnouncement(`${player.name}, bu maçın sonucunda aldığın puan: ` + yeniPuan, player.id, announcementColor, 'bold');
        await updatePlayer(authArray[player.id][0], stats)
        await setAvatar(stats.puan, player);

    }

    async function updateStats() {
        if (
            players.length >= 2 * teamSize &&
            (
                game.scores.time >= (5 / 6) * game.scores.timeLimit ||
                game.scores.red == game.scores.scoreLimit ||
                game.scores.blue == game.scores.scoreLimit
            ) &&
            teamRedStats.length >= teamSize && teamBlueStats.length >= teamSize
        ) {
            for (let player of teamRedStats) {
                await updatePlayerStats(player, Team.RED);
            }
            for (let player of teamBlueStats) {
                await updatePlayerStats(player, Team.BLUE);
            }
        }
    }

    async function printRankings(statKey, id = 0) {
        const data = await getAll()
        var leaderboard = [];
        data.forEach(function (element) {
            leaderboard.push(Object.fromEntries(Object.entries(element).filter(([key, value]) => ['isim', `${statKey}`].includes(key))))
        });
        if (leaderboard.length < 5) {
            if (id != 0) {
                room.sendAnnouncement(
                    'Sıralama yapabilmek için yeterince oyun oynanılmamış !',
                    id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            }
            return;
        }
        leaderboard.sort(function (a, b) { return b[statKey] - a[statKey]; });
        var rankingString = `${statKey.charAt(0).toUpperCase() + statKey.slice(1)}| `;
        for (let i = 0; i < 5; i++) {
            let playerName = leaderboard[i]["isim"];
            let playerStat = leaderboard[i][statKey];
            if (statKey == 'aktiflik') playerStat = getTimeStats(playerStat);
            rankingString += `${i + 1} - ${playerName} : ${playerStat}, `;
        }
        rankingString = rankingString.substring(0, rankingString.length - 2);
        room.sendAnnouncement(
            rankingString,
            id,
            infoColor,
            'bold',
            HaxNotification.CHAT
        );
    }

    /* GET STATS FUNCTIONS */

    async function getGamePlayerStats(player) {
        var data = await checkStats(authArray[player.id][0]);
        const stats = Object.fromEntries(Object.entries(data).filter(([key, value]) => key !== '_id'))
        var pComp = getPlayerComp(player);
        stats.gol += getGoalsPlayer(pComp);
        stats.assist += getAssistsPlayer(pComp);
        stats.kk += getOwnGoalsPlayer(pComp);
        stats.aktiflik += getGametimePlayer(pComp);
        return stats;
    }

    function getGametimePlayer(pComp) {
        var timePlayer = 0;
        for (let j = 0; j < pComp.timeEntry.length; j++) {
            if (pComp.timeExit.length < j + 1) {
                timePlayer += game.scores.time - pComp.timeEntry[j];
            } else {
                timePlayer += pComp.timeExit[j] - pComp.timeEntry[j];
            }
        }
        return timePlayer;
    }

    function getGoalsPlayer(pComp) {
        var goalPlayer = 0;
        for (let goal of game.goals) {
            if (goal.striker != null && goal.team === pComp.player.team) {
                if (authArray[goal.striker.id][0] == pComp.auth) {
                    goalPlayer++;
                }
            }
        }
        return goalPlayer;
    }

    function getOwnGoalsPlayer(pComp) {
        var goalPlayer = 0;
        for (let goal of game.goals) {
            if (goal.striker != null && goal.team !== pComp.player.team) {
                if (authArray[goal.striker.id][0] == pComp.auth) {
                    goalPlayer++;
                }
            }
        }
        return goalPlayer;
    }

    function getAssistsPlayer(pComp) {
        var assistPlayer = 0;
        for (let goal of game.goals) {
            if (goal.assist != null) {
                if (authArray[goal.assist.id][0] == pComp.auth) {
                    assistPlayer++;
                }
            }
        }
        return assistPlayer;
    }

    function actionReportCount(goals) {
        var playerActionSummary = [];
        for (let goal of goals) {
            if (goal[0] != null) {
                if (playerActionSummary.find((a) => a[0].id == goal[0].id)) {
                    var index = playerActionSummary.findIndex((a) => a[0].id == goal[0].id);
                    playerActionSummary[index][1]++;
                } else {
                    playerActionSummary.push([goal[0], 1, 0, 0]);
                }
                if (goal[1] != null) {
                    if (playerActionSummary.find((a) => a[0].id == goal[1].id)) {
                        var index = playerActionSummary.findIndex((a) => a[0].id == goal[1].id);
                        playerActionSummary[index][2]++;
                    } else {
                        playerActionSummary.push([goal[1], 0, 1, 0]);
                    }
                }
            }
        }
        playerActionSummary.sort((a, b) => a[1] + a[2] - (b[1] + b[2]));
        return playerActionSummary;
    }

    /* PRINT FUNCTIONS */

    function printPlayerStats(stats) {
        let statsString = '';
        for (let [key, value] of Object.entries(stats)) {
            if (key == 'isim') statsString += `${value}: `;
            else {
                if (key == 'aktiflik') value = getTimeStats(value);
                let reCamelCase = /([A-Z](?=[a-z]+)|[A-Z]+(?![a-z]))/g;
                let statName = key.replaceAll(reCamelCase, ' $1').trim();
                statsString += `${statName.charAt(0).toUpperCase() + statName.slice(1)}: ${value}, `;
            }
        }
        statsString = statsString.substring(0, statsString.length - 2);
        return statsString;
    }

    /* FETCH FUNCTIONS */

    function fetchGametimeReport(game) {
        var fieldGametimeRed = {
            name: '🔴        **KIRMIZI TAKIM:**',
            value: '⌛ __**Oyun Süresi:**__\n\n',
            inline: true,
        };
        var fieldGametimeBlue = {
            name: '🔵       **MAVİ TAKIM**',
            value: '⌛ __**Oyun Süresi:**__\n\n',
            inline: true,
        };
        var redTeamTimes = game.playerComp[0].map((p) => [p.player, getGametimePlayer(p)]);
        var blueTeamTimes = game.playerComp[1].map((p) => [p.player, getGametimePlayer(p)]);

        for (let time of redTeamTimes) {
            var minutes = getMinutesReport(time[1]);
            var seconds = getSecondsReport(time[1]);
            fieldGametimeRed.value += `> **${time[0].name}:** ${minutes > 0 ? `${minutes} dk` : ''}` +
                `${seconds > 0 || minutes == 0 ? `${seconds} sn` : ''}\n`;
        }
        fieldGametimeRed.value += `\n${blueTeamTimes.length - redTeamTimes.length > 0 ? '\n'.repeat(blueTeamTimes.length - redTeamTimes.length) : ''
            }`;
        fieldGametimeRed.value += '=====================';

        for (let time of blueTeamTimes) {
            var minutes = getMinutesReport(time[1]);
            var seconds = getSecondsReport(time[1]);
            fieldGametimeBlue.value += `> **${time[0].name}:** ${minutes > 0 ? `${minutes} dk` : ''}` +
                `${seconds > 0 || minutes == 0 ? `${seconds} sn` : ''}\n`;
        }
        fieldGametimeBlue.value += `\n${redTeamTimes.length - blueTeamTimes.length > 0 ? '\n'.repeat(redTeamTimes.length - blueTeamTimes.length) : ''
            }`;
        fieldGametimeBlue.value += '=====================';

        return [fieldGametimeRed, fieldGametimeBlue];
    }

    function fetchActionsSummaryReport(game) {
        var fieldReportRed = {
            name: '🔴        **KIRMIZI TAKIM**',
            value: '📊 __**Oyuncu İstatistikleri:**__\n\n',
            inline: true,
        };
        var fieldReportBlue = {
            name: '🔵       **MAVİ TAKIM**',
            value: '📊 __**Oyuncu İstatistikleri:**__\n\n',
            inline: true,
        };
        var goals = [[], []];
        for (let i = 0; i < game.goals.length; i++) {
            goals[game.goals[i].team - 1].push([game.goals[i].striker, game.goals[i].assist]);
        }
        var redActions = actionReportCount(goals[0]);
        if (redActions.length > 0) {
            for (let act of redActions) {
                fieldReportRed.value += `> **${act[0].team != Team.RED ? '[KK] ' : ''}${act[0].name}:` +
                    `**${act[1] > 0 ? ` ${act[1]}G` : ''}${act[2] > 0 ? ` ${act[2]}A` : ''}\n`;
            }
        }
        var blueActions = actionReportCount(goals[1]);
        if (blueActions.length > 0) {
            for (let act of blueActions) {
                fieldReportBlue.value += `> **${act[0].team != Team.BLUE ? '[KK] ' : ''}${act[0].name}:` +
                    `**${act[1] > 0 ? ` ${act[1]}G` : ''}${act[2] > 0 ? ` ${act[2]}A` : ''}\n`;
            }
        }

        fieldReportRed.value += `\n${blueActions.length - redActions.length > 0 ? '\n'.repeat(blueActions.length - redActions.length) : ''
            }`;
        fieldReportRed.value += '=====================';

        fieldReportBlue.value += `\n${redActions.length - blueActions.length > 0 ? '\n'.repeat(redActions.length - blueActions.length) : ''
            }`;
        fieldReportBlue.value += '=====================';

        return [fieldReportRed, fieldReportBlue];
    }

    function fetchSummaryEmbed(game) {
        var fetchEndgame = [fetchGametimeReport, fetchActionsSummaryReport];
        var logChannel = gameWebhook;
        var fields = [
            {
                name: '🔴        **KIRMIZI TAKIM**',
                value: '=====================\n\n',
                inline: true,
            },
            {
                name: '🔵       **MAVİ TAKIM**',
                value: '=====================\n\n',
                inline: true,
            },
        ];
        for (let i = 0; i < fetchEndgame.length; i++) {
            var fieldsReport = fetchEndgame[i](game);
            fields[0].value += fieldsReport[0].value + '\n\n';
            fields[1].value += fieldsReport[1].value + '\n\n';
        }
        fields[0].value = fields[0].value.substring(0, fields[0].value.length - 2);
        fields[1].value = fields[1].value.substring(0, fields[1].value.length - 2);

        var possR = possession[0] / (possession[0] + possession[1]);
        var possB = 1 - possR;
        var possRString = (possR * 100).toPrecision(3).toString();
        var possBString = (possB * 100).toPrecision(3).toString();
        var zoneR = actionZoneHalf[0] / (actionZoneHalf[0] + actionZoneHalf[1]);
        var zoneB = 1 - zoneR;
        var zoneRString = (zoneR * 100).toPrecision(3).toString();
        var zoneBString = (zoneB * 100).toPrecision(3).toString();
        var win = (game.scores.red > game.scores.blue) * 1 + (game.scores.blue > game.scores.red) * 2;
        var objectBodyWebhook = {
            embeds: [
                {
                    title: `📝 MAÇ RAPORU #${getIdReport()}`,
                    description:
                        `**${getTimeEmbed(game.scores.time)}** ` +
                        (win == 1 ? '**Kırmızı Takım** ' : 'Kırmızı Takım ') + game.scores.red +
                        ' - ' +
                        game.scores.blue + (win == 2 ? ' **Mavi Takım**' : ' Mavi Takım') +
                        '\n```c\nTopla oynama: ' + possRString + '% - ' + possBString + '%' +
                        '\nTopun oynandığı bölgeler: ' + zoneRString + '% - ' + zoneBString + '%\n```\n\n',
                    color: 9567999,
                    fields: fields,
                    footer: {
                        text: `Kayıt: ${getRecordingName(game)}`,
                    },
                    timestamp: new Date().toISOString(),
                },
            ],
            username: roomName
        };
        if (logChannel != '') {
            fetch(logChannel, {
                method: 'POST',
                body: JSON.stringify(objectBodyWebhook),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
        }
    }

    /* EVENTS */

    /* PLAYER MOVEMENT */

    room.onPlayerJoin = async function (player) {
        authArray[player.id] = [player.auth, player.conn];
        if (player.auth == null)
            room.kickPlayer(player.id, "Anonim hesaplar sunucumuza alınmıyor!", true);
        if (await checkPlayer(authArray[player.id][0]) == null) await newPlayer(player.name, authArray[player.id][0], authArray[player.id][1]);
        const stats = Object.fromEntries(Object.entries(await checkPlayer(authArray[player.id][0])).filter(([key, value]) => key !== '_id'))
        if (room.getPlayerList().length >= 13) {
            if (stats.isAdmin == false && stats.isMaster == false && stats.isVIP == false) {
                room.kickPlayer(player.id, `Son 4 kişilik yer adminlere ayırılmıştır.`, false);
            }
        }
        await setAvatar(stats.puan, player);
        if (player.name != stats.isim) await updateName(authArray[player.id][0], player.name), room.sendAnnouncement(stats.isim + " ismini " + player.name + " olarak değiştirmiş!", null, 0xFFFFFF)
        if (player.conn != stats.conn) await updateConn(authArray[player.id][0], player.conn)
        if (roomWebhook != '') {
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: `[${getDate()}] ➡️ GİRİŞ (${playersAll.length + 1}/${maxPlayers})\n**` +
                        `${player.name}** [${authArray[player.id][0]}] {${authArray[player.id][1]}}`,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
        }
        room.sendAnnouncement(
            `👋 ${player.name}, hoşgeldin !\nTakımına mesaj göndermek için başına t, bir oyuncuya özel mesaj göndermek için @@ koyabilirsin !`,
            player.id,
            welcomeColor,
            'bold',
            HaxNotification.CHAT
        );
        updateTeams();
        updateAdmins();
        if (masterList.map((a) => a[0]).findIndex((auth) => auth == player.auth) != -1) {
            room.sendAnnouncement(
                `Yetkili ${player.name} odaya giriş yaptı !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
            room.setPlayerAdmin(player.id, true);
        } else if (adminList.map((a) => a[0]).findIndex((auth) => auth == player.auth) != -1) {
            room.sendAnnouncement(
                `Admin ${player.name} odaya giriş yaptı !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
            room.setPlayerAdmin(player.id, true);
        } else if (vipList.map((a) => a[0]).findIndex((auth) => auth == player.auth)) {
            room.sendAnnouncement(
                `VIP ${player.name} odaya giriş yaptı !`,
                null,
                announcementColor,
                'bold',
                HaxNotification.CHAT
            );
        }
        var sameAuthCheck = playersAll.filter((p) => p.id != player.id && authArray[p.id][0] == player.auth);
        if (sameAuthCheck.length > 0 && !debugMode) {
            var oldPlayerArray = playersAll.filter((p) => p.id != player.id && authArray[p.id][0] == player.auth);
            for (let oldPlayer of oldPlayerArray) {
                ghostKickHandle(oldPlayer, player);
            }
        }
        handlePlayersJoin();
    };

    room.onPlayerTeamChange = function (changedPlayer, byPlayer) {
        handleLineupChangeTeamChange(changedPlayer);
        if (AFKSet.has(changedPlayer.id) && changedPlayer.team != Team.SPECTATORS) {
            room.setPlayerTeam(changedPlayer.id, Team.SPECTATORS);
            room.sendAnnouncement(
                `${changedPlayer.name} AFK olduğu için onu kullanamazsın !`,
                null,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            return;
        }
        updateTeams();
        if (gameState != State.STOP) {
            if (changedPlayer.team != Team.SPECTATORS && game.scores.time <= (3 / 4) * game.scores.timeLimit && Math.abs(game.scores.blue - game.scores.red) < 2) {
                changedPlayer.team == Team.RED ? teamRedStats.push(changedPlayer) : teamBlueStats.push(changedPlayer);
            }
        }
        handleActivityPlayerTeamChange(changedPlayer);
        handlePlayersTeamChange(byPlayer);
    };

    room.onPlayerLeave = function (player) {
        setTimeout(() => {
            if (!kickFetchVariable) {
                if (roomWebhook != '') {
                    var stringContent = `[${getDate()}] ⬅️ LEAVE (${playersAll.length}/${maxPlayers})\n**${player.name}**` +
                        `[${authArray[player.id][0]}] {${authArray[player.id][1]}}`;
                    fetch(roomWebhook, {
                        method: 'POST',
                        body: JSON.stringify({
                            content: stringContent,
                            username: roomName,
                        }),
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }).then((res) => res);
                }
            } else kickFetchVariable = false;
        }, 10);
        handleLineupChangeLeave(player);
        checkCaptainLeave(player);
        updateTeams();
        updateAdmins();
        handlePlayersLeave();
    };

    room.onPlayerKicked = function (kickedPlayer, reason, ban, byPlayer) {
        kickFetchVariable = true;
        if (roomWebhook != '') {
            var stringContent = `[${getDate()}] ⛔ ${ban ? 'BAN' : 'KICK'} (${playersAll.length}/${maxPlayers})\n` +
                `**${kickedPlayer.name}** [${authArray[kickedPlayer.id][0]}] {${authArray[kickedPlayer.id][1]}} was ${ban ? 'banned' : 'kicked'}` +
                `${byPlayer != null ? ' by **' + byPlayer.name + '** [' + authArray[byPlayer.id][0] + '] {' + authArray[byPlayer.id][1] + '}' : ''}`
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: `[${getDate()}] ⛔ ${ban ? 'BAN' : 'KICK'} (${players.length}/${maxPlayers})\n` +
                        `**${kickedPlayer.name}** [${authArray[kickedPlayer.id][0]}] {${authArray[kickedPlayer.id][1]}} was ${ban ? 'banned' : 'kicked'}` +
                        `${byPlayer != null ? ' by **' + byPlayer.name + '** [' + authArray[byPlayer.id][0] + '] {' + authArray[byPlayer.id][1] + '}' : ''}`,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
        }
        if ((ban && ((byPlayer != null &&
            (byPlayer.id == kickedPlayer.id || getRole(byPlayer) < Role.MASTER)) || getRole(kickedPlayer) == Role.MASTER)) || disableBans
        ) {
            room.clearBan(kickedPlayer.id);
            return;
        }
        if (byPlayer != null && getRole(byPlayer) < Role.ADMIN_PERM) {
            room.sendAnnouncement(
                'Oyuncuları atmak için yetkin yok !',
                byPlayer.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            room.setPlayerAdmin(byPlayer.id, false);
            return;
        }
        if (ban) banList.push([kickedPlayer.name, kickedPlayer.id]);
    };

    /* PLAYER ACTIVITY */

    room.onPlayerChat = function (player, message) {
        if (gameState !== State.STOP && player.team != Team.SPECTATORS) {
            let pComp = getPlayerComp(player);
            if (pComp != null) pComp.inactivityTicks = 0;
        }
        let msgArray = message.split(/ +/);
        if (roomWebhook != '')
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: `[${getDate()}] 💬 **${player.name}** : ${message.replace('@', '@ ')}`,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
        if (msgArray[0][0] == '!') {
            let command = getCommand(msgArray[0].slice(1).toLowerCase());
            if (command != false && commands[command].roles <= getRole(player)) commands[command].function(player, message);
            else
                room.sendAnnouncement(
                    `Böyle bir komut yok, komutlar için !yardım yazabilirsin.`,
                    player.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
            return false;
        }
        if (msgArray[0].toLowerCase() == 't') {
            teamChat(player, message);
            return false;
        }
        if (msgArray[0].substring(0, 2) === '@@') {
            playerChat(player, message);
            return false;
        }
        if (chooseMode && teamRed.length * teamBlue.length != 0) {
            var choosingMessageCheck = chooseModeFunction(player, message);
            if (choosingMessageCheck) return false;
        }
        if (slowMode > 0) {
            var filter = slowModeFunction(player, message);
            if (filter) return false;
        }
        if (!player.admin && muteArray.getByAuth(authArray[player.id][0]) != null) {
            room.sendAnnouncement(
                `Ceza yediğin için mesaj yazamazsın !`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            return false;
        }
    };

    room.onPlayerActivity = function (player) {
        if (gameState !== State.STOP) {
            let pComp = getPlayerComp(player);
            if (pComp != null) pComp.inactivityTicks = 0;
        }
    };

    room.onPlayerBallKick = function (player) {
        if (playSituation != Situation.GOAL) {
            var ballPosition = room.getBallPosition();
            if (game.touchArray.length == 0 || player.id != game.touchArray[game.touchArray.length - 1].player.id) {
                if (playSituation == Situation.KICKOFF) playSituation = Situation.PLAY;
                lastTeamTouched = player.team;
                game.touchArray.push(
                    new BallTouch(
                        player,
                        game.scores.time,
                        getGoalGame(),
                        ballPosition
                    )
                );
                lastTouches[0] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 1,
                    getGoalGame()
                );
                lastTouches[1] = checkGoalKickTouch(
                    game.touchArray,
                    game.touchArray.length - 2,
                    getGoalGame()
                );
            }
        }
    };

    /* GAME MANAGEMENT */

    room.onGameStart = async function (byPlayer) {
        clearTimeout(startTimeout);
        if (byPlayer != null) clearTimeout(stopTimeout);
        game = new Game();
        possession = [0, 0];
        actionZoneHalf = [0, 0];
        gameState = State.PLAY;
        endGameVariable = false;
        goldenGoal = false;
        playSituation = Situation.KICKOFF;
        lastTouches = Array(2).fill(null);
        lastTeamTouched = Team.SPECTATORS;
        teamRedStats = [];
        teamBlueStats = [];
        if (teamRed.length == teamSize && teamBlue.length == teamSize) {
            for (var i = 0; i < teamSize; i++) {
                teamRedStats.push(teamRed[i]);
                teamBlueStats.push(teamBlue[i]);
            }
        }
        calculateStadiumVariables();
    };

    room.onGameStop = function (byPlayer) {
        clearTimeout(stopTimeout);
        clearTimeout(unpauseTimeout);
        if (byPlayer != null) clearTimeout(startTimeout);
        game.rec = room.stopRecording();
        if (
            !cancelGameVariable && game.playerComp[0].length + game.playerComp[1].length > 0 &&
            (
                (game.scores.timeLimit != 0 &&
                    ((game.scores.time >= 0.5 * game.scores.timeLimit &&
                        game.scores.time < 0.75 * game.scores.timeLimit &&
                        game.scores.red != game.scores.blue) ||
                        game.scores.time >= 0.75 * game.scores.timeLimit)
                ) ||
                endGameVariable
            )
        ) {
            if (saveRecordingVariable);
            fetchSummaryEmbed(game);
        }
        cancelGameVariable = false;
        gameState = State.STOP;
        playSituation = Situation.STOP;
        updateTeams();
        handlePlayersStop(byPlayer);
        handleActivityStop();
    };

    room.onGamePause = function (byPlayer) {
        if (mentionPlayersUnpause && gameState == State.PAUSE) {
            if (byPlayer != null) {
                room.sendAnnouncement(
                    `Oyun ${byPlayer.name} tarafından durduruldu!`,
                    null,
                    defaultColor,
                    'bold',
                    HaxNotification.NONE
                );
            } else {
                room.sendAnnouncement(
                    `Oyun durduruldu !`,
                    null,
                    defaultColor,
                    'bold',
                    HaxNotification.NONE
                );
            }
        }
        clearTimeout(unpauseTimeout);
        gameState = State.PAUSE;
    };

    room.onGameUnpause = function (byPlayer) {
        unpauseTimeout = setTimeout(() => {
            gameState = State.PLAY;
        }, 2000);
        if (mentionPlayersUnpause) {
            if (byPlayer != null) {
                room.sendAnnouncement(
                    `Oyun ${byPlayer.name} tarafından devam ettiriliyor !`,
                    null,
                    defaultColor,
                    'bold',
                    HaxNotification.NONE
                );
            } else {
                room.sendAnnouncement(
                    `Oyun devam ediyor !`,
                    null,
                    defaultColor,
                    'bold',
                    HaxNotification.NONE
                );
            }
        }
        if (
            (teamRed.length == teamSize && teamBlue.length == teamSize && chooseMode) ||
            (teamRed.length == teamBlue.length && teamSpec.length < 2 && chooseMode)
        ) {
            deactivateChooseMode();
        }
    };

    room.onTeamGoal = async function (team) {
        const scores = room.getScores();
        game.scores = scores;
        playSituation = Situation.GOAL;
        ballSpeed = getBallSpeed();
        var goalString = getGoalString(team);
        for (let player of teamRed) {
            var playerComp = getPlayerComp(player);
            team == Team.RED ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
        }
        for (let player of teamBlue) {
            var playerComp = getPlayerComp(player);
            team == Team.BLUE ? playerComp.goalsScoredTeam++ : playerComp.goalsConcededTeam++;
        }
        room.sendAnnouncement(
            goalString,
            null,
            team == Team.RED ? redColor : blueColor,
            null,
            HaxNotification.CHAT
        );
        if (roomWebhook != '') {
            fetch(roomWebhook, {
                method: 'POST',
                body: JSON.stringify({
                    content: `[${getDate()}] ${goalString}`,
                    username: roomName,
                }),
                headers: {
                    'Content-Type': 'application/json',
                },
            }).then((res) => res);
        }
        if ((scores.scoreLimit != 0 && (scores.red == scores.scoreLimit || scores.blue == scores.scoreLimit)) || goldenGoal) {
            await endGame(team);
            goldenGoal = false;
            stopTimeout = setTimeout(() => {
                room.stopGame();
            }, 1000);
        }
    };

    room.onPositionsReset = function () {
        lastTouches = Array(2).fill(null);
        lastTeamTouched = Team.SPECTATORS;
        playSituation = Situation.KICKOFF;
    };

    /* MISCELLANEOUS */

    room.onRoomLink = async function () {
        room.setTeamColors(1, 60, 0xCFCFCF, [0xCF1238]);
        room.setTeamColors(2, 60, 0xCFCFCF, [0x2C89AB]);
        const data = await getAll()
        data.forEach(function (element) {
            const check = Object.fromEntries(Object.entries(element))
            if (check.isMaster == true) masterList.push(check.auth)
            if (check.isAdmin == true) adminList.push([check.auth, check.isim])
            if (check.isVIP == true) vipList.push([check.auth, check.isim])
        });
    };

    room.onPlayerAdminChange = function (changedPlayer, byPlayer) {
        updateTeams();
        if (!changedPlayer.admin && getRole(changedPlayer) >= Role.ADMIN_TEMP) {
            room.setPlayerAdmin(changedPlayer.id, true);
            return;
        }
        updateAdmins(byPlayer != null && !changedPlayer.admin && changedPlayer.id == byPlayer.id ? changedPlayer.id : 0);
    };

    room.onKickRateLimitSet = function (min, rate, burst, byPlayer) {
        if (byPlayer != null) {
            room.sendAnnouncement(
                `Kickrate değerlerini değiştiremezsin! Bu sunucuda değerler sabit.`,
                player.id,
                errorColor,
                'bold',
                HaxNotification.CHAT
            );
            room.setKickRateLimit(6, 0, 0);
        }
    };

    room.onStadiumChange = function (newStadiumName, byPlayer) {
        if (byPlayer !== null) {
            if (getRole(byPlayer) < Role.MASTER && currentStadium != 'other') {
                room.sendAnnouncement(
                    `Elle harita değiştiremezsin. Lütfen harita komutlarını kullan.`,
                    byPlayer.id,
                    errorColor,
                    'bold',
                    HaxNotification.CHAT
                );
                stadiumCommand(emptyPlayer, `!${currentStadium}`);
            } else {
                room.sendAnnouncement(
                    `Harita değişti fakat bir dahaki sefere harita komutlarını kullan. Böyle bota zarar verebilirsin.`,
                    byPlayer.id,
                    infoColor,
                    'bold',
                    HaxNotification.CHAT
                );
                currentStadium = 'other';
            }
        }
        checkStadiumVariable = true;
    };

    room.onGameTick = function () {
        checkTime();
        getLastTouchOfTheBall();
        getGameStats();
        handleActivity();
    };


    // kimmich difference
    async function newPlayer(a, b, c) {
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
        await fetch(`http://localhost:3000/api/newplayer`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    };

    async function checkPlayer(a) {
        const req = await fetch(`http://localhost:3000/api/getAuth/${a}`);
        const res = await req.json();
        return res;
    }

    async function checkStats(a) {
        const req = await fetch(`http://localhost:3000/api/playerstats/${a}`);
        const res = await req.json();
        return res;
    }

    async function updatePlayer(a, stats) {
        const data = stats
        await fetch(`http://localhost:3000/api/update/${a}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    };
    async function updateName(a, name) {
        const data = { "isim": name }
        await fetch(`http://localhost:3000/api/update/${a}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    };
    async function updateConn(a, conn) {
        const data = { "conn": conn }
        await fetch(`http://localhost:3000/api/update/${a}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res);
    };

    async function getAll() {
        const req = await fetch(`http://localhost:3000/api/getAll`);
        const res = await req.json();
        return res;
    }

    async function setAvatar(puan, player) {
        if (puan >= 750) room.setPlayerAvatar(player.id, "👎")
        if (puan >= 850) room.setPlayerAvatar(player.id, "👍")
        if (puan >= 950) room.setPlayerAvatar(player.id, "🌵")
        if (puan >= 1000) room.setPlayerAvatar(player.id, "🔥")
        if (puan >= 1050) room.setPlayerAvatar(player.id, "💧")
        if (puan >= 1100) room.setPlayerAvatar(player.id, "⚡")
        if (puan >= 1150) room.setPlayerAvatar(player.id, "💎")
        if (puan >= 1200) room.setPlayerAvatar(player.id, "🏆")
        if (puan >= 1250) room.setPlayerAvatar(player.id, "👑")
    }

    var sure = 1000 * 180;
    dclink = setInterval(function () { room.sendAnnouncement(" ▒█▀▀▄ ▀█▀ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▀█ ▒█▀▀█ ▒█▀▀▄ ", null, 0x5F85FF); }, sure);
    dclink = setInterval(function () { room.sendAnnouncement(" ▒█░▒█ ▒█░ ░▀▀▀▄▄ ▒█░░░ ▒█░░▒█ ▒█▄▄▀ ▒█░▒█ ", null, 0x7E76FF); }, sure);
    dclink = setInterval(function () { room.sendAnnouncement(" ▒█▄▄▀ ▄█▄ ▒█▄▄▄█ ▒█▄▄█ ▒█▄▄▄█ ▒█░▒█ ▒█▄▄▀ ", null, 0x9E66FF); }, sure);
    dclink = setInterval(function () { room.sendAnnouncement(" Discordumuza gelmeyi unutmayın! https://discord.gg/wspDawNSDp", null, 0x17E8EC); }, sure);
});