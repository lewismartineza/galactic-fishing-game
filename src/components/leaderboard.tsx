import { useEffect, useState } from "react";
import { getPlayerRanks } from "../services";
import { Player } from "../core/entities";

type LeaderBoardProps = {
    currentUsername: string;
};

function calculatePlayerScore(player: Player): number {
    return (player.level * 1000) + (player.xp * 1) + (player.gold * 0.1);
}

function updateUserRankInStorage(currentUsername: string, players: Player[]) {
    const currentPlayer = players.find(p => p.username === currentUsername);
    if (!currentPlayer) return;

    const sortedPlayers = [...players].sort((a, b) =>
        calculatePlayerScore(b) - calculatePlayerScore(a)
    );

    localStorage.setItem('userRank', JSON.stringify({
        rank: sortedPlayers.findIndex(p => p.username === currentUsername) + 1,
        level: currentPlayer.level,
        xp: currentPlayer.xp,
        gold: currentPlayer.gold,
        lastUpdated: new Date().toISOString()
    }));
}

export function LeaderBoard({ currentUsername }: LeaderBoardProps) {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        const fetchPlayers = async () => {
            const data = await getPlayerRanks();
            setPlayers(data);
            updateUserRankInStorage(currentUsername, data);
        };

        fetchPlayers();
        const interval = setInterval(fetchPlayers, 5000);
        return () => clearInterval(interval);
    }, [currentUsername]);

    return (
        <div className="space-y-4 mt-6">
            {players.map((player) => (
                <div key={player.username} className={`rounded-xl p-4 ${player.username === currentUsername ? "bg-white text-black" : "bg-slate-800 text-white"}`}>
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-bold">{player.username}</div>
                            <div className="text-sm">Rank: #{player.rank}</div>
                        </div>
                        <div className="text-right text-sm">
                            <div>Level: {player.level}</div>
                            <div>XP: {player.xp.toLocaleString()}</div>
                            <div>Gold: {player.gold.toLocaleString()}</div>
                        </div>
                    </div>
                    {player.emojiDescription && <div className="mt-2 text-sm italic text-slate-400">{player.emojiDescription}</div>}
                    {player.fishEmojis && <div className="text-xl">{player.fishEmojis}</div>}
                </div>
            ))}
        </div>
    );
}