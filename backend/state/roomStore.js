const roomStates = {};

// Initial game state with lastRound data included
function initialGameState() {
  return {
    settings: {
      wordsPerRound: 5,
      timePerTurn: 60,
      pointsToWin: 10,
    },
    teams: { A: [], B: [] },
    scores: { A: 0, B: 0 },
    turnOrder: [],                  // Array of player objects: [{ id, name }, ...]
    currentTurnIndex: 0,           // Index in turnOrder array
    currentPhase: 'lobby',         // 'lobby' | 'score' | 'gameplay' | 'end'
    lastRound: {
      words: [],           
      guesses: [],             
      correct: 0,                  
    },
  };
}

// Create a new room with host and initial game state
function createRoom(roomId, hostId, hostName) {
  roomStates[roomId] = {
    roomId,
    hostId,
    players: [{ id: hostId, name: hostName }],
    gameState: initialGameState(),
  };
  return roomStates[roomId];
}

// Fetch a room by ID
function getRoom(roomId) {
  return roomStates[roomId];
}

// Return all active rooms
function getAllRooms() {
  return roomStates;
}

// Delete a room from memory
function deleteRoom(roomId) {
  delete roomStates[roomId];
}

// Perform an update on a room via mutation callback
function updateRoom(roomId, updaterFn) {
  const room = getRoom(roomId);
  if (room) {
    updaterFn(room);
  }
}

module.exports = {
  getRoom,
  createRoom,
  deleteRoom,
  getAllRooms,
  updateRoom
};
