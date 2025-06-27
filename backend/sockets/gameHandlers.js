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
    io.to(roomId).emit('score-update', {
      scores: room.gameState.scores,
      teams: room.gameState.teams,
    });

    io.to(roomId).emit('last-round', { words: [], guesses: [] });
    io.to(roomId).emit('game-started');
  });

  socket.on('score-screen-loaded', ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;

    console.log('📊 Score screen loaded — teams:', room.gameState.teams);

    const { scores, teams, lastRound, currentTurnIndex, turnOrder, gameState } = room.gameState;
    const currentPlayer = turnOrder[currentTurnIndex];

    socket.emit('score-update', {
      scores,
      teams,
    });

    socket.emit('last-round', lastRound);
    socket.emit('next-turn', { player: currentPlayer });

    if (room.gameState.currentPhase === 'end' && room.gameState.winner) {
      socket.emit('game-ended', { winner: room.gameState.winner });
    }
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

  socket.on('play-again', ({ roomId }) => {
    const room = getRoom(roomId);
    if (!room) return;

    updateRoom(roomId, room => {
      const prevTeams = room.gameState.teams;
      const prevSettings = room.gameState.settings;

      room.gameState = {
        scores: { A: 0, B: 0 },
        teams: prevTeams,
        settings: prevSettings,
        turnOrder: [],
        currentTurnIndex: 0,
        currentPhase: 'lobby',
        lastRound: { words: [], guesses: [], correct: 0 },
      };
    });

    // 🚨 Send BOTH these back — needed by Lobby.jsx
    io.to(roomId).emit('reset-to-lobby'); // Triggers navigate
    io.to(roomId).emit('room-update', room.players); // Shows unassigned
    io.to(roomId).emit('host-id', room.hostId); // Needed for isHost
    io.to(roomId).emit('teams-updated', { teams: room.gameState.teams }); // Shows team A/B
    io.to(roomId).emit('settings-updated', { settings: room.gameState.settings }); // Updates sliders
  });

};
