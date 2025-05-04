import { Player } from "../core/entities"
import { CheckCircle, AlertTriangle } from "lucide-react"
import clsx from "clsx"

type Props = {
    player: Player
    highlight?: boolean
    rank: number
}

export default function PlayerCard({ player, highlight = false }: Props) {
    return (
        <div
            className={clsx(
                "rounded-lg p-4",
                highlight ? "bg-white text-black" : "bg-slate-800 text-white"
            )}
        >
            <div className="flex items-center justify-between">
                <div className="flex gap-2 items-center">
                    <span className="text-lg font-semibold">{player.username}</span>
                    {player.isInfected ? (
                        <AlertTriangle data-testid="infected-icon" size={16} className="text-red-500" />
                    ) : (
                        <CheckCircle data-testid="not-infected-icon" size={16} className="text-green-400" />
                    )}
                </div>
                <div className="text-right text-sm">
                    <p>Level: {player.level}</p>
                    <p>XP: {player.xp}</p>
                    <p>Gold: {player.gold}</p>
                </div>
            </div>
            <div className="mt-2 text-sm italic text-gray-400">
                {player.emojiDescription} {player.fishEmojis}
            </div>
        </div>
    )
}
