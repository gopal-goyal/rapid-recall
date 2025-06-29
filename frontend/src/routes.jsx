// File: src/routes.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Lobby from './pages/Lobby';
import Scoreboard from './pages/ScoreBoard';
import GameScreen from './pages/GameScreen';
import NotFound from './pages/NotFound';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby/:roomId" element={<Lobby />} />
        <Route path="/score/:roomId" element={<Scoreboard />} />
        <Route path="/game/:roomId" element={<GameScreen />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
