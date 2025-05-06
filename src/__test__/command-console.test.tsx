import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CommandConsole } from '../components/command-console'
import React from 'react'

interface CommandType {
    id: string;
    command: string;
    response: string;
    timestamp: string;
}

interface Fish {
    id: string;
    name: string;
    value: number;
    rarity: string;
    xp: number;
    gold: number;
}

vi.mock('../components/command-log', () => ({
    CommandLog: ({ entries }: { entries: CommandType[] }) => (
        <div data-testid="command-log">{entries.length} entries</div>
    )
}))

vi.mock('@heroui/react', () => ({
    Input: ({
        value,
        onChange,
        placeholder,
        className
    }: {
        value: string;
        onChange: (e: { target: { value: string } }) => void;
        placeholder?: string;
        className?: string;
        ref?: any;
    }) => (
        <input
            data-testid="input"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={className}
        />
    ),
    Button: ({
        children,
        type,
        onPress
    }: {
        children: React.ReactNode;
        type?: 'submit' | 'button' | 'reset';
        onPress?: () => void
    }) => (
        <button
            data-testid="button"
            type={type}
            onClick={onPress}
        >
            {children}
        </button>
    )
}))

vi.mock('lucide-react', () => ({
    Send: () => <span data-testid="icon-send">Send</span>,
    HelpCircle: () => <span data-testid="icon-help">HelpCircle</span>,
    Fish: () => <span data-testid="icon-fish">Fish</span>,
    Package: () => <span data-testid="icon-package">Package</span>,
    Coins: () => <span data-testid="icon-coins">Coins</span>,
    UtensilsCrossed: () => <span data-testid="icon-utensils">UtensilsCrossed</span>,
    BadgeDollarSign: () => <span data-testid="icon-badge">BadgeDollarSign</span>,
    Text: () => <span data-testid="icon-text">Text</span>,
    ChartBarBig: () => <span data-testid="icon-chart">ChartBarBig</span>
}))

const mockUseCommandConsole = vi.fn()
vi.mock('../hooks/useCommandConsole', () => ({
    useCommandConsole: () => mockUseCommandConsole()
}))

describe('CommandConsole', () => {
    const mockSetInput = vi.fn()
    const mockHandleSubmit = vi.fn((e: React.FormEvent) => e.preventDefault())

    const mockCommandHistory: CommandType[] = [{
        id: '1',
        command: 'test',
        response: 'response',
        timestamp: new Date().toISOString()
    }]

    const mockScrollAreaRef = { current: null }
    const mockInventory: Fish[] = []

    beforeEach(() => {
        vi.resetAllMocks()
        mockUseCommandConsole.mockReturnValue({
            input: '',
            setInput: mockSetInput,
            handleSubmit: mockHandleSubmit,
            commandHistory: mockCommandHistory,
            fishingCooldown: 0,
            scrollAreaRef: mockScrollAreaRef,
            isInventoryLoaded: false,
            money: 0,
            xp: 0,
            inventory: mockInventory
        })
    })

    it('renders the component correctly', () => {
        render(<CommandConsole />)
        expect(screen.getByText(/Command Console/i)).toBeInTheDocument()
        expect(screen.getByTestId('command-log')).toBeInTheDocument()
        expect(screen.getByTestId('input')).toBeInTheDocument()
        expect(screen.getAllByTestId('button')).toHaveLength(9)
    })

    it('updates input when typed', () => {
        render(<CommandConsole />)
        const input = screen.getByTestId('input')
        fireEvent.change(input, { target: { value: '/fish' } })
        expect(mockSetInput).toHaveBeenCalledWith('/fish')
    })

    it('calls handleSubmit when form is submitted', () => {
        render(<CommandConsole />)
        const form = screen.getByTestId('input').closest('form')!
        fireEvent.submit(form)
        expect(mockHandleSubmit).toHaveBeenCalled()
    })

    it('displays fishing cooldown when greater than 0', () => {
        mockUseCommandConsole.mockReturnValue({
            input: '',
            setInput: mockSetInput,
            handleSubmit: mockHandleSubmit,
            commandHistory: [],
            fishingCooldown: 10,
            scrollAreaRef: mockScrollAreaRef,
            isInventoryLoaded: false,
            money: 0,
            xp: 0,
            inventory: mockInventory
        })

        render(<CommandConsole />)
        expect(screen.getByText(/Fishing cooldown: 10s remaining/i)).toBeInTheDocument()
    })

    it('does not display fishing cooldown when 0', () => {
        render(<CommandConsole />)
        expect(screen.queryByText(/Fishing cooldown/i)).not.toBeInTheDocument()
    })

    it('passes reversed command history to CommandLog', () => {
        const mockHistory: CommandType[] = [
            { id: '1', command: 'test1', response: 'response1', timestamp: new Date().toISOString() },
            { id: '2', command: 'test2', response: 'response2', timestamp: new Date().toISOString() }
        ]

        mockUseCommandConsole.mockReturnValue({
            input: '',
            setInput: mockSetInput,
            handleSubmit: mockHandleSubmit,
            commandHistory: mockHistory,
            fishingCooldown: 0,
            scrollAreaRef: mockScrollAreaRef,
            isInventoryLoaded: false,
            money: 0,
            xp: 0,
            inventory: mockInventory
        })

        render(<CommandConsole />)
        expect(screen.getByTestId('command-log')).toHaveTextContent('2 entries')
    })
})