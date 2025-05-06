import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import UserInfo from '../components/user-info'

vi.mock('lucide-react', () => ({
    User: () => <span data-testid="icon-user">User</span>,
    Sword: () => <span data-testid="icon-sword">Sword</span>,
    BadgeDollarSign: () => <span data-testid="icon-badge-dollar">BadgeDollarSign</span>,
    Sparkles: () => <span data-testid="icon-sparkles">Sparkles</span>
}))

const mockUseLocalStorageData = vi.fn()

vi.mock('../hooks/useLocalStorageData', () => ({
    useLocalStorageData: () => mockUseLocalStorageData()
}))

describe('UserInfo', () => {
    beforeEach(() => {
        vi.resetAllMocks()
        mockUseLocalStorageData.mockReturnValue({
            username: null,
            level: 0,
            xp: 0,
            gold: 0,
            rank: null
        })
    })

    it('renders user information with default values when no data is provided', () => {
        render(<UserInfo />)

        expect(screen.getByTestId('icon-user')).toBeInTheDocument()

        expect(screen.getByText(/Lvl\s*0/)).toBeInTheDocument()

        const badgeDollarIcon = screen.getByTestId('icon-badge-dollar')
        expect(badgeDollarIcon.nextElementSibling).toHaveTextContent('0')

        const sparklesIcon = screen.getByTestId('icon-sparkles')
        expect(sparklesIcon.nextElementSibling).toHaveTextContent('0')

        expect(screen.queryByText(/Rank #/)).not.toBeInTheDocument()
    })

    it('renders user information with provided data', () => {
        mockUseLocalStorageData.mockReturnValue({
            username: 'TestUser',
            level: 5,
            xp: 1234,
            gold: 5678,
            rank: 0
        })

        render(<UserInfo />)

        const userIcon = screen.getByTestId('icon-user')
        expect(userIcon.nextElementSibling).toHaveTextContent('TestUser')

        expect(screen.getByText(/Lvl\s*5/)).toBeInTheDocument()

        expect(screen.getByText('5,678')).toBeInTheDocument()
        expect(screen.getByText('1,234')).toBeInTheDocument()

        expect(screen.queryByText(/Rank #/)).not.toBeInTheDocument()
    })

    it('renders rank information when rank is greater than 0', () => {
        mockUseLocalStorageData.mockReturnValue({
            username: 'RankedUser',
            level: 10,
            xp: 9876,
            gold: 54321,
            rank: 42
        })

        render(<UserInfo />)

        const userIcon = screen.getByTestId('icon-user')
        expect(userIcon.nextElementSibling).toHaveTextContent('RankedUser')

        expect(screen.getByText(/Lvl\s*10/)).toBeInTheDocument()
        expect(screen.getByText('54,321')).toBeInTheDocument()
        expect(screen.getByText('9,876')).toBeInTheDocument()

        expect(screen.getByText('Rank #42')).toBeInTheDocument()
    })

    it('formats large numbers correctly', () => {
        mockUseLocalStorageData.mockReturnValue({
            username: 'RichUser',
            level: 99,
            xp: 1000000,
            gold: 9999999,
            rank: 1
        })

        render(<UserInfo />)

        expect(screen.getByText('1,000,000')).toBeInTheDocument()
        expect(screen.getByText('9,999,999')).toBeInTheDocument()
    })

    it('renders all icons correctly', () => {
        mockUseLocalStorageData.mockReturnValue({
            username: 'IconUser',
            level: 1,
            xp: 100,
            gold: 200,
            rank: 3
        })

        render(<UserInfo />)

        expect(screen.getByTestId('icon-user')).toBeInTheDocument()
        expect(screen.getByTestId('icon-sword')).toBeInTheDocument()
        expect(screen.getByTestId('icon-badge-dollar')).toBeInTheDocument()
        expect(screen.getByTestId('icon-sparkles')).toBeInTheDocument()
    })
})