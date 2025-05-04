import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { MarketItemCard } from "../components/marketItemCard"

describe("MarketItemCard", () => {
    const mockItem = {
        id: "abcd1234567890",
        name: "Fishing Rod",
        type: "FISHING_TOOL",
        cost: 100,
        description: "Used to catch fish"
    }

    it("renders item name, type, cost and description", () => {
        render(<MarketItemCard item={mockItem} />)

        expect(screen.getByText("Fishing Rod")).toBeInTheDocument()
        expect(screen.getByText("FISHING TOOL")).toBeInTheDocument()
        expect(screen.getByText("100 gold")).toBeInTheDocument()
        expect(screen.getByText("Used to catch fish")).toBeInTheDocument()
    })

    it("renders Detail and Buy buttons", () => {
        render(<MarketItemCard item={mockItem} />)

        expect(screen.getByText("Detail")).toBeInTheDocument()
        expect(screen.getByText("Buy")).toBeInTheDocument()
    })
})
