import { render, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, Mock } from "vitest"
import { LeaderBoard } from "../components/leaderboard"
import { Player } from "../core/entities"

vi.mock("../services", () => ({
    getPlayerRanks: vi.fn()
}))

const mockPlayers: Player[] = [
    {
        username: "alice",
        rank: 1,
        level: 10,
        xp: 2500,
        gold: 1000,
        emojiDescription: "🐟 Master fisher",
        fishEmojis: "🐟🐠🐡",
        isInfected: false
    },
    {
        username: "bob",
        rank: 2,
        level: 8,
        xp: 1800,
        gold: 750,
        emojiDescription: "🎣 Expert angler",
        fishEmojis: "🐠🐟",
        isInfected: false
    }
]

describe("LeaderBoard", () => {
    it("renders player data and highlights current user", async () => {
        const { getPlayerRanks } = await import("../services")
            ; (getPlayerRanks as Mock).mockResolvedValue(mockPlayers)

        render(<LeaderBoard currentUsername="bob" />)

        await waitFor(() => {
            expect(screen.getByText("alice")).toBeInTheDocument()
            expect(screen.getByText("bob")).toBeInTheDocument()
        })

        expect(screen.getByText("Rank: #1")).toBeInTheDocument()
        expect(screen.getByText("XP: 2,500")).toBeInTheDocument()
        expect(screen.getByText("🐠🐟")).toBeInTheDocument()

        const highlighted = screen.getByText("bob").closest("div")
        expect(highlighted).toHaveClass("font-bold")
    })
})
