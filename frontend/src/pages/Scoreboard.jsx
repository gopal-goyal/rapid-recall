import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Button } from '@/components/ui/Button';
import SectionCard from '@/components/ui/SectionCard';
import GuessList from '@/components/ui/GuessList';
import PlayerBadge from '@/components/ui/PlayerBadge';
import WordList from '../components/ui/WordList';

export default function Scoreboard() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();
  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [teams, setTeams] = useState({ A: [], B: [] });
  const [lastRound, setLastRound] = useState({ words: [], guesses: [] });
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState(null);
  const playerId = localStorage.getItem('playerId');
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!socket) return;

    socket.emit('score-screen-loaded', { roomId });

    socket.on('score-update', ({ scores, teams }) => {
      setScores(scores);
      if (teams) setTeams(teams);
    });

    socket.on('reset-to-lobby', () => {
      setTimeout(() => navigate(`/lobby/${roomId}`), 100);
    });

    socket.on('last-round', ({ words, guesses }) => setLastRound({ words, guesses }));
    socket.on('next-turn', ({ player }) => setCurrentTurnPlayer(player));
    socket.on('navigate-to-game', () => navigate(`/game/${roomId}`));
    socket.on('game-ended', ({ winner }) => setWinner(winner));

    return () => {
      socket.off('score-update');
      socket.off('last-round');
      socket.off('next-turn');
      socket.off('navigate-to-game');
      socket.off('game-ended');
      socket.off('reset-to-lobby');
    };
  }, [socket, roomId]);

  const isMyTurn = currentTurnPlayer?.playerId === playerId;

  return (
  <SectionCard>
    <h2 className="text-2xl font-bold mb-6 text-center">Scoreboard</h2>

    {/* Winner Banner */}
    {winner && (
      <div className="bg-green-50 border border-green-300 text-green-800 p-4 rounded-xl text-center mb-6">
        🏆 <span className="font-semibold">Team {winner}</span> wins the game!
        <p className="text-sm text-gray-600 mt-1">
          Final Score — <strong>Team A:</strong> {scores.A} &nbsp;|&nbsp; <strong>Team B:</strong> {scores.B}
        </p>
      </div>
    )}

    {/* Score Grid */}
    <div className="grid grid-cols-2 gap-6 mb-6 text-sm text-gray-700">
        <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-blue-800 mb-3 text-center">Team A — {scores.A} pts</h3>
          <div className="flex flex-col gap-2 items-center">
            {teams.A.map((p) => (
              <PlayerBadge key={p.playerId} name={p.name} small />
            ))}
          </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-bold text-red-800 mb-3 text-center">Team B — {scores.B} pts</h3>
          <div className="flex flex-col gap-2 items-center">
            {teams.B.map((p) => (
              <PlayerBadge key={p.playerId} name={p.name} small />
            ))}
          </div>
        </div>
      </div>

    {/* Last Round Summary */}
    <div className="mb-6">
      <h4 className="text-sm font-medium mb-2 text-gray-700">📝 Last Round Words:</h4>
      <WordList words={lastRound.words} emptyText="None" />
      <h4 className="text-sm font-medium mb-2 text-gray-700">📝 Last Round Guesses:</h4>
      <GuessList
        guesses={lastRound.guesses}
        myTeam={null}
        clueGiverId={currentTurnPlayer?.playerId}
      />
    </div>

    {/* Turn Controls */}
    {!winner && (
      isMyTurn ? (
        <Button
          variant="success"
          className="w-full"
          onClick={() => {
            socket.emit('start-turn', { roomId });
            navigate(`/game/${roomId}`);
          }}
        >
          Start Turn
        </Button>
      ) : (
        <p className="text-center text-gray-500 text-sm">
          Waiting for <strong>{currentTurnPlayer?.name || '...'}</strong> to start their turn.
        </p>
      )
    )}

    {/* Play Again Button */}
    {winner && (
      <div className="text-center mt-6">
        <Button
          variant="success"
          onClick={() => socket.emit('play-again', { roomId })}
        >
          🔁 Play Again
        </Button>
      </div>
    )}
  </SectionCard>
  );

}
