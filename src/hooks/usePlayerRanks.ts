import { useEffect, useState } from "react"
import { PlayerList } from "../core/entities"
import { getPlayerRanks } from "../services"

export function usePlayerRanks() {
    const [players, setPlayers] = useState<PlayerList>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await getPlayerRanks()
                setPlayers(data)
                localStorage.setItem("leaderboard", JSON.stringify(data))
                setError(null)
            } catch (err: any) {
                const cached = localStorage.getItem("leaderboard")
                if (cached) {
                    setPlayers(JSON.parse(cached))
                    setError("Using cached data. Pull to refresh when online.")
                } else {
                    setError(err)
                }
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    return { players, loading, error }
}
