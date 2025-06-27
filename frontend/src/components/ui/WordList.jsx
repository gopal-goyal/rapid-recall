export default function WordList({ words, highlightGuessed }) {
  return (
    <div>
      <h3 className="font-semibold mb-2">Words</h3>
      <ul className="grid grid-cols-2 gap-2">
        {words.map((w, i) => (
          <li
            key={i}
            className={`p-2 rounded-md border ${
              w.guessed && highlightGuessed
                ? 'bg-green-100 text-green-700 border-green-300'
                : 'bg-gray-50 border-gray-300'
            }`}
          >
            {w.word}
          </li>
        ))}
      </ul>
    </div>
  );
}
