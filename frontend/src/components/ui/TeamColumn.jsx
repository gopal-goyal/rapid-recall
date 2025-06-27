import { useDrop } from 'react-dnd';

export default function TeamColumn({ name, players, onDrop, isHost }) {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'PLAYER',
    canDrop: () => isHost,
    drop: (item) => onDrop(item),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  return (
    <div
      ref={dropRef}
      className={`w-48 min-h-[200px] p-4 rounded-lg border-2 ${
        isOver && canDrop ? 'border-green-500' : 'border-gray-300'
      }`}
    >
      <h3 className="font-semibold mb-2 text-center">{name}</h3>
      {players.map(player => (
        <div key={player.id} className="mb-1 px-2 py-1 bg-gray-100 rounded">
          {player.name}
        </div>
      ))}
    </div>
  );
}
