// Word pools
const cleanWords = [
  // Himachal level
  "baawe", "babu", "teri", "chachu", "shap", "maal", "tola", "paper", "chanchal", "khopcha", "bouncer",
  "jangu", "ekta", "junction", "vande bharat", "rasmalai", "chai", "bhaiji", "hamari bong", "nescafe",
  "Hillfair", "bir", "billing", "chopra", "gusto", "badka", "Lucknow Food",

  // Miscellaneous
  "Chamar", "Jaat", "Gurjar", "Yadav", "Brahman", "Bengali Lawyer", "Chutpaglu", "Pepsu Paglu", "Stash Pro",
  "Kohli Paglu", "Bongchie", "Indicator", "Nano", "Minions", "Niggro", "Einstein", "Kashmiri Chachu", "Jamalta",
  "Prerna", "Kanak","Aarya","Old Monk","Monkey Shoulder", "Sky Vodka", "V20","Jimmy's Cocktail","Bayblade", "Oswald", "Simpsons",
  "Tukur Tukur", "Allah hu akbar", "Green Bullet", "Ava Adams", "Dani Daniels", "Mia Khalifa", "Leh Gotti", "Nanchaku","Namastute",
  "Ungli", "Bedi ki Choti Lulli", "Iceburst", "Advance", "Choti Advance", "Connect","Bhosdi", "Jagdish Bhagat", "Puneet Superstar",
  "Samay Raina","Poonam Pandey", "Oggy and Cockroach","Gadbad","Adhyan ki Bund", "De dana dan", "Vetican City", "Venice","Chutpur",
  "Bhosdipur","Ranki ki fuddi", "Fameer Fuddi", "Bablu Ji", "Mr Hola", "Mrs Verma", "Jethalal","BOObita","Champaklal","Puba",
  "Zudio","Zoro","Lufy","Fila","Splitsvilla","Systum","Elvish Yadav","Solo Leveling","Savita Bhabhi","Emo","Omi TV","Mausichod",
  "Onlyfans","Bentley","Ferrari","Hyundai","Kia","Skoda Laura","Jenga",

  // Music & Songs
  "seedhe maut", "kr$na", "sonu nigam", "raftaar", "badshah", "Neeraj Pepsu", "Raga", "Panther", "Sapna Choudhary",

  // Youtube & Content Creators
  "carryminati", "ashish chanchlani", "bb ki vines", "rebel kid", "Arpit Bala",

  // Movies & TV
  "bollywood", "tollywood", "kdrama", "web series", "netflix", "amazon prime", "disney+", "hindi cinema",

  // Bollywood & Celebrities
  "shah rukh khan", "Salman Bhai", "alia bhatt", "karan johar", "gadar", "tiger", "item song", "dhinchak", "big boss",

  // Slang & Memes
  "jugaad", "patakha", "chumma", "yaar", "setting", "scene", "bhaag", "cringe", "tharki", "ghanta", "faltu",

  // Tech / Apps
  "whatsapp", "instagram", "jio", "swiggy", "zomato", "chatgpt", "reels", "snapchat", "netflix", "youtube",

  // College Life
  "hostel", "ragging", "proxy", "attendance", "fresher", "exam", "crush", "lab partner", "internship",

  // Political & Satirical
  "modi", "rahul gandhi", "parliament", "vote", "protest", "chowkidar", "scam", "bhakt", "aandolan",

  // Random Indian Elements
  "rickshaw", "chai", "paan", "ganja", "sanskari", "tinder", "swag", "desi", "traffic", "mirchi", "censor",

  // Flirty & Funny
  "bf", "gf", "ex", "breakup", "cheater", "cringe reel", "late night", "goodnight", "eyeliner", "dhoka",
];

const nsfwWords = [
  "condom", "honeymoon", "boobs", "bra", "panty", "sex", "hookup", "strip", "vodka", "threesome", "nudes",
  "Tatte", "Third leg", "Chawanprash", "Loose motion", "Chole bhature", "Baingan", "Moti gand",
  "Chotti luli", "Camel toe", "Periods blood", "Wet panty", "Double penetration", "Black hole", "Fetish",
  "Orgasm", "Kinky", "muth"
];

// Persistent pools
let cleanPool = [];
let nsfwPool = [];

function shuffleArray(arr) {
  return arr
    .map(value => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function refillPool(pool, baseWords, usedWords) {
    const filtered = baseWords.filter(word => !usedWords.includes(word));
    const shuffled = shuffleArray(filtered);
    pool.push(...shuffled);
}

function getWordsFromPool(pool, baseWords, usedWords, count) {
    const result = [];
    while (result.length < count) {
        if (pool.length === 0) {
            refillPool(pool, baseWords, usedWords);
            if (pool.length === 0) break;  // No more new words possible
        }

        const word = pool.shift();
        if (!usedWords.includes(word)) {
            result.push(word);
            usedWords.push(word);
        }
    }
    return result;
}

function generateWords(room, n = 5, includeNsfw = false) {
    // Initialize room.usedWords as an array if not present
    if (!room.usedWords) {
        room.usedWords = [];
    }

    let usedWords = room.usedWords;
    let selectedWords = [];

    if (includeNsfw) {
        const half = Math.floor(n / 2);
        const cleanCount = n - half;

        const cleanWordsSelected = getWordsFromPool(cleanPool, cleanWords, usedWords, cleanCount);
        const nsfwWordsSelected = getWordsFromPool(nsfwPool, nsfwWords, usedWords, half);

        selectedWords = [...cleanWordsSelected, ...nsfwWordsSelected];
    } else {
        selectedWords = getWordsFromPool(cleanPool, cleanWords, usedWords, n);
    }
    console.log(selectedWords);
    console.log(usedWords)

    return selectedWords.map(word => ({ word, guessed: false }));
}

module.exports = {
    generateWords,
}