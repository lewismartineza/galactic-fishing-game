import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import UserInfo from "../components/user-info"
import type { Player } from "../core/entities"

vi.mock("lucide-react", () => ({
    BadgeDollarSign: () => <div data-testid="badge-dollar-icon" />,
    Sparkles: () => <div data-testid="sparkles-icon" />,
}))

describe("UserInfo", () => {
    const mockPlayer: Player = {
        username: "TestPlayer",
        gold: 100,
        xp: 50,
        rank: 1,
        level: 5,
        fishEmojis: "🐟🐠🐡",
        emojiDescription: "Colorful Fish",
        isInfected: false,
    }

    it("Render player information correctly", () => {
        render(<UserInfo player={mockPlayer} />)

        expect(screen.getByText("TestPlayer")).toBeInTheDocument()
        expect(screen.getByText("100")).toBeInTheDocument()
        expect(screen.getByText("50")).toBeInTheDocument()
    })

    it("Render the gold and experience icons", () => {
        render(<UserInfo player={mockPlayer} />)

        expect(screen.getByTestId("badge-dollar-icon")).toBeInTheDocument()
        expect(screen.getByTestId("sparkles-icon")).toBeInTheDocument()
    })

    it("Apply the right colors to the elements", () => {
        render(<UserInfo player={mockPlayer} />)

        const goldContainer = screen.getByText("100").parentElement
        const xpContainer = screen.getByText("50").parentElement

        expect(goldContainer).toHaveClass("text-yellow-400")
        expect(xpContainer).toHaveClass("text-blue-300")
    })
})
