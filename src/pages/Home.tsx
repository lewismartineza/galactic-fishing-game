"use client"

import { Tabs, CommandConsole } from "../components"
import { Wifi, WifiOff } from "lucide-react"
import { useCheckOnlineConnection } from "../hooks"
import { useEffect, useState } from "react"
import UserNameModal from "../components/user-name-modal"
import { getPlayerRanks } from "../services"
import { Player } from "../core/entities"
import { useCommandConsole } from "../hooks/useCommandConsole"

export function Home() {
    const isOnline = useCheckOnlineConnection()
    const [username, setUsername] = useState<string | null>(null)
    const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
    const {
        isInventoryLoaded,
        money,
        xp,
        inventory
    } = useCommandConsole()

    useEffect(() => {
        const saved = localStorage.getItem("username")
        if (saved) setUsername(saved)
    }, [])

    useEffect(() => {
        if (!username) return
        getPlayerRanks().then(players => {
            const player = players.find(p => p.username === username)
            setCurrentPlayer(player || null)
        })
    }, [username])

    if (!username) return <UserNameModal onConfirm={setUsername} />
    if (!isInventoryLoaded) return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
            <div className="text-white">Loading game data...</div>
        </main>
    )

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
            <div className="px-4 py-8">
                <header className="mb-8">
                    <div className="flex items-center justify-between text-slate-400">
                        <h1 className="text-3xl font-bold">Game Dashboard</h1>
                        <div className="flex items-center gap-4">
                            <div className="text-sm text-white">
                                {username} — 🪙 {money ?? 0} — ⚔️ {xp ?? 0} — 🎒 {inventory.length}
                            </div>
                            <div className="flex items-center gap-2">
                                {isOnline ? (
                                    <>
                                        <Wifi className="h-5 w-5 text-green-400" />
                                        <span className="text-sm text-green-400">Online</span>
                                    </>
                                ) : (
                                    <>
                                        <WifiOff className="h-5 w-5 text-amber-400" />
                                        <span className="text-sm text-amber-400">Offline</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                    <p className="mt-2 text-slate-300">View the live leaderboard and market</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Tabs currentUsername={username} />
                    </div>
                    <div>
                        <CommandConsole />
                    </div>
                </div>
            </div>
        </main>
    )
}