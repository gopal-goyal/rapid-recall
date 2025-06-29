export default function GameSettings({ isHost, settings, onUpdate }) {
  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    onUpdate(newSettings);
  };

  return (
    <div className="mb-4">
      <div className="bg-neutral-100 border border-gray-300 p-4 rounded-md font-mono text-sm text-gray-800">
        <div className="mb-2 text-gray-600 font-semibold uppercase tracking-wide text-xs">
          Game Config
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Words per round */}
          <label className="flex flex-col">
            <span className="text-gray-500 mb-1">Words / Round</span>
            <input
              type="number"
              min={1}
              value={settings.wordsPerRound}
              disabled={!isHost}
              onChange={(e) => handleChange('wordsPerRound', parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>

          {/* Time per turn */}
          <label className="flex flex-col">
            <span className="text-gray-500 mb-1">Time / Turn (s)</span>
            <input
              type="number"
              min={10}
              value={settings.timePerTurn}
              disabled={!isHost}
              onChange={(e) => handleChange('timePerTurn', parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>

          {/* Points to win */}
          <label className="flex flex-col">
            <span className="text-gray-500 mb-1">Points to Win</span>
            <input
              type="number"
              min={1}
              value={settings.pointsToWin}
              disabled={!isHost}
              onChange={(e) => handleChange('pointsToWin', parseInt(e.target.value))}
              className="px-2 py-1 border border-gray-300 rounded-sm bg-white focus:outline-none focus:ring-1 focus:ring-blue-400"
            />
          </label>
        </div>

        {/* 🔞 NSFW toggle */}
        <div className="mt-4 flex items-center gap-2">
          <input
            type="checkbox"
            id="includeNsfw"
            disabled={!isHost}
            checked={!!settings.includeNsfw}
            onChange={(e) => handleChange('includeNsfw', e.target.checked)}
            className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
          />
          <label htmlFor="includeNsfw" className="text-sm text-gray-700 select-none">
            Include NSFW words
          </label>
        </div>
      </div>
    </div>
  );
}
