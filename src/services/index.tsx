import { MarketList, PlayerList } from "../core/entities";

const MARKET_API_URL = "https://api-game.bloque.app/game/market"
const PLAYER_RANK_API_URL = "https://api-game.bloque.app/game/leaderboard"

export async function getMarkets(): Promise<MarketList> {
    try {
        const response = await fetch(MARKET_API_URL)
        const data = await response.json()

        return data.items
    } catch (err: any) {
        return Promise.reject(err)
    }
}

export async function getPlayerRanks(): Promise<PlayerList> {
    try {
        const response = await fetch(PLAYER_RANK_API_URL)
        const data = await response.json()

        return data.players
    } catch (err: any) {
        return Promise.reject(err)
    }
}