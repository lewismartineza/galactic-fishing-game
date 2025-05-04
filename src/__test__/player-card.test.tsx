import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import PlayerCard from "../components/playerCard"
import type { Player } from "../core/entities"

describe("PlayerCard", () => {
    const basePlayer: Player = {
        username: "testplayer",
        rank: 1,
        level: 10,
        xp: 1500,
        gold: 200,
        isInfected: false,
        emojiDescription: "🏆 Champion",
        fishEmojis: "🐟🐠"
    }

    it("renders player info correctly", () => {
        render(<PlayerCard player={basePlayer} rank={1} />)

        expect(screen.getByText("testplayer")).toBeInTheDocument()
        expect(screen.getByText("Level: 10")).toBeInTheDocument()
        expect(screen.getByText("XP: 1500")).toBeInTheDocument()
        expect(screen.getByText("Gold: 200")).toBeInTheDocument()
        expect(screen.getByText("🏆 Champion 🐟🐠")).toBeInTheDocument()
    })

    it("shows green icon when not infected", () => {
        render(<PlayerCard player={basePlayer} rank={1} />)
        expect(screen.getByTestId("not-infected-icon")).toBeInTheDocument()
    })

    it("shows red icon when infected", () => {
        const infectedPlayer: Player = { ...basePlayer, isInfected: true }
        render(<PlayerCard player={infectedPlayer} rank={1} />)
        expect(screen.getByTestId("infected-icon")).toBeInTheDocument()
    })

    it("applies highlight style when highlight is true", () => {
        const { container } = render(
            <PlayerCard player={basePlayer} rank={1} highlight />
        )
        expect(container.firstChild).toHaveClass("bg-white")
    })
})

