import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { Button } from '@/components/ui/Button';
import SectionCard from '@/components/ui/SectionCard';
import GuessList from '@/components/ui/GuessList';
import WordList from '../components/ui/WordList';
import TeamPanel from '@/components/ui/TeamPanel';
import useCheckRoomExists from '@/hooks/useCheckRoomExists';

export default function Scoreboard() {
  const { roomId } = useParams();
  useCheckRoomExists(roomId);

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
    <div className="grid grid-cols-2 gap-6 mb-6">
      <TeamPanel teamName="Team A" players={teams.A} score={scores.A} />
      <TeamPanel teamName="Team B" players={teams.B} score={scores.B} />
    </div>

    {/* Last Round Summary */}
    <div className="mb-6 space-y-4">
      {/* Last Round Words Box */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2 text-yellow-800">📝 Last Round Words:</h4>
        <WordList words={lastRound.words} emptyText="None" />
      </div>

      {/* Last Round Guesses Box */}
      <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
        <h4 className="text-sm font-medium mb-2 text-gray-800">📝 Last Round Guesses:</h4>
        <GuessList
          guesses={lastRound.guesses}
          myTeam={null}
          clueGiverId={currentTurnPlayer?.playerId}
        />
      </div>
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
          Play Again
        </Button>
      </div>
    )}
  </SectionCard>
  );

}
