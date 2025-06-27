import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeamColumn from '@/components/ui/TeamColumn';
import DraggablePlayer from '@/components/ui/DraggablePlayer';
import GameSettings from '@/components/ui/GameSettings';
import { Button } from '@/components/ui/Button';


export default function Lobby() {
  const { roomId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const name = searchParams.get('name');
  const socket = useSocket();

  const [players, setPlayers] = useState([]);
  const [hostId, setHostId] = useState(null);
  const [isHost, setIsHost] = useState(false);
  const [teamA, setTeamA] = useState([]);
  const [teamB, setTeamB] = useState([]);
  const [gameSettings, setGameSettings] = useState({
    wordsPerRound: 5,
    timePerTurn: 60,
    pointsToWin: 10,
  });

  const handleRoomUpdate = useCallback((playerList) => {
    setPlayers(playerList);
    setTeamA(prev => prev.filter(p => playerList.find(x => x.id === p.id)));
    setTeamB(prev => prev.filter(p => playerList.find(x => x.id === p.id)));
  }, []);

  const handleSettingsUpdate = useCallback(({ settings }) => {
    setGameSettings(settings);
  }, []);

  useEffect(() => {
    if (!socket || !name) return;

    socket.emit('join-room', { roomId, name });

    socket.on('room-update', handleRoomUpdate);

    socket.on('host-id', (id) => {
      setHostId(id);
      setIsHost(socket.id === id);
    });

    socket.on('teams-updated', ({ teams }) => {
      setTeamA(teams.A);
      setTeamB(teams.B);
    });

    socket.on('game-started', () => {
      console.log('Received game-started event');
      navigate(`/score/${roomId}`);
    });

    socket.on('settings-updated', handleSettingsUpdate);

    return () => {
      socket.off('room-update', handleRoomUpdate);
      socket.off('host-id');
      socket.off('teams-updated');
      socket.off('settings-updated', handleSettingsUpdate);
      socket.off('game-started');
    };
  }, [socket, roomId, name, handleRoomUpdate, handleSettingsUpdate]);

  const unassigned = players.filter(
    p => !teamA.some(a => a.id === p.id) && !teamB.some(b => b.id === p.id)
  );

  const canStart = isHost && teamA.length >= 2 && teamB.length >= 2;

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-blue-50 p-6">
        <div className="bg-white p-6 rounded-xl shadow w-full max-w-4xl">
          <h2 className="text-xl font-bold mb-4 text-center">Lobby: {roomId}</h2>

          {/* Unassigned Players */}
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {unassigned.map(player => (
              <DraggablePlayer key={player.id} player={player} isHost={isHost} />
            ))}
          </div>

          {/* Team Columns */}
          <div className="flex justify-center gap-4 mb-6">
            {['Team A', 'Team B'].map((teamName) => (
              <TeamColumn
                key={teamName}
                name={teamName}
                players={teamName === 'Team A' ? teamA : teamB}
                onDrop={(p) => {
                  const newTeamA =
                    teamName === 'Team A'
                      ? [...teamA, p]
                      : teamA.filter((a) => a.id !== p.id);
                  const newTeamB =
                    teamName === 'Team B'
                      ? [...teamB, p]
                      : teamB.filter((b) => b.id !== p.id);

                  setTeamA(newTeamA);
                  setTeamB(newTeamB);

                  if (isHost) {
                    socket.emit('teams-updated', {
                      roomId,
                      teams: { A: newTeamA, B: newTeamB },
                    });
                  }
                }}
                isHost={isHost}
              />
            ))}
          </div>

          {/* Game Settings */}
          <GameSettings
            isHost={isHost}
            settings={gameSettings}
            onUpdate={(newSettings) => {
              setGameSettings(newSettings);
              if (isHost) {
                socket.emit('settings-updated', { roomId, settings: newSettings });
              }
            }}
          />

          {/* Start Button or Info */}
          {isHost && canStart ? (
            <div className="flex justify-center mt-4">
              <Button
                className="mt-4"
                variant="default"
                onClick={() => {
                  socket.emit('start-game', {
                    roomId,
                    teams: { A: teamA, B: teamB },
                  });
                  navigate(`/score/${roomId}`);
                }}
              >
                Start Game
              </Button>
            </div>
          ) : (
            <p className="text-center text-gray-500 mt-4">
              {isHost
                ? 'Assign at least 2 players to each team to start'
                : 'Waiting for host to start the game...'}
            </p>
          )}
        </div>
      </div>
    </DndProvider>
  );
}
