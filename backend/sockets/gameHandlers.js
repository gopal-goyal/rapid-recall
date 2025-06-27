const { getRoom, updateRoom } = require('../state/roomStore');
const { generateWords } = require('../utils/wordsGenerator');

module.exports = function registerGameHandlers(io, socket) {
  socket.on('start-game', ({ roomId, teams }) => {
    const room = getRoom(roomId);
    if (!room || socket.id !== room.hostId) return;

    // Generate interleaved turn order with random starting team
    const randomOrder = Math.random() < 0.5 ? ['A', 'B'] : ['B', 'A'];
    const maxLen = Math.max(teams.A.length, teams.B.length);
    const turnOrder = [];

    for (let i = 0; i < maxLen; i++) {
      for (const team of randomOrder) {
        if (teams[team][i]) {
          turnOrder.push({ ...teams[team][i], team });
        }
      }
    }

    updateRoom(roomId, (room) => {
      room.gameState.scores = { A: 0, B: 0 };
      room.gameState.teams = teams;
      room.gameState.turnOrder = turnOrder;
      room.gameState.currentTurnIndex = 0;
      room.gameState.currentPhase = 'score';
      room.gameState.lastRound = { words: [], guesses: [] };
    });

    const currentPlayer = turnOrder[0];

    io.to(roomId).emit('next-turn', { player: currentPlayer });
    io.to(roomId).emit('score-update', { scores: { A: 0, B: 0 } });
    io.to(roomId).emit('last-round', { words: [], guesses: [] });
    io.to(roomId).emit('game-started');
  });

  socket.on('score-screen-loaded', ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;

    io.to(socket.id).emit('score-update', { scores: room.gameState.scores });
    io.to(socket.id).emit('last-round', room.gameState.lastRound);
    const currentPlayer = room.gameState.turnOrder[room.gameState.currentTurnIndex];
    io.to(socket.id).emit('next-turn', { player: currentPlayer });
  });

  socket.on('start-turn', ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;

    const currentPlayer = room.gameState.turnOrder[room.gameState.currentTurnIndex];
    if (socket.id !== currentPlayer.id) return;

    console.log(`🎮 ${currentPlayer.name} started their turn`);

    updateRoom(roomId, (room) => {
      room.gameState.currentPhase = 'game';
      room.gameState.lastRound = { words: generateWords(), guesses: [] };
      room.gameState.timer = room.gameState.settings.timePerTurn || 60;
    });

    io.to(roomId).emit('navigate-to-game');
  });
};
