import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import WordList from '@/components/ui/WordList';
import GuessInput from '@/components/ui/GuessInput';
import GuessList from '@/components/ui/GuessList';
import Timer from '@/components/ui/Timer';

export default function GameScreen() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const [socketId, setSocketId] = useState(null);
  const [words, setWords] = useState([]); // [{ word: 'apple', guessed: false }]
  const [guesses, setGuesses] = useState([]); // [{ playerId, guess, correct }]
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [teams, setTeams] = useState({ A: [], B: [] });
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!socket) return;
    setSocketId(socket.id);

    socket.emit('game-screen-loaded', { roomId });

    socket.on('game-state', ({ words, guesses, currentPlayer, teams, timeLeft }) => {
      setWords(words);
      setGuesses(guesses);
      setCurrentPlayer(currentPlayer);
      setTeams(teams);
      setTimeLeft(timeLeft);
    });

    socket.on('guess-made', (newGuess) => {
      setGuesses((prev) => [...prev, newGuess]);
      setWords((prev) =>
        prev.map((w) =>
          w.word === newGuess.guess && newGuess.correct ? { ...w, guessed: true } : w
        )
      );
    });

    socket.on('timer-update', setTimeLeft);

    socket.on('navigate-to-score', () => {
    navigate(`/score/${roomId}`);
    });


    return () => {
      socket.off('game-state');
      socket.off('guess-made');
      socket.off('timer-update');
      socket.off('navigate-to-score');
    };
  }, [socket, roomId]);

//   const isClueGiver = currentPlayer?.id === socketId;
//   const myTeam = teams.A.some(p => p.id === socketId) ? 'A' : 'B';
//   const isTeammate = !isClueGiver && teams[myTeam].some(p => p.id === socketId);
  const isClueGiver = currentPlayer?.id === socketId;
  const currentPlayerTeam = teams.A.some(p => p.id === currentPlayer?.id) ? 'A' : (teams.B.some(p => p.id === currentPlayer?.id) ? 'B' : null);
  const myTeam = teams.A.some(p => p.id === socketId) ? 'A' : 'B';
  const isTeammateOfClueGiver = !isClueGiver && myTeam === currentPlayerTeam;
 
  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <Timer timeLeft={timeLeft} />
        <div className="w-full max-w-3xl mt-4 bg-white rounded-xl p-4 shadow-md">
        {isClueGiver || !isTeammateOfClueGiver ? (
        <WordList words={words} highlightGuessed />
        ) : (
        <GuessInput roomId={roomId} />
        )}
        <div className="mt-6">
          <GuessList guesses={guesses} myTeam={myTeam} clueGiverId={currentPlayer?.id} />
        </div>
      </div>
    </div>
  );
}
