import { useState } from 'react';
import { useSocket } from '@/context/SocketContext';
import { Button } from './Button';

export default function GuessInput({ roomId }) {
  const socket = useSocket();
  const [guessText, setGuessText] = useState('');

  const handleSubmit = () => {
    const guesses = guessText
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);
    guesses.forEach((guess) => {
      socket.emit('make-guess', { roomId, guess });
    });
    setGuessText('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // prevent form submit or newline
      handleSubmit();
    }
  };

  return (
    <div className="mt-4">
      <h4 className="font-semibold mb-2">Guess and hit Enter</h4>
      <input
        value={guessText}
        onChange={(e) => setGuessText(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full border border-gray-300 p-2 rounded mb-2"
        placeholder="make a guess..."
        autoComplete="off"
      />
      <Button onClick={handleSubmit} variant="success" className="w-full">
        Submit Guess
      </Button>
    </div>
  );
}
