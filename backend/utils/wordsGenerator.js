const sampleWords = [
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

  // NSFW / 18+ / Edgy (mild)
  "condom", "honeymoon", "boobs", "bra", "panty", "sex", "hookup", "strip", "vodka", "threesome", "nudes",

  // Political & Satirical
  "modi", "rahul gandhi", "parliament", "vote", "protest", "chowkidar", "scam", "bhakt", "aandolan",

  // Random Indian Elements
  "rickshaw", "chai", "paan", "ganja", "sanskari", "tinder", "swag", "desi", "traffic", "mirchi", "censor",

  // Games & Shows
  "pubg", "valorant", "kaun banega crorepati", "splitsvilla", "shark tank", "mtv", "ipl", "cricket", "wwe",

  // Flirty & Funny
  "bf", "gf", "ex", "breakup", "cheater", "cringe reel", "late night", "goodnight", "eyeliner", "dhoka"
];


function generateWords(n = 5) {
  const shuffled = [...sampleWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(w => ({ word: w, guessed: false }));
}

module.exports = { generateWords };
