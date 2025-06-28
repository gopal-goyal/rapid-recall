import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import SectionCard from '@/components/ui/SectionCard';

export default function Home() {
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleCreate = () => {
    const newRoomId = crypto.randomUUID().slice(0, 6);
    navigate(`/lobby/${newRoomId}?name=${encodeURIComponent(name)}`);
  };

  const handleJoin = () => {
    if (roomId) {
      navigate(`/lobby/${roomId}?name=${encodeURIComponent(name)}`);
    }
  };

  return (
    <SectionCard>
      <div className="space-y-6 max-w-md mx-auto w-full">
        {/* Name Input */}
        <div>
          <label htmlFor="name" className="text-sm font-medium text-gray-700 mb-1 block">
            Your Name
          </label>
          <Input
            id="name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Create Room Section */}
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
            <Input
              id="room-id"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="flex-1"
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