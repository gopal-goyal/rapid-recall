import { useState } from 'react';

export default function GuessList({ guesses, myTeam, clueGiverId }) {
  const [showAll, setShowAll] = useState(false);

  if (!guesses.length) {
    return <p className="text-sm text-gray-500">No guesses yet.</p>;
  }

  const reversedGuesses = [...guesses].reverse(); // 🔁 Newest first
  const visibleGuesses = showAll ? reversedGuesses : reversedGuesses.slice(0, 10);

  return (
    <div className="bg-white rounded-lg p-3 text-sm">
      <ul className="divide-y divide-gray-200">
        {visibleGuesses.map((g, i) => {
          const isSameTeam = g.team === myTeam;
          const isCorrect = g.correct;
          const textColor = isCorrect
            ? isSameTeam
              ? 'text-green-700 font-medium'
              : 'text-green-600 font-medium'
            : 'text-gray-800';

          return (
            <li key={i} className={`py-1 ${textColor}`}>
              <strong>{g.playerName}</strong>: {g.guess}
            </li>
          );
        })}
      </ul>

      {guesses.length > 10 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-2 text-blue-600 text-xs underline"
        >
          {showAll ? 'Hide extra guesses' : `Show all (${guesses.length})`}
        </button>
      )}
    </div>
  );
}
