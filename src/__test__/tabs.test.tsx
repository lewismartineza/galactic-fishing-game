import { render, screen } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import userEvent from "@testing-library/user-event"
import { Tabs } from "../components/tabs"

vi.mock("../components/leaderboard", () => ({
    LeaderBoard: ({ currentUsername }: { currentUsername: string }) => (
        <div data-testid="leaderboard">Leaderboard for {currentUsername}</div>
    )
}))

vi.mock("../components/market", () => ({
    Market: () => <div data-testid="market">Market content</div>
}))

describe("Tabs", () => {
    it("renders Leaderboard tab by default", () => {
        render(<Tabs currentUsername="testuser" />)

        expect(screen.getByRole("tab", { name: /Leaderboard/i })).toBeInTheDocument()
        expect(screen.getByRole("tab", { name: /Markets/i })).toBeInTheDocument()

        expect(screen.getByTestId("leaderboard")).toBeInTheDocument()
        expect(screen.queryByTestId("market")).not.toBeInTheDocument()
    })

    it("shows Market tab content when clicked", async () => {
        render(<Tabs currentUsername="testuser" />)
        const user = userEvent.setup()

        await user.click(screen.getByRole("tab", { name: /Markets/i }))

        expect(screen.getByTestId("market")).toBeInTheDocument()
        expect(screen.queryByTestId("leaderboard")).not.toBeInTheDocument()
    })
})
