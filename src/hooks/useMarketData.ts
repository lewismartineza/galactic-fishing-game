import { useState, useEffect } from "react"
import { MarketList } from "../core/entities"
import { getMarkets } from "../services"

export function useMarketData() {
    const [items, setItems] = useState<MarketList>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true)
                const data = await getMarkets()
                setItems(data)
                localStorage.setItem("market", JSON.stringify(data))
                setError(null)
            } catch (err: any) {
                const cached = localStorage.getItem("market")
                if (cached) {
                    setItems(JSON.parse(cached))
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

    return { items, loading, error }
}
