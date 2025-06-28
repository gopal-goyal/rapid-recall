// components/ui/DraggablePlayer.jsx
import { useDrag } from 'react-dnd';
import PlayerBadge from './PlayerBadge';

export default function DraggablePlayer({ player, isHost }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'PLAYER',
    item: player,
    canDrag: isHost,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`cursor-pointer ${isDragging ? 'opacity-40 scale-95' : ''}`}
    >
      <PlayerBadge name={player.name} />
    </div>
  );
}
