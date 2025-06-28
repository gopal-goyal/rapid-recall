// hooks/usePlayerId.js
import { useState } from 'react';

export function usePlayerId() {
  const [playerId] = useState(() => {
    let existing = localStorage.getItem('playerId');
    if (!existing) {
      existing = crypto.randomUUID();
      localStorage.setItem('playerId', existing);
    }
    return existing;
  });

  return playerId;
}
