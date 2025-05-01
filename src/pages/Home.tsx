"use client"

import { Tabs, CommandConsole } from "../components"
import { Wifi, WifiOff } from "lucide-react"
import { useCheckOnlineConnection } from "../hooks"

export function Home() {
    const isOnline = useCheckOnlineConnection()

    return (
        <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 text-white">
            <div className="container mx-auto px-4 py-8">
                <header className="mb-8">
                    <div className="flex items-center justify-between">
                        <h1 className="text-3xl font-bold">Game Dashboard</h1>
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
                    <p className="mt-2 text-slate-300">View the live leaderboard and market</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Tabs />
                    </div>

                    <div>
                        <CommandConsole />
                    </div>
                </div>
            </div>
        </main>
    )
}
