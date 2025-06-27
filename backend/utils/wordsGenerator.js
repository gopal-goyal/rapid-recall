const sampleWords = ['apple', 'book', 'cat', 'river', 'mountain', 'phone', 'tree', 'car'];

function generateWords(n = 5) {
  const shuffled = [...sampleWords].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, n).map(w => ({ word: w, guessed: false }));
}

module.exports = { generateWords };
