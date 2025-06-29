export default function Timer({ timeLeft, totalTime }) {
  const percent = Math.max((timeLeft / totalTime) * 100, 0);

  return (
    <div className="w-full max-w-xl">
      <div className="relative h-6 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full transition-all duration-500 ease-linear ${
            percent < 25 ? 'bg-red-500' : percent < 50 ? 'bg-yellow-400' : 'bg-green-500'
          }`}
          style={{ width: `${percent}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center text-sm font-semibold text-gray-800">
          Time Left: {timeLeft}s
        </div>
      </div>
    </div>
  );
}
