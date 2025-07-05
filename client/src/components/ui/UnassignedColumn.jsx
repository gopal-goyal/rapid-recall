import { useDrop } from 'react-dnd';
import DraggablePlayer from './DraggablePlayer';

export default function UnassignedColumn({ players, onDrop, isHost }) {
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
      className={`
        w-full transition-all duration-200 ease-in-out rounded border-2 mb-4
        ${isOver && canDrop ? 'border-green-500 bg-green-50' : 'border-transparent'}
        ${players.length === 0 ? 'min-h-[40px]' : 'p-2'}
      `}
    >
      {players.length > 0 && (
        <>
          <h3 className="font-semibold mb-2 text-center text-sm text-gray-600">Unassigned Players</h3>
          <div className="flex flex-wrap justify-center gap-2">
            {players.map((player) => (
              <DraggablePlayer key={player.playerId} player={player} isHost={isHost} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
