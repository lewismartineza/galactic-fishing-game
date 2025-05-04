import { render, screen } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import { Market } from "../components/market"
import { useMarketData } from "../hooks/useMarketData"

vi.mock("../hooks/useMarketData", () => ({
    useMarketData: vi.fn()
}))

const mockedUseMarketData = useMarketData as ReturnType<typeof vi.fn>

describe("Market", () => {
    it("shows loading spinner when loading", () => {
        mockedUseMarketData.mockReturnValue({
            items: [],
            loading: true,
            error: null
        })

        render(<Market />)
        expect(screen.getByRole("status")).toBeInTheDocument()
    })

    it("shows error alert when error occurs", () => {
        mockedUseMarketData.mockReturnValue({
            items: [],
            loading: false,
            error: "Something went wrong"
        })

        render(<Market />)
        expect(screen.getByText("Something went wrong")).toBeInTheDocument()
    })

    it("renders market items when data is loaded", () => {
        mockedUseMarketData.mockReturnValue({
            items: [
                { id: "1", name: "Fishing Rod", price: 100, type: "equipment" },
                { id: "2", name: "Bait", price: 10, type: "consumable" }
            ],
            loading: false,
            error: null
        })

        render(<Market />)
        expect(screen.getByText("Fishing Rod")).toBeInTheDocument()
        expect(screen.getByText("Bait")).toBeInTheDocument()
    })
})
