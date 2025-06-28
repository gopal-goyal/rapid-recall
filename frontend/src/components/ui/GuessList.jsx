export default function GuessList({ guesses, myTeam, clueGiverId }) {
  return (
    <div>
      <ul className="space-y-1 text-sm">
        {guesses.map((g, i) => {
          const isSameTeam = g.team === myTeam;
          return (
            <li
              key={i}
              className={`px-3 py-1 rounded ${
                g.correct
                  ? isSameTeam
                    ? 'bg-green-100 text-green-700'
                    : 'bg-green-50 text-green-600'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <strong>{g.playerName || 'Unknown'}</strong>: {g.guess}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
