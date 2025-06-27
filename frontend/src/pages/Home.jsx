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
      <h1 className="text-xl font-bold mb-4 text-center">Rapid Recall</h1>

      <Input
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="mb-4"
      />

      <div className="flex flex-col gap-3">
        <Button onClick={handleCreate} disabled={!name}>
          Create Room
        </Button>

        <div className="flex gap-2">
          <Input
            placeholder="Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <Button onClick={handleJoin} disabled={!name || !roomId}>
            Join
          </Button>
        </div>
      </div>
    </SectionCard>
  );
}