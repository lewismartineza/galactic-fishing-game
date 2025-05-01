export type Market = {
    id: string
    name: string
    type: string
    description: string
    cost: number
}

export type Player = {
    rank: number
    username: string
    level: number
    xp: number
    gold: number
    fishEmojis: string
    emojiDescription: string
    isInfected: boolean
}

export type MarketList = Market[]
export type PlayerList = Player[]