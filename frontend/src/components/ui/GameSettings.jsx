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
      </div>
    </div>
  );
}
