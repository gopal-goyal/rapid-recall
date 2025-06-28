// Generate a unique player ID and store it in localStorage
export function getPlayerId() {
  let playerId = localStorage.getItem('playerId');
  
  if (!playerId) {
    // Generate a new unique ID
    playerId = 'player_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    localStorage.setItem('playerId', playerId);
  }
  
  return playerId;
}

// Get player name from localStorage
export function getPlayerName() {
  return localStorage.getItem('playerName') || '';
}

// Set player name in localStorage
export function setPlayerName(name) {
  localStorage.setItem('playerName', name);
}

// Clear player data (for testing or logout)
export function clearPlayerData() {
  localStorage.removeItem('playerId');
  localStorage.removeItem('playerName');
} 