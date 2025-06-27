// File: components/ui/DraggablePlayer.jsx
import { useDrag } from 'react-dnd';

export default function DraggablePlayer({ player, isHost }) {
  const [{ isDragging }, dragRef] = useDrag({
    type: 'PLAYER',
    item: player,
    canDrag: isHost, // 👈 only draggable if isHost is true
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={dragRef}
      className={`px-4 py-2 rounded shadow border bg-white ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {player.name}
    </div>
  );
}
