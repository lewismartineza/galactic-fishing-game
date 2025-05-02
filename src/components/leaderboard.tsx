"use client"

import { Loader2 } from "lucide-react"
import { usePlayerRanks } from "../hooks/usePlayerRanks"
import { PlayerCard } from "./playerCard"
import { Card, CardHeader, CardBody, Alert } from "@heroui/react"

export function Leaderboard() {
    const { players, loading, error } = usePlayerRanks()

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-slate-300" />
            </div>
        )
    }

    return (
        <Card className="bg-slate-800 border-slate-700 gap-6 mt-6 p-4 rounded-lg">
            <CardHeader>
                <div className="text-xl text-slate-400">Leaderboard</div>
            </CardHeader>
            <CardBody>
                {error && (
                    <Alert
                        className="mb-4 bg-amber-900/30 border-amber-800"
                        title="Error loading leaderboard"
                        description={error}
                    />
                )}
                <div className="space-y-4">
                    {players.map((player) => (
                        <PlayerCard key={player.username} player={player} />
                    ))}
                </div>
            </CardBody>
        </Card>
    )
}
