import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import GameSettings from '@/components/ui/GameSettings';
import { Button } from '@/components/ui/Button';
import SectionCard from '@/components/ui/SectionCard';
import UnassignedColumn from '@/components/ui/UnassignedColumn';
import TeamPanel from '@/components/ui/TeamPanel';
import useCheckRoomExists from '@/hooks/useCheckRoomExists';

export default function Lobby() {
    const { roomId } = useParams();
    useCheckRoomExists(roomId);

    const navigate = useNavigate();
    const playerId = localStorage.getItem('playerId');
    const playerName = localStorage.getItem('playerName');
    const socket = useSocket();

    const [players, setPlayers] = useState([]);
    const [hostId, setHostId] = useState(null);
    const [isHost, setIsHost] = useState(false);
    const [teamA, setTeamA] = useState([]);
    const [teamB, setTeamB] = useState([]);
    const [gameSettings, setGameSettings] = useState({
        wordsPerRound: 5,
        timePerTurn: 30,
        pointsToWin: 20,
    });

    useEffect(() => {
        if (!socket || !roomId || !playerName) return;

        socket.emit('join-room', { roomId, name: playerName, playerId });

        socket.on('room-state', ({ players, hostId, settings, teams }) => {
            setPlayers(players);
            setHostId(hostId);
            setIsHost(playerId === hostId);
            setGameSettings(settings || {});
            setTeamA(teams?.A || []);
            setTeamB(teams?.B || []);
        });

        socket.on('teams-updated', ({ teams }) => {
            setTeamA(teams.A || []);
            setTeamB(teams.B || []);
        });

        socket.on('settings-updated', ({ settings }) => {
            setGameSettings(settings);
        });

        socket.on('game-started', () => {
            navigate(`/score/${roomId}`);
        });

        return () => {
            socket.off('room-state');
            socket.off('teams-updated');
            socket.off('settings-updated');
            socket.off('game-started');
        };
    }, [socket, roomId, playerName]);

    const unassigned = players.filter(
        p => !teamA.some(a => a.playerId === p.playerId) && !teamB.some(b => b.playerId === p.playerId)
    );

    const canStart = isHost && teamA.length >= 2 && teamB.length >= 2;

    function emitTeamUpdate(a, b) {
        if (isHost) {
            socket.emit('teams-updated', {
                roomId,
                teams: { A: a, B: b },
            });
        }
    }

    // 🎲 Random Distribution Logic
    function randomlyDistributePlayers() {
        if (!isHost) return;

        const allPlayers = [...players];
        const shuffled = allPlayers.sort(() => Math.random() - 0.5);

        const half = Math.ceil(shuffled.length / 2);
        const newTeamA = shuffled.slice(0, half);
        const newTeamB = shuffled.slice(half);

        setTeamA(newTeamA);
        setTeamB(newTeamB);
        emitTeamUpdate(newTeamA, newTeamB);
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <SectionCard>
                <h2 className="text-xl font-bold mb-4 text-center">Room Code: {roomId}</h2>

                {/* 🎲 Random Distribution Button */}
                {isHost && (
                    <div className="flex justify-center mb-4">
                        <Button variant="secondary" onClick={randomlyDistributePlayers}>
                            Randomly Distribute Players
                        </Button>
                    </div>
                )}

                <UnassignedColumn
                    players={unassigned}
                    onDrop={(player) => {
                        const newTeamA = teamA.filter(p => p.playerId !== player.playerId);
                        const newTeamB = teamB.filter(p => p.playerId !== player.playerId);
                        setTeamA(newTeamA);
                        setTeamB(newTeamB);
                        emitTeamUpdate(newTeamA, newTeamB);
                    }}
                    isHost={isHost}
                />

                <div className="flex justify-center gap-4 mb-6">
                    <TeamPanel
                        teamName="Team A"
                        players={teamA}
                        isDroppable={true}
                        isHost={isHost}
                        onDrop={(p) => {
                            if (!teamA.some(player => player.playerId === p.playerId)) {
                                const newTeamA = [...teamA, p];
                                const newTeamB = teamB.filter(b => b.playerId !== p.playerId);
                                setTeamA(newTeamA);
                                setTeamB(newTeamB);
                                emitTeamUpdate(newTeamA, newTeamB);
                            }
                        }}
                    />
                    <TeamPanel
                        teamName="Team B"
                        players={teamB}
                        isDroppable={true}
                        isHost={isHost}
                        onDrop={(p) => {
                            if (!teamB.some(player => player.playerId === p.playerId)) {
                                const newTeamB = [...teamB, p];
                                const newTeamA = teamA.filter(a => a.playerId !== p.playerId);
                                setTeamA(newTeamA);
                                setTeamB(newTeamB);
                                emitTeamUpdate(newTeamA, newTeamB);
                            }
                        }}
                    />
                </div>

                <GameSettings
                    isHost={isHost}
                    settings={gameSettings}
                    onUpdate={(newSettings) => {
                        setGameSettings(newSettings);
                        if (isHost) {
                            socket.emit('settings-updated', { roomId, settings: newSettings });
                        }
                    }}
                />

                {isHost && canStart ? (
                    <div className="flex justify-center mt-4">
                        <Button
                            className="mt-4"
                            variant="default"
                            onClick={() => {
                                socket.emit('start-game', {
                                    roomId,
                                    teams: { A: teamA, B: teamB },
                                });
                            }}
                        >
                            Start Game
                        </Button>
                    </div>
                ) : (
                    <p className="text-center text-gray-500 mt-4">
                        {isHost
                            ? 'Assign at least 2 players to each team to start'
                            : 'Waiting for host to start the game...'}
                    </p>
                )}
            </SectionCard>
        </DndProvider>
    );
}
