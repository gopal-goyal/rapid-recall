export default function GameSettings({ isHost, settings, onUpdate }) {
  const handleChange = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    onUpdate(newSettings);
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold mb-2 text-center">Game Settings</h3>
      <div className="grid grid-cols-3 gap-4">
        <label className="flex flex-col text-sm">
          Words per Round
          <input
            type="number"
            className="border p-1 rounded"
            value={settings.wordsPerRound}
            onChange={(e) => handleChange('wordsPerRound', parseInt(e.target.value))}
            disabled={!isHost}
          />
        </label>

        <label className="flex flex-col text-sm">
          Time per Turn (sec)
          <input
            type="number"
            className="border p-1 rounded"
            value={settings.timePerTurn}
            onChange={(e) => handleChange('timePerTurn', parseInt(e.target.value))}
            disabled={!isHost}
          />
        </label>

        <label className="flex flex-col text-sm">
          Points to Win
          <input
            type="number"
            className="border p-1 rounded"
            value={settings.pointsToWin}
            onChange={(e) => handleChange('pointsToWin', parseInt(e.target.value))}
            disabled={!isHost}
          />
        </label>
      </div>
    </div>
  );
}
