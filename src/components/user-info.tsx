"use client"

import { BadgeDollarSign, Sparkles, Sword, User } from "lucide-react"
import { useLocalStorageData } from "../hooks/useLocalStorageData"

export default function UserInfo() {
    const { username = "Guest", level = 0, xp = 0, gold = 0, rank = 0 } = useLocalStorageData(3000)

    return (
        <div className="flex items-center gap-4 text-white">
            <div className="flex items-center gap-1">
                <User size={16} />
                <span className="text-sm">{username}</span>
            </div>

            <div className="flex items-center gap-1 text-blue-300">
                <Sword size={16} />
                <span>Lvl {level}</span>
            </div>

            <div className="flex items-center gap-1 text-yellow-400">
                <BadgeDollarSign size={16} />
                <span>{gold.toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1 text-purple-300">
                <Sparkles size={16} />
                <span>{xp.toLocaleString()}</span>
            </div>

            {rank > 0 && (
                <div className="flex items-center gap-1 text-green-300">
                    <span>Rank #{rank}</span>
                </div>
            )}
        </div>
    )
}