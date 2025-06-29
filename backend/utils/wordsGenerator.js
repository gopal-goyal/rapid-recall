// ... existing code ...
const cleanWords = [
  // General
  "apple", "book", "cat", "river", "mountain", "phone", "tree", "car",

  // Indian Food
  "samosa", "pani puri", "butter chicken", "biryani", "masala dosa", "roti", "paneer", "maggie",

  // Bollywood & Celebrities
  "shah rukh khan", "alia bhatt", "karan johar", "gadar", "tiger", "item song", "dhinchak", "bigg boss",

  // Slang & Memes
  "jugaad", "patakha", "chumma", "yaar", "setting", "scene", "bhaag", "cringe", "tharki", "ghanta", "faltu",

  // Tech / Apps
  "whatsapp", "instagram", "jio", "swiggy", "zomato", "chatgpt", "reels", "snapchat", "netflix", "youtube",

  // College Life
  "hostel", "ragging", "proxy", "attendance", "fresher", "exam", "crush", "lab partner", "internship",

  // Festivals & Culture
  "diwali", "holi", "eid", "navratri", "garba", "rakhi", "baraat", "mehendi", "puja", "mandir", "ladoo",

  // Political & Satirical
  "modi", "rahul gandhi", "parliament", "vote", "protest", "chowkidar", "scam", "bhakt", "aandolan",

  // Random Indian Elements
  "rickshaw", "chai", "paan", "ganja", "sanskari", "tinder", "swag", "desi", "traffic", "mirchi", "censor",

  // Flirty & Funny
  "bf", "gf", "ex", "breakup", "cheater", "cringe reel", "late night", "goodnight", "eyeliner", "dhoka",
];

const nsfwWords = [
  // NSFW / 18+ (toggle required to include these)
  "condom", "honeymoon", "boobs", "bra", "panty", "sex", "hookup", "strip", "vodka", "threesome", "nudes",
  "Tatte", "Third leg", "Chamanprash", "Loose motion", "Choole bhature", "Baingan", "Moti gand",
  "Chotti luli", "Camel toe", "Periods blood", "Wet panty", "Double penetration", "Black hole"
];

function generateWords(n = 5, includeNsfw = false) {
  let wordsPool = [...cleanWords];
  if (includeNsfw) {
    wordsPool = wordsPool.concat(nsfwWords);
  }

  const shuffled = wordsPool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(w => ({ word: w, guessed: false }));
}

module.exports = { generateWords };