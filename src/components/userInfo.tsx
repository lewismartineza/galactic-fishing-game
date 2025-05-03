import { BadgeDollarSign, Sparkles } from "lucide-react"
import { Player } from "../core/entities"

type Props = {
    player: Player
}

export default function UserInfo({ player }: Props) {

    return (
        <div className="flex items-center gap-4 text-white">
            <span className="text-sm">{player.username}</span>
            <div className="flex items-center gap-1 text-yellow-400">
                <BadgeDollarSign size={16} />
                <span>{player.gold}</span>
            </div>
            <div className="flex items-center gap-1 text-blue-300">
                <Sparkles size={16} />
                <span>{player.xp}</span>
            </div>
        </div>
    )
}
