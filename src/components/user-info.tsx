import { BadgeDollarSign, Sparkles, Sword, User } from "lucide-react"

export default function UserInfo() {
    const username = localStorage.getItem("username");
    const level = localStorage.getItem("level");
    const xp = localStorage.getItem("xp");
    const gold = localStorage.getItem("gold");
    const rank = localStorage.getItem("rank");

    const parsedLevel = level ? JSON.parse(level) : 0;
    const parsedXp = xp ? JSON.parse(xp) : 0;
    const parsedGold = gold ? JSON.parse(gold) : 0;
    const parsedRank = rank ? JSON.parse(rank) : 0;

    return (
        <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
                <User size={16} />
                <span className="text-sm">{username || "Guest"}</span>
            </div>

            <div className="flex items-center gap-1 text-blue-300">
                <Sword size={16} />
                <span>Lvl {parsedLevel}</span>
            </div>

            <div className="flex items-center gap-1 text-yellow-400">
                <BadgeDollarSign size={16} />
                <span>{parsedGold.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1 text-purple-300">
                <Sparkles size={16} />
                <span>{parsedXp.toLocaleString()}</span>
            </div>

            {parsedRank > 0 && (
                <div className="flex items-center gap-1 text-green-300">
                    <span>Rank #{parsedRank}</span>
                </div>
            )}
        </div>
    )
}