const { getRoom, updateRoom } = require('../state/roomStore');

module.exports = function registerTeamHandlers(io, socket) {
  socket.on('teams-updated', ({ roomId, teams }) => {
    const room = getRoom(roomId);

    // Validation checks
    if (!room) return;
    if (socket.id !== room.hostId) return; // Only host can update teams
    if (!teams || typeof teams !== 'object') return;

    // Validate teams contain only current players
    const playerIds = new Set(room.players.map(p => p.id));
    const isValidTeam = (team) =>
      Array.isArray(team) && team.every(p => playerIds.has(p.id));

    if (!isValidTeam(teams.A) || !isValidTeam(teams.B)) {
      console.warn(`⚠️ Invalid team update from ${socket.id}`);
      return;
    }

    // Update using the centralized store
    updateRoom(roomId, (room) => {
      if (!room.gameState) {
        room.gameState = {
          teams: { A: [], B: [] },
        };
      }

      room.gameState.teams = {
        A: teams.A,
        B: teams.B,
      };
    });

    // Emit to all players in room
    io.to(roomId).emit('teams-updated', { teams });
    console.log(`🔄 Teams updated in room ${roomId}`);
  });
};
