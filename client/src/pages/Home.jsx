import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import SectionCard from '@/components/ui/SectionCard';
import { useSocket } from '@/context/SocketContext';

export default function Home() {
  const socket = useSocket();
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();
  console.log('🧠 socket:', socket);


  useEffect(() => {
    if (!socket) return;

    socket.on('room-created', ({ roomId, playerId, hostId }) => {
      localStorage.setItem('playerId', playerId);
      localStorage.setItem('playerName', name);
      localStorage.setItem('hostId', hostId);
      setTimeout(() => {
        navigate(`/lobby/${roomId}`);
      }, 100);
    });

    socket.on('room-joined', ({ roomId, playerId, hostId }) => {
      localStorage.setItem('playerId', playerId);
      localStorage.setItem('playerName', name);
      localStorage.setItem('hostId', hostId);
      setTimeout(() => {
        navigate(`/lobby/${roomId}`);
      }, 100);
    });

    socket.on('join-error', ({ message }) => {
      alert(message);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-joined');
      socket.off('join-error');
    };
  }, [socket, name, navigate]);


  const handleCreate = () => {
    socket.emit('create-room', { name });
  };

  const handleJoin = () => {
    let playerId = localStorage.getItem('playerId');
    socket.emit('join-room', { name, playerId, roomId });
  };

  return (
    <SectionCard>
      <div className="space-y-6 max-w-md mx-auto w-full">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
            Your Name
          </label>
            <input
                autoFocus={true}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
            />
        </div>

        <div>
          <Button onClick={handleCreate} disabled={!name} className="w-full">
            Create New Room
          </Button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4 text-gray-400 text-sm">
          <hr className="flex-grow border-gray-300" />
          OR
          <hr className="flex-grow border-gray-300" />
        </div>

        {/* Join Room Section */}
        <div>
          <label htmlFor="room-id" className="text-sm font-medium text-gray-700 mb-1 block">
            Join Existing Room
          </label>
          <div className="flex gap-2">
            <input
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              placeholder="Room Id"
            />

            <Button onClick={handleJoin} disabled={!name || !roomId} className="w-28">
              Join
            </Button>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}