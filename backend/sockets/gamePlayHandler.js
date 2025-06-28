const { getRoom, updateRoom } = require('../state/roomStore');
const { generateWords } = require('../utils/wordsGenerator');

module.exports = function registerGameplayHandlers(io, socket) {
  socket.on('game-screen-loaded', ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;

    const { gameState } = room;
    const currentPlayer = gameState.turnOrder[gameState.currentTurnIndex];
    const words = gameState.currentWords || generateWords(gameState.settings.wordsPerRound);
    const guesses = gameState.guesses || [];

    updateRoom(roomId, room => {
      room.gameState.currentWords = words;
      room.gameState.guesses = guesses;
    });

    io.to(socket.id).emit('game-state', {
      words,
      guesses,
      currentPlayer,
      teams: gameState.teams,
      timeLeft: gameState.timeLeft || gameState.settings.timePerTurn,
    });
  });

  socket.on('make-guess', ({ roomId, guess }) => {
    const room = getRoom(roomId);
    if (!room) return;

    const wordList = room.gameState.currentWords;
    const correct = wordList.some(w => w.word === guess && !w.guessed);

    const player = [...room.gameState.teams.A, ...room.gameState.teams.B].find(p => p.id === socket.id);
    const team = room.gameState.teams.A.some(p => p.id === socket.id) ? 'A' : 'B';

    const newGuess = {
      playerId: socket.id,
      playerName: player?.name || 'Unknown',
      team,
      guess,
      correct,
    };

    updateRoom(roomId, room => {
      room.gameState.guesses.push(newGuess);
      if (correct) {
        room.gameState.currentWords = room.gameState.currentWords.map(w =>
          w.word === guess ? { ...w, guessed: true } : w
        );
      }
    });

    io.to(roomId).emit('guess-made', newGuess);

    const updatedRoom = getRoom(roomId);
    const allGuessed = updatedRoom.gameState.currentWords.every(w => w.guessed);
    if (allGuessed) {
      endTurn(io, roomId);
    }
  });

  socket.on('start-turn', ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;

    if (room.gameState.currentPhase === 'end') return;

    const currentPlayer = room.gameState.turnOrder[room.gameState.currentTurnIndex];
    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || player.playerId !== currentPlayer.playerId) return;

    const timePerTurn = room.gameState.settings.timePerTurn;

    updateRoom(roomId, room => {
      room.gameState.currentWords = generateWords(room.gameState.settings.wordsPerRound);
      room.gameState.turnEnded = false;
      room.gameState.guesses = [];
      room.gameState.timeLeft = timePerTurn;
    });

    io.to(roomId).emit('navigate-to-game');

    io.to(roomId).emit('game-state', {
      words: room.gameState.currentWords,
      guesses: [],
      currentPlayer,
      teams: room.gameState.teams,
      timeLeft: timePerTurn,
    });

    const interval = setInterval(() => {
      const roomNow = getRoom(roomId);
      if (!roomNow || !roomNow.gameState) {
        clearInterval(interval);
        return;
      }

      const time = --roomNow.gameState.timeLeft;
      io.to(roomId).emit('timer-update', time);

      if (time <= 0) {
        clearInterval(interval);
        endTurn(io, roomId);
      }
    }, 1000);
  });
};

function endTurn(io, roomId) {
  const room = getRoom(roomId);

  if (room.gameState.turnEnded) return;
  updateRoom(roomId, room => {
    room.gameState.turnEnded = true;

    const turnIndex = room.gameState.currentTurnIndex;
    const currentPlayer = room.gameState.turnOrder[turnIndex];
    const team = currentPlayer.team;
    const correctGuesses = room.gameState.guesses.filter(g => g.correct).length;

    room.gameState.scores[team] += correctGuesses;
    room.gameState.lastRound = {
      words: room.gameState.currentWords,
      guesses: room.gameState.guesses,
    };

    const { scores, settings } = room.gameState;
    const winner = scores.A >= settings.pointsToWin ? 'A'
                 : scores.B >= settings.pointsToWin ? 'B'
                 : null;

    if (winner) {
      room.gameState.currentPhase = 'end';
      room.gameState.winner = winner;
    } else {
      room.gameState.currentTurnIndex = (turnIndex + 1) % room.gameState.turnOrder.length;
      room.gameState.currentPhase = 'score';
    }
  });

  const updatedRoom = getRoom(roomId);

  io.to(roomId).emit('score-update', {
    scores: updatedRoom.gameState.scores,
    teams: updatedRoom.gameState.teams,
  });
  io.to(roomId).emit('last-round', updatedRoom.gameState.lastRound);

  if (updatedRoom.gameState.currentPhase === 'end') {
    io.to(roomId).emit('game-ended', { winner: updatedRoom.gameState.winner });
    io.to(roomId).emit('navigate-to-score');
  } else {
    io.to(roomId).emit('next-turn', {
      player: updatedRoom.gameState.turnOrder[updatedRoom.gameState.currentTurnIndex],
    });
    io.to(roomId).emit('navigate-to-score');
  }
}
