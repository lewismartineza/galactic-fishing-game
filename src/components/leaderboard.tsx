import { useEffect, useState } from "react"
import { getPlayerRanks } from "../services"
import { Player } from "../core/entities"

type LeaderBoardProps = {
    currentUsername: string
}

export function LeaderBoard({ currentUsername }: LeaderBoardProps) {
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        getPlayerRanks().then(setPlayers)
    }, [])

    return (
        <div className="space-y-4">
            {players.map((player) => {
                const isCurrent = player.username === currentUsername

                return (
                    <div
                        key={player.username}
                        className={`rounded-xl p-4 ${isCurrent ? "bg-white text-black" : "bg-slate-800 text-white"
                            }`}
                    >
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
                        <div className="mt-2 text-sm italic text-slate-400">{player.emojiDescription}</div>
                        <div className="text-xl">{player.fishEmojis}</div>
                    </div>
                )
            })}
        </div>
    )
}
