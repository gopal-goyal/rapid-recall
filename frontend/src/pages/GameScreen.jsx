import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import WordList from '@/components/ui/WordList';
import GuessInput from '@/components/ui/GuessInput';
import GuessList from '@/components/ui/GuessList';
import Timer from '@/components/ui/Timer';
import SectionCard from '@/components/ui/SectionCard';

export default function GameScreen() {
  const { roomId } = useParams();
  const socket = useSocket();
  const navigate = useNavigate();

  const playerId = localStorage.getItem('playerId');
  const [words, setWords] = useState([]); // [{ word: 'apple', guessed: false }]
  const [guesses, setGuesses] = useState([]); // [{ playerId, guess, correct }]
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [teams, setTeams] = useState({ A: [], B: [] });
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!socket) return;

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

  const isClueGiver = currentPlayer?.playerId === playerId;
  const currentPlayerTeam = teams.A.some(p => p.playerId === currentPlayer?.playerId) ? 'A' : (teams.B.some(p => p.playerId === currentPlayer?.playerId) ? 'B' : null);
  const myTeam = teams.A.some(p => p.playerId === playerId) ? 'A' : 'B';
  const isTeammateOfClueGiver = !isClueGiver && myTeam === currentPlayerTeam;
 
  

  return (
    <SectionCard>
      {/* Top: Timer */}
      <div className="flex justify-center mb-2">
        <Timer timeLeft={timeLeft} />
      </div>

      {/* Game Box */}
      <div className="w-full max-w-3xl bg-gradient-to-br from-yellow-50 to-orange-100 rounded-xl p-6 shadow-lg border border-orange-200">
        {/* Word or Guess Area */}
        <div className="mb-4">
          {isClueGiver || !isTeammateOfClueGiver ? (
            <>
              <h3 className="text-center text-lg font-semibold text-orange-800 mb-2">
                Words to Describe
              </h3>
              <WordList words={words} center />
            </>
          ) : (
            <>
              <h3 className="text-center text-lg font-semibold text-blue-800 mb-2">
                💭 Guess the Word!
              </h3>
              <GuessInput roomId={roomId} />
            </>
          )}
        </div>

        {/* Guess Feed */}
        <div className="mt-6">
          <h4 className="text-sm text-gray-600 mb-2 font-medium">🔎 Guesses so far:</h4>
          <GuessList
            guesses={guesses}
            myTeam={myTeam}
            clueGiverId={currentPlayer?.playerId}
          />
        </div>
      </div>
    </SectionCard>
  );
}
