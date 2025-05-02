import { Player } from "../core/entities"
import { BadgeCheck, Skull } from "lucide-react"
import { getRankIcon } from "../core/utils/rankIcons"

interface Props {
    player: Player
}

export function PlayerCard({ player }: Props) {
    const rankIcon = getRankIcon(player.rank)

    return (
        <div className="p-4 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-lg font-medium text-slate-100 flex items-center gap-2">
                        {rankIcon && <span className="text-xl">{rankIcon}</span>}
                        {player.username}
                        {player.isInfected ? (
                            <Skull className="text-red-400 w-4 h-4" />
                        ) : (
                            <BadgeCheck className="text-green-400 w-4 h-4" />
                        )}
                    </h3>
                    <p className="text-sm text-slate-400">Rank: #{player.rank}</p>
                </div>
                <div className="text-right text-sm text-slate-300">
                    <p>Level: {player.level}</p>
                    <p>XP: {player.xp}</p>
                    <p>Gold: {player.gold}</p>
                </div>
            </div>
            <p className="mt-2 text-slate-300">{player.fishEmojis}</p>
            <p className="text-xs text-slate-400 italic">{player.emojiDescription}</p>
        </div>
    )
}
