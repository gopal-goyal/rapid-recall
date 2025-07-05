import { useDrop } from 'react-dnd';
import DraggablePlayer from './DraggablePlayer';

export default function UnassignedColumn({ players, onDrop, isHost }) {
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'PLAYER',
    canDrop: () => isHost,
    drop: (item) => {
        onDrop(item)
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
      <div
          ref={dropRef}
          className={`
        w-full border-2 rounded transition-all duration-200 ease-in-out mb-4
        ${isActive ? 'border-green-500 bg-green-50' : 'border-transparent'}
        ${players.length === 0 ? 'min-h-[40px]' : 'p-4'}
      `}
      >
        {players.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-600 text-center mb-3">
                Unassigned Players
              </h3>

              <div className="flex flex-wrap justify-center gap-3">
                {players.map((player) => (
                    <DraggablePlayer
                        key={player.playerId}
                        player={player}
                        isHost={isHost}
                    />
                ))}
              </div>
            </div>
        )}
      </div>
  );
}
