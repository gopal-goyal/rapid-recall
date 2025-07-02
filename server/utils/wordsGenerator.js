// Word pools
const cleanWords = [
  // Himachal level
  "baawe", "babu", "teri", "chachu", "shap", "maal", "tola", "paper", "chanchal", "khopcha", "bouncer",
  "jangu", "ekta", "junction", "vande bharat", "rasmalai", "chai", "bhaiji", "hamari bong", "nescafe",
  "Hillffair", "bir", "billing", "chopra", "gusto", "badka", "Lucknow Food",

  // Music & Songs
  "seedhe maut", "kr$na", "sonu nigam", "raftaar", "badshah", "Neeraj Pepsu",

  // Youtube & Content Creators
  "carryminati", "ashish chanchlani", "bb ki vines", "rebel kid", 

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
  "Tatte", "Third leg", "Chamanprash", "Loose motion", "Choole bhature", "Baingan", "Moti gand",
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

function refillPool(pool, baseWords) {
  const shuffled = shuffleArray(baseWords);
  pool.push(...shuffled);
}

function getWordsFromPool(pool, baseWords, count) {
  if (pool.length < count) {
    refillPool(pool, baseWords);
  }
  return pool.splice(0, count);
}

function generateWords(n = 5, includeNsfw = false) {
  // Fill clean pool if empty
  if (cleanPool.length < n) {
    refillPool(cleanPool, cleanWords);
  }

  let selectedWords = getWordsFromPool(cleanPool, cleanWords, n);

  if (includeNsfw) {
    // Fill nsfw pool if empty
    if (nsfwPool.length < n) {
      refillPool(nsfwPool, nsfwWords);
    }

    // Half from clean, half from nsfw (or tweak logic as needed)
    const half = Math.floor(n / 2);
    const cleanCount = n - half;
    selectedWords = getWordsFromPool(cleanPool, cleanWords, cleanCount).concat(
      getWordsFromPool(nsfwPool, nsfwWords, half)
    );
  }

  return selectedWords.map(w => ({ word: w, guessed: false }));
}

module.exports = { generateWords };
