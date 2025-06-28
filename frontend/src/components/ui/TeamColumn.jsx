import { useDrop } from 'react-dnd';
import DraggablePlayer from './DraggablePlayer';
import PlayerBadge from './PlayerBadge';
import { useRef } from 'react';

export default function TeamColumn({
  name,
  players,
  onDrop = () => {},
  isHost = false,
  isDroppable = true,
  score = null,
}) {
  const localRef = useRef(null);

  const teamStyles = {
    'Team A': {
      bg: 'bg-blue-50',
      text: 'text-blue-800',
      border: 'border-blue-200',
    },
    'Team B': {
      bg: 'bg-red-50',
      text: 'text-red-800',
      border: 'border-red-200',
    },
  };

  const { bg, text, border } = teamStyles[name] || {
    bg: 'bg-gray-50',
    text: 'text-gray-800',
    border: 'border-gray-200',
  };

  let dropRef = localRef;

  // ✅ Only useDrop if allowed
  const dropProps = isDroppable
    ? useDrop({
        accept: 'PLAYER',
        canDrop: () => isHost,
        drop: (item) => onDrop(item),
        collect: (monitor) => ({
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        }),
      })
    : null;

  if (isDroppable && dropProps) {
    dropRef = dropProps[1]; // the actual ref
  }

  const isOver = dropProps?.[0]?.isOver ?? false;
  const canDrop = dropProps?.[0]?.canDrop ?? false;

  return (
    <div
      ref={dropRef}
      className={`p-4 rounded-lg shadow-sm w-full min-h-[200px]
        ${bg} ${border} border-2 ${
        isDroppable && isOver && canDrop ? 'border-green-500 bg-green-50' : ''
      }`}
    >
      <h3 className={`font-bold mb-3 text-center ${text}`}>
        {name} {score !== null && `— ${score} pts`}
      </h3>
      <div className="flex flex-col gap-2 items-center">
        {players.map((p) =>
          isDroppable ? (
            <DraggablePlayer key={p.playerId} player={p} isHost={isHost} />
          ) : (
            <PlayerBadge key={p.playerId} name={p.name} small />
          )
        )}
      </div>
    </div>
  );
}
