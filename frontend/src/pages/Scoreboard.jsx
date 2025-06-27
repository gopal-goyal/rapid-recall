import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Button } from '@/components/ui/Button';
import SectionCard from '@/components/ui/SectionCard';
import GuessList from '@/components/ui/GuessList';

export default function Scoreboard() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const [scores, setScores] = useState({ A: 0, B: 0 });
  const [lastRound, setLastRound] = useState({ words: [], guesses: [] });
  const [currentTurnPlayer, setCurrentTurnPlayer] = useState(null);
  const [socketId, setSocketId] = useState(null);
  const [winner, setWinner] = useState(null);

  useEffect(() => {
    if (!socket) return;

    setSocketId(socket.id);
    socket.emit('score-screen-loaded', { roomId });

    socket.on('score-update', ({ scores }) => setScores(scores));
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
    };
  }, [socket, roomId]);

  const isMyTurn = currentTurnPlayer?.id === socketId;

  return (
    <SectionCard>
      <h2 className="text-xl font-bold mb-4 text-center">Scoreboard</h2>

      {/* Winner Banner */}
      {winner && (
        <div className="bg-green-100 border border-green-300 text-green-800 p-4 rounded-lg text-center mb-4">
          🎉 <strong>Team {winner}</strong> wins the game!
          <p className="text-sm text-gray-600 mt-1">
            Final Score — Team A: {scores.A} | Team B: {scores.B}
          </p>
        </div>
      )}

      {/* Scores */}
      <div className="flex justify-between mb-4 text-center font-semibold">
        <div>Team A: {scores.A}</div>
        <div>Team B: {scores.B}</div>
      </div>

      {/* Last Round Summary */}
      <div className="mb-4">
        <h4 className="text-sm font-medium mb-1">Last Round Words:</h4>
        <ul className="text-sm list-disc ml-4">
          {lastRound.words?.length === 0
            ? <li className="text-gray-500">None</li>
            : lastRound.words.map((w, idx) => (
                <li key={idx}>{typeof w === 'string' ? w : w.word}</li>
              ))}
        </ul>

        <h4 className="text-sm font-medium mt-3 mb-1">Guesses:</h4>
        <GuessList
          guesses={lastRound.guesses}
          myTeam={null}
          clueGiverId={currentTurnPlayer?.id}
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
          <p className="text-center text-gray-600">
            Waiting for <strong>{currentTurnPlayer?.name || '...'}</strong> to start their turn.
          </p>
        )
      )}
    </SectionCard>
  );
}
