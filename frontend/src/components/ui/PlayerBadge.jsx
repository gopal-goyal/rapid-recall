// components/ui/PlayerBadge.jsx
export default function PlayerBadge({ name, small = false }) {
  const colors = [
    'from-pink-400 to-purple-500',
    'from-blue-400 to-green-500',
    'from-yellow-400 to-red-500',
  ];
  const bgColor = colors[name.length % colors.length];

  return (
    <div
      className={`inline-block rounded-xl shadow-md text-white font-bold text-center bg-gradient-to-r ${bgColor} 
        ${small ? 'px-2 py-1 text-xs' : 'px-4 py-2 text-sm'} 
        transition-transform transform hover:scale-105`}
    >
      👾 {name}
    </div>
  );
}
