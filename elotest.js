function generateRandomFloatInRange(min, max) {
    return (Math.floor(Math.random() * (max - min + 1)) + min)+1;
}

//oldelo = generateRandomFloatInRange(700, 1500)
oldelo = 1000
hasWon = false
cs = false
goals = 2
assits = 0
owngoals = 0
const csbonus = (cs ? 3 : 0);
const bonus = (hasWon ? 2 : -3);

const newelo = goals*5 + assits*3 - owngoals*5 + bonus*5 + csbonus*4

console.log(newelo,"win:",hasWon,"cs:",cs)