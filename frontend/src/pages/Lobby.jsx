import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TeamColumn from '@/components/ui/TeamColumn';
import GameSettings from '@/components/ui/GameSettings';
import { Button } from '@/components/ui/Button';
import SectionCard from '@/components/ui/SectionCard';
import UnassignedColumn from '@/components/ui/UnassignedColumn';

export default function Lobby() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const playerId = localStorage.getItem('playerId');
  const playerName = localStorage.getItem('playerName');
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

  useEffect(() => {
    if (!socket || !roomId || !playerName) return;

    socket.emit('join-room', { roomId, name: playerName, playerId });

    // 🔄 Room full state (players, teams, settings, host)
    socket.on('room-state', ({ players, hostId, settings, teams }) => {
      setPlayers(players);
      setHostId(hostId);
      setIsHost(playerId === hostId);
      setGameSettings(settings || {});
      setTeamA(teams?.A || []);
      setTeamB(teams?.B || []);
    });

    socket.on('teams-updated', ({ teams }) => {
      setTeamA(teams.A || []);
      setTeamB(teams.B || []);
    });

    socket.on('settings-updated', ({ settings }) => {
      setGameSettings(settings);
    });

    socket.on('game-started', () => {
      navigate(`/score/${roomId}`);
    });

    return () => {
      socket.off('room-state');
      socket.off('teams-updated');
      socket.off('settings-updated');
      socket.off('game-started');
    };
  }, [socket, roomId, playerName]);


  const unassigned = players.filter(
    p => !teamA.some(a => a.playerId === p.playerId) && !teamB.some(b => b.playerId === p.playerId)
  );

  const canStart = isHost && teamA.length >= 2 && teamB.length >= 2;

  function emitTeamUpdate(a, b) {
    if (isHost) {
      socket.emit('teams-updated', {
        roomId,
        teams: { A: a, B: b },
      });
    }
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <SectionCard>
          <h2 className="text-xl font-bold mb-4 text-center">Room Code: {roomId}</h2>

          {/* ✅ Drop zone for unassigned players */}
          <UnassignedColumn
            players={unassigned}
            onDrop={(player) => {
              const newTeamA = teamA.filter(p => p.playerId !== player.playerId);
              const newTeamB = teamB.filter(p => p.playerId !== player.playerId);
              setTeamA(newTeamA);
              setTeamB(newTeamB);
              emitTeamUpdate(newTeamA, newTeamB);
            }}
            isHost={isHost}
          />

          {/* Team Columns */}
          <div className="flex justify-center gap-4 mb-6">
            {['Team A', 'Team B'].map((teamName) => (
              <TeamColumn
                key={teamName}
                playerName={teamName}
                players={teamName === 'Team A' ? teamA : teamB}
                onDrop={(p) => {
                  const newTeamA =
                    teamName === 'Team A'
                      ? [...teamA, p]
                      : teamA.filter((a) => a.playerId !== p.playerId);
                  const newTeamB =
                    teamName === 'Team B'
                      ? [...teamB, p]
                      : teamB.filter((b) => b.playerId !== p.playerId);

                  setTeamA(newTeamA);
                  setTeamB(newTeamB);
                  emitTeamUpdate(newTeamA, newTeamB);
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
      </SectionCard>
    </DndProvider>
  );
}
